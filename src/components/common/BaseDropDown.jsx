import React, {useEffect} from "react";
import {FloatingLabel, Form} from "react-bootstrap";

export function BaseDropDown({name, items, value, onSelect}) {
    const selectWrapper = (event) => {
        onSelect(event.target.value);
    };
    useEffect(() => onSelect(value == null ? items[0] : value), [items, value, onSelect]);
    return (
        <FloatingLabel label={name} style={{"minWidth": name.length * 12 + "px"}}>
            <Form.Select onChange={selectWrapper} defaultValue={value}>
                {items.map((item) => <option key={item} value={item}>{item}</option>)}
            </Form.Select>
        </FloatingLabel>
    )
}