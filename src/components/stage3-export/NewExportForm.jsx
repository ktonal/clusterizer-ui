import React, { useState} from "react";
import {Button, Form, Row} from "react-bootstrap";


export function NewExportForm({setExport}) {
    const [exportName, setExportName] = useState("");

    const onSubmit = (event) => {
        setExport({name: exportName, splits: {}});
        event.preventDefault();
    };
    return (
        <Form className={"entity-form"}>
            <Row className="m-4">
                    <Form.Label>Export Name</Form.Label>
                    <Form.Control type={"text"}
                                  placeholder={"new export"}
                                  onChange={(e) => setExportName(e.target.value)}
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


