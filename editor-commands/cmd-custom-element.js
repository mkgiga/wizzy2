import { EditorCommand } from "../editor-commands.js";
import html from "../lib/html.js";
import contextMenu from "../elements/context-menu.js";
import { command } from "../elements/editor-commands.js";

export default class CmdCustomElement extends EditorCommand {
  constructor({
    editor,
    params = {
      html: `
        <div 
          class="custom-element"
          style="background-color: white; color: black; padding: 10px; border: 1px solid black; border-radius: 5px;"
        >
          Hello, World!
        </div>
      `,
    },
    description = "Insert a custom element.",
    name = "Custom Element",
    brief = "Insert a custom element",
    icon = "html",
  }) {
    super({ editor, params, description, name, brief, icon });
  }

  createElement() {
    const cmd = command({
      name: this.name,
      description: this.description,
      brief: this.brief,
      icon: this.icon,
      action: (e) => {
        this.do();
      },
      contextMenu: contextMenu({
        items: [
          {
            name: "Edit",
            action: () => {
              this.promptEdit();
            },
          },
          {
            name: "Add matching to selection",
            action: () => {
              const selector = createSelector();
              const elements = Array.from(document.querySelectorAll(selector));
              this.editor.sel.add(...elements);
            },
          },
          {
            name: "Remove matching from selection",
            action: () => {
              const selector = createSelector();
              const elements = Array.from(document.querySelectorAll(selector));
              this.editor.sel.remove(...elements);
            },
          },
        ],
      }),
    });

    // Builds a css selector that matches any element of the same structure.
    // (same number of children, same classes, same attributes, same text content) recursively.
    function createSelector() {
      const test = html`${this.params.html}`;
      const selector = [];

      function buildSelector(el, selector) {
        const children = Array.from(el.children);
        const classes = Array.from(el.classList);
        const attributes = Array.from(el.attributes);
        const text = el.textContent;

        selector.push(el.tagName);

        if (classes.length) {
          selector.push(`.${classes.join(".")}`);
        }

        if (attributes.length) {
          for (const attr of attributes) {
            selector.push(`[${attr.name}="${attr.value}"]`);
          }
        }

        if (text) {
          selector.push(`:contains("${text}")`);
        }

        if (children.length) {
          for (const child of children) {
            buildSelector(child, selector);
          }
        }

        return selector;
      }

      return buildSelector(test, selector).join("");
    }

    return cmd;
  }

  do() {
    const el = html`${this.params.html}`;
    this.editor.addElement({ element: el });
  }

  undo() {}
}
