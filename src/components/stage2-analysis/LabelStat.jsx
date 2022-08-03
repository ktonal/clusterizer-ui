import React, {} from "react";
import {Button, Card} from "react-bootstrap";
import {Editable} from "../common/Editable";
import {FiTrash} from "react-icons/fi";


export function LabelStat({split, performSplit, removeSplit, renameSplit}) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    <Editable value={split.name} onSubmit={(newName) => {
                        renameSplit(split, newName)
                    }}/>
                </Card.Title>
                <Card.Text>
                    <span style={{display: "flex"}}>
                    <span className={"me-4"}>
                    Label: {split.label}<br/>
                    Length: {split.length} frames<br/>
                    Duration: {split.duration.toFixed(2)} sec.<br/>
                    </span>
                        <span className={"me-4"}>
                    Centroid: {split.centroid.toFixed(2)} Hz<br/>
                    Loudness: {split.loudness.toFixed(2)} dB<br/>
                    Median Position: {split.median_position.toFixed(2)} sec.<br/>
                    </span>
                    </span>
                </Card.Text>
                <Button variant={"outline-primary"}
                        size={"sm"}
                        onClick={(e) => {
                            performSplit(split);
                            e.preventDefault()
                        }}
                >
                    Bounce
                </Button>
                <Button className={"mx-1 my-2"}
                        variant={"outline-danger"} size={"sm"} type={"button"}
                        onClick={() => {
                            removeSplit();
                        }}>
                    <FiTrash/>
                </Button>
            </Card.Body>
        </Card>
    )
}