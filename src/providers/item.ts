import s from "superstruct";

export interface ItemMeta {
    uid: string;

    source: { uid: string; name: string };

    /**
     * Identifier for special renderer to be used when displaying this item
     */
    renderer?: string;
}

export namespace ItemMeta {
    export const Schema = s.object({
        uid: s.string(),
        source: s.object({ uid: s.string(), name: s.string() }),
        renderer: s.optional(s.string()),
    });
}

export interface Item {
    title: string;
    subtitle?: string;

    description: string;
    longDescription?: string;

    tags?: { [key: string]: string | string[] };
    urls?: string[];

    searchTerm: string;

    meta: ItemMeta;
}

export namespace Item {
    export const Schema = s.object({
        title: s.string(),
        subtitle: s.optional(s.string()),
        description: s.string(),
        longDescription: s.optional(s.string()),
        tags: s.optional(
            s.record(s.string(), s.union([s.string(), s.array(s.string())])),
        ),
        urls: s.optional(s.array(s.string())),

        searchTerm: s.string(),
        meta: ItemMeta.Schema,
    });
}
