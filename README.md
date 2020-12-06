# Wikichan

**Wikichan** is a WebExtensions addon and userscript that displays a popup with
information from Wikipedia and other sources.

## Getting Started

### Usage

While holding the `Ctrl` key, click on a word in any webpage. A popup will
appear with information for that word and groups of words around it.

### Installation

Clone and build from source for your platform.

    git clone https://github.com/Dophin2009/wikichan
    cd wikichan
    yarn install

For Greasemonkey userscript:

    yarn build:ujs

For Firefox extension:

    yarn build:firefox

For Chrome extension:

    yarn build:chrome

For Edge extension (not tested at all):

    yarn build:edge

For Opera extension (not tested at all):

    yarn build:opera

Automated builds and addon store entries coming soon.

## Contributing

### To-Do

-   [x] Manifest and build WebExtension
-   [x] English dictionary provider
-   [x] Cache results (per provider)
-   [x] Eliminate duplicate query strings before calling providers
-   [ ] More provider choices
-   [ ] Settings menu
    -   [ ] Enable / disable providers
-   [ ] Dark and light theme + switch
-   [ ] Cross-domain cache and settings in qutebrowser
-   [ ] Tabs to show results from individual providers
-   [ ] Testing

## Credits

This project was inspired heavily by the extension
[Yomichan](https://foosoft.net/projects/yomichan), a Japanese-learning tool.

Created originally for Conestoga High School's 2018 CodeFest.

## License

This project is licensed under the GNU Public License v3. See [LICENSE](LICENSE)
for more details.
