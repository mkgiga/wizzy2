import html from "../lib/html.js";
import randomUUID from "../util/randomUUID.js";
import editorWindow from "./editor-window.js";
import codeEditor from "./editor-code-editor.js";
import resizeHandle from "./resize-handle.js";
import fadingTooltip from "./editor-fading-tooltip.js";
import contextMenu from './context-menu.js';
/**
 * A menu for user-created HTML element presets.
 * @param {Object} options
 * @param {{ [name: string]: { outerHtml: string, style: string, meta: Object } }} options.elements - A map of custom HTML elements.
 * @param {HTMLElement} options.editor - A reference to the editor state.
 * @returns {HTMLElement} The custom HTML elements menu.
 * @returns
 */
export function myCustomHtmlElements({ elements = {}, editor }) {
  if (!editor) {
    throw new Error("Editor reference must be passed to myCustomHtmlElements");
  }

  const content = html`
    <div class="__wizzy-custom-elements">
      <div class="__wizzy-custom-elements-list-container">
        <div class="__wizzy-custom-elements-list-header"></div>
        <div class="__wizzy-custom-elements-list-actions">
          <button class="__wizzy-custom-elements-add material-icons">
            add
          </button>
          <button class="__wizzy-custom-elements-rename material-icons">
            edit
          </button>
          <button class="__wizzy-custom-elements-delete material-icons">
            delete
          </button>
        </div>
        <ul class="__wizzy-custom-elements-list"></ul>
      </div>
      <div class="__wizzy-custom-elements-editor">
        <div
          class="__wizzy-custom-elements-html-editor-container __wizzy-element-code-editor-container"
        >
          <div class="__wizzy-custom-elements-html-editor-top-bar"></div>
        </div>

        <div
          class="__wizzy-custom-elements-css-editor-container __wizzy-element-code-editor-container"
        >
          <div class="__wizzy-custom-elements-html-editor-top-bar"></div>
        </div>
      </div>
      <div class="__wizzy-custom-elements-buttons">
        <button class="__wizzy-custom-elements-add">Save</button>
        <button class="__wizzy-custom-elements-cancel">Close</button>
      </div>
    </div>
  `;

  const addElementButton = content.querySelector(
    ".__wizzy-custom-elements-add"
  );
  const renameElementButton = content.querySelector(
    ".__wizzy-custom-elements-rename"
  );
  const deleteElementButton = content.querySelector(
    ".__wizzy-custom-elements-delete"
  );

  const elementEditors = content.querySelector(
    ".__wizzy-custom-elements-editor"
  );

  const htmlEditorContainer = content.querySelector(
    ".__wizzy-custom-elements-html-editor-container"
  );

  const cssEditorContainer = content.querySelector(
    ".__wizzy-custom-elements-css-editor-container"
  );

  

  const renameElement = ({ listItem }) => {
    const nameElement = listItem.querySelector(".__wizzy-custom-elements-list-item-name");
    const oldValue = nameElement.textContent;

    nameElement.setAttribute("contenteditable", "true");
    nameElement.focus();
    
    // select all text
    const range = document.createRange();
    range.selectNodeContents(nameElement);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    nameElement.addEventListener("blur", (e) => {
      console.log("Blurred", e);
      const allElementListItems = content.querySelector(".__wizzy-custom-elements-list");
      
      for (const listItem of Array.from(allElementListItems.querySelectorAll(".__wizzy-custom-elements-list-item-name"))) {
        const textContent = listItem.textContent.trim();

        if (textContent === nameElement.textContent.trim() && listItem !== nameElement) {
          nameElement.removeAttribute("contenteditable");

          fadingTooltip({
            text: "An element with that name already exists.",
            x: listItem.getBoundingClientRect().left,
            y: listItem.getBoundingClientRect().top,
          });

          if (nameElement.textContent.trim() === "") {
            nameElement.textContent = oldValue;
          } else {
            nameElement.textContent = oldValue;
            nameElement.closest(".__wizzy-custom-elements-list-item").setAttribute("for", nameElement.textContent.trim());
          }

          return;
        } else {
          nameElement.closest(".__wizzy-custom-elements-list-item").setAttribute("for", nameElement.textContent.trim());
        }
      }

      nameElement.removeAttribute("contenteditable");
      nameElement.textContent = nameElement.textContent.trim();
    });

    nameElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        nameElement.blur();
      }
    });
  };

  const handle = resizeHandle({
    container: elementEditors,
    direction: "column",
    onResize: (e) => {
      console.log("Resized", e);
    },
  });

  

  cssEditorContainer.insertAdjacentElement("beforebegin", handle);

  const saveButton = content.querySelector(".__wizzy-custom-elements-add");
  const cancelButton = content.querySelector(".__wizzy-custom-elements-cancel");

  // ##################### Event Listeners ########################## //

  addElementButton.addEventListener("click", (e) => {
    const newElement = customHtmlElement({
      name: `Untitled Element #
      ${
        Object.keys(elements)
          .filter((key) => key.startsWith("Untitled Element #"))
          .reduce((acc, key) => {
            const num = parseInt(key.split("#")[1]);
            if (num > acc) {
              return num;
            }
            return acc;
          }, 0) + 1
      }`,
      outerHtml: "<span></span>",
      style: "",
      meta: {},
    });

    addElements(
      newElement  
    );
    

  });

  renameElementButton.addEventListener("click", (e) => {
    
  });

  deleteElementButton.addEventListener("click", (e) => {
    const nameElement = content.querySelector(".__wizzy-custom-elements-list-item-name");
    const listItem = nameElement.closest(".__wizzy-custom-elements-list-item");
    listItem.remove();
  });

  saveButton.addEventListener("click", (e) => {
    // todo
  });

  cancelButton.addEventListener("click", (e) => {
    customElementsContainer.toggle(false);
  });

  

  function onChangeOrInput(e, whichEditor = "html", elementName) {}

  htmlEditorContainer.appendChild(
    codeEditor({
      text: ``,
      listeners: {},
      attr: {
        
      },
    })
  );

  cssEditorContainer.appendChild(
    codeEditor({
      text: ``,
      listeners: {},
      attr: { "editor-name": "CSS", },
    })
  );
  
  const htmlTextArea = htmlEditorContainer.querySelector("textarea");
  const cssTextArea = cssEditorContainer.querySelector("textarea");

  function createListEntry({ element }) {
    const li = html`
      <li class="__wizzy-custom-elements-list-item">
        <style>
          @scope (.__wizzy-custom-elements-list-item) {
            :scope {
              display: grid;
              grid-template-columns: 1fr auto;
              gap: 0.5rem;
              padding: 0.5rem;
              border-bottom: 1px solid #333;
              align-items: center;
              justify-content: space-between;
              font-size: 1rem;
              font-family: sans-serif;

              .__wizzy-custom-elements-list-item-name {
                font-weight: bold;
                font-size: 1.25rem;

                &[contenteditable="true"] {
                  border: 1px solid #333;
                  padding: 0.25rem;
                  border-radius: 0.25rem;
                }
              }

              .__wizzy-custom-elements-list-item-actions {

                color: #333;
                font-size: 0.875rem;

                .material-icons {
                  cursor: pointer;

                  &:hover {
                    color: #333;
                  }
                  
                  &:active {
                    color: #000;
                  }

                  &:not(:last-child) {
                    margin-right: 0.5rem;
                  }

                  &:not(:first-child) {
                    margin-left: 0.5rem;
                  }
                }
              }
            }
          }
        </style>
        <span class="__wizzy-custom-elements-list-item-name">
          ${element.getAttribute("name")}
        </span>
        <span class="__wizzy-custom-elements-list-item-actions">
          <button class="__wizzy-custom-elements-list-item-rename material-icons">
            edit
          </button>
          <button class="__wizzy-custom-elements-list-item-delete material-icons">
            delete
          </button>
        </span>
      </li>
    `;

    

    const ctxMenu = contextMenu({

      items: [
        {
          label: "Rename",
          value: () => {
            renameElement({ listItem: li, e });
          }
        }
      ],

      meta: {
        override: true,
      }
    });

    li.__wizzy_contextMenu = ctxMenu;

    const renameButton = li.querySelector(".__wizzy-custom-elements-list-item-rename");
    const deleteButton = li.querySelector(".__wizzy-custom-elements-list-item-delete");
    const nameElement = li.querySelector(".__wizzy-custom-elements-list-item-name");

    renameButton.addEventListener("click", (e) => {
      renameElement({ listItem: li, e });
    });

    deleteButton.addEventListener("click", (e) => {
      const forElement = document.querySelector(`[__wizzy-editor] .__wizzy-custom-elements li[for="${nameElement.textContent}"]`);
      forElement?.remove();
      li?.remove();
    });

    li.addEventListener("click", (e) => {
      htmlTextArea.value = element.meta.outerHtml;
      cssTextArea.value = element.meta.style;
      
      // visual feedback
      for (const editor of [htmlEditorContainer, cssEditorContainer]) {
        editor.animate([
          { "filter": "invert(1)" },
          { "filter": "invert(0)" },
        ], {
          duration: 300,
          easing: "linear",
        });
      }
    });

    return li;
  }

  const list = content.querySelector(".__wizzy-custom-elements-list");

  for (const [name, { outerHtml, style, meta }] of Object.entries(elements)) {
    const li = createListEntry({ element: { name, outerHtml, style, meta } });
    list.appendChild(li);
  }
  const customElementsContainer = editorWindow({
    title: "Custom Elements",
    content,
    editor,
    menuItems: [],
  });

  const toggle = (state = undefined) => {
    if (state === undefined) {
      customElementsContainer.toggleAttribute("hidden");
    } else {
      if (!state) {
        customElementsContainer.setAttribute("hidden");
      } else {
        customElementsContainer.removeAttribute("hidden", "");
      }
    }

    return customElementsContainer;
  };

  const addElements = (...elements) => {
    const list = content.querySelector(".__wizzy-custom-elements-list");
    
    let lastAddedElement = null;
    
    for (const element of elements) {
      const li = createListEntry({ element, name: element.getAttribute("name") });
      list.appendChild(li);

      lastAddedElement = li;
    }

    if (lastAddedElement) {
      lastAddedElement.click();
    }

    return customElementsContainer;
  }

  customElementsContainer.addElements = addElements;
  customElementsContainer.toggle = toggle;

  return customElementsContainer;
}

export function customHtmlElement({
  name = `untitled-${randomUUID()}`,
  outerHtml = '<div class="hello-world">Hello, World!</div>',
  style = "",
}) {
  const element = html`
    ${outerHtml}
  `;

  element.setAttribute("name", name);

  const meta = {
    name,
    outerHtml,
    style,
  };

  element.meta = meta;

  return element;
}

export default {
  myCustomHtmlElements,
  customHtmlElement,
};
