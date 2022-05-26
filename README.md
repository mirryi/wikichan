# Wikichan

**Wikichan** is a WebExtensions addon and userscript that displays a popup with
information from Wikipedia and other sources.

## Features

-   Wikipedia article summary source
-   English dictionary source via OwlBot
-   Search bar to manually query providers
-   Open links to source pages

See [To-Do](#to-do) for upcoming features.

## Usage

While holding the `ctrl` key, click on a word in any webpage. A popup will
appear with information for that word and groups of words around it.

## Installation

Automated release builds and addon store entries coming soon.

Clone and build from source for your platform.

    git clone --recurse-submodules https://github.com/mirryi/wikichan
    cd wikichan
    yarn install

If you want to enable the OwlBot provider, [create an OwlBot API
key](https://owlbot.info/) and create a `.env` file:

    OWLBOT_TOKEN=<token>

### Greasemonkey Userscript

The userscript has been tested on Tampermonkey. It **does not work on
Greasemonkey**.

Build the script and copy:

    yarn build:ujs      # builds to dist/ujs/wikichan.user.js

#### For Qutebrowser

Until qutebrowser has better Greasemonkey support ([see
\#3238](https://github.com/qutebrowser/qutebrowser/issues/3238)), persistent
cross-domain storage is accomplished via a tiny server with an SQLite database.

Build the script and copy files:

    yarn build:qutebrowser  # builds to dist/qutebrowser/

You will need to start the server when you start up qutebrowser.

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
-   [x] Cache results (per provider)
-   [ ] More provider choices
    -   [x] English dictionary provider
    -   [ ] Any language Wikipedia
    -   [ ] Other language dictionary
-   [ ] Settings menu
    -   [ ] Use library for certain cache/storage backends
    -   [x] Cross-domain cache and settings in qutebrowser
    -   [ ] Input API tokens instead of at compile-time
    -   [ ] Enable/disable providers
    -   [ ] Dark/light themes (migrate to styled components?)
    -   [ ] Option to select by character
    -   [ ] Per-domain settings
-   [ ] Tabs to show results from individual providers
-   [ ] Automated release builds
-   [ ] Testing
-   [ ] i18n
-   [ ] Legacy extension support

## Credits

This project was inspired heavily by the extension
[Yomichan](https://foosoft.net/projects/yomichan), a Japanese-learning tool.

Created originally for Conestoga High School's 2018 CodeFest.

## License

This project is licensed under the GNU Public License v3. See [LICENSE](LICENSE)
for more details.
