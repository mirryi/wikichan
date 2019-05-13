export class Language {
    id: string;
    priority: number;
    name: string;

    constructor(id: string, name: string, priority: number) {
        this.id = id;
        this.name = name;
        this.priority = priority;
    }

    get url(): string {
        return "https://" + this.id.toLowerCase() + ".wikipedia.org";
    }
}

export module Language {
    export const EN = new Language("EN", "English", 1);
}
