import html from "../lib/html.js";
import randomUUID from "../util/randomUUID.js";
import editorWindow from "./editor-window.js";
/**
 * A menu for user-created HTML elements.
 * @param {*} param0
 * @returns
 */
export function myCustomHtmlElements({ entries = {}, editor }) {
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
          <textarea class="__wizzy-custom-elements-html-editor"></textarea>
        </div>
        <hr class="__wizzy-custom-elements-separator">
        <div class="__wizzy-custom-elements-css-editor-container __wizzy-element-code-editor-container">
          <div class="__wizzy-custom-elements-html-editor-top-bar">
            
          </div>
          <textarea class="__wizzy-custom-elements-css-editor"></textarea>
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
