import {BaseDropDown} from "../common/BaseDropDown";
import React, {useEffect, useState} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {FiTrash, FiPlus} from "react-icons/fi";

function SampleRateDropDown({onSelect, value}) {
    return <BaseDropDown name={"Sample Rate"}
                         items={[16000, 22050, 32000, 44100]}
                         onSelect={onSelect}
                         value={value}
    />
}

function WindowSizeDropDown({onSelect, value}) {
    return <BaseDropDown name={"Window Size"}
                         items={[256, 512, 1024, 2048, 4096]}
                         onSelect={onSelect}
                         value={value}
    />
}

function HopLengthDropDown({onSelect, value}) {
    return <BaseDropDown name={"Hop Length"}
                         items={[64, 128, 256, 512, 1024, 2048]}
                         onSelect={onSelect}
                         value={value}
    />
}

function MelSpectrogramForm({parameters, setParameters}) {
    useEffect(() => {
        if (Object.keys(parameters).length === 0) {
            setParameters({n_mels: 32})
        }
    }, [parameters, setParameters]);
    return (
        <Col className={'mx-0'}>
            <FloatingLabel label={"N Mels"} style={{fontSize: "10px"}}>
                <Form.Control type={"number"}
                              value={parameters.n_mels}
                              onChange={e => setParameters({n_mels: Number(e.target.value)})}
                />
            </FloatingLabel>
        </Col>)
}

function MFCCForm({parameters, setParameters}) {
    useEffect(() => {
        if (Object.keys(parameters).length === 0) {
            setParameters({n_mfcc: 32})
        }
    }, [parameters, setParameters]);
    return (
        <Col className={'mx-0'}>
            <FloatingLabel label={"N MFCC"} style={{fontSize: "10px"}}>
                <Form.Control type={"number"}
                              value={parameters.n_mfcc}
                              onChange={e => setParameters({n_mfcc: Number(e.target.value)})}
                />
            </FloatingLabel>
        </Col>)
}

function AutoConvolveForm({parameters, setParameters}) {
    useEffect(() => {
        if (Object.keys(parameters).length === 0) {
            setParameters({window_size: 2})
        }
    }, [parameters, setParameters]);
    return (
        <Col className={'mx-0'}>
            <FloatingLabel label={"Window Size"} style={{fontSize: "10px"}}>
                <Form.Control type={"number"}
                              value={parameters.window_size}
                              onChange={e => setParameters({window_size: Number(e.target.value)})}
                />
            </FloatingLabel>
        </Col>)
}

function NearestNeighborFilterForm({parameters, setParameters}) {
    useEffect(() => {
        if (Object.keys(parameters).length === 0) {
            setParameters({n_neighbors: 2})
        }
    }, [parameters, setParameters]);
    return (
        <Col className={'mx-0'}>
            <FloatingLabel label={"N Neighbors"} style={{fontSize: "10px"}}>
                <Form.Control type={"number"}
                              value={parameters.n_neighbors}
                              onChange={e => setParameters({n_neighbors: Number(e.target.value)})}
                />
            </FloatingLabel>
        </Col>)
}

function ChromaForm({parameters, setParameters}) {
    useEffect(() => {
        if (Object.keys(parameters).length === 0) {
            setParameters({n_chroma: 12})
        }
    }, [parameters, setParameters]);
    return (
        <Col className={'mx-0'}>
            <FloatingLabel label={"N chroma"} style={{fontSize: "10px"}}>
                <Form.Control type={"number"}
                              value={parameters.n_chroma}
                              onChange={e => setParameters({n_chroma: Number(e.target.value)})}
                />
            </FloatingLabel>
        </Col>
    )
}

function NComponentsForm({parameters, setParameters}) {
    useEffect(() => {
        if (Object.keys(parameters).length === 0) {
            setParameters({n_components: 2})
        }
    }, [parameters, setParameters]);
    return (
        <Col className={'mx-0'}>
            <FloatingLabel label={"N components"} style={{fontSize: "10px"}}>
                <Form.Control type={"number"}
                              value={parameters.n_components}
                              onChange={e => setParameters({n_components: Number(e.target.value)})}
                />
            </FloatingLabel>
        </Col>
    )
}


