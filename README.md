# Wikichan
**Wikichan** is a WebExtensions addon for Firefox that conveniently displays a popup with a preview of 
the Wikipedia article. 

Currently supports queries to Wikipedia in English, French, German, Spanish, Russian, Japanese, and Chinese. 
Support for more languages may come later.

## Getting Started

### Installation
Build from source:

Run `yarn install`, then `yarn run build` and `yarn run pack` to package the extension for use. 
Find the packaged zip file in the `dist` folder.

### Usage
While holding the `alt` key, click on a word in any webpage. A popup will appear with information from 
the Wikipedia articles of that word and groups of words around it. 

Any of the buttons at the top with language IDs may be used to filter out results for that language.
Filter settings do not persist when a new popup is opened.

Since Wikipedia has disambiguation pages to handle topics with the same or similar names and an effective
way of handling these has not been implemented, the message 'x disambiguation(s) hidden' may 
appear at the top of the popup. Click on this text to show the titles and links for these disambiguation
pages.

## Contributing
Run `yarn install` to fetch dependencies. 

To test, run `yarn run build` in root. The built extensions will be located in the `ext` directory.

### Dependencies
Wikichan uses only [Handlebars](https://handlebarsjs.com/) for templating and 
[loglevel](https://npmjs.com/loglevel) for logging.

### Credits
This project was inspired heavily by the extension [Yomichan](https://foosoft.net/projects/yomichan),
a Japanese-learning tool.

### License
This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for more details.