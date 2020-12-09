import Item from "@providers/Item";

import WikipediaProvider from "./Provider";

class WikipediaItem implements Item {
  title: string;
  description: string;
  longDescription?: string;

  tags: Map<string, string | string[]>;
  urls?: string[];

  searchTerm: string;
  provider: WikipediaProvider;

  pageid: number;
}

export default WikipediaItem;
