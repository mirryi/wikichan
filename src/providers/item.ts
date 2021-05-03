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

export interface ItemMeta {
    source: { name: string };

    /**
     * Identifier for special renderer to be used when displaying this item
     */
    renderer?: string;
}
