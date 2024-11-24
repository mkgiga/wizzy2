/**
 * @fileoverview
 *
 * wizzy2.js - A front-end power tool for web developers designed to make
 * rapidly iterating on web pages less painful and more fun.
 *
 * @version 2.0.0
 * @license MIT
 * @author mkgiga
 * @see {@link "https://github.com/mkgiga/wizzy2"} for the source code repository
 */

import html from "./lib/html.js";
import getTools from "./tools.js";
import { EditorCommand } from "./editor-commands.js";

// Functions that create complex elements
import contextMenu from "./elements/contextmenu.js";
import editorDomPath from "./elements/editor-dompath.js";
import quickEdit from "./elements/element-quickedit.js";
import editorContainer from "./elements/editor-container.js";
import elementInfo from "./elements/element-info.js";
import editorWindow from "./elements/editor-window.js";
import { tabMenu } from "./elements/tab-menu.js";
import { tools, tool } from "./elements/toolbar.js";
import { editorPreferences } from "./elements/editor-preferences.js";
import {
  hotbar,
  hotbarSlot,
  command,
  commandSearchMenu,
  insertHTMLSnippetCommand,
} from "./elements/commands.js";
import quickStyles from "./elements/element-quickstyles.js";
import { addChord, chordContainer } from "./elements/editor-chords.js";

/**
 * using new() with an IIFE to allow for a private stateful object instance
 */
