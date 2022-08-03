import {Button, Card} from "react-bootstrap";
import React from "react";
import {FiTrash} from "react-icons/fi";


export function ProjectCard({project, selectProject, selectedId, deleteProject}) {
    return (
        <div>
            <Card style={{borderWidth: "3px", maxHeight: "fit-content"}}
                  border={selectedId === project.id ? "primary" : ""}
                  onClick={() => selectProject(project)}
            >
                <Card.Body>
                    <Card.Title>{project.name}</Card.Title>
                    <Card.Text>
                        <span>file: {project.file_name}<br/></span>
                        <span>created at: {project.created_at}</span>
                    </Card.Text>
                    <Button variant={"outline-danger"}
                            style={{position: "relative"}}
                            onClick={() => deleteProject(project.id)}
                    ><FiTrash/>
                    </Button>
                </Card.Body>
            </Card>
        </div>)
}