import { EqualityChecker } from "../util/set";

export class WikiLang implements EqualityChecker {

    private _id: string;
    private _language: string;
    private _disambiguationId: string;

    constructor(id: string, lang: string, disambiguationTemplate: string) {
        this._id = id;
        this._language = lang;
        this._disambiguationId = disambiguationTemplate;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._language;
    }

    get disambiguationId(): string {
        return this._disambiguationId;
    }

    equals(other: WikiLang): boolean {
        return this.id === other.id;
    }

}

export module WikiLang {
    export const 
        EN = new WikiLang("EN", "English", "Category:Disambiguation"),
        FR = new WikiLang("FR", "French", "Cat\u00e9gorie:Homonymie");
}