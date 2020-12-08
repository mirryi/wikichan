# Wikichan

**Wikichan** is a WebExtensions addon and userscript that displays a popup with
information from Wikipedia and other sources.

## Usage

While holding the `Ctrl` key, click on a word in any webpage. A popup will
appear with information for that word and groups of words around it.

## Installation

Automated release builds and addon store entries coming soon.

Clone and build from source for your platform.

    git clone https://github.com/Dophin2009/wikichan
    cd wikichan
    yarn install

If you want to enable the OwlBot provider, [create an OwlBot API
key](https://owlbot.info/) and set the environment variable `OWLBOT_TOKEN` to
the key value.

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

### With Docker

Pass in the desired target value:

    DOCKER_BUILDKIT=1 docker build --build-arg TARGET=<target> --output dist .

## Contributing

### To-Do

-   [x] Manifest and build WebExtension
-   [ ] Cache results (per provider)
    -   [x] Browser and GM cache
    -   [ ] Cross-domain cache and settings in qutebrowser
-   [ ] More provider choices
    -   [x] English dictionary provider
    -   [ ] Any language Wikipedia
    -   [ ] Other language dictionary
-   [ ] Settings menu
    -   [ ] Enable / disable providers
    -   [ ] Dark and light theme + switch
    -   [ ] Option to select by character
-   [ ] Tabs to show results from individual providers
-   [ ] Testing
-   [ ] i18n
-   [ ] Automated release builds

## Credits

This project was inspired heavily by the extension
[Yomichan](https://foosoft.net/projects/yomichan), a Japanese-learning tool.

Created originally for Conestoga High School's 2018 CodeFest.

## License

This project is licensed under the GNU Public License v3. See [LICENSE](LICENSE)
for more details.