function F0FilterForm({parameters, setParameters}) {
    useEffect(() => {
        if (Object.keys(parameters).length === 0) {
            console.log(parameters)
            setParameters({n_over: 2, n_under: 2})
        }
    }, [parameters, setParameters]);
    return (<>
            <FloatingLabel label={"N Overtone"} style={{fontSize: "10px"}}>
                <Form.Control type={"number"}
                              value={parameters.n_over}
                              onChange={e => setParameters({...parameters, n_over: Number(e.target.value)}
                              )}
                />
            </FloatingLabel>
            <FloatingLabel label={"N Undertone"} style={{fontSize: "10px"}}>
                <Form.Control type={"number"}
                              value={parameters.n_under}
                              onChange={e => setParameters({...parameters, n_under: Number(e.target.value)}
                              )}
                />
            </FloatingLabel>
        </>
    )
}


function HPSSForm({parameters, setParameters}) {
    useEffect(() => {
        if (Object.keys(parameters).length === 0) {
            setParameters({kernel_size: 2, margin: 2., power: 1.})
        }
    }, [parameters, setParameters]);
    return (
        <>
            <FloatingLabel label={"Kernel Size"} style={{fontSize: "10px"}}>
                <Form.Control type={"number"}
                              value={parameters.kernel_size}
                              onChange={e => setParameters({...parameters, kernel_size: Number(e.target.value)}
                              )}
                />
            </FloatingLabel>
            <FloatingLabel label={"Power"} style={{fontSize: "10px"}}>
                <Form.Control type={"number"}
                              value={parameters.power}
                              onChange={e => setParameters({...parameters, power: Number(e.target.value)}
                              )}
                />
            </FloatingLabel>
            <FloatingLabel label={"Margin"} style={{fontSize: "10px"}}>
                <Form.Control type={"number"}
                              value={parameters.margin}
                              onChange={e => setParameters({...parameters, margin: Number(e.target.value)}
                              )}
                />
            </FloatingLabel>

        </>
    )
}

function TransformWrapper({method, children, submitTransform}) {
    return (<div className={'mx-4 d-flex'} style={{fontSize: "10px"}}>
        <BaseDropDown name={"Transform"}
                      items={[
                          "melspectrogram",
                          "chroma",
                          "mfcc",
                          "auto_convolve",
                          "nearest_neighbors_filter",
                          "f0_filter",
                          "harmonic_source",
                          "percussive_source",
                          "pca",
                          "factor_analysis",
                          "nmf"
                      ]}
                      value={method}
                      onSelect={(m) => {
                          if (m !== method) submitTransform({method: m, parameters: {}})
                      }}
        />
        {children}
        <Button variant={'outline-danger'}
                onClick={() => {
                    submitTransform(null)
                }}>
            <FiTrash style={{verticalAlign: "text-top"}}
            />
        </Button>
    </div>)
}

