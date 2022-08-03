import React, {useState} from "react";
import {FiEdit} from "react-icons/fi";
import {Button, Form, InputGroup} from "react-bootstrap";


export function Editable({value, onSubmit}) {
    const [editable, setEditable] = useState(false);
    const [edited, setEdited] = useState(value);
    return (
        <>

            {!editable ?
                <>
                    {value}{" "}
                    {value &&
                    <FiEdit onClick={() => setEditable(true)}
                            style={{verticalAlign: "text-top"}}/>}
                </>
                :
                <InputGroup className="mb-3" style={{zIndex: 10000}}>
                    <Form.Control
                        defaultValue={value}
                        onChange={e => setEdited(e.target.value)}
                    />
                    <Button variant="outline-secondary"
                            onClick={() => {
                                setEditable(false);
                                onSubmit(edited);
                            }}
                    >
                        Submit
                    </Button>
                </InputGroup>
            }
        </>
    )
}