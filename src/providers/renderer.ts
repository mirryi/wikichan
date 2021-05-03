import { Item } from "./item";

export type RenderFunc<T> = (item: T) => JSX.Element | undefined;

export type Renderer<T extends Item> = {
    render?: RenderFunc<T>;
} & {
    [Property in keyof Omit<Item, "meta">]?: RenderFunc<T>;
};
