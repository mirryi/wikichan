import { WikiPage } from '../api/page';
const pageTemplate = require('./../../../template/page.handlebars');

export class TemplateHandler {

    compile(page: WikiPage): string {
        return pageTemplate(page);
    }

}