function TransformsList({transforms, setTransforms}) {
    return (<>
        {transforms.map((t, i) => {
            const replaceTransform = (i) => {
                return (tr) => {
                    setTransforms(ts => {
                        const newTs = [...ts];
                        newTs[i] = tr;
                        return [...newTs.filter(x => x !== null)];
                    });
                };
            };
            switch (t.method) {
                case 'auto_convolve':
                    return <TransformWrapper key={i} method={t.method} submitTransform={replaceTransform(i)}>
                        <AutoConvolveForm setParameters={(p) => replaceTransform(i)({...t, parameters: p})}
                                          parameters={t.parameters}/>
                    </TransformWrapper>;
                case 'nearest_neighbors_filter':
                    return <TransformWrapper key={i} method={t.method} submitTransform={replaceTransform(i)}>
                        <NearestNeighborFilterForm setParameters={(p) => replaceTransform(i)({...t, parameters: p})}
                                                   parameters={t.parameters}/>
                    </TransformWrapper>;
                case 'f0_filter':
                    return <TransformWrapper key={i} method={t.method} submitTransform={replaceTransform(i)}>
                        <F0FilterForm setParameters={(p) => replaceTransform(i)({...t, parameters: p})}
                                      parameters={t.parameters}/>
                    </TransformWrapper>;
                case 'harmonic_source':
                    return <TransformWrapper key={i} method={t.method} submitTransform={replaceTransform(i)}>
                        <HPSSForm setParameters={(p) => replaceTransform(i)({...t, parameters: p})}
                                  parameters={t.parameters}/>
                    </TransformWrapper>;
                case 'percussive_source':
                    return <TransformWrapper key={i} method={t.method} submitTransform={replaceTransform(i)}>
                        <HPSSForm setParameters={(p) => replaceTransform(i)({...t, parameters: p})}
                                  parameters={t.parameters}/>
                    </TransformWrapper>;
                case 'chroma':
                    return <TransformWrapper key={i} method={t.method} submitTransform={replaceTransform(i)}>
                        <ChromaForm setParameters={(p) => replaceTransform(i)({...t, parameters: p})}
                                    parameters={t.parameters}/></TransformWrapper>;
                case 'melspectrogram':
                    return <TransformWrapper key={i} method={t.method} submitTransform={replaceTransform(i)}>
                        <MelSpectrogramForm setParameters={(p) => replaceTransform(i)({...t, parameters: p})}
                                            parameters={t.parameters}/></TransformWrapper>;
                case 'mfcc':
                    return <TransformWrapper key={i} method={t.method} submitTransform={replaceTransform(i)}>
                        <MFCCForm setParameters={(p) => replaceTransform(i)({...t, parameters: p})}
                                            parameters={t.parameters}/></TransformWrapper>;
                case 'pca':
                    return <TransformWrapper key={i} method={t.method} submitTransform={replaceTransform(i)}>
                        <NComponentsForm setParameters={(p) => replaceTransform(i)({...t, parameters: p})}
                                         parameters={t.parameters}/></TransformWrapper>;
                case 'factor_analysis':
                    return <TransformWrapper key={i} method={t.method} submitTransform={replaceTransform(i)}>
                        <NComponentsForm setParameters={(p) => replaceTransform(i)({...t, parameters: p})}
                                         parameters={t.parameters}/></TransformWrapper>;
                case 'nmf':
                    return <TransformWrapper key={i} method={t.method} submitTransform={replaceTransform(i)}>
                        <NComponentsForm setParameters={(p) => replaceTransform(i)({...t, parameters: p})}
                                         parameters={t.parameters}/></TransformWrapper>;

                default:
                    return null;
            }
        })}
        <Row className={'mx-4 my-1'}>
            <Button variant={"outline-primary"}
                    onClick={e => {
                        setTransforms(ts => [...ts, {method: "auto_convolve", parameters: {}}]);
                    }}
            ><FiPlus/></Button>
        </Row>
    </>)
}


export function NewPreProcessingForm({addPreProcessing}) {
    const [sr, setSr] = useState(22050);
    const [windowSize, setWindowSize] = useState(2048);
    const [hopLength, setHopLength] = useState(512);
    const [transforms, setTransforms] = useState([]);
    return (
        <Form className={"entity-form"}>
            <Row className="mx-4 my-1">
                <Col className={'d-flex'}>
                    <SampleRateDropDown onSelect={setSr} value={sr}/>
                    <WindowSizeDropDown onSelect={setWindowSize} value={windowSize}/>
                    <HopLengthDropDown onSelect={setHopLength} value={hopLength}/>
                </Col>
            </Row>
            <TransformsList transforms={transforms} setTransforms={setTransforms}/>
            <Row className="mx-4 my-1">
                <Button type="submit"
                        variant={"outline-primary"}
                        onClick={(event) => {
                            event.preventDefault();
                            addPreProcessing({
                                sr: sr,
                                repr: "FFT",
                                windowSize: windowSize,
                                hopLength: hopLength,
                                transforms: transforms
                            })
                        }}>
                    Compute
                </Button>
            </Row>
        </Form>
    )
}