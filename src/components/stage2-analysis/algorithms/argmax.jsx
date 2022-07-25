import React, {useEffect} from "react";
import {Col, Row} from "react-bootstrap";

export function ArgMaxForm({setParameters}) {
    useEffect(() => {
        setParameters({});
    }, [setParameters]);
    return <Row className="m-3"><Col>{" No parameters to set "}</Col></Row>
}