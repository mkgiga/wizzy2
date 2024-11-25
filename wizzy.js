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
import elementReference from "./elements/editor-element-reference.js";

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

  const defaultPreferences = [
    {
      group: "Elements",
      items: [
        {
          name: "Prevent appending inside:",
          type: "textarea",
          value: `p,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nimg,\nbutton,\nlabel,\ninput,\ntextarea,\nembed`,
        },
      ],
    },

    {
      group: "Selection",
      items: [
        {
          name: "Auto-select duplicated elements",
          type: "checkbox",
          value: false,
        },
      ],
    },
  ];

  /**
   * @exports WizzyEditor
   * @typedef {typeof state} WizzyEditor - The editor state
   */
  const state = {
    history: {
      commands: [],
      index: 0,
    },

    /**
     * This is where deleted elements live until the history no longer needs them
     */
    shadowRealm: document.createElement("div"),

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

    // temporary internal selection array to allow for the querying methods to return the dictionary root and still
    // remember the selected elements of the previous query
    tempSelection: [],

    chord: [],

    chords: {
      m: {
        // margin
        text: "Margin",
        key: "margin",
        allowManual: true,

        a: () => {
          sel.reset().set.style("margin", "auto");
        },

        s: {
          text: "Self...",
          // place-self
          p: {
            text: "Place Self",
            key: "place-self",

            arrowup: () => {},

            arrowdown: () => {},

            arrowleft: () => {},

            arrowright: () => {},
          },
        },

        t: {
          text: "Topside Margin",
          key: "margin-top",

          arrowup: () => {
            sel
              .reset()
              .set.style(
                "margin-top",
                `${state.cssSettings.length.step}${state.cssSettings.length.unit}`
              );
          },

          arrowdown: () => {
            sel
              .reset()
              .set.style(
                "margin-top",
                `-${state.cssSettings.length.step}${state.cssSettings.length.unit}`
              );
          },

          arrowleft: () => {
            sel
              .reset()
              .set.style(
                "margin-top",
                `-${state.cssSettings.length.step}${state.cssSettings.length.unit}`
              );
          },

          arrowright: () => {
            sel
              .reset()
              .set.style(
                "margin-top",
                `${state.cssSettings.length.step}${state.cssSettings.length.unit}`
              );
          },

          a: {
            text: "Auto",
            arrowup: () => {
              sel.reset().set.style("margin-top", "auto");
            },
          },

          delete: () => {
            sel.reset().set.style("margin-top", "");
          },
        },
      },
      t: {
        // text-align

        text: "Text Align",
        key: "text-align",

        a: {
          text: "Text Align",

          arrowleft: () => {
            sel.reset().set.style("text-align", "left");
          },
          arrowright: () => {
            sel.reset().set.style("text-align", "right");
          },
          arrowup: () => {
            sel.reset().set.style("text-align", "center");
          },
          arrowdown: () => {
            sel.reset().set.style("text-align", "justify");
          },
        },

        // text-justify
        j: {
          text: "Text Justify",
          key: "text-justify",

          arrowleft: () => {
            sel.reset().set.style("text-justify", "left");
          },
          arrowright: () => {
            sel.reset();
            sel.reset().set.style("text-justify", "right");
          },
          arrowup: () => {
            sel.reset().set.style("text-justify", "center");
          },
          arrowdown: () => {},
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

        arrowup: {
          text: "Padding Top",

          arrowup: () => {
            sel
              .reset()
              .set.style(
                "padding-top",
                `${state.cssSettings.length.step}${state.cssSettings.length.unit}`
              );

            return `Increase top-side padding by ${state.cssSettings.length.step}${state.cssSettings.length.unit}.`;
          },
          arrowdown: () => {
            sel
              .reset()
              .set.style(
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
          arrowup: () => {
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
          arrowdown: () => {
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
          arrowup: () => {},
        },
      },
    },

    mouse: {
      x: 0,
      y: 0,
    },

    preferences: defaultPreferences,
    preferencesElement: editorPreferences(
      LOCALSTORAGE_TARGET_PREFERENCES,
      defaultPreferences
    ),
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
    initPreferences();
    initStyle();
    initElements();
    initListeners();

    state.editorContainer.watch();
  }

  function initPreferences() {
    // testing
    localStorage.removeItem(LOCALSTORAGE_TARGET_PREFERENCES);

    const loaded = loadPreferences();

    state.preferences = loaded;
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

    state.preferencesElement.toggle();
    state.editorContainer.appendChild(state.preferencesElement);

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

      const target = e.target;

      const items = [
        [
          {
            label: "Select",
            value: () => {
              selectElement(target);
            },
          },
          {
            label: "Unselect",
            value: () => {
              unselectElement(target);
            },
          },
          {
            label: "Delete",
            value: () => {
              removeElement(target);
            },
          },
        ],
      ];

      const everyElementHasParent = Array.from(getSelection()).reduce(
        (acc, element) => {
          return acc && element.parentElement;
        },
        true
      );

      if (everyElementHasParent) {
        items.push([
          {
            label: "Move to parent",
            value: () => {
              for (const element of getSelection()) {
                const parent = element.parentElement;

                const ref = elementReference({
                  element,
                  editor,
                });

                if (parent) {
                  parent.appendChild(element);
                } else {
                  notification({
                    type: "error",
                    title: "Error",
                    message: "Element has no parent",
                  });

                  continue;
                }
              }
            },
          },
        ]);
      }

      if (!isBlockElement(target)) {
        const group = [];

        const selection = getSelection();

        if (selection.length == 2) {
          group.push({
            label: "Swap",
            value: () => {
              swapElements(selection[0], selection[1]);
            },
          });
        }

        items.push(group);
      }

      switch (target.tagName) {
        case "IMG":
          break;

        case "A":
          break;
      }

      const ctxMenu = contextMenu({
        items,
        x: e.clientX,
        y: e.clientY,
      });

      ctxMenu.style.position = "fixed";
      ctxMenu.style.left = `${e.clientX}px`;
      ctxMenu.style.top = `${e.clientY}px`;

      state.editorContainer.appendChild(ctxMenu);
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

      if (e.key === "3") {
        document.body.toggleAttribute("is-3d");
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
      } else {
        e.stopPropagation();
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

      let currentBranch = getCurrentChordBranch();
      let valueMultiSelection = [];

      if (e.key === "Backspace" && chordKeys.length > 0) {
        let newChord = editor.state.chord.slice(0, -1);
        editor.state.chord = newChord;
      } else if (chordKeys.includes(e.key.toLowerCase())) {
        // If the current branch contains a key that matches the key pressed,
        let target = currentBranch[e.key.toLowerCase()];
        editor.state.chord.push(e.key.toLowerCase());

        console.log(target);

        if (target) {
          if (typeof target === "object") {
            const allowMultiple = target.allowMultiple || false;

            if (allowMultiple) {
              let propKey = target.key; // the actual CSS property key

              if (!propKey) {
                throw new Error(
                  "No key provided. \
                  \nA chord that supports adding multiple values must have a `key` property, which should be a valid CSS property key."
                );
              }

              if (e.shiftKey) {
                valueMultiSelection.push(target[e.key.toLowerCase()]);
                selectionSetInlineStyle(propKey, valueMultiSelection.join(" "));
              } else {
                valueMultiSelection = [target[e.key.toLowerCase()]];
                selectionSetInlineStyle(propKey, valueMultiSelection.join(" "));
                return;
              }
            }
          } else if (typeof target === "function") {
            const res = target();
            console.log(res);

            state.chord = [];
          }
        } else {
          console.error("No target found");
        }
      } else if (chordKeys.includes("allowManual")) {
        if (e.key === " ") {
          promptInput({
            onEnter: (value) => {
              selectionSetInlineStyle("margin", value);
            },
            onCancel: () => {
              console.log("Canceled");
            },
            placeholder:
              currentBranch.key || currentBranch.text || "Enter value",
            x: state.mouse.x,
            y: state.mouse.y,
          });
        }
      } else {
        console.error("No target found");
        state.chord = [];
      }

      // we dont want to trigger other key events if we are in a chord
      if (isPromptingChord()) {
        console.log("Chord is active");
      }

      if (e.altKey) {
        // moving the selection
        if (e.key === "ArrowUp") {
          for (const element of getSelection()) {
            const dir = window.getComputedStyle(element).direction;
          }
        }
      }

      // CTRL+SHIFT commands
      if (e.ctrlKey && e.shiftKey) {
        if (e.code === "KeyP") {
          state.preferencesElement.toggle();
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
          const newChild = element.parentElement.appendChild(clone);

          if (state.preferences.find((item) => item.group === "Selection")) {
            const autoSelect = state.preferences.find(
              (item) => item.name === "Auto-select duplicated elements"
            );

            if (autoSelect) {
              newChild.setAttribute("__wizzy-selected", "");
            } else {
              newChild.removeAttribute("__wizzy-selected");
            }
          }
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
        // backing out of a chord prompt should clear the current chord without affecting the selection
        if (isPromptingChord()) {
          const chordContainer = document.querySelector(
            ".__wizzy-current-chords"
          );

          const chordBranches = chordContainer.querySelector(
            ".__wizzy-current-chords-branches"
          );

          editor.state.chord = [];
          chordBranches.innerHTML = "";
          return;
        }

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

  let tempSelection = state.tempSelection;

  /**
   * Quick way to modify or work with selected elements
   */
  const sel = {
    /** Resets the internal selection array */
    reset: () => {
      tempSelection = getSelection();

      return sel;
    },

    set: {
      style: (property, value) => {
        selectionSetInlineStyle(property, value, tempSelection);
      },
      attr: (attribute, value) => {
        selectionSetAttribute(attribute, value, tempSelection);
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
              ...sel,
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
              ...sel,
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

      return sel;
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

        return sel;
      },
      query: (querySelector) => {
        const newSelection = document.querySelectorAll(querySelector);

        for (const element of newSelection) {
          element.removeAttribute("__wizzy-selected");
        }

        tempSelection = getSelection();

        return sel;
      },
    },
    empty: () => {
      for (const element of document.querySelectorAll("[__wizzy-selected]")) {
        element.removeAttribute("__wizzy-selected");
      }

      tempSelection = getSelection();

      return sel;
    },
    replaceWith: (element) => {
      for (const selected of document.querySelectorAll("[__wizzy-selected]")) {
        selected.replaceWith(element);
      }

      tempSelection = getSelection();

      return sel;
    },
    animate: (keyframes, options) => {
      for (const element of tempSelection) {
        element.animate(keyframes, options);
      }

      return sel;
    },
  };

  function elementSetInlineStyle(target, property, value) {
    if (value === "") {
      // auto-remove
      let cssText = target.getAttribute("style") || "";
      cssText = cssText.replace(new RegExp(`${property}: [^;]+;`), "");
      target.setAttribute("style", cssText.trim());
    } else {
      // set the css text of the element (attribute)
      let cssText = target.getAttribute("style") || "";

      // remove the property if it already exists
      cssText = cssText.replace(new RegExp(`${property}: [^;]+;`), "");

      // add the new property and value
      cssText += ` ${property}: ${value};`;

      target.setAttribute("style", cssText.trim());
    }

    animateElementUpdate(target);
  }

  /**
   *
   * @param {{property: string, value: string}} options
   */
  function selectionSetInlineStyle(
    property,
    value,
    selection = state.tempSelection
  ) {
    console.log(selection);
    console.log(property, value);
    console.log(tempSelection);
    if (!property) {
      console.error("No property provided");
      return;
    }

    for (const element of selection) {
      elementSetInlineStyle(element, property, value);
    }
  }

  function selectionSetAttribute(
    attribute,
    value,
    selection = state.tempSelection
  ) {
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

  function moveToParent(element) {
    const parent = element.parentElement;

    if (!parent) {
      console.error("No parent found");
      return;
    }

    parent.appendChild(element);
  }

  function swapElements(element1, element2) {
    const parent1 = element1.parentElement;
    const parent2 = element2.parentElement;

    if (!parent1 || !parent2) {
      console.error("No parent found");
      return;
    }

    const i1 = Array.from(parent1.children).indexOf(element1);
    const i2 = Array.from(parent2.children).indexOf(element2);

    parent1.insertBefore(element2, parent1.children[i1]);
    parent2.insertBefore(element1, parent2.children[i2]);

    animateElementUpdate(element1);
    animateElementUpdate(element2);
  }

  /**
   * Returns the user tool of the given id
   * @param {string} id - The id of the tool to get
   * @returns {HTMLElement} The tool element
   */
  function getTool(id = "div") {
    return state.editorContainer.querySelector(`#__wizzy-tool-${id}`);
  }

  function promptInput({
    x,
    y,
    placeholder = "",
    type = "text",
    onEnter = (value) => {},
    onCancel = () => {},
  }) {
    const previousFocus = document.activeElement;

    const el = html`<input
      type="${type}"
      class="__wizzy-input"
      style="position: fixed; top: ${y}px; left: ${x}px; z-index: 1000000002;"
      placeholder="${placeholder}"
    />`;

    el.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Escape") {
        onCancel();
        el?.remove();
        previousFocus?.focus();
      }

      if (e.key === "Enter") {
        onEnter(el.value);
        el?.remove();
        previousFocus?.focus();
      }
    });
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

  function getBoxDirection(element) {
    return window.getComputedStyle(element).flexDirection || "row";
  }

  function isBlockElement(element) {
    const displayStyle = window.getComputedStyle(element).display;

    return (
      displayStyle !== "inline" &&
      displayStyle !== "inline-block" &&
      displayStyle !== "inline-flex" &&
      displayStyle !== "inline-grid"
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

  function loadPreferences() {
    // testing
    localStorage.removeItem(LOCALSTORAGE_TARGET_PREFERENCES);

    const preferences = localStorage.getItem(LOCALSTORAGE_TARGET_PREFERENCES);

    if (!preferences) {
      localStorage.setItem(
        LOCALSTORAGE_TARGET_PREFERENCES,
        JSON.stringify(defaultPreferences)
      );

      return JSON.parse(localStorage.getItem(LOCALSTORAGE_TARGET_PREFERENCES));
    }

    return JSON.parse(preferences);
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

  this.moveToParent = moveToParent;
  this.swapElements = swapElements;
  this.getSelection = getSelection;
  this.getTool = getTool;
  this.promptInput = promptInput;
  this.promptQuerySelector = promptQuerySelector;
  this.animateElementUpdate = animateElementUpdate;
  this.sel = sel;

  document.addEventListener("DOMContentLoaded", main);
})();
