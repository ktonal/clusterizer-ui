import React, {useState} from "react";
import {BaseDropDown} from "./BaseDropDown";


export function Sortable({items, renderItem, excludeKeys}) {
    let keys = [];
    if (items.length > 0) {
        keys = Object.keys(items[0]);
        if (excludeKeys !== undefined) keys = keys.filter(k => !excludeKeys.includes(k));
    }
    const [sortingKey, setSortingKey] = useState(keys[0]);
    const [direction, setDirection] = useState(-1);
    return (
        <div>
            <div style={{display: "flex", width: "max-content", margin: "auto 0 auto auto"}}>
                <BaseDropDown items={keys} value={sortingKey} name={"sort By"}
                              onSelect={e => setSortingKey(e)}
                />
                <BaseDropDown items={["asc", "desc"]}
                              value={direction === 1 ? "asc" : "desc"} name={"direction"}
                              onSelect={e => setDirection(e === "asc" ? 1 : -1)}/>
            </div>
            {items.sort((a, b) => {
                return a[sortingKey] > b[sortingKey] ? direction : direction * -1;
            }).map(i => renderItem(i))
            }
        </div>
    )
}