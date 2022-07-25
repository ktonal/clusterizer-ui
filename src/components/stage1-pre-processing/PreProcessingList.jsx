import React from "react";
import {usePromiseTracker} from "react-promise-tracker";
import {TailSpin} from "react-loader-spinner";
import {PreProcessingCard} from "./PreProcessingCard";


export default function PreProcessingList(
    {allPreProcessing, selectedPreProcessing, setPreProcessing, deletePreProcessing}) {
    const {promiseInProgress: loadingPPs} = usePromiseTracker({area: "loading-pre-processings", delay: 0});
    const {promiseInProgress: creatingPP} = usePromiseTracker({area: "new-pre-processing"});

    return (
        <div className={"list-container"}>
            {creatingPP ? <TailSpin/> : null}
            {loadingPPs ? <TailSpin/> :
                allPreProcessing.map((pp) => <PreProcessingCard key={pp.id}
                                                                preProcessing={pp}
                                                                selectedId={selectedPreProcessing.id}
                                                                selectPreProcessing={() => setPreProcessing(pp)}
                                                                deletePreProcessing={() => deletePreProcessing(pp)}

                />)}
        </div>
    );
}