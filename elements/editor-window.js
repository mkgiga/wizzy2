import html from "../lib/html.js";

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
  position = "relative",
  cssOverrides = {},
  listeners = {
    onRemove: (e) => {},
  }
}) {
  const el = html`
    
    <div class="__wizzy-window">
    <style>
      @scope (.__wizzy-window) {
        :scope {
          
          --background: white;
          --text-color: black;

          color: var(--text-color);

          & {
            position: ${position};
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            background: var(--background);
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            z-index: 100000006;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            border-style: solid;
            border-width: 1px;
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

          ${(() => {
            if (typeof cssOverrides !== "object") {
              throw new Error("cssOverrides must be an object");
            }

            let res = "";

            for (let [selector, value] of Object.entries(cssOverrides)) {
              
              if (typeof value !== "string") {
                throw new Error("cssOverrides values must be strings");
              }

              if (selector.startsWith(".container")) {
                selector = selector.replace(/^\.container/, "&");
              } else if (selector.startsWith(".menu")) {
                selector = selector.replace(/^\.menu/, ".__wizzy-window-menu");
              } else if (selector.startsWith(".toolbar")) {
                selector = selector.replace(/^\.toolbar/, ".__wizzy-window-toolbar");
              } else if (selector.startsWith(".content")) {
                selector = selector.replace(/^\.content/, ".__wizzy-window-content");
              } else if (selector.startsWith(".footer")) {
                selector = selector.replace(/^\.footer/, ".__wizzy-window-footer");
              }

              res += `${selector} { ${value} }\n\n`;
            }

            return res;
          })()}
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
  const content = el.querySelector(".__wizzy-window-content");
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

  const closeButton = menu.querySelector("button");

  closeButton.addEventListener("click", (e) => {
    if (listeners.onRemove) {
      listeners.onRemove(e);
    }
  });

  return el;
}
