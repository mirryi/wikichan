import { WikiPage } from '../api/page';
const pageTemplate = require('./../../../template/page.handlebars');
const disambiguationTemplate = require('./../../../template/disambiguation.handlebars');

export class TemplateHandler {

    compilePage(page: WikiPage): string {
        return pageTemplate(page);
    }

    compileDisambiguation(page: WikiPage): string {
        return disambiguationTemplate(page);
    }

}