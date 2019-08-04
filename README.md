# Wikichan
**Wikichan** is a WebExtensions addon for Firefox that conveniently displays a popup with 
a preview of the Wikipedia article. 

v2 currently supports queries to Wikipedia in English, 
~~French, German, Spanish, Russian, Japanese, and Chinese.~~ 
Support for more languages may come later.

## Getting Started

### Installation
Build from source or download via AMO.

[![](img/marketplace.png)](https://addons.mozilla.org/en-US/firefox/addon/wikichan-v2/)

### Usage
While holding the `alt` key, click on a word in any webpage. A popup will appear with 
information from the Wikipedia articles of that word and groups of words around it. 

~~Any of the buttons at the top with language IDs may be used to filter out results for 
that language. Filter settings do not persist when a new popup is opened.~~
These features have not yet been implemented in this version.

## Contributing
Run `yarn install` and then `yarn run build` in root. The built extensions will be 
located in the `ext` directory.

### Dependencies
[Rivets](https://www.npmjs.com/package/rivets) for data binding.

Written in Typescript 2.0, HTML 5, and SCSS, which are compiled and bundled with Webpack 4.

### Credits
This project was inspired heavily by the extension 
[Yomichan](https://foosoft.net/projects/yomichan), a Japanese-learning tool.

### License
This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for more 
details.