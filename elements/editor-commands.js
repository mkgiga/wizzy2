import html from "../lib/html.js";
import { getMaterialIcon } from "../util/element-utils.js";
import contextMenu from "./context-menu.js";

/**
 * Holds items that can be triggered with a keyboard shortcut.
 * Each item should be a HTML element with a callable 'action' method.
 * @param {Object} options
 * @param {Array} options.slots - Array of hotbar slots
 * @returns {HTMLElement} - The hotbar element
 */
export function hotbar({ slots = [] }) {
  const el = html`
    <div class="__wizzy-hotbar">
      <style>
        @scope (.__wizzy-hotbar) {
          :scope {
            & {
              position: fixed;
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
              grid-auto-rows: 50px;
              gap: 0.5rem;

              bottom: 0.5rem;
              left: 0.5rem;
              width: 100%;
              height: 50px;
              background: transparent;
              box-sizing: border-box;
              margin: 0;
              z-index: 1000000001;
            }

            &[user-can-add] {
              .__wizzy-hotbar-new-slot {
                display: flex;
              }
            }

            &:not([user-can-add]) {
              .__wizzy-hotbar-new-slot {
                display: none;
              }
            }
          }
        }
      </style>
    </div>
  `;

  slots.forEach((slot) => {
    el.appendChild(slot);
  });

  const addNewSlotElement = hotbarSlot({
    command: command({
      action: () => {
        const slot = hotbarSlot({ command: command({}) });
        el.appendChild(slot);
      },
      name: "Add new slot",
      icon: "add",
      description: "Adds a new slot to the hotbar",
    }),
    type: "html",
    key: null,
  });

  return el;
}

/**
 * Holds a single item that can be triggered with a keyboard shortcut.
 * @param {Object} options
 * @param {Object} options.command - The command to be executed
 * @param {String} options.key - The keyboard shortcut to trigger the command
 * @returns {HTMLElement} - The hotbar slot element
 */
export function hotbarSlot({ command, key = "" }) {
  const el = html`
    <div class="__wizzy-hotbar-slot" key="${key}">
      <span class="__wizzy-hotbar-slot-key"></span>

      <style>
        @scope (.__wizzy-hotbar-slot) {
          :scope {
            & {
              position: relative;
              display: flex;
              flex-direction: column;
              width: 100%;
              height: 100%;
              background: white;
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              z-index: 1000000008;
              box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.25);
            }

            .__wizzy-hotbar-slot-key {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              padding: 0.5rem;
              text-align: center;
              font-size: 1rem;
              font-family: monospace;
              color: black;
              pointer-events: none;

              ::before {
                content: attr(key);
              }
            }

            .__wizzy-command {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
              padding: 0.5rem;
              box-sizing: border-box;
              background: #f1f1f1;
              color: black;
              font-family: sans-serif;
              font-size: 1rem;
              cursor: pointer;
              transition: all 0.1s cubic-bezier(0.25, 0.1, 0.25, 1);

              .__wizzy-command-icon {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                font-size: 2rem;
                pointer-events: none;

                &::before {
                  content: attr(icon);
                }
              }

              .__wizzy-command-name {
                display: none;
              }

              .__wizzy-command-brief {
                display: none;
              }

              .__wizzy-command-description {
                display: none;
              }

              .__wizzy-command:has(.__wizzy-html-preview-box) {
                &:not(:hover) {
                  display: none;
                }

                &:hover {
                  display: flex;
                }
              }
            }
          }
        }
      </style>
    </div>
  `;

  el.appendChild(command);

  window.addEventListener("keydown", (e) => {
    if (e.key === key) {
      command.action();
    }
  });

  return el;
}

/**
 * Creates a command element. This element will not have any styling by default,
 * and it is up to the container to style it.
 * All properties are placed as attributes on the container element,
 * so each child element's textContent can be (optionally) set using ::before/::after on
 * any of the child elements, should the host want to do so.
 *
 * @param {Object} options
 * @param {String} options.name - The name of the command
 * @param {String} options.icon - The icon of the command
 * @param {String} options.description - The description of the command
 * @param {String} options.brief - The brief description of the command
 * @param {Function} options.action - The action to be executed when the command is triggered
 * @returns {HTMLElement} - The command element
 */
