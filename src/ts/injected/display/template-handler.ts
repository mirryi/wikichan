import { WikiPage } from '../api/page';
import { WikiLang } from '../api/lang';
const pageTemplate = require('./../../../template/page.handlebars');
const disambiguationTemplate = require('./../../../template/disambiguation.handlebars');
const langFilterTemplate = require('./../../../template/filter.handlebars');

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