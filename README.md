# wizzy2.js
A visual power tool for rapid development of HTML/CSS user interfaces.

## Table of Contents
- [Overview](#overview)
- [Current priorities](#current-priorities)
- [Usage and Installation](#usage-and-installation)
  - [Installation](#1-installation)
  - [Usage](#2-usage)
- [FAQ (Frequently Asked Questions)](#faq-frequently-asked-questions)
- [License](#license)

## Overview
There are few tools available that succeed in providing a fast and intuitive way to create and iterate on web interfaces. In the past, tools like Adobe Dreamweaver and Microsoft Frontpage have tried to provide a visual interface for web development -- These tools often go out of their way to accommodate both developers and non-developers alike, and as a result, their interfaces are often described as cluttered and may overload the user with too many options, creating a sort of web-development equivalent to a DAW (Digital Audio Workstation) like FL Studio or Ableton Live. These tools are valuable in their field, but should not be the standard for a visual web development experience.

## Current priorities
- [x] Attributes/classes/inline style editor per-element
- [ ] Quick styles menu on selection per-element (Alignment, padding, margin, etc.)
- [x] Preferences menu
- [ ] Quick color picker

## Usage and Installation

### 1. Installation
1. 
  ```
  git clone https://github.com/mkgiga/wizzy2.git
  ```
2. 
  ```
  cd wizzy2
  ```
3. 
  ```
  npm install
  ```
4. 
  ```
  npm run build
  ```

5. Load dist/wizzy2.build.js inside a web page using your favorite method, such as a simple `<script>` tag, or a browser extension like Tampermonkey if you want to use it on any page.

### 2. Usage
(Coming soon)

## FAQ (Frequently Asked Questions)
- *What happened to wizzy 1?*
  The first iteration of wizzy was a simple project that I never released publicly. It ended up being more of a proof of concept, which I scrapped so I could start fresh with a new codebase

- *Why is this project called wizzy?*
  The name "wizzy" is a portmanteau of "wizard", "busy" and the long acronym "WYSIWYG" which stands for "What You See Is What You Get", which refers to any editor that shows the user the end-result of their work as they are working on it, such as Microsoft Word or Adobe Photoshop.

- *Where can I find the source code?*
  Right here, dummy. Look at the top of the page.

- *Can I use this project in my own project?*
  Yes! This project is licensed under the [MIT License](#license), which means you can use it in your own projects, commercial or otherwise, as long as you include the license with your project. It's not required, but I would be very happy if you included a link to this project in your project's acknowledgements or credits.

## License

```
Copyright 2024 mkgiga

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```