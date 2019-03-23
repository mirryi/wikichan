import { EqualityChecker } from "../util/set";

export class WikiPage implements EqualityChecker {
  private _id: number;
  private _title: string;
  private _summary: string;
  private _description: string;
  private _aliases: string[];

  private _url: string;
  private _editUrl: string;
  private _extlinks: string[];

  private _redirects: WikiRedirect[];

  constructor() {
    this._aliases = [];
    this._extlinks = [];
    this._redirects = [];
  }

  get id(): number {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get summary(): string {
    return this._summary;
  }

  get description(): string {
    return this._description;
  }

  get aliases(): string[] {
    return this._aliases;
  }

  get url(): string {
    return this._url;
  }

  get editUrl(): string {
    return this._editUrl;
  }

  get extlinks(): string[] {
    return this._extlinks;
  }

  get redirects(): WikiRedirect[] {
    return this._redirects;
  }

  addRedirect(r: WikiRedirect) {
    this._redirects.push(r);
  }

  equals(other: WikiPage): boolean {
    return this.id === other.id;
  }

  static fromJson(json: {
    redirects: { from: string; to: string }[];
    page: any;
  }): WikiPage {
    const res = new WikiPage();

    if (json.redirects) {
      json.redirects.forEach(r => {
        res.addRedirect(WikiRedirect.fromJson(r));
      });
    }

    const page = json.page;
    res._id = page.pageid;
    res._title = page.title;
    res._summary = page.extract;
    res._description = page.description;
    res._url = page.fullurl;
    res._editUrl = page.editurl;

    if (page.extlinks) {
      page.extlinks.forEach((e: any) => {
        res._extlinks.push(e["*"]);
      });
    }
    if (page.terms.alias) {
      page.terms.alias.forEach((a: string) => {
        res._aliases.push(a);
      });
    }

    if (page.redirects) {
      page.redirects.forEach((r: { from: string; to: string }) => {
        res._redirects.push(WikiRedirect.fromJson(r));
      });
    }
    return res;
  }
}

export class WikiRedirect {
  private _from: string;
  private _to: string;

  constructor() {}

  get from(): string {
    return this._from;
  }

  get to(): string {
    return this._to;
  }

  static fromJson(json: { from: string; to: string }) {
    console.log(json);
    const res = new WikiRedirect();
    res._from = json.from;
    res._to = json.to;
    return res;
  }
}
