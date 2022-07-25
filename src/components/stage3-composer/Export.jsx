import React from "react";
import {Container} from "react-bootstrap";

export default function Export({splitsToExport}) {
    return (
        <Container>
            {splitsToExport.map((s, index) => {
                return <p key={index}>analysis={s.analysis} ; index={s.index} ;</p>
            })}
        </Container>);
}