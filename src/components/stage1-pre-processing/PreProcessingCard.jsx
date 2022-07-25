import {Button, Card} from "react-bootstrap";
import React from "react";
import { FaTrash } from "react-icons/fa";

export function PreProcessingCard({preProcessing, selectPreProcessing, selectedId, deletePreProcessing}) {
    return (
        <div>
            <Card style={{borderWidth: "3px"}}
                  border={selectedId === preProcessing.id ? "primary" : ""}
                  onClick={() => selectPreProcessing(preProcessing)}
            >
                <Card.Body>
                    <Card.Title>{preProcessing.name}</Card.Title>
                    <Card.Text>
                        <span>sample_rate = {preProcessing.sample_rate};</span><br/>
                        <span>representation = {preProcessing.representation};</span><br/>
                        <span>window_size = {preProcessing.window_size};</span><br/>
                        <span>hop_length = {preProcessing.hop_length};</span><br/>
                    </Card.Text>
                    <Button variant={"outline-danger"}
                            style={{position: "relative"}}
                            onClick={(e) => {deletePreProcessing(preProcessing); e.stopPropagation()}}
                    ><FaTrash/></Button>
                </Card.Body>
            </Card>
        </div>
    )
}