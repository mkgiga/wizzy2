import html from "../lib/html.js";

export function tools({ itemElements = [], editor }) {
  const el = html`
    <div class="__wizzy-tools">
      <style>
        @scope (.__wizzy-tools) {
          :scope {
            & {
              position: relative;
              width: 1.5rem;
              height: 100%;
              background: transparent;
              color: white;
              z-index: 100000000;
              display: flex;

              transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }

            .__wizzy-tools-items {
              display: grid;
              grid-template-rows: repeat(${itemElements.length}, 1.5rem);
              row-gap: 0.25rem;
              height: 100%;
              width: 100%;
              align-content: flex-end;
              align-items: center;
            }
          }
        }
      </style>

      <div class="__wizzy-tools-items"></div>
    </div>
  `;

  const items = el.querySelector(".__wizzy-tools-items");

  for (const item of itemElements) {
    console.log(item);
    items.appendChild(item);
  }

  return el;
}
/**
 * Create a tool button which can be used to select a tool and use it,
 * which does something depending on the tool and the context it is used in.
 * @param {Object} options
 * @param {String} options.id
 * @param {String} options.icon
 * @param {String} options.title
 * @param {Function} options.onSelect
 * @param {Function} options.onUse
 * @param {Object} options.editor
 * @returns {HTMLElement}
 */
export function tool({
  id = "tool",
  icon = "bucket",
  title = "Tool",
  onSelect = (e) => {},
  onUse = (e) => {},
  editor,
}) {
  const el = html`
    <div class="__wizzy-tool">
      <style>
        @scope (.__wizzy-tool) {
          :scope {
            & {
              display: grid;
              place-items: center;
              background: white;
              color: black;
              border: none;
              font-size: 24px;
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
              width: 1.5rem;
              height: 1.5rem;
              box-shadow: 0 0 12px 4px rgba(0, 0, 0, 0.66);

              &[selected] {
                /* blue background glow */
                box-shadow: 0 0 12px 5px rgba(0, 0, 255, 0.66);
              }
            }

            &:hover {
              filter: invert(1);
            }
          }
          .__wizzy-tool-icon {
            font-size: 24px;
            width: 1.5rem;
            height: 1.5rem;
            margin: 0;
            padding: 0;
            border: 0;
            background: transparent;
            color: inherit;
            cursor: pointer;
            font-family: "Material Icons";
          }
        }
      </style>
      <button class="material-icons __wizzy-tool-icon" title="${title}">
        ${icon}
      </button>
    </div>
  `;

  const onClick = (e) => {
    const otherTools = document.querySelectorAll(".__wizzy-tool");
    for (const tool of otherTools) {
      tool.removeAttribute("selected");
    }

    el.setAttribute("selected", "");

    onSelect(e);
  };

  function onUsed(e) {
    onUse(e);
  }

  el.onUse = onUse.bind(editor);
  el.onSelect = onSelect.bind(editor);

  el.addEventListener("click", onClick);

  el.setAttribute("id", `__wizzy-tool-${id}`);

  return el;
}

export default {
  tools,
  tool,
};
