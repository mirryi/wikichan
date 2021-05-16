import * as s from "superstruct";

import { Item } from "./item";
import { Loader, LoaderConfig, ValidationSchema } from "./loader";

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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RendererOptions {}

export namespace RendererOptions {
    export const Schema: ValidationSchema<RendererOptions> = s.object({});
}

export type RendererLoader<
    C extends RendererOptions,
    T extends Item,
    P extends Renderer<T>
> = Loader<C, P>;

export type RendererLoaderConfig<
    C extends RendererOptions,
    T extends Item,
    P extends Renderer<T>
> = LoaderConfig<C, P>;
