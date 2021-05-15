import * as s from "superstruct";

import { Item, ValidationSchema } from "..";

export interface OwlBotItem extends Item {
    definitions: OwlBotDefinition[];
    pronunciation: string;
}

export interface OwlBotDefinition {
    type: string;
    definition: string;
    example: string | null;
    image_url: string;
    emoji: string | null;
}

export namespace OwlBotDefinition {
    export const Schema: ValidationSchema<OwlBotDefinition> = s.object({
        type: s.string(),
        definition: s.string(),
        example: s.nullable(s.string()),
        image_url: s.string(),
        emoji: s.nullable(s.string()),
    });
}

export namespace OwlBotItem {
    export const Schema: ValidationSchema<OwlBotItem> = s.assign(
        Item.Schema,
        s.object({
            definitions: s.array(OwlBotDefinition.Schema),
            pronunciation: s.string(),
        }),
    );
}
