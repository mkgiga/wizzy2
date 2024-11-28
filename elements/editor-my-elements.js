import html from "../lib/html.js";
import randomUUID from "../util/randomUUID.js";
import editorWindow from "./editor-window.js";
import codeEditor from "./editor-code-editor.js";

/**
 * A menu for user-created HTML elements.
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
        <div class="__wizzy-custom-elements-list-header">
        </div>
        <div class="__wizzy-custom-elements-list-actions">
          <button class="__wizzy-custom-elements-add material-icons">add</button>
          <button class="__wizzy-custom-elements-rename material-icons">edit</button>
          <button class="__wizzy-custom-elements-delete material-icons">delete</button>
        </div>
        <ul class="__wizzy-custom-elements-list">
        </ul>
      </div>
      <div class="__wizzy-custom-elements-editor">
        <div class="__wizzy-custom-elements-html-editor-container __wizzy-element-code-editor-container">
          <div class="__wizzy-custom-elements-html-editor-top-bar">

          </div>
          
        </div>
        <hr class="__wizzy-custom-elements-separator">
        <div class="__wizzy-custom-elements-css-editor-container __wizzy-element-code-editor-container">
          <div class="__wizzy-custom-elements-html-editor-top-bar">
            
          </div>
          
        </div>
      </div>
      <div class="__wizzy-custom-elements-buttons">
        <button class="__wizzy-custom-elements-add">Save</button>
        <button class="__wizzy-custom-elements-cancel">Close</button>
      </div>
    </div>
  `;

  // Draggable separator that allows the user to resize the HTML and CSS editors.
  const handle = content.querySelector(".__wizzy-custom-elements-separator");
  let isDragging = false;

  handle.addEventListener("mousedown", (e) => {
    isDragging = true;
  });

  handle.addEventListener("mouseup", (e) => {
    isDragging = false;
  });

  window.addEventListener("mousemove", (e) => {
    const [mouseX, mouseY] = [e.clientX, e.clientY];

    // both the css and html editor should share the same parent element
    const rect = content
      .querySelector(".__wizzy-custom-elements-html-editor-container")
      .parentElement.getBoundingClientRect();

    if (isDragging) {
      // todo
    }
  });

  const addElementButton = content.querySelector(".__wizzy-custom-elements-add");
  const renameElementButton = content.querySelector(".__wizzy-custom-elements-rename");
  const deleteElementButton = content.querySelector(".__wizzy-custom-elements-delete");

  const htmlEditor = content.querySelector(".__wizzy-custom-elements-html-editor");
  const cssEditor = content.querySelector(".__wizzy-custom-elements-css-editor");

  const saveButton = content.querySelector(".__wizzy-custom-elements-add");
  const cancelButton = content.querySelector(".__wizzy-custom-elements-cancel");

  // ##################### Event Listeners ########################## //

  addElementButton.addEventListener("click", (e) => {
    // todo
  });

  renameElementButton.addEventListener("click", (e) => {
    // todo
  });

  deleteElementButton.addEventListener("click", (e) => {
    // todo
  });

  saveButton.addEventListener("click", (e) => {
    // todo
  });

  cancelButton.addEventListener("click", (e) => {
    // todo
  });

  const htmlEditorContainer = content.querySelector(".__wizzy-custom-elements-html-editor-container");
  const cssEditorContainer = content.querySelector(".__wizzy-custom-elements-css-editor-container");

  function onChangeOrInput(e, whichEditor = 'html', elementName) {
    
  }

  htmlEditorContainer.appendChild(
    codeEditor({
      text: "",
      listeners: {
        
      }
    })
  );

  cssEditorContainer.appendChild(
    codeEditor({
      text: "",
      listeners: {

      }
    })
  );

  const list = content.querySelector(".__wizzy-custom-elements-list");

  for (const [name, { outerHtml, style, meta }] of Object.entries(elements)) {
    const li = html`
      <li class="__wizzy-custom-elements-list-item">
        <span class="__wizzy-custom-elements-list-item-name">${name}</span>
      </li>
    `;

    li.addEventListener("click", (e) => {
      htmlEditor.value = outerHtml;
      cssEditor.value = style;
    });

    list.appendChild(li);
  }

  const topMenuItems = [];

  const customElementsContainer = editorWindow({
    title: "Custom Elements",
    content,
    editor,
    menuItems: topMenuItems,
  });

  return el;
}

export function customHtmlElement({
  name = `untitled-${randomUUID()}`,
  outerHtml = '<div class="hello-world">Hello, World!</div>',
  style = ".hello-world { color: red; }",
  meta = {},
}) {
  return {
    name,
    outerHtml,
    style,
    meta,
  }
}


export default {
  myCustomHtmlElements,
  customHtmlElement,
};
