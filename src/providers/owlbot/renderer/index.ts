import { OwlBotItem } from "..";
import { RendererLoader, RendererLoaderConfig, ValidationSchema } from "../..";
import { OwlBotRenderer, OwlBotRendererOptions } from "./renderer";

export * from "./renderer";

export class OwlBotRendererLoader
    implements RendererLoader<OwlBotRendererOptions, OwlBotItem, OwlBotRenderer>
{
    load(opts: OwlBotRendererOptions): OwlBotRenderer {
        return new OwlBotRenderer(opts);
    }

    optionsSchema(): ValidationSchema<OwlBotRendererOptions> {
        return OwlBotRendererOptions.Schema;
    }
}

type OwlBotRendererLoaderConfig = RendererLoaderConfig<
    OwlBotRendererOptions,
    OwlBotItem,
    OwlBotRenderer
>;

export namespace OwlBotRendererLoader {
    export const ALL: { owlbot: OwlBotRendererLoaderConfig } = {
        owlbot: { getLoader: () => new OwlBotRendererLoader() },
    };
}
