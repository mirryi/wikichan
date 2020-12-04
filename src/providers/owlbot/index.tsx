import React, { ReactNode } from "react";
import { from, merge, Observable } from "rxjs";
import { distinct, filter, map } from "rxjs/operators";

import { Provider, Item } from "@providers";

import CachedOwlBotProvider from "./cached";
import styles from "./index.module.scss";

export { CachedOwlBotProvider };

export interface OwlBotItem extends Item {
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

export class OwlBotProvider implements Provider<OwlBotItem> {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  name(): string {
    return "OwlBot";
  }

  search(queries: string[]): Observable<OwlBotItem> {
    const observables = queries.map((q) => {
      const req = this.request(q);
      return from(req).pipe(
        filter((d) => !!d && !!d.definitions),
        map((d) => {
          d = d as OwlBotResponse;
          const item: OwlBotItem = {
            title: d.word,
            description: d.pronunciation ? `/${d.pronunciation}/` : "",
            tags: new Map<string, string | string[]>(),
            urls: [`https://owlbot.info/?q=${q}`],
            definitions: d.definitions,
            pronunciation: d.pronunciation,
            searchTerm: q,
            provider: this,
          };
          return item;
        }),
      );
    });
    return merge(...observables).pipe(distinct((item) => item.title));
  }

  async request(query: string): Promise<OwlBotResponse | null> {
    const url = `https://owlbot.info/api/v4/dictionary/${encodeURIComponent(query)}`;
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      });

      if (!res.ok) {
        return null;
      }
      return res.json();
    } catch (e) {
      return null;
    }
  }

  renderLongDescription(item: OwlBotItem): ReactNode {
    return item.definitions.map((def) => (
      <div key={item.title + def.definition} className={styles.definition}>
        <div>
          <em>{def.type}</em>: {def.definition} {def.emoji}
        </div>
        <div className={styles.example}>{def.example ? '"' + def.example + '"' : ""}</div>
      </div>
    ));
  }
}

export interface OwlBotResponse {
  definitions: OwlBotDefinition[];
  word: string;
  pronunciation: string;
}

interface OwlBotDefinition {
  type: string;
  definition: string;
  example: string | null;
  image_url: string;
  emoji: string | null;
}
