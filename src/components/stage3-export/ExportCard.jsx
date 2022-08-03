import {Button, Card} from "react-bootstrap";
import React from "react";
import { FaTrash } from "react-icons/fa";


export function ExportCard({splitsExport, selectExport, selectedId, deleteExport}) {

    return (
        <div>
            <Card style={{borderWidth: "3px", maxHeight: "fit-content"}}
                  border={selectedId === splitsExport.id ? "primary" : ""}
                  onClick={() => selectExport(splitsExport)}
            >
                <Card.Body>
                    <Card.Title>{splitsExport.name}</Card.Title>
                    <span>file: {splitsExport.file_name}</span>
                    <br/>
                    <span>created at: {splitsExport.created_at}</span>
                    <br/>
                    <Button variant={"outline-danger"}
                            style={{position: "relative"}}
                            onClick={() => deleteExport(splitsExport.id)}
                    ><FaTrash/>
                    </Button>
                </Card.Body>
            </Card>
        </div>)
}