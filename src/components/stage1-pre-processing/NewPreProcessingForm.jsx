import {BaseDropDown} from "../common/BaseDropDown";
import React, {useState} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";

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

function RepresentationDropDown({onSelect, value}) {
    return <BaseDropDown name={"Representation"}
                         items={[
                             "FFT",
                             // "MelSpec",
                             // "Chroma"
                         ]}
                         onSelect={onSelect}
                         value={value}
    />
}

export function NewPreProcessingForm({addPreProcessing}) {
    const [sr, setSr] = useState(22050);
    const [repr, setRepr] = useState("FFT");
    const [windowSize, setWindowSize] = useState(2048);
    const [hopLength, setHopLength] = useState(512);
    return (
        <Form className={"entity-form"}>
            <Row className="m-4">
                <Col><SampleRateDropDown onSelect={setSr} value={sr}/></Col>
                <Col><RepresentationDropDown onSelect={setRepr} value={repr}/></Col>
                <Col><WindowSizeDropDown onSelect={setWindowSize} value={windowSize}/></Col>
                <Col><HopLengthDropDown onSelect={setHopLength} value={hopLength}/></Col>
            </Row>
            <Row className="m-4">
                <Button type="submit"
                        variant={"outline-primary"}
                        onClick={(event) => {
                            event.preventDefault();
                            addPreProcessing({sr: sr, repr: repr, windowSize: windowSize, hopLength: hopLength})
                        }}>
                    Compute
                </Button>
            </Row>
        </Form>
    )
}