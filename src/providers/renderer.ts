import { Item } from "./item";

/**
 * Renderer implementation functions should return a JSX element.
 *
 * If the associated section should be empty, an empty JSX fragment should be
 * returned.
 *
 * undefined should be returned when the renderer should fallback to the
 * default renderer.
 *
 */
export type RenderFunc<T> = (item: T) => JSX.Element | undefined;

export type Renderer<T extends Item> = {
    render?: RenderFunc<T>;
} & {
    [Property in keyof Omit<Item, "meta">]?: RenderFunc<T>;
};
