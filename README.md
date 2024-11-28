# wizzy2.js

A visual power tool for rapid development of HTML/CSS user interfaces.

## Table of Contents

- [Overview](#overview)
- [Motivation](#motivation)
- [Roadmap](#roadmap)
- [Usage and Installation](#usage-and-installation)
  - [Installation](#1-installation)
  - [Usage](#2-usage)
- [FAQ (Frequently Asked Questions)](#faq-frequently-asked-questions)
- [License](#license)

## Overview

Wizzy2 is a visual editor HTML/CSS webpages that allows for developers already familiar with HTML/CSS to rapidly prototype and design user interfaces that can be exported and used in any web project.

## Motivation

There are few tools that allow you to visually edit pages in a way that is intuitive when simply writing it by hand is faster and easier. I aim to bridge that gap by accommodating the user that is already familiar with HTML/CSS instead of trying to abstract it away and make it more 'user-friendly'. A couple of examples of this may be:

- Setting specific CSS properties by pressing keys in a specific sequence, i.e. `S -> M -> T -> A` to set the `margin-top` of an element to `auto`. or `S -> M -> T -> ↑ -> ↑ -> ↑ -> ↑ ... ` to increment the `margin-top` by some amount. These types of shortcuts are calld "chords" and are common in text editors like Vim or Emacs. `S` stands for style, `M` for margin, `T` for top, and so on.

- Just editing the HTML directly in the page rather than using massive set of buttons and dropdowns to do the same thing. Now you're doing what you would normally do, except you get instant visual feedback.

## Roadmap

- [x] Basic inline HTML editing
- [ ] Element selection
  - [x] Click to select
  - [ ] Multi-select
    - [x] Ctrl click to add single element
    - [ ] Shift click to add range of elements
    - [x] Queryselector text prompt
  - [x] Selection visualization
    - [x] Highlighting
      - [x] Single element
      - [x] Multiple elements
- [ ] Drag and drop elements
  - [ ] Drag to rearrange
  - [ ] Drag from a palette
  - [ ] Drag to resize
- [ ] CSS Editing
  - [x] Inline CSS editing
  - [ ] Global CSS editing
    - [ ] Saving/tracking changes to global state of CSS
- [ ] Custom elements
  - [ ] Custom element editor
    - [ ] HTML editor
    - [ ] CSS editor
    - [ ] JS editor
- [ ] Commands
  - [ ] Undo action
  - [ ] Copy/Paste element
  - [x] Delete element
  - [ ] Duplicate element
  - [x] Assignable command hotbar
- [x] Context menus
- [ ] Export page
- [ ] Preferences and settings
  - [x] Preferences window element
  - [ ] Settings
    - [ ] Custom Keybindings
    - [ ] Appearance
- [ ] Plugin system
- [ ] Documentation

## Usage and Installation

### 1. Installation

```
git clone https://github.com/mkgiga/wizzy2.git
```

```
cd wizzy2
```

```
npm install
```

```
npm run build
```

Now load `dist/wizzy2.build.js` inside a web page using your favorite method, such as a simple `<script>` tag, or a browser extension like Tampermonkey if you want to use it on any page.

### 2. Usage

(Coming soon)

## FAQ (Frequently Asked Questions)

- _What happened to wizzy 1?_

  The first iteration of wizzy was a simple project that I never released publicly. It ended up being more of a proof of concept, which I scrapped so I could start fresh with a new codebase

- _Why is this project called wizzy?_

  The name "wizzy" is a portmanteau of "wizard", "busy" and the long acronym "WYSIWYG" which stands for "What You See Is What You Get", which refers to any editor that shows the user the end-result of their work as they are working on it, such as Microsoft Word or Adobe Photoshop.

- _Where can I find the source code?_

  Right here dummy 😄 Look at the top of the page!

- _Can I use this project in my own project?_

  Yes! This project is licensed under the [MIT License](#license), which means you can use it in your own projects, commercial or otherwise, as long as you include the license with your project. It's not required, but I would be very happy if you included a link to this project in your project's acknowledgements or credits.

## License

```
Copyright 2024 mkgiga

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
