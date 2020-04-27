import { ReactNode } from "react";
import { Observable, from, empty } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Item, Provider } from "../provider";

export class WikipediaProvider implements Provider<Item> {
  language: WikipediaLanguage;

  constructor(language: WikipediaLanguage) {
    this.language = language;
  }

  search(query: string): Observable<Item> {
    const url = this.queryString(query);
    const req = fetch(url.toString())
      .then((res: Response): any => {
        if (!res.ok) {
          Promise.reject("unsuccessful request");
        }

        return res.json();
      })
      .then((json) => {
        return json["query"] as MediaWikiResponse;
      });

    return from(req).pipe(
      map<MediaWikiResponse, MediaWikiPage>((data) => {
        let seen: Map<string, boolean> = new Map();
        let entries: MediaWikiPage[] = Object.entries(data.pages)
          .filter(([k, _]) => {
            if (Number(k) === -1 || seen.get(k) !== undefined) {
              return false;
            }
            seen.set(k, true);
            return true;
          })
          .map(([_, v]) => v);

        if (entries.length < 1) {
          throw new Error("no pages found");
        }

        const entry = entries[0];
        return entry;
      }),
      map((entry) => {
        const item: Item = {
          title: entry.title,
          urls: [entry.fullurl, entry.editurl],
          description: entry.description ? entry.description : "No description.",
          longDescription: entry.extract,
          tags: new Map([["lang", this.language.id]]),
          searchTerm: query,
          provider: this,
        };

        if (entry.categories) {
          item.tags?.set(
            "categories",
            entry.categories.map((c) => c.title),
          );
        }
        if (entry.extlinks) {
          item.urls?.push(...entry.extlinks.map((link) => link["*"]));
        }
        if (entry.terms?.alias) {
          item.tags?.set("aliases", entry.terms.alias);
        }

        return item;
      }),
      catchError((err, caught) => {
        return empty();
      }),
    );
  }

  queryString(query: string): URL {
    let url = `${this.language.baseURL()}/w/api.php?`;
    const params = new Map([
      ["origin", "*"],
      ["format", "json"],
      ["action", "query"],
      ["prop", "info|description|categories|extlinks|pageterms|extracts&exintro"],
      ["inprop", "url"],
      ["redirects", "1"],
      ["titles", query],
    ]);

    for (const [k, v] of params) {
      url += `${k}=${v}&`;
    }
    return new URL(url);
  }

  renderf(): ((item: Item) => ReactNode) | null {
    return null;
  }
}

export class WikipediaLanguage {
  id: string;
  name: string;
  disambID: string;

  constructor(id: string, name: string, disambID: string) {
    this.id = id;
    this.name = name;
    this.disambID = disambID;
  }

  baseURL(): URL {
    return new URL(`https://${this.id.toLowerCase()}.wikipedia.org`);
  }
}

export module WikipediaLanguage {
  export const EN = new WikipediaLanguage(
    "EN",
    "English",
    "Category:All article disambiguation pages",
  );
}

type MediaWikiResponse = {
  normalized: { from: string; to: string }[];
  pages: Map<number, MediaWikiPage>;
};

type MediaWikiPage = {
  canonicalurl: string;
  categories?: { ns: number; title: string }[];
  contentmodel: string;
  description?: string;
  descriptionsource?: string;
  editurl: string;
  extlinks?: { "*": string }[];
  extract?: string;
  fullurl: string;
  lastrevid?: number;
  length?: number;
  ns: number;
  pageid?: number;
  pagelanguage: string;
  pagelanguagedir: string;
  pagelanguagehtmlcode: string;
  terms?: {
    alias: string[];
    description: string[];
    label: string[];
  };
  title: string;
  touched?: string;
};
