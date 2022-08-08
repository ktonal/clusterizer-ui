import React, {useEffect, useState} from "react";
import {Col, Form, Row} from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";

export function DissimilaritySegmentForm({setParameters}) {
    const [kernelSize, setKernelSize] = useState(4);
    const [minDuration, setMinDuration] = useState(4);
    const [minStrength, setMinStrength] = useState(0.5);
    const [factor, setFactor] = useState(1.);
    const [detectFromTempo, setDetectFromTempo] = useState(false);
    useEffect(() => {
        setParameters(
            {
                kernel_size: detectFromTempo ? null : kernelSize,
                min_dur: minDuration > 0 ? minDuration : null,
                min_strength: minStrength,
                detect_tempo: detectFromTempo,
                factor: factor
            });
    }, [kernelSize, minDuration, minStrength, detectFromTempo, factor, setParameters]);
    return (
        <>
            <Row className="m-3">
                <Col>
                    <Form.Check type={"checkbox"}
                                label={"Auto Detect From Tempo"}
                                onChange={(e) => setDetectFromTempo(v => !v)}
                                defaultValue={detectFromTempo}/>
                </Col>
            </Row>
            <Row className="m-3">
                <Col>
                    <FloatingLabel label={"Kernel Size"}>
                        <Form.Control type={"number"}
                                      disabled={detectFromTempo}
                                      value={detectFromTempo ? '' : kernelSize}
                                      onChange={(e) => setKernelSize(Number(e.target.value))}
                        />
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel label={"Min Duration"}>
                        <Form.Control type={"number"}
                                      value={minDuration > 0 ? minDuration : ''}
                                      onChange={(e) => setMinDuration(Number(e.target.value))}
                        />
                    </FloatingLabel>
                </Col>
                <Col>
                    <Form.Label>{"Min Strength: " + minStrength}</Form.Label>
                    <Form.Range type={"range"}
                                min={0.1}
                                max={1.}
                                step={0.01}
                                onChange={(e) => setMinStrength(Number(e.target.value))}
                                defaultValue={.5}/>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Label>{"Factor: " + factor}</Form.Label>
                    <Form.Control type={"number"}
                                min={0.0}
                                max={32.}
                                onChange={(e) => setFactor(Number.parseFloat(e.target.value))}
                                defaultValue={1.}/>
                </Col>
            </Row>
        </>
    )
}