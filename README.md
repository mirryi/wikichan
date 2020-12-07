# Wikichan

**Wikichan** is a WebExtensions addon and userscript that displays a popup with
information from Wikipedia and other sources.

## Usage

While holding the `Ctrl` key, click on a word in any webpage. A popup will
appear with information for that word and groups of words around it.

## Installation

Clone and build from source for your platform.

    git clone https://github.com/Dophin2009/wikichan
    cd wikichan
    yarn install

### Greasemonkey Userscript

The userscript has been tested on Tampermonkey, Violentmonkey, and qutebrowser's
built-in greasemonkey support. It **does not work on Greasemonkey**.

Build the script and copy:

    yarn build:ujs      # builds to dist/ujs/wikichan.user.js

### Firefox Addon

Build and sign the addon:

    yarn build:firefox  # builds to dist/firefox
    cd dist/firefox
    yarn web-ext sign --api-key <api-key> --api-secret <api-secret>

### Chrome Extension

Build the extension:

    yarn build:chrome   # builds to dist/chrome

Automated builds and addon store entries coming soon.

### With Docker

Pass in the desired target value:

    DOCKER_BUILDKIT=1 docker build --build-arg TARGET=<target> --output dist .

## Contributing

### To-Do

-   [x] Manifest and build WebExtension
-   [x] English dictionary provider
-   [x] Cache results (per provider)
-   [ ] More provider choices
-   [ ] Settings menu
    -   [ ] Enable / disable providers
    -   [ ] Dark and light theme + switch
-   [ ] Cross-domain cache and settings in qutebrowser
-   [ ] Tabs to show results from individual providers
-   [ ] Testing
-   [ ] Automated release builds

## Credits

This project was inspired heavily by the extension
[Yomichan](https://foosoft.net/projects/yomichan), a Japanese-learning tool.

Created originally for Conestoga High School's 2018 CodeFest.

## License

This project is licensed under the GNU Public License v3. See [LICENSE](LICENSE)
for more details.
