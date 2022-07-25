import React, {useEffect, useState} from "react";
import {Col, Form, Row} from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";

export function KMeansForm({setParameters}) {
    const [nClusters, setNClusters] = useState(2);
    const [nInit, setNInit] = useState(4);
    const [nIter, setNIter] = useState(200);
    const [randomSeed, setRandomSeed] = useState(42);
    useEffect(() => {
        setParameters({
            n_clusters: nClusters, n_init: nInit, max_iter: nIter,
            random_state: randomSeed
        });
    }, [nClusters, nInit, nIter, randomSeed, setParameters]);
    return (
        <>
            <Row className="m-3">
                <Col>
                    <FloatingLabel label={"N Clusters"}>
                        <Form.Control type={"number"}
                                      onChange={(e) => setNClusters(Number(e.target.value))}
                                      defaultValue={2}/>
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel label={"N Init"}>
                        <Form.Control type={"number"}
                                      onChange={(e) => setNInit(Number(e.target.value))}
                                      defaultValue={4}/>
                    </FloatingLabel>
                </Col>
            </Row>
            <Row className="m-3">

                <Col>
                    <FloatingLabel label={"N Iter"}>
                        <Form.Control type={"number"}
                                      onChange={(e) => setNIter(Number(e.target.value))}
                                      defaultValue={200}/>
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel label={"Rand Seed"}>
                        <Form.Control type={"number"}
                                      onChange={(e) => setRandomSeed(Number(e.target.value))}
                                      defaultValue={42}/>
                    </FloatingLabel>
                </Col>
            </Row>
        </>
    )
}