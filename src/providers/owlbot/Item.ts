import Item from "@providers/Item";

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

export default OwlBotItem;
