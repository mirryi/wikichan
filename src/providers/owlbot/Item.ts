import Item from "@providers/Item";

import OwlBotProvider from "./Provider";

interface OwlBotItem extends Item {
    title: string;
    description: string;
    longDescription?: string;

    tags: Map<string, string | string[]>;
    urls?: string[];

    definitions: OwlBotDefinition[];
    pronunciation: string;

    searchTerm: string;
    provider: OwlBotProvider;
}

export interface OwlBotDefinition {
    type: string;
    definition: string;
    example: string | null;
    image_url: string;
    emoji: string | null;
}

export default OwlBotItem;
