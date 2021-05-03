import axios, { AxiosInstance } from "axios";
import { from, merge, Observable } from "rxjs";
import { distinct, filter, map } from "rxjs/operators";

import { isNotUndefined } from "@util/guards";

import { Provider } from "..";
import { OwlBotItem, OwlBotDefinition } from "./item";

const UID = "owlbot";
const NAME = "OwlBot";
const RENDERER = "OWLBOT";

export class OwlBotProvider implements Provider<OwlBotItem> {
    private token: string;
    private client: AxiosInstance;

    constructor(token: string) {
        this.token = token;

        this.client = axios.create({
            baseURL: "https://owlbot.info/api/v4",
        });
        this.client.interceptors.request.use((req) => {
            req.headers = { ["Authorization"]: `Token ${this.token}` };
            return req;
        });
    }

    search(queries: string[]): Observable<OwlBotItem> {
        const observables = queries.map((q) => {
            const req = this.request(q);
            return from(req).pipe(
                filter(isNotUndefined),
                map((d) => this.convertResponse(d, q)),
            );
        });
        return this.uniq(merge(...observables));
    }

    uniq(stream: Observable<OwlBotItem>): Observable<OwlBotItem> {
        return stream.pipe(distinct((item) => item.title));
    }

    private convertResponse(d: OwlBotResponse, query: string): OwlBotItem {
        const title = d.word;
        return {
            title,
            description: d.pronunciation ? `/${d.pronunciation}/` : "",
            tags: {},
            urls: [`https://owlbot.info/?q=${query}`],
            definitions: d.definitions,
            pronunciation: d.pronunciation,
            searchTerm: query,
            meta: {
                uid: title,
                source: { uid: UID, name: NAME },
                renderer: RENDERER,
            },
        };
    }

    private async request(query: string): Promise<OwlBotResponse | undefined> {
        const url = `/dictionary/${encodeURIComponent(query)}`;

        try {
            const response = await this.client.get<OwlBotResponse>(url);
            return response.data;
        } catch (e: unknown) {
            return undefined;
        }
    }
}

interface OwlBotResponse {
    definitions: OwlBotDefinition[];
    word: string;
    pronunciation: string;
}
