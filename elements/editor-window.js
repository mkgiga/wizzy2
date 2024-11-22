import html from "../lib/html.js";
import randomUUID from "../src/util/randomUUID.js";
/**
 * Create a new editor window.
 * @param {Object} options
 * @param {string} options.title - The title of the window.
 * @param {Array<HTMLElement>} options.menuItems - An array of menu items to display in the window.
 * @param {HTMLElement|string|Array<HTMLElement>} options.toolbarContent - The content to display in the toolbar.
 * @param {HTMLElement|string} options.footerContent - The content to display in the footer.
 * @param {HTMLElement} options.editor - A reference to the editor state.
 * @param {string} options.position - The position of the window.
 * @returns {HTMLElement} The editor window element.
 * @throws {Error} If the toolbar content is not a valid type.
 * @throws {Error} If the footer content is not a valid type.
 */
export default function editorWindow({
  title = "Untitled Window",
  toolbarContent = "",
  footerContent = "",
  content = "",
  position = "relative",
  cssOverrides = {},
  listeners = {
    onRemove: (e) => {},
  }
}) {
  const id = randomUUID();

  const el = html`
    
    <div class="__wizzy-window" id="${id}">
    <style>
      @scope (#${id}) {
        :scope {
          
          --background: white;
          --text-color: black;

          color: var(--text-color);

          & {
            position: ${position};
            display: flex;
            flex-direction: column;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--background);
            box-sizing: border-box;
            margin: 3rem;
            padding: 0;
            z-index: 1000000006;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            border-style: solid;
            border-width: 1px;
            border-color: #ccc;

          }

          button {
            font-family: 'Material Icons';
            font-size: 24px;
            cursor: pointer;
            border: none;
            background: none;
            color: inherit;
            font-size: 1rem;
            padding: 0.5rem;
            margin: 0;
            text-align: center;
            text-decoration: none;
            text-justify: center;
            
            &:hover {
              background: rgba(0, 0, 0, 0.1);
            }

            &:active {
              background: rgba(0, 0, 0, 0.2);
            }
          }
          .__wizzy-window-menu {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem;
            background: #f1f1f1;
            border-bottom: 1px solid #ccc;
          }
          .__wizzy-window-toolbar {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem;
            background: #f1f1f1;
            border-bottom: 1px solid #ccc;
          }
          .__wizzy-window-content {
            flex: 1;
            padding: 0;
            margin: 0;
            overflow: auto;
          }
        }
      }
    </style>
      <div class="__wizzy-window-menu">
        <h4>${title}</h4>
        <div class="__wizzy-window-menu-buttons">
          <button class="material-icons">close</button>
        </div>
      </div>
      <div class="__wizzy-window-toolbar"></div>
      <div class="__wizzy-window-content"></div>
      <div class="__wizzy-window-footer"></div>
    </div>
  `;

console.log(el);

  const menu = el.querySelector(".__wizzy-window-menu");
  const toolbar = el.querySelector(".__wizzy-window-toolbar");
  const _content = el.querySelector(".__wizzy-window-content");
  const footer = el.querySelector(".__wizzy-window-footer");

  if (toolbarContent instanceof Array) {
    for (const item of toolbarContent) {
      if (item instanceof HTMLElement) {
        toolbar.appendChild(item);
      } else {
        throw new Error("Toolbar content array may only contain HTMLElements");
      }
    }
  } else if (typeof toolbarContent === "string") {
    if (toolbarContent.trim().length > 0) {
      toolbar.insertAdjacentHTML("beforeend", toolbarContent);
    }
  } else if (toolbarContent instanceof HTMLElement) {
    toolbar.appendChild(toolbarContent);
  } else {
    throw new Error(`
      Invalid toolbar content argument provided.

      Must be one of:
        - HTMLElement
        - Array<HTMLElement>
        - string

      Received: ${typeof toolbarContent}.
    `);
  }

  if (footerContent instanceof HTMLElement) {
    footer.appendChild(footerContent);
  } else if (typeof footerContent === "string") {
    if (footerContent.trim().length > 0) {
      footer.insertAdjacentHTML("beforeend", footerContent);
    }
  } else {
    throw new Error(`
      Invalid footer content argument provided.

      Must be one of:
        - HTMLElement
        - string

      Received: ${typeof footerContent}.
    `);
  }

  if (content instanceof HTMLElement) {
    _content.appendChild(content);
  } else if (typeof content === "string") {
    if (content.trim().length > 0) {
      _content.insertAdjacentHTML("beforeend", content);
    }
  } else {
    throw new Error(`
      Invalid content argument provided.

      Must be one of:
        - HTMLElement
        - string

      Received: ${typeof content}.
    `);
  }

  const closeButton = menu.querySelector("button");

  closeButton.addEventListener("click", (e) => {
    if (listeners.onRemove) {
      listeners.onRemove(e);
    }
  });

  return el;
}
