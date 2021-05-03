import React from "react";

import { Item } from "@providers";

import { ItemDetails } from "./ItemDetails";

interface ItemListProps {
    items: Item[];
}

export const ItemList = (props: ItemListProps): JSX.Element => (
    <>
        {props.items.map((item) => (
            <ItemDetails key={item.title} data={item} />
        ))}
    </>
);
