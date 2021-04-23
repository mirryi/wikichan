import { ReactNode } from "react";

import { Item } from "./Item";

export type RenderFunc<T> = (item: T) => ReactNode;

export type Renderer<T extends Item> = {
    render?: RenderFunc<T>;
} & {
    [Property in keyof Omit<Item, "meta">]?: RenderFunc<T>;
};
