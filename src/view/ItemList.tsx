import React, { ReactNode, Component } from "react";

import { Item } from "@providers";

import ItemComponent from "./Item";

interface ItemListProps {
    items: Item[];
}

class ItemListComponent extends Component<ItemListProps> {
    render(): ReactNode {
        return (
            <div>
                {this.props.items.map((item) => (
                    <ItemComponent key={item.title} data={item} />
                ))}
            </div>
        );
    }
}

export default ItemListComponent;
