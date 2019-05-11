import { WikiPage } from "src/model/page";
import { WikiLang } from "src/model/lang";

const pageTemplate = require('./page.handlebars');
const disambiguationTemplate = require('./disambiguation.handlebars');
const langFilterTemplate = require('./filter.handlebars');

export class TemplateHandler {

    compilePage(page: WikiPage): string {
        return pageTemplate(page);
    }

    compileDisambiguation(page: WikiPage): string {
        return disambiguationTemplate(page);
    }

    compileLangFilter(lang: WikiLang): string {
        return langFilterTemplate(lang);
    }

}