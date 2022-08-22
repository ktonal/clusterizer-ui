import {useContext, useEffect, useState} from "react";
import {trackPromise} from "react-promise-tracker";
import ClusterizerApi from "../../api";
import {AuthContext} from "../../Auth";
import {NotificationManager} from "react-notifications";

export function PreProcessingController({preProcessing, project, setPreProcessing}) {
    const {token} = useContext(AuthContext);

    const [pps, setPps] = useState([]);

    useEffect(() => {
        if (project.hasOwnProperty("id")) {
            setPreProcessing({});
            setPps([]);
            trackPromise(
                new ClusterizerApi(token).listPreProcessings(project.id).then((resp) => {
                    setPps(resp.data);
                    // if (resp.data.length > 0) NotificationManager.info("loaded pre-processing");
                }), "loading-pre-processings")
        } else {
            setPreProcessing({});
            setPps([]);
        }
    }, [project, setPreProcessing, token]);

    useEffect(() => {
        if (!preProcessing.hasOwnProperty("id"))
            if (pps.length > 0) {
                setPreProcessing(pps[0]);
            }
        // else setPreProcessing({})
    }, [preProcessing, pps, setPreProcessing]);

    const addPreProcessing = (pp, projectId) => {
        trackPromise(
            new ClusterizerApi(token).createPreProcessing(projectId, pp.sr, pp.repr, pp.windowSize, pp.hopLength, pp.transforms)
                .then((resp) => {
                    NotificationManager.info("added pre-processing");
                    setPps([...pps, resp.data]);
                    setPreProcessing(resp.data)
                }),
            "new-pre-processing")
    };

    const deletePreProcessing = (preProcessingToDelete) => {
        trackPromise(
            new ClusterizerApi(token).deletePeProcessing(project.id, preProcessingToDelete.id)
                .then((resp) => {
                    NotificationManager.info("deleted pre-processing");
                    if (preProcessing.id === preProcessingToDelete.id) {
                        setPreProcessing({});
                    }
                    setPps(prevValue => [...prevValue.filter((p) => p.id !== preProcessingToDelete.id)])
                })
            , "delete-pre-processing")
    }
    return [pps, addPreProcessing, deletePreProcessing];
}