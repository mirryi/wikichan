import { sanitize } from "dompurify";
import htmlReactParse from "html-react-parser";
import { ReactNode } from "react";
import { empty, from, merge, Observable } from "rxjs";
import { catchError, distinct, filter, map } from "rxjs/operators";

import Provider from "@providers/Provider";

import WikipediaItem from "./Item";

class WikipediaProvider implements Provider<WikipediaItem> {
  language: WikipediaLanguage;

  constructor(language: WikipediaLanguage) {
    this.language = language;
  }

  name(): string {
    return this.language.name + " Wikipedia";
  }

  search(queries: string[]): Observable<WikipediaItem> {
    const observables = queries.map((q) => {
      const req = this.request(q);
      return from(req).pipe(
        filter((v) => !!v),
        map((data) => {
          data = data as MediaWikiResponse;
          const seen: Map<string, boolean> = new Map();
          const entries: MediaWikiPage[] = Object.entries(data.pages)
            .filter(([k]) => {
              if (Number(k) === -1 || seen.get(k) !== undefined) {
                return false;
              }
              seen.set(k, true);
              return true;
            })
            .map(([, v]) => v);

          if (entries.length < 1) {
            throw new Error("no pages found");
          }

          return entries[0];
        }),
        map((entry) => {
          if (!entry.pageid) {
            throw new Error("no pageid found");
          }
          const item: WikipediaItem = {
            pageid: entry.pageid,
            title: entry.title,
            urls: [entry.fullurl, entry.editurl],
            description: entry.description ? entry.description : "No description.",
            longDescription: entry.extract,
            tags: new Map([["lang", this.language.id]]),
            searchTerm: q,
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
        catchError(() => {
          return empty();
        }),
      );
    });
    return merge(...observables).pipe(distinct((item) => item.pageid));
  }

  async request(query: string): Promise<MediaWikiResponse | null> {
    const url = this.queryString(query);
    try {
      const res = await fetch(url.toString());

      if (!res.ok) {
        return null;
      }

      const data = await res.json();
      return data["query"] as MediaWikiResponse;
    } catch (error) {
      return null;
    }
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
      ["titles", encodeURIComponent(query)],
    ]);

    for (const [k, v] of params) {
      url += `${k}=${v}&`;
    }
    return new URL(url);
  }

  renderLongDescription(item: WikipediaItem): ReactNode {
    const ld = item.longDescription;
    if (!ld) {
      return null;
    }

    const html = sanitize(ld);
    const components = htmlReactParse(html);
    return components;
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

  static readonly EN = new WikipediaLanguage(
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

export default WikipediaProvider;
