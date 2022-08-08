import {Button, Card} from "react-bootstrap";
import React from "react";
import {FiTrash, FiDownload} from "react-icons/fi";
import {Editable} from "../common/Editable";

export function AnalysisCard({analysis, selectAnalysis, selectedId, project, deleteAnalysis, downloadResult, renameAnalysis, bounceAllSplit}) {

    return (
        <div>
            <Card style={{borderWidth: "3px"}}
                  border={selectedId === analysis.id ? "primary" : ""}
                  onClick={() => selectAnalysis(analysis)}
            >
                <Card.Body>
                    <Card.Title>
                        <Editable value={analysis.name}
                                  onSubmit={(newName) => renameAnalysis(analysis, newName)}/>
                    </Card.Title>
                    <Card.Text>
                        <span>n labels: {analysis.splits.length}<br/></span>
                        {Object.keys(analysis.parameters).sort((a, b) => a > b ? 1 : -1)
                            .map(k => <span key={k}>{k}: {analysis.parameters[k] !== null ? analysis.parameters[k] : "None"}<br/></span>)
                        }
                    </Card.Text>
                    <Button className={"me-1"}
                            variant={"outline-primary"}
                            onClick={e => {
                                downloadResult(analysis)
                                e.stopPropagation()
                            }}>
                        <FiDownload style={{verticalAlign: "text-top"}}/> Result
                    </Button>
                    <Button className={"me-1"}
                            variant={"outline-primary"}
                            onClick={e => {
                                bounceAllSplit(analysis);
                                e.stopPropagation()
                            }}>
                        Bounce All
                    </Button>
                    <Button variant={"outline-danger"}
                            style={{position: "relative"}}
                            onClick={e => {
                                deleteAnalysis();
                                e.stopPropagation()
                            }}
                    ><FiTrash/></Button>
                </Card.Body>
            </Card>
        </div>
    )
}