import React, {useState} from "react";
import {Button, Form, Row, Tab, Tabs} from "react-bootstrap";
import {BaseDropDown} from "../common/BaseDropDown";
import {KMeansForm} from "./algorithms/kmeans";
import {ArgMaxForm} from "./algorithms/argmax";
import {OnsetSegmentForm} from "./algorithms/onset";
import {DissimilaritySegmentForm} from "./algorithms/dissimilarity";
import {SpectralClusteringForm} from "./algorithms/spectral";
import {QCoresForm} from "./algorithms/qcores";

export function ClusterForm({addClustering}) {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
    const [parameters, setParameters] = useState({});

    const onSubmit = (e) => {
        e.preventDefault();
        addClustering({algorithm: selectedAlgorithm, parameters: parameters})
    };

    const renderForm = (selectedAlgorithm) => {
        switch (selectedAlgorithm) {
            case 'kmeans':
                return <KMeansForm setParameters={setParameters}/>;
            case "argmax":
                return <ArgMaxForm setParameters={setParameters}/>;
            case "spectral":
                return <SpectralClusteringForm setParameters={setParameters}/>;
            case "qcores":
                return <QCoresForm setParameters={setParameters}/>;
            default:
                return null;
        }
    };

    return (
        <Form>
            <Row className="m-3">
                <BaseDropDown name={"Algorithm"}
                              items={["kmeans", "argmax", "spectral", "qcores"]}
                              onSelect={setSelectedAlgorithm}
                              value={selectedAlgorithm}
                />
            </Row>
            {renderForm(selectedAlgorithm)}
            <Row className="m-3">
                <Button type="submit"
                        variant={"outline-primary"}
                        onClick={onSubmit}>
                    Compute
                </Button>
            </Row>
        </Form>
    )
}

export function SegmentForm({addSegmenting}) {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
    const [parameters, setParameters] = useState({});

    const onSubmit = (e) => {
        e.preventDefault();
        addSegmenting({algorithm: selectedAlgorithm, parameters: parameters})
    };

    const renderForm = (selectedAlgorithm) => {
        switch (selectedAlgorithm) {
            case 'onset':
                return <OnsetSegmentForm setParameters={setParameters}/>;
            case "dissimilarity":
                return <DissimilaritySegmentForm setParameters={setParameters}/>
            default:
                return null;
        }
    };

    return (
        <Form>
            <Row className="m-3">
                <BaseDropDown name={"Algorithm"}
                              items={["dissimilarity",]}
                              onSelect={setSelectedAlgorithm}
                              value={selectedAlgorithm}
                />
            </Row>
            {renderForm(selectedAlgorithm)}
            <Row className="m-3">
                <Button type="submit"
                        variant={"outline-primary"}
                        onClick={onSubmit}>
                    Compute
                </Button>
            </Row>
        </Form>
    )
}

export function NewAnalysisForm({addAnalysis}) {

    return (
        <div className={"entity-form"}>
            <Tabs defaultActiveKey={"cluster"} className="m-3">
                <Tab eventKey={"cluster"} title={"Cluster"}>
                    <ClusterForm addClustering={addAnalysis}/>
                </Tab>
                <Tab eventKey={"segment"} title={"Segment"}>
                    <SegmentForm addSegmenting={addAnalysis}/>
                </Tab>
            </Tabs>
        </div>
    )
}