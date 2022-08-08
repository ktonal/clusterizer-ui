import React, {useEffect, useState} from "react";
import {Col, Form, Row} from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";


export function QCoresForm({setParameters}) {
    const [qCores, setQCores] = useState(.1);
    const [nNeighbors, setNNeighbors] = useState(64);
    const [coreNSize, setCoreNSize] = useState(4);
    useEffect(() => {
        setParameters({
            cores_prop: qCores, n_neighbors: nNeighbors, core_neighborhood_size: coreNSize,
        });
    }, [qCores, nNeighbors, coreNSize, setParameters]);
    return (
        <>
            <Row className="m-3">
                <Col>
                    <FloatingLabel label={"N Neighbors"}>
                        <Form.Control type={"number"}
                                      onChange={(e) => setNNeighbors(Number(e.target.value))}
                                      defaultValue={64}/>
                    </FloatingLabel>
                </Col>
            </Row>
            <Row className="m-3">
                <Col>
                    <Form.Label>{"Proportion of Core Points: " + qCores}</Form.Label>
                    <Form.Range type={"range"}
                                min={0.00001}
                                max={.99999999}
                                step={0.001}
                                onChange={(e) => setQCores(Number(e.target.value))}
                                defaultValue={.1}/>
                </Col>
            </Row>
            <Row className="m-3">
                <Col>
                    <FloatingLabel label={"Cores Neighborhood's Size"}>
                        <Form.Control type={"number"}
                                      onChange={(e) => setCoreNSize(Number(e.target.value))}
                                      defaultValue={4}/>
                    </FloatingLabel>
                </Col>
            </Row>
        </>
    )
}