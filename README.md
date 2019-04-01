# Wikichan
**Wikichan** is a WebExtensions addon for Firefox that conveniently displays a popup with a preview of 
the Wikipedia article. 

Currently supports queries to Wikipedia in English, French, German, Spanish, Russian, Japanese, and Chinese. 
Support for more languages may come later.

## Getting Started

### Installation
Releases can be found in the `dist` folder. Download the latest and install in Firefox (Install Add-on 
from File...). This addon is only supported on Firefox versions 57+.

### Usage
While holding the `alt` key, click on a word in any webpage. A popup will appear with information from 
the Wikipedia articles of that word and groups of words around it.

## Contributing
Uses npm version 6.4.1; run `npm install` and then `npm run build` in root. The built extensions will 
be located in the `ext` directory.

### Dependencies
Wikichan uses only [Handlebars](https://handlebarsjs.com/) for templating and 
[loglevel](https://npmjs.com/loglevel) for logging.

In development, Wikichan is written in Typescript 2.0, HTML 5, and SCSS, which are compiled and bundled 
with Webpack 4.

### Credits
This project was inspired heavily by the extension [Yomichan](https://foosoft.net/projects/yomichan),
a Japanese-learning tool.

### License
This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for more details.