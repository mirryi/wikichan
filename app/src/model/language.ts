export class Language {
    id: string;
    priority: number;
    name: string;
    disambId: string;

    constructor(id: string, name: string, priority: number, disambId: string) {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.disambId = disambId;
    }

    get url(): string {
        return "https://" + this.id.toLowerCase() + ".wikipedia.org";
    }
}

export module Language {
    export const EN = new Language(
        "EN",
        "English",
        1,
        "Category:All article disambiguation pages"
    );
}
