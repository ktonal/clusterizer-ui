import {usePromiseTracker} from "react-promise-tracker";
import {TailSpin} from "react-loader-spinner";
import {AnalysisCard} from "./AnalysisCard";
import React from "react";


export function AnalysisList({allAnalysis, selectedAnalysis, selectAnalysis, project, deleteAnalysis}) {

    const {promiseInProgress: loadingAnalysis} = usePromiseTracker({area: "loading-analysis"});
    const {promiseInProgress: creatingAnalysis} = usePromiseTracker({area: "new-analysis"});

    return (
        <div className={"list-container"}>
            {creatingAnalysis ? <TailSpin/> : null}
            {loadingAnalysis ? <TailSpin/> :
                allAnalysis.map((a, index) => {
                    return <AnalysisCard key={a.id}
                                         analysis={a}
                                         selectedId={selectedAnalysis.id}
                                         selectAnalysis={selectAnalysis}
                                         project={project}
                                         deleteAnalysis={() => deleteAnalysis(a)}
                    />
                })}
        </div>
    )
}