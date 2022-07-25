import React, { useState} from "react";
import {Button, Form, Row} from "react-bootstrap";


export function NewProjectForm({addProject}) {
    const [projectName, setProjectName] = useState("");
    const [file, setFile] = useState(null);

    const onSubmit = (e) => {
        e.preventDefault();
        addProject({name: projectName, file_name: file.name}, file)
    };
    return (
        <Form className={"entity-form"}>
            <Row className="m-4">
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control type={"text"}
                                  placeholder={"new project"}
                                  onChange={(e) => setProjectName(e.target.value)}
                    />
            </Row>
            <Row className="m-4">
                    <Form.Label>Select an audio file</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        accept={".wav, .mp3, .m4a"}
                    />
            </Row>
            <Row className="m-4">
                <Button type="submit" variant={"outline-primary"} onClick={onSubmit}>
                    Submit
                </Button>
            </Row>
        </Form>
    )
}


