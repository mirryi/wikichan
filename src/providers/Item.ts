import Provider from "./Provider";

interface Item {
    title: string;
    subtitle?: string;

    description: string;
    longDescription?: string;

    tags?: Map<string, string | string[]>;
    urls?: string[];

    searchTerm: string;

    provider: Provider<Item>;
}

export default Item;
