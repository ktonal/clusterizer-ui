import React, {useEffect, useState} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";

export function DissimilaritySegmentForm({setParameters}) {
    const [kernelSize, setKernelSize] = useState(4);
    const [minDuration, setMinDuration] = useState(4);
    const [minStrength, setMinStrength] = useState(0.1);
    const [detectKSFromTempo, setDetectKSFromTempo] = useState(false);
    const [detectMDFromTempo, setDetectMDFromTempo] = useState(false);
    const [factors, ] = useState(['1/8', '1/4', '1/3', '1/2', '1', '2', '3', '4', '6', '8']);
    const [factorsState, setFactorsState] = useState(Array.from({length: factors.length}, (x, i) => factors[i] === '1'));

    useEffect(() => {
        setParameters(
            {
                kernel_size: detectKSFromTempo ? null : kernelSize,
                min_dur: minDuration <= 0 || detectMDFromTempo ? null : minDuration,
                min_strength: minStrength,
                factors: factors.filter((f, i) => factorsState[i]).map(f => Number.parseFloat(eval(f)))
            });
    }, [kernelSize, minDuration, minStrength, detectKSFromTempo, detectMDFromTempo, factors, factorsState, setParameters]);
    return (
        <>
            <Row className="m-3">
                <Col>
                    <Form.Label className={"text-muted"}>{"Min Strength: " + minStrength}</Form.Label>
                    <Form.Range type={"range"}
                                min={0.0}
                                max={1.}
                                step={0.01}
                                onChange={(e) => setMinStrength(Number(e.target.value))}
                                defaultValue={.1}/>
                </Col>
            </Row>
            <Row className="m-3">
                <Col>
                    <FloatingLabel label={"Kernel Size"}>
                        <Form.Control type={"number"}
                                      disabled={detectKSFromTempo}
                                      value={detectKSFromTempo ? '' : kernelSize}
                                      onChange={(e) => setKernelSize(Number(e.target.value))}
                        />
                    </FloatingLabel>
                    <Form.Check type={"switch"}
                                className={"m-2 small text-muted"}
                                label={"from tempo"}
                                onChange={(e) => setDetectKSFromTempo(v => !v)}
                                defaultValue={detectKSFromTempo}/>
                </Col>
                <Col>
                    <FloatingLabel label={"Min Duration"}>
                        <Form.Control type={"number"}
                                      disabled={detectMDFromTempo}
                                      value={detectMDFromTempo ? '' : minDuration}
                                      onChange={(e) => setMinDuration(Number(e.target.value))}
                        />
                    </FloatingLabel>
                    <Form.Check type={"switch"}
                                className={"m-2 small text-muted"}
                                label={"from tempo"}
                                onChange={(e) => setDetectMDFromTempo(v => !v)}
                                defaultValue={detectMDFromTempo}/>
                </Col>
                <span className={'text-muted mb-2'}>Factors</span>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    {
                        factors.map((f, i) => {
                            return (<Button key={i} className={'small'}
                                            variant={factorsState[i] ? 'primary' : "outline-primary"} size={'sm'}
                                            onClick={(e) => {
                                                const newState = [...factorsState];
                                                newState[i] = !newState[i];
                                                setFactorsState(newState);
                                            }}
                                            onMouseDown={e => e.preventDefault()}
                                            onMouseEnter={e => e.preventDefault()}
                                            style={{"&:hover": {"background-color": "#f3f3f3"}}}
                                >{f}</Button>
                            )
                        })
                    }
                </div>
            </Row>
        </>
    )
}