import {useContext, useEffect, useState} from "react";
import {trackPromise} from "react-promise-tracker";
import ClusterizerApi, {errorHandler} from "../../api";
import {NotificationManager} from 'react-notifications';
import {AuthContext} from "../../Auth";

export function ExportController({project, allAnalysis}) {
    const {token} = useContext(AuthContext);

    const [currentExport, setExport] = useState({name: "Export", splits: {}});
    const [exports, setExports] = useState([]);
    const [urls, setUrls] = useState([]);

    useEffect(() => {
        trackPromise(
            new ClusterizerApi(token).listExports()
                .then(res => {
                    setExports(res.data);
                    if (res.data.length > 0) setExport(res.data[0])
                })
        )
    }, [setExports, setExport, token]);

    const urlToObject = (splitURL) => {
        const allSplits = allAnalysis.map(a => a.splits !== null ? a.splits : []).flat(1);
        const allSplitsUrls = allSplits.map(s => s.url);
        return allSplits[allSplitsUrls.indexOf(splitURL)];

    };

    const createExport = (e) => {
        trackPromise(
            new ClusterizerApi(token).createExport(project.id, e)
                .then(res => {
                    setExport(res.data);
                })
        )
    };

    const addSplitToExport = (split) => {
        let maxIndex = "0";
        setExport(prevState => {
            if (Object.keys(prevState.splits).length > 0) {
                maxIndex = Object.keys(prevState.splits).reduce(
                    (a, b) => Number.parseInt(a) > Number.parseInt(b) ? a : b);
                maxIndex = (Number.parseInt(maxIndex) + 1).toString();
            }
            const newEntry = {};
            newEntry[maxIndex] = split.url;
            return {
                ...prevState,
                splits: {...prevState.splits, ...newEntry}
            }
        });
        trackPromise(
            new ClusterizerApi(token).addSplitToExport(
                project.id, currentExport, split, maxIndex)
                .then(res => {
                })
        )
    };

    const removeSplitFromExport = (index) => {
        setExport(prevState => {
            console.log("PREV STATE", prevState);
            const newSplits = Object.entries(prevState.splits).filter(
                ([i, u]) => i !== index);
            return {
                ...prevState,
                splits: {
                    ...Object.fromEntries(newSplits)
                }
            }
        });
        trackPromise(
            new ClusterizerApi(token).deleteSplitFromExport(project.id, currentExport, index)
                .then(res => {
                })
        )
    };

    const doExport = () => {

    };

    return [currentExport, createExport, addSplitToExport, removeSplitFromExport, urlToObject, doExport]
}