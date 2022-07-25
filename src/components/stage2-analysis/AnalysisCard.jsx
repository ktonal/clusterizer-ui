import ClusterizerApi from "../../api";
import {Button, Card} from "react-bootstrap";
import React, {useContext} from "react";
import {trackPromise} from "react-promise-tracker";
import {FaTrash} from "react-icons/fa";
import {AuthContext} from "../../Auth";

export function AnalysisCard({analysis, selectAnalysis, selectedId, project, deleteAnalysis}) {
    const {token} = useContext(AuthContext);

    const addSplits = () => {
        trackPromise(
            new ClusterizerApi(token).split(project.id, analysis)
                .then((resp) => {
                    const newA = {...analysis, splits: [...resp.data]}
                    selectAnalysis(newA);
                }), "split")
    };
    return (
        <div>
            <Card style={{borderWidth: "3px"}}
                  border={selectedId === analysis.id ? "primary" : ""}
                  onClick={() => selectAnalysis(analysis)}
            >
                <Card.Body>
                    <Card.Title>{analysis.name}</Card.Title>
                    <Card.Text>
                        {Object.entries(analysis.parameters).map(([k, v], i) =>
                            ["id", "name"].includes(k) ? null :
                                <span key={k}>{k} = {v} ;<br/></span>
                        )}
                    </Card.Text>
                    <br/>
                    <Button variant={"outline-secondary"}
                            onClick={(e) => {addSplits(); e.stopPropagation()}}
                    >SPLIT</Button>
                    <Button variant={"outline-danger"}
                            style={{position: "relative"}}
                            onClick={e => {deleteAnalysis(); e.stopPropagation()}}
                    ><FaTrash/></Button>
                </Card.Body>
            </Card>
        </div>
    )
}