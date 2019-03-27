export enum WikiLang {
    EN, FR, DE, ES, IT
}

export module WikiLang {
    export function toString(lang: WikiLang): string {
        return WikiLang[lang].toLowerCase();
    }
}