import React, {useEffect, useState} from "react";
import {Col, Form, Row} from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";

export function DissimilaritySegmentForm({setParameters}) {
    const [kernelSize, setKernelSize] = useState(4);
    const [minDuration, setMinDuration] = useState(4);
    const [minStrength, setMinStrength] = useState(0.93);
    const [detectFromTempo, setDetectFromTempo] = useState(false);
    useEffect(() => {
        setParameters({kernelSize: kernelSize, minDuration: minDuration, minStrength: minStrength});
    }, [kernelSize, minDuration, minStrength, setParameters]);
    return (
        <>
            <Row className="m-3">
                <Col>
                    <Form.Check type={"checkbox"}
                                label={"Auto Detect From Tempo"}
                                onChange={(e) => setDetectFromTempo(e.target.value)}
                                defaultValue={detectFromTempo}/>
                </Col>
            </Row>
            <Row className="m-3">
                <Col>
                    <FloatingLabel label={"Kernel Size"}>
                        <Form.Control type={"number"}
                                      onChange={(e) => setKernelSize(Number(e.target.value))}
                                      defaultValue={4}/>
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel label={"Min Duration"}>
                        <Form.Control type={"number"}
                                      onChange={(e) => setMinDuration(Number(e.target.value))}
                                      defaultValue={4}/>
                    </FloatingLabel>
                </Col>
                <Col>
                    <Form.Label>{"Min Strength: " + minStrength}</Form.Label>
                    <Form.Range type={"range"}
                                min={0.1}
                                max={1.}
                                step={0.01}
                                onChange={(e) => setMinStrength(Number(e.target.value))}
                                defaultValue={4}/>
                </Col>
            </Row>
        </>
    )
}