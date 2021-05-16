export * from "./renderer";

import { RendererLoader } from "../..";
import { OwlBotItem } from "..";
import { OwlBotRenderer, OwlBotRendererOptions } from "./renderer";
import { Describe } from "superstruct";

export class OwlBotRendererLoader
    implements RendererLoader<OwlBotRendererOptions, OwlBotItem, OwlBotRenderer> {
    load(opts: OwlBotRendererOptions): OwlBotRenderer {
        return new OwlBotRenderer(opts);
    }

    optionsSchema(): Describe<OwlBotRendererOptions> {
        return OwlBotRendererOptions.Schema;
    }
}
