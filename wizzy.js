import html from "./lib/html.js";
import editorContainer from "./elements/editor-container.js";
import { tools, tool } from "./elements/toolbar.js";
import { tabMenu } from "./elements/tab-menu.js";
import getTools from "./tools.js";
import editorDomPath from "./elements/editor-dompath.js";
import quickEdit from "./elements/element-quickedit.js";
import elementInfo from "./elements/element-info.js";
import contextMenu from "./elements/context-menu.js";
import { hotbar, hotbarSlot, command, commandSearchMenu, insertHTMLSnippetCommand } from "./elements/commands.js";
import { editorPreferences } from "./elements/editor-preferences.js";

import editorWindow from "./elements/editor-window.js";

new (function () {

  const LOCALSTORAGE_TARGET_PREFERENCES = "__wizzy-preferences";
  const LOCALSTORAGE_TARGET_HTML = "__wizzy-html";
  const LOCALSTORAGE_TARGET_CSS = "__wizzy-css";

  const editor = this;

  /**
   * @exports EditorState
   */

  /**
   * @typedef {typeof state} EditorState
   */
  const state = {
    commands: [],

    mouse: {
      x: 0,
      y: 0,
    },

    preferences: editorPreferences(LOCALSTORAGE_TARGET_PREFERENCES),
    editorContainer: editorContainer(),
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
    
    state.editorContainer.appendChild(state.preferences);

    initHotbar();
  }

  function initHotbar() {
    const defaultHotbarSlots = [
      hotbarSlot({
        key: "1",
        command: insertHTMLSnippetCommand({
          outerHTML: "<div>Hello, World!</div>",
          editor
        })
      }),
      hotbarSlot({
        key: "2",
        command: insertHTMLSnippetCommand({
          outerHTML: "<p>Hello, World!</p>",
          editor
        })
      }),
      hotbarSlot({
        key: "3",
        command: insertHTMLSnippetCommand({
          outerHTML: "<h1>Hello, World!</h1>",
          editor
        })
      }),
      hotbarSlot({
        key: "4",
        command: insertHTMLSnippetCommand({
          outerHTML: "<h2>Hello, World!</h2>",
          editor
        })
      }),
    ];

    const hotbarContainer = hotbar({
      slots: defaultHotbarSlots,
    });

    state.hotbar = hotbarContainer;

    state.editorContainer.appendChild(hotbarContainer);
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
            }
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
            }
          ],
          [
            {
              "label": "Settings...",
              "value": [
                {
                  "label": "Font",
                  "value": () => {
                    console.log("Test");
                  }
                },
                {
                  "label": "Theme",
                  "value": () => {
                    console.log("Test");
                  }
                },
                {
                  "label": "Editor",
                  "value": () => {
                    console.log("Test");
                  }
                }
              ]
            }
          ]
        ]
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

    function onKeyDown(e) {
      
      // Don't block the developer tools
      if (e.key === "F12") {
        return;
      }

      if (
        !(
          document.activeElement.closest("[__wizzy-editor]") &&
          document.activeElement.tagName === "INPUT"
        )
      ) {
        e.preventDefault();
      }
      
      if (e.ctrlKey) {
        if (e.key === "s") {
          save();
        }

        if (e.key === 'p') {
          state.preferences.toggle();
        }
      }

      // Hotbar commands
      if (e.key.match(/[0-9]/)) {
        const index = parseInt(e.key, 10) - 1;
        const command = state.commands[index];

        if (command) {
          command();
        }
      }

      // Duplicate selected elements
      if (e.key === "d") {
        
        const selection = getSelection();

        for (const element of selection) {
          if (element === document.documentElement || element === document.body) {
            console.error("You can't duplicate the body or the html element");
            continue;
          }

          const clone = element.cloneNode(true);
          element.parentElement.appendChild(clone);
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
          console.error("You can't append elements to the editor. How did you even manage to select it?");
          return;
        }

        for (const element of elements) {
          selectedElement.appendChild(element);
        }
      }
    } else if (elements instanceof Element) {
      for (const selectedElement of selection) {
        if (selectedElement.closest("[__wizzy-editor]")) {
          console.error("You can't append elements to the editor. How did you even manage to select it?");
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

  function getTool(id = "div") {
    return document.querySelector(`#__wizzy-tool-${id}`);
  }

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
          elements = document.querySelectorAll(selector);

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
