import {useContext, useEffect, useState} from "react";
import ClusterizerApi from "../../api";
import {trackPromise} from "react-promise-tracker";
import {AuthContext} from "../../Auth";
import {NotificationManager} from "react-notifications";

export function AnalysisController({analysis, setAnalysis, project, preProcessing, splits, setSplits}) {
    const {token} = useContext(AuthContext);
    const [allAnalysis, setAllAnalysis] = useState([]);

    useEffect(() => {
        if (project.hasOwnProperty("id") && preProcessing.hasOwnProperty("id")) {
            setAnalysis({});
            setAllAnalysis([]);
            new ClusterizerApi(token).listAnalysis(project.id, preProcessing.id).then((resp) => {
                setAllAnalysis(resp.data);
                if (resp.data.length > 0) NotificationManager.info("loaded analysis")
            })
        } else {
            setAnalysis({});
            setAllAnalysis([]);
        }
    }, [project, preProcessing, setAnalysis, token]);

    useEffect(() => {
        if (!analysis.hasOwnProperty("id") && allAnalysis.length > 0) setAnalysis(allAnalysis[0])
        // eslint-disable-next-line
    }, [analysis, allAnalysis]);

    useEffect(() => {
        setSplits(analysis.splits !== null ? analysis.splits : []);
        const newAllAnalysis = [...allAnalysis];
        newAllAnalysis[allAnalysis.map(a => a.id).indexOf(analysis.id)] = analysis;
        setAllAnalysis(newAllAnalysis);
        /// analysis then needs to be replaced in the list
        // eslint-disable-next-line
    }, [analysis, setSplits]);

    const addAnalysis = (newAnalysis) => {
        newAnalysis.pre_processing_id = preProcessing.id;
        trackPromise(
            new ClusterizerApi(token).createAnalysis(project.id, newAnalysis)
                .then((resp, err) => {
                    setAllAnalysis([resp.data, ...allAnalysis]);
                    setAnalysis(resp.data);
                    NotificationManager.info("added analysis");
                }), "new-analysis")
    };

    const deleteAnalysis = (analysisToDelete) => {
        trackPromise(
            new ClusterizerApi(token).deleteAnalysis(project.id, analysisToDelete)
                .then((resp) => {
                    NotificationManager.info("deleted analysis");
                    if (analysis.id === analysisToDelete.id) setAnalysis({});
                    setAllAnalysis([...allAnalysis.filter((p) => p.id !== analysisToDelete.id)]);
                })
            , "delete-analysis");
    };

    const deleteSplit = (s) => {
        setSplits(prevAll => [...prevAll.filter(oldSplit => oldSplit.url !== s.url)]);
        setAnalysis(prevAnalysis => {
            const newAnalysis = {...prevAnalysis, splits: [...prevAnalysis.splits.filter(x => x.url !== s.url)]};
            new ClusterizerApi(token).updateAnalysis(project.id, newAnalysis)
                .then(res => {
                    // NotificationManager.info("deleted split");
                });
            return newAnalysis;
        });
        setAllAnalysis(prevAll => [...prevAll.filter(a => a.id !== analysis.id), analysis])
    };

    return [allAnalysis, addAnalysis, deleteAnalysis, deleteSplit];
}