new (function () {
  const LOCALSTORAGE_TARGET_PREFERENCES = "__wizzy-preferences";
  const LOCALSTORAGE_TARGET_HTML = "__wizzy-html";
  const LOCALSTORAGE_TARGET_CSS = "__wizzy-css";

  const editor = this;

  const CssLengthUnit = {
    PX: "px",
    EM: "em",
    REM: "rem",
    PERCENT: "%",
    VW: "vw",
    VH: "vh",
    CM: "cm",
    MM: "mm",
    IN: "in",
    PT: "pt",
    PC: "pc",
  };

  const CssTimeUnit = {
    Second: "s",
    Millisecond: "ms",
  };

  /**
   * @typedef {typeof state} EditorState
   */
  const state = {
    history: {
      commands: [],
      index: 0,
    },

    /**
     * @type {{
     *   [key: string]: {
     *     unit: string,
     *     step: number,
     *   }
     * }}
     * @description Settings for editing CSS properties, remembering user preferences for each type of property
     */
    cssSettings: {
      length: {
        unit: CssLengthUnit.PX,
        step: 1,
      },

      time: {
        unit: "s",
        step: 0.1,
      },

      weight: {
        unit: "",
        step: 100,
      },
    },

    chord: [],

    chords: {
      t: {
        // text-align
        a: {
          text: "Text Align",

          ArrowLeft: () => {
            selection.set.style("text-align", "left");
          },
          ArrowRight: () => {
            selection.set.style("text-align", "right");
          },
          ArrowUp: () => {
            selection.set.style("text-align", "center");
          },
          ArrowDown: () => {
            selection.set.style("text-align", "justify");
          },
        },

        // text-justify
        j: {
          text: "Text Justify",
          ArrowLeft: () => {
            selection.set.style("text-justify", "left");
          },
          ArrowRight: () => {
            selection.set.style("text-justify", "right");
          },
          ArrowUp: () => {
            selection.set.style("text-justify", "center");
          },
          ArrowDown: () => {},
        },

        // text-decoration
        d: {
          text: "Text Decoration",
          key: "text-decoration",
          allowMultiple: true,

          b: "bold",
          i: "italic",
          u: "underline",
          l: "line-through",
          o: "overline",
          s: {},
        },
      },
      p: {
        // padding
        text: "Padding",

        ArrowUp: {
          text: "Padding Top",

          ArrowUp: () => {
            selection.set.style(
              "padding-top",
              `${state.cssSettings.length.step}${state.cssSettings.length.unit}`
            );

            return `Increase top-side padding by ${state.cssSettings.length.step}${state.cssSettings.length.unit}.`;
          },
          ArrowDown: () => {
            selection.set.style(
              "padding-top",
              `-${state.cssSettings.length.step}${state.cssSettings.length.unit}`
            );

            return `Decrease top-side padding by ${state.cssSettings.length.step}${state.cssSettings.length.unit}.`;
          },
        },
      },

      f: {
        // font-weight
        text: "Font Weight",
        w: {
          text: "Font Weight",
          ArrowUp: () => {
            let { unit, step } = state.cssSettings.weight;
            step = Math.abs(step);

            for (const element of getSelection()) {
              const computedStyle = window.getComputedStyle(element);
              const fontWeight = parseInt(computedStyle.fontWeight);

              elementSetInlineStyle(
                element,
                "font-weight",
                `${fontWeight + step}`
              );
            }
          },
          ArrowDown: () => {
            let { unit, step } = state.cssSettings.weight;
            step = Math.abs(step);

            for (const element of getSelection()) {
              const computedStyle = window.getComputedStyle(element);
              const fontWeight = parseInt(computedStyle.fontWeight);

              elementSetInlineStyle(
                element,
                "font-weight",
                `${Math.max(100, fontWeight - step)}`
              );
            }
          },
        },
        // font-style
        s: {},
        // font-size
        z: {
          ArrowUp: () => {},
        },
      },
    },

    mouse: {
      x: 0,
      y: 0,
    },

    preferences: editorPreferences(LOCALSTORAGE_TARGET_PREFERENCES),
    editorContainer: editorContainer(),
    notifications: html` <div class="__wizzy-notifications"></div> `,
    chordContainer: null,

    mouseFollower: html`
      <span
        class="__wizzy-current-tool-mouse-follower material-icons"
        style="
          position: fixed; 
          top: 0; 
          left: 0; 
          z-index: 1000000006; 
          pointer-events: none; 
          user-select: none;
          font-size: 16px;
          color: #333;
          font-family: 'Material Icons';
          "
      >
      </span>
    `,
    hotbar: null,
    canvasOverlay: html` <canvas class="__wizzy-canvas-overlay"></canvas> `,
  };

  this.state = state;

  function main() {
    initStyle();
    initElements();
    initListeners();

    state.editorContainer.watch();
  }

  function initStyle() {
    fetch("./wizzy.css")
      .then((res) => res.text())
      .then((css) => {
        const style = document.createElement("style");
        style.innerHTML = css;
        style.classList.add("__wizzy-style");
        document.head.appendChild(style);
      });
  }

  function initElements() {
    document.body.appendChild(state.editorContainer);

    const toolElements = getTools({ editor });

    const toolbarContainer = html`
      <div class="__wizzy-toolbar-container"></div>
    `;

    const toolbar = tools({
      itemElements: toolElements,
      editor,
    });

    toolbarContainer.appendChild(toolbar);

    state.editorContainer.appendChild(toolbarContainer);

    const selectedTool = state.editorContainer.querySelector(
      ".__wizzy-tool[selected]"
    );

    if (selectedTool) {
      showMouseFollower(true);
    } else {
      showMouseFollower(false);
    }

    state.editorContainer.appendChild(state.mouseFollower);

    initCanvasOverlay(state.canvasOverlay);

    state.preferences.toggle();
    state.editorContainer.appendChild(state.preferences);

    initHotbar();

    state.chordContainer = chordContainer({ options: state.chords });
  }

  function initHotbar() {
    const defaultHotbarSlots = [
      hotbarSlot({
        key: "1",
        command: insertHTMLSnippetCommand({
          outerHTML: "<div>Hello, World!</div>",
          editor,
        }),
      }),
      hotbarSlot({
        key: "2",
        command: insertHTMLSnippetCommand({
          outerHTML: "<p>Hello, World!</p>",
          editor,
        }),
      }),
      hotbarSlot({
        key: "3",
        command: insertHTMLSnippetCommand({
          outerHTML: "<h1>Hello, World!</h1>",
          editor,
        }),
      }),
      hotbarSlot({
        key: "4",
        command: insertHTMLSnippetCommand({
          outerHTML: "<h2>Hello, World!</h2>",
          editor,
        }),
      }),
    ];

    const hotbarContainer = hotbar({
      slots: defaultHotbarSlots,
    });

    state.hotbar = hotbarContainer;

    state.editorContainer.appendChild(hotbarContainer);
    state.editorContainer.appendChild(state.notifications);
  }

  /**
   * Initialize the canvas overlay which draws the selection rectangle
   * @param {HTMLCanvasElement} overlay
   */
  function initCanvasOverlay(overlay) {
    overlay.width = window.innerWidth;
    overlay.height = window.innerHeight;

    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.zIndex = "999999999";
    overlay.style.pointerEvents = "none";
    overlay.style.userSelect = "none";
    overlay.style.imageRendering = "pixelated";

    const ctx = overlay.getContext("2d");

    function animateOverlay() {
      const selection = getSelection();

      overlay.width = window.innerWidth;
      overlay.height = window.innerHeight;

      overlay.style.width = `${window.innerWidth}px`;
      overlay.style.height = `${window.innerHeight}px`;

      ctx.clearRect(0, 0, overlay.width, overlay.height);

      // draw a dimmed overlay over the entire page
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, overlay.width, overlay.height);

      // we are going to 'cut out' the selected elements from the overlay,
      // for visual clarity on what is selected and the selected element's parent rect

      // the parent rectangle should be dimmed by 0.25
      // the selected element should be completely visible
      for (const selected of selection) {
        // first we have to cut out the area where the parent should be dimmed

        const parent = selected.parentElement || null;

        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          ctx.clearRect(
            parentRect.left,
            parentRect.top,
            parentRect.width,
            parentRect.height
          );

          ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
          ctx.fillRect(
            parentRect.left,
            parentRect.top,
            parentRect.width,
            parentRect.height
          );
        }

        const rect = selected.getBoundingClientRect();
        ctx.clearRect(rect.left, rect.top, rect.width, rect.height);
      }

      requestAnimationFrame(animateOverlay);
    }

    state.editorContainer.appendChild(overlay);

    requestAnimationFrame(animateOverlay);
  }

  function showMouseFollower(state = true) {
    if (state) {
      editor.state.mouseFollower.visibility = "visible";
    } else {
      editor.state.mouseFollower.visibility = "hidden";
    }
  }

  function initListeners() {
    function onMouseMove(e) {
      state.mouse.x = e.clientX;
      state.mouse.y = e.clientY;
    }

    function onContextMenu(e) {
      e.preventDefault();

      const test = contextMenu({
        items: [
          {
            label: "New Element",
            value: () => {
              console.log("Test");
            },
          },
          {
            label: "Copy",
            value: () => {
              console.log("Test");
            },
          },

          {
            label: "Paste",
            value: () => {
              console.log("Test");
            },
          },

          {
            label: "Cut",
            value: () => {
              console.log("Test");
            },
          },

          {
            label: "Delete",
            value: () => {
              console.log("Test");
            },
          },
          {
            label: "Duplicate",
            value: () => {
              console.log("Test");
            },
          },

          // group
          [
            {
              label: "Copy Style",
              value: () => {
                console.log("Test");
              },
            },
            {
              label: "Copy Attributes",
              value: () => {
                console.log("Test");
              },
            },
            {
              label: "Copy Text",
              value: () => {
                console.log("Test");
              },
            },
          ],
          [
            {
              label: "Clear Style",
              value: () => {
                console.log("Test");
              },
            },
            {
              label: "Clear Attributes",
              value: () => {
                console.log("Test");
              },
            },
            {
              label: "Clear Text",
              value: () => {
                console.log("Test");
              },
            },
          ],
          [
            {
              label: "Settings...",
              value: [
                {
                  label: "Font",
                  value: () => {
                    console.log("Test");
                  },
                },
                {
                  label: "Theme",
                  value: () => {
                    console.log("Test");
                  },
                },
                {
                  label: "Editor",
                  value: () => {
                    console.log("Test");
                  },
                },
              ],
            },
          ],
        ],
      });

      test.style.position = "fixed";
      test.style.left = `${e.clientX}px`;
      test.style.top = `${e.clientY}px`;

      state.editorContainer.appendChild(test);
    }

    function onClick(e) {
      e.preventDefault();

      // multiple selection
      if (!e.shiftKey && e.ctrlKey) {
        if (e.target.closest("[__wizzy-editor]")) {
          return;
        }

        const target = e.target;

        if (target.hasAttribute("__wizzy-selected")) {
          unselectElement(target);
        } else {
          selectElement(target);
        }
      }

      if (!e.ctrlKey && !e.shiftKey) {
        if (e.target.closest("[__wizzy-editor]")) {
          return;
        }

        const target = e.target;
        const selection = getSelection();

        if (selection.length) {
          for (const element of selection) {
            unselectElement(element);
          }

          if (target === document.documentElement) {
            selectElement(document.body);
          } else {
            selectElement(target);
          }
        } else {
          if (target === document.documentElement) {
            selectElement(document.body);
          } else {
            selectElement(target);
          }
        }
      }
    }

    function onDblClick(e) {
      const target = e.target;

      const parent = target.parentElement;

      if (!parent || parent.closest("[__wizzy-editor]")) {
        return;
      }

      const selection = getSelection();

      for (const element of selection) {
        unselectElement(element);
      }

      selectElement(parent);
    }

    /**
     * Handles keyboard events when the user presses a key
     * @param {KeyboardEvent} e
     * @returns
     */
    function onKeyDown(e) {
      // Don't block the developer tools
      if (e.key === "F12") {
        return;
      }

      // Don't block default behavior when the user is interacting with an input
      // Or the editor itself
      if (
        !(
          document.activeElement.closest("[__wizzy-editor]") &&
          document.activeElement.tagName === "INPUT"
        )
      ) {
        e.preventDefault();
      }

      // CTRL+SHIFT commands
      if (e.ctrlKey && e.shiftKey) {
        if (e.code === "KeyP") {
          state.preferences.toggle();
        }

        return;
      }

      // CTRL+ commands
      if (e.ctrlKey) {
        if (e.key === "s") {
          save();
        }

        return;
      }

      // Duplicate selected elements
      if (e.key === "d") {
        const selection = getSelection();

        for (const element of selection) {
          if (
            element === document.documentElement ||
            element === document.body
          ) {
            console.error("You can't duplicate the body or the html element");
            continue;
          }

          const clone = element.cloneNode(true);
          element.parentElement.appendChild(clone);
        }
      }

      //
      //  .-|
      //    |_  Chords
      //    |_)
      //

      // these are meta keys which should not be considered as part of the chord,
      // rather they determine its behavior
      const notChordDictKeys = ["allowMultiple", "text", "key"];

      let chordKeys = Object.keys(getCurrentChordBranch()).filter(
        (key) => !notChordDictKeys.includes(key)
      );

      const currentBranch = getCurrentChordBranch();
      let valueMultiselection = [];

      if (chordKeys.includes(e.key.toLowerCase())) {
        // If the current branch contains a key that matches the key pressed,
        let target = currentBranch[e.key.toLowerCase()];

        if (target) {
        } else {
          // not found, reset the chord
          editor.state.chord = [];
        }
      } else if (currentBranch.allowMultiple) {
        if (e.shiftKey) {
          valueMultiselection.push(target);
        }
      }

      // Queryselector search bar
      if (e.key === "q") {
        promptQuerySelector(state.mouse.x, state.mouse.y);
      }

      // Editing attributes of the current selection
      if (e.key === "a") {
        const selection = getSelection();

        const quickEditorContainer = html`
          <div class="__wizzy-quickedit-container"></div>
        `;

        quickEditorContainer.style.setProperty("position", "fixed");

        for (const element of selection) {
          const attrEditor = quickEdit({
            element,
            type: "attributes",
          });

          quickEditorContainer.appendChild(attrEditor);
        }

        state.editorContainer.appendChild(quickEditorContainer);

        quickEditorContainer.style.left = `${state.mouse.x}px`;
        quickEditorContainer.style.top = `${state.mouse.y}px`;

        snapIntoViewport({ element: quickEditorContainer });

        quickEditorContainer.querySelector("input").focus();
      }

      // Showing the tab menu
      if (e.key === "Tab") {
      }

      if (e.key === "Escape") {
        for (const element of getSelection()) {
          element.removeAttribute("__wizzy-selected");
        }
      }

      if (e.key === "Delete") {
        for (const element of getSelection()) {
          removeElement(element);
        }
      }
    }

    window.addEventListener("click", onClick);
    window.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("dblclick", onDblClick);
  }

  /**
   * Editor commands which may be executed or undone
   */
  const editorCommands = {};

  function executeCommand(path = "select.element", params = {}) {
    const arr = path.split(".");

    if (arr.length === 0) {
      console.error("Invalid command path");
      return;
    }

    let target = editorCommands;

    for (const key of arr) {
      const res = target[key];

      if (!res) {
        console.error("Invalid command path");
        return;
      }

      target = res;

      if (Object.getPrototypeOf(target) === EditorCommand) {
        const newCommand = new target({ editor, params });

        newCommand.do();

        // remove future commands from the history
        state.history.commands.splice(state.history.index + 1);
        state.history.index = state.history.commands.push(newCommand) - 1;

        return newCommand;
      }
    }
  }

  function getCurrentChordBranch() {
    let chord = editor.state.chord;
    let target = editor.state.chords;

    for (const key of chord) {
      target = target[key];
    }

    return target;
  }

  function isPromptingChord() {
    return editor.state.chord.length > 0;
  }

  function onChord() {
    const currentBranch = getCurrentChordBranch();

    if (editor.state.chord.length === 0) {
      const chordStreak = editor.state.chordContainer.querySelector(
        ".__wizzy-current-chords-branches"
      );

      chordStreak.innerHTML = "";

      addChord({ options: currentBranch });
      return;
    }

    addChord({ options: currentBranch });
  }

  function undo() {
    if (state.history.index < 0) {
      return;
    }

    const command = state.history.commands[state.history.index];

    command.undo();

    state.history.index--;

    return command;
  }

  function redo() {
    if (state.history.index >= state.history.commands.length - 1) {
      return;
    }

    const command = state.history.commands[state.history.index + 1];

    command.do();

    state.history.index++;

    return command;
  }

  function tryPlaceElements(e, elements = []) {
    if (e.target.closest("[__wizzy-editor]")) {
      return;
    }

    const selection = getSelection();

    if (!elements) {
      console.error("No elements to place were provided.");
      return;
    }

    if (selection.length === 0) {
      console.warn("No elements selected. Nothing to place");
      return;
    }

    if (elements instanceof Array) {
      for (const selectedElement of selection) {
        if (selectedElement.closest("[__wizzy-editor]")) {
          console.error(
            "You can't append elements to the editor. How did you even manage to select it?"
          );
          return;
        }

        for (const element of elements) {
          selectedElement.appendChild(element);
        }
      }
    } else if (elements instanceof Element) {
      for (const selectedElement of selection) {
        if (selectedElement.closest("[__wizzy-editor]")) {
          console.error(
            "You can't append elements to the editor. How did you even manage to select it?"
          );
          return;
        }

        selectedElement.appendChild(elements);
      }
    } else {
      throw new Error("Invalid elements argument");
    }
  }

  /**
   * Returns all selected elements
   * @returns {NodeListOf<Element>}
   */
  function getSelection() {
    return document.querySelectorAll("[__wizzy-selected]");
  }

  // temporary internal selection array to allow for the querying methods to return the dictionary root and still
  // remember the selected elements of the previous query
  let tempSelection = getSelection();

  /**
   * Quick way to modify or work with selected elements
   */
  const selection = {
    /** Resets the internal selection array */
    reset: () => {
      tempSelection = getSelection();
    },

    set: {
      style: (property, value) => {
        selectionSetInlineStyle(property, value);
      },
      attr: (attribute, value) => {
        selectionSetAttribute(attribute, value);
      },

      /**
       * Remove specific child elements from every selected element
       */
      remove: {
        /**
         * Remove these specific elements (using an arraylike list of elements)
         */
        these: (...elements) => {
          for (const element of tempSelection) {
            for (const el of elements) {
              if (element === el) {
                element.remove();
              }
            }
          }

          return {
            then: {
              ...selection,
            },
          };
        },

        /**
         * Remove elements that match the querySelector of the current element
         * @param {string} querySelector
         */
        if: (querySelector = "*") => {
          const newSelection = document.querySelectorAll(querySelector);
          const intersection = Array.from(newSelection).filter((el) =>
            Array.from(tempSelection).includes(el)
          );

          for (const element of intersection) {
            element.remove();
          }

          return {
            then: {
              ...selection,
            },
          };
        },
      },
    },

    filter: (querySelector) => {
      const newSelection = document.querySelectorAll(querySelector);
      const intersection = Array.from(newSelection).filter((el) =>
        Array.from(tempSelection).includes(el)
      );

      tempSelection = intersection;

      return selection;
    },
    add: {
      elements: (...elements) => {
        for (const element of elements) {
          element.setAttribute("__wizzy-selected", "");
        }

        tempSelection = getSelection();
      },
      query: (querySelector) => {
        const newSelection = document.querySelectorAll(querySelector);

        for (const element of newSelection) {
          element.setAttribute("__wizzy-selected", "");
        }

        tempSelection = getSelection();
      },
    },
    remove: {
      elements: (...elements) => {
        for (const element of elements) {
          element.removeAttribute("__wizzy-selected");
        }

        tempSelection = getSelection();

        return selection;
      },
      query: (querySelector) => {
        const newSelection = document.querySelectorAll(querySelector);

        for (const element of newSelection) {
          element.removeAttribute("__wizzy-selected");
        }

        tempSelection = getSelection();

        return selection;
      },
    },
    empty: () => {
      for (const element of tempSelection) {
        element.removeAttribute("__wizzy-selected");
      }

      tempSelection = getSelection();

      return selection;
    },
    replaceWith: (element) => {
      for (const selected of tempSelection) {
        selected.replaceWith(element);
      }

      tempSelection = getSelection();

      return selection;
    },
    animate: (keyframes, options) => {
      for (const element of tempSelection) {
        element.animate(keyframes, options);
      }

      return selection;
    },
  };

  function elementSetInlineStyle(target, property, value) {
    // set the css text of the element (attribute)
    let cssText = target.getAttribute("style") || "";

    // remove the property if it already exists
    cssText = cssText.replace(new RegExp(`${property}: [^;]+;`), "");

    // add the new property and value
    cssText += ` ${property}: ${value};`;

    animateElementUpdate(target);
  }

  /**
   *
   * @param {{property: string, value: string}} options
   */
  function selectionSetInlineStyle(property, value, selection = tempSelection) {
    if (!property) {
      console.error("No property provided");
      return;
    }

    for (const element of selection) {
      elementSetInlineStyle(element, property, value);
    }
  }

  function selectionSetAttribute(attribute, value, selection = tempSelection) {
    if (!attribute) {
      console.error("No attribute provided");
      return;
    }

    for (const element of selection) {
      element.setAttribute(attribute, value);

      animateElementUpdate(element);
    }
  }

  function selectElement(element) {
    // 1. is this part of the editor?
    if (element.closest("[__wizzy-editor]")) {
      return;
    }

    // 2. some elements can't be selected
    if (
      element.closest("head") ||
      element.tagName === "SCRIPT" ||
      element.tagName === "STYLE" ||
      element.tagName === "LINK" ||
      element.tagName === "META" ||
      element.tagName === "TITLE"
    ) {
      return;
    }

    // 3. select the element
    element.setAttribute("__wizzy-selected", "");

    // 4. each selected element should have an info element that shows various information an
    const elInfo = elementInfo({ targetElement: element });
    elInfo.style.visibility = "hidden";

    state.editorContainer.appendChild(elInfo);
    const rect = element.getBoundingClientRect();

    // 5. correct the element's position
    elInfo.setPosition(rect.left, rect.top);
    elInfo.correctPosition();

    // 6. show the element's info. done
    elInfo.style.visibility = "visible";
  }

  function unselectElement(element) {
    element.removeAttribute("__wizzy-selected");

    const elInfo = element.infoElement;

    if (elInfo) {
      elInfo.remove();
    } else {
      console.error("No info element found");
    }
  }

  /**
   * Returns the user tool of the given id
   * @param {string} id - The id of the tool to get
   * @returns {HTMLElement} The tool element
   */
  function getTool(id = "div") {
    return state.editorContainer.querySelector(`#__wizzy-tool-${id}`);
  }

  /**
   * Prompts the user to enter a querySelector string
   * @param {number} x
   * @param {number} y
   */
  function promptQuerySelector(x, y) {
    const el = html`<input
      type="text"
      class="__queryselector-input"
      style="position: fixed; top: ${y}px; left: ${x}px; z-index: 1000000002;"
    />`;

    el.addEventListener("keydown", (e) => {
      // restore default behavior
      e.stopPropagation();

      if (e.key === "Enter") {
        const selector = el.value;

        if (selector.includes("__wizzy")) {
          console.error(
            "You can't select elements that are part of the editor"
          );

          el.remove();
          return;
        }

        let elements = [];

        try {
          elements = document.querySelectorAll(selector.trim());

          // remove elements that are part of the editor
          elements = Array.from(elements).filter(
            (el) => !el.closest("[__wizzy-editor]")
          );
        } catch (err) {
          if (err.message.includes("is empty")) {
            console.error("No elements found");
          } else {
            console.error(err);
          }

          el.removeEventListener("blur", onBlur);
          el.remove();

          return;
        }

        for (const element of getSelection()) {
          unselectElement(element);
        }

        state.selection = Array.from(elements);

        el.removeEventListener("blur", onBlur);
        el.remove();

        for (const element of state.selection) {
          selectElement(element);
        }
      }
    });

    removeOnESC({ element: el });

    const onBlur = () => {
      el.remove();
    };

    el.addEventListener("blur", onBlur);

    state.editorContainer.appendChild(el);

    // make sure the input is within the viewport
    if (el.getBoundingClientRect().right > window.innerWidth) {
      el.style.left = `${window.innerWidth - el.offsetWidth}px`;
    }

    if (el.getBoundingClientRect().bottom > window.innerHeight) {
      el.style.top = `${window.innerHeight - el.offsetHeight}px`;
    }

    el.focus();
  }

  function removeOnESC({ element }) {
    element.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        element.remove();
      }
    });
  }

  function snapIntoViewport({ element }) {
    const rect = element.getBoundingClientRect();
    // check if not outside of viewport
    if (
      rect.left > 0 &&
      rect.top > 0 &&
      rect.right < window.innerWidth &&
      rect.bottom < window.innerHeight
    ) {
      return;
    }

    // 1. If the element's total width is greater than the viewport's width,
    //    then set the width of the element to the viewport's width
    if (rect.width > window.innerWidth) {
      element.style.width = `${window.innerWidth}px`;
    }

    // 2. If the element's total height is greater than the viewport's height,
    //    then set the height of the element to the viewport's height
    if (rect.height > window.innerHeight) {
      element.style.height = `${window.innerHeight}px`;
    }

    // 3. Snap the element to the viewport's edges
    if (rect.left < 0) {
      element.style.left = "0px";
    }

    if (rect.top < 0) {
      element.style.top = "0px";
    }

    if (rect.right > window.innerWidth) {
      element.style.left = `${window.innerWidth - rect.width}px`;
    }

    if (rect.bottom > window.innerHeight) {
      element.style.top = `${window.innerHeight - rect.height}px`;
    }
  }

  function canDeleteElement(element) {
    if (element.closest("[__wizzy-editor]")) {
      return false;
    }

    if (
      element === document.documentElement ||
      element === document.body ||
      element === document.head
    ) {
      return false;
    }

    return true;
  }

  function removeElement(element) {
    if (canDeleteElement(element)) {
      if (element.infoElement) {
        element.infoElement.remove();
      }

      element.remove();
    } else {
      console.error("This element cannot be deleted");
      unselectElement(element);
    }
  }

  function isBlockElement(element) {
    const displayStyle = window.getComputedStyle(element).display;

    return (
      displayStyle === "block" ||
      displayStyle === "flex" ||
      displayStyle === "grid"
    );
  }

  function animateElementUpdate(element = document.body) {
    element.animate(
      [{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }, { opacity: 1 }],
      {
        duration: 50,
        iterations: 2,
      }
    );
  }

  function save() {
    const outerHtml = document.documentElement.outerHTML;
    const css = document.head.querySelector(".__wizzy-user-style").innerHTML;

    localStorage.setItem(LOCALSTORAGE_TARGET_HTML, outerHtml);
    localStorage.setItem(LOCALSTORAGE_TARGET_CSS, css);
  }

  function load() {
    if (!localStorage.getItem(LOCALSTORAGE_TARGET_HTML)) {
      console.error("No saved HTML document found");
      return;
    }

    const headElements = document.head.querySelectorAll(`
        :not(.__wizzy-style),
        :not(.__wizzy-user-style)
      `);

    const bodyElements = document.body.querySelectorAll(`
        :not([__wizzy-editor]),
      `);

    for (const element of headElements) {
      if (element === document.currentScript) {
        continue;
      }

      element.remove();
    }

    for (const element of bodyElements) {
      if (element === document.currentScript) {
        continue;
      }

      element.remove();
    }

    const html = localStorage.getItem(LOCALSTORAGE_TARGET_HTML);

    document.documentElement.outerHTML = html;

    if (!localStorage.getItem(LOCALSTORAGE_TARGET_CSS)) {
      console.error("No saved CSS document found");
      return;
    }

    const css = localStorage.getItem(LOCALSTORAGE_TARGET_CSS);

    const style = document.createElement("style");
    style.classList.add("__wizzy-user-style");
    style.innerHTML = css;

    document.head.appendChild(style);

    console.info("Loaded saved document");
  }

  function animate() {
    const followerOffsetX = 12;
    const followerOffsetY = 12;

    const selectedTool = state.editorContainer.querySelector(
      ".__wizzy-tool[selected]"
    );

    if (selectedTool) {
      showMouseFollower(true);
      const btn = selectedTool.querySelector("button");
      state.mouseFollower.innerHTML = btn.innerHTML;
      state.mouseFollower.style.left = `${state.mouse.x + followerOffsetX}px`;
      state.mouseFollower.style.top = `${state.mouse.y + followerOffsetY}px`;
    } else {
      showMouseFollower(false);
    }

    const selectedInfos = document.querySelectorAll(".__wizzy-element-info");

    for (const info of selectedInfos) {
      if (!info.refersTo || !info.refersTo.hasAttribute("__wizzy-selected")) {
        info.remove();
        continue;
      }
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  document.addEventListener("DOMContentLoaded", main);
})();
