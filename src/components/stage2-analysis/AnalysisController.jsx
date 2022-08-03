import {useContext, useEffect, useState} from "react";
import ClusterizerApi from "../../api";
import {trackPromise} from "react-promise-tracker";
import {AuthContext} from "../../Auth";
import {NotificationManager} from "react-notifications";

export function AnalysisController({
                                       analysis, setAnalysis, project, preProcessing,
                                       split, setSplit, splits, setSplits, setAnalysisResult,
                                   }) {
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
        // UPDATE analysis DEPENDENCIES
        setSplits(analysis.splits !== null ? analysis.splits : []);

        if (analysis.hasOwnProperty("result") && analysis.result !== null) {
            new ClusterizerApi(token).getAnalysisResult(project.id, analysis)
                .then(res => {
                    setAnalysisResult(res.data);
                });
        }

        /// analysis then needs to be replaced in the list
        const newAllAnalysis = [...allAnalysis];
        newAllAnalysis[allAnalysis.map(a => a.id).indexOf(analysis.id)] = analysis;
        setAllAnalysis(newAllAnalysis);
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

    const renameAnalysis = (a, newName) => {
        new ClusterizerApi(token).renameAnalysis(project.id, a, newName)
            .then(res => {
                const newAnalysis = {...a, name: newName};
                const newAllAnalysis = [...allAnalysis];
                newAllAnalysis[allAnalysis.map(a => a.id).indexOf(a.id)] = newAnalysis;
                setAllAnalysis(newAllAnalysis);
            })
    }

    const downloadResult = (a) => {
        new ClusterizerApi(token).getAnalysisResult(project.id, a)
            .then(res => {
                const a = document.createElement("a");
                const file = new Blob([JSON.stringify(res.data)], {type: "text/plain"});
                a.href = URL.createObjectURL(file);
                a.download = `${project.name}.${analysis.name}.result.json`;
                a.click();
            })
    };

    const deleteSplit = (s) => {
        setSplits(prevAll => [...prevAll.filter(oldSplit => oldSplit.id !== s.id)]);
        new ClusterizerApi(token).deleteSplit(s).then(r => {
        });
        setAnalysis(prevAnalysis => {
            return {...prevAnalysis, splits: [...prevAnalysis.splits.filter(x => x.id !== s.id)]};
        });
        setAllAnalysis(prevAll => [...prevAll.filter(a => a.id !== analysis.id), analysis])
    };

    const performSplit = (s) => {
        trackPromise(
            new ClusterizerApi(token).singleSplit(project.id, analysis, s)
                .then(res => {
                    const url = res.data;
                    const newSplit = {...s, url: url};
                    setSplit(newSplit);
                    const newSplits = [...splits];
                    newSplits[splits.map(s => s.id).indexOf(newSplit.id)] = newSplit;
                    setAnalysis({...analysis, splits: [...newSplits]});
                    setSplits(newSplits);
                    /// further updates are triggered in a above effect...
                }), "bounce-split-" + s.id)
    };

    const bounceAllSplit = (a) => {
        const promises = a.splits.map(s => {
            return trackPromise(new ClusterizerApi(token).singleSplit(project.id, a, s)
                .then(res => {
                    return {...s, url: res.data}
                }), "new-analysis")
        });
        Promise.all(promises).then(newSplits => {
            console.log(newSplits);
            const newAnalysis = {...a, splits: newSplits};
            const newAllAnalysis = [...allAnalysis];
            newAllAnalysis[allAnalysis.map(a => a.id).indexOf(a.id)] = newAnalysis;
            setAllAnalysis(newAllAnalysis);
            setAnalysis(newAnalysis);
        })
    }

    function renameSplit(s, name) {
        new ClusterizerApi(token).renameSplit(project.id, analysis, s, name)
            .then(res => {
                const newSplit = {...s, name: name};
                const newSplits = [...splits];
                newSplits[splits.map(s => s.id).indexOf(newSplit.id)] = newSplit;
                setAnalysis({...analysis, splits: [...newSplits]});
                setSplits(newSplits);
            })
    }

    return [allAnalysis, addAnalysis, deleteAnalysis, renameAnalysis, bounceAllSplit, downloadResult, deleteSplit, renameSplit, performSplit];
}