# DeskDocs
[![Build Status](https://travis-ci.com/jmerle/deskdocs.svg?branch=master)](https://travis-ci.com/jmerle/deskdocs)
[![Latest release](https://img.shields.io/github/release/jmerle/deskdocs.svg?style=flat)](https://github.com/jmerle/deskdocs/releases)

DeskDocs is a feature-rich desktop application for [DevDocs.io](https://devdocs.io/) which wraps 150+ API documentations in a fast, consistent and searchable interface.

**DeskDocs is a work-in-progress at the moment. Not all features listed below are implemented yet and the download links don't work yet. PR's are not accepted at this time.**

## Highlights
- [Dark mode](#dark-mode)
- [Tabs](#tabs)
- [In-page search](#in-page-search)
- [Global shortcut](#global-shortcut)
- [Auto restore](#auto-restore)
- [Adjustable text size](#adjustable-text-size)
- [Launch on boot](#launch-on-boot)
- [`devdocs://` protocol](#devdocs-protocol)
- Cross-platform

## Install
*macOS 10.10+, Linux, and Windows 7+ are supported (64-bit only).*

### macOS
[**Download**](https://github.com/jmerle/deskdocs/releases/latest) the `.dmg` file.

*The application is unsigned. The first time you run the application you'll need to manually go to the `/Applications` folder, right click on DeskDocs and click "Open". This pops up an alert asking you whether you want to run the application, which you need to confirm.*

### Linux
[**Download**](https://github.com/jmerle/deskdocs/releases/latest) the `.AppImage` or `.deb` file.

Also available as a [snap](https://snapcraft.io/deskdocs).

*The AppImage needs to be [made executable](http://discourse.appimage.org/t/how-to-make-an-appimage-executable/80) after download.*

### Windows
[**Download**](https://github.com/jmerle/deskdocs/releases/latest) the `.exe` file.

*The application is unsigned. If SmartScreen pops up, click on "More Info" and click on the "Run Anyways" button.*

## Features

### Dark mode
TBD

### Tabs
TBD

### In-page search
TBD

### Global shortcut
TBD

### Auto restore
TBD

### Adjustable text size
TBD

### Launch on boot
TBD

### `devdocs://` protocol
TBD

## Development
DeskDocs is built with Electron and TypeScript. Yarn is used for dependency management. After installing the dependencies with `yarn`, the following commands can be useful:
```sh
# Start the application with hot-reloading enabled
$ yarn start

# Package the application for the current platform
$ yarn package

# Lint the code
$ yarn lint

# Auto-fix linting issues
$ yarn fix
```

### Releases
Running `yarn release` starts an interactive UI to publish a new version. After the command finishes and a browser window opens to create a new draft, save it immediately to allow the Travis build to attach assets to it. After the Travis build is finished the draft can be released. `snapcraft` is required to be installed and configured so that a new Snap can be pushed to the Snap Store.