export function command({
  name = "",
  icon = "",
  description = "",
  brief = "",
  action = () => {},
  editor = null,
  contextMenu: ctxMenu = [{ label: "Click me!", value: (e) => console.log(e) }],
}) {
  const el = html`
    <span
      class="__wizzy-command"
      name="${name}"
      icon="${icon}"
      description="${description}"
      brief="${brief}"
    >
      <span class="__wizzy-command-icon material-icons"></span>
      <span class="__wizzy-command-name"></span>
      <span class="__wizzy-command-brief"></span>
      <span class="__wizzy-command-description"></span>
    </span>
  `;

  el.querySelector(".__wizzy-command-icon").textContent = icon;
  el.querySelector(".__wizzy-command-name").textContent = name;
  el.querySelector(".__wizzy-command-brief").textContent = brief;
  el.querySelector(".__wizzy-command-description").textContent = description;

  el.addEventListener("click", (e) => {
    if (typeof action === "function") {
      action.call(editor, e);
    } else if (typeof action === "string") {
      editor.insertAdjacentHTML("beforeend", action);
    } else {
      throw new Error("Invalid action type, expected string or function");
    }
  });

  el.addEventListener("contextmenu", (e) => {
    const menu = contextMenu({
      items: ctxMenu,
      x: e.clientX,
      y: e.clientY,
    });

    editor.state.editorContainer.appendChild(menu);
  });

  return el;
}

/**
 * A VSCode-like command search menu that appears and expands when your press a keyboard shortcut.
 * @param {Object} options
 * @param {Array} options.commands - The commands to be displayed in the search menu
 * @returns {HTMLElement} - The command search menu element
 */
export function commandSearchMenu({ commands = [] }) {
  const el = html`
    <div class="__wizzy-command-search-menu">
      <style>
        @scope (.__wizzy-command-search-menu) {
          :scope {
            & {
              position: fixed;
              display: flex;
              flex-direction: column;
              width: 100%;
              height: 100%;
              background: white;
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              z-index: 100000006;
            }
            .__wizzy-command-search-menu-header {
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              width: 100%;
              padding: 0.5rem;
              box-sizing: border-box;
            }

            .__wizzy-command-search-menu-input {
              width: 100%;
              padding: 0.5rem;
              box-sizing: border-box;
              font-size: 1rem;
              font-family: sans-serif;
              border: 1px solid #ccc;
              border-radius: 4px;
              background: white;
              color: black;
            }

            .__wizzy-command-search-menu-results {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: center;
              width: 100%;
              padding: 1rem;
              box-sizing: border-box;
            }
          }
        }
      </style>
      <div class="__wizzy-command-search-menu-header">
        <input
          type="text"
          class="__wizzy-command-search-menu-input"
          placeholder="Search for a command by name or description"
        />
      </div>

      <div class="__wizzy-command-search-menu-results"></div>
    </div>
  `;
}

export function insertHTMLSnippetCommand({ outerHTML = "", editor }) {
  function htmlPreviewBox({
    previewElement = document.createElement("div"),
    x = 0,
    y = 0,
    width = 0,
    height = 0,
  }) {
    const previewContainer = html`
      <div class="__wizzy-html-preview-box">
        <style>
          @scope (.__wizzy-html-preview-box) {
            :scope {
              & {
                position: fixed;
                display: flex;
                flex-direction: column;
                top: ${y}px;
                left: ${x}px;
                width: ${width}px;
                height: ${height}px;
                background: transparent;
                border: 1px solid black;
                z-index: 10000000007;
              }
            }
          }
        </style>

        <div class="__wizzy-html-preview-box-content"></div>
      </div>
    `;

    return previewContainer;
  }

  const preview = html`${outerHTML}`;
  const outerTag = preview.tagName.toLowerCase();

  const cmd = command({
    name: "Insert HTML Snippet",
    icon: getMaterialIcon(outerTag),
    description: "Inserts an HTML snippet into the editor",
    brief: "Inserts an HTML snippet",
    editor,

    action: (e) => {
      if (e.target && e.target instanceof HTMLElement) {
        if (e.target.closest("[wizzy-editor]")) {
          return;
        }

        e.target.insertAdjacentHTML("beforeend", outerHTML);
        return;
      }
    },
  });

  return cmd;
}
