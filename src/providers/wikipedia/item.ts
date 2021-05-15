import s from "superstruct";

import { Item, ValidationSchema } from "..";

export interface WikipediaItem extends Item {
    pageid: number;
}

export namespace WikipediaItem {
    export const Schema: ValidationSchema<WikipediaItem> = s.assign(
        Item.Schema,
        s.object({
            pageid: s.number(),
        }),
    );
}
