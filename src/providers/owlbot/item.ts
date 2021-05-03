import { Item } from "..";

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
