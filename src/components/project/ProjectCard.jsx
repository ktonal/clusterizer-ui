import {Button, Card} from "react-bootstrap";
import React from "react";
import { FaTrash } from "react-icons/fa";


export function ProjectCard({project, selectProject, selectedId, deleteProject}) {

    return (
        <div>
            <Card style={{borderWidth: "3px", maxHeight: "fit-content"}}
                  border={selectedId === project.id ? "primary" : ""}
                  onClick={() => selectProject(project)}
            >
                <Card.Body>
                    <Card.Title>{project.name}</Card.Title>
                    <span>file: {project.file_name}</span>
                    <br/>
                    <span>created at: {project.created_at}</span>
                    <br/>
                    <Button variant={"outline-danger"}
                            style={{position: "relative"}}
                            onClick={() => deleteProject(project.id)}
                    ><FaTrash/>
                    </Button>
                </Card.Body>
            </Card>
        </div>)
}