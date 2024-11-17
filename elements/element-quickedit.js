import html from "../lib/html.js";
import editorDomPath from "./editor-dompath.js";

export function quickEdit({ element = document.body, type = "attributes" }) {
  const el = html`
    <div class="__wizzy-quickedit">
      <style>
        @scope (.__wizzy-quickedit) {
          :scope {
            & {
              display: grid;
              grid-template-columns: 256px 1fr 64px;
              grid-template-rows: 24px;
              height: 24px;
              margin: 0;
              padding: 0;
              overflow: hidden;
              max-height: 24px;
              gap: 0;
              z-index: 1000000002;
              font-family: monospace;
            }

            button {
              height: 100%;
              background: #f1f1f1;
              color: #333;
              border: none;
              padding: 0;
              margin: 0;
              cursor: pointer;
              font-size: 12px;

              &:hover {
                background: #e1e1e1;
              }

              &:active {
                background: #d1d1d1;
              }
            }

            .__wizzy-quickedit-path {
              grid-column: 1 / 2;
              grid-row: 1 / 2;
              padding: 0;
              margin: 0;
              background: #f1f1f1;
              color: #333;
              font-size: 12px;
              height: 100%;
            }

            .__wizzy-quickedit-content {
              input {
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                background: #f1f1f1;
                padding: 0;
                margin: 0;
                border: none;
                font-size: 12px;
                color: #333;
                text-justify: left;
                padding-left: 4px;
                font-family: monospace;
              }
            }

            .__wizzy-quickedit-actions {
              grid-column: 3 / 4;
              grid-row: 1 / 2;
              padding: 0;
              margin: 0;
              background: #f1f1f1;
              color: #333;
              font-size: 12px;
              height: 100%;
              justify-items: center;
            }
          }
        }
      </style>
      <div class="__wizzy-quickedit-path">
        ${editorDomPath({ element }).outerHTML}
      </div>
      <div class="__wizzy-quickedit-content"></div>
      <div class="__wizzy-quickedit-actions">
        <button class="material-icons" id="__wizzy-quickedit-btn-confirm">
          check
        </button>
        <button class="material-icons" id="__wizzy-quickedit-btn-close">
          close
        </button>
      </div>
    </div>
  `;

  let input = null;

  switch(type) {
    case "attributes":
      input = attributeEdit({ element });

      input.addEventListener("keydown", (e) => {
        e.stopPropagation();

        if (e.key === "Enter") {
          const oldAttributes = element.attributes;
          console.log(oldAttributes);
          const attributes = input.value.split(" ").map((attr) => {
            const [name, value] = attr.split("=");
            return { name, value };
          });

          console.log(attributes);

          for (const oldAttribute of oldAttributes) {
            if (!attributes.find((attr) => attr.name === oldAttribute.name)) {
              if (oldAttribute.name === "__wizzy-selected") {
                continue;
              }

              element.removeAttribute(oldAttribute.name);
            }
          }

          for (const attribute of attributes) {
            if (attribute.name === "__wizzy-selected") {
              continue;
            }

            element.setAttribute(attribute.name, attribute.value || "");
          }
        }
      });
      break;

    case "class":
      input = classEdit({ element });

      input.addEventListener("keydown", (e) => {
        e.stopPropagation();

        if (e.key === "Enter") {
          element.className = input.value;
        }
      });
      break;

    default:
      throw new Error(`Unknown quick edit type: ${type}`);
  }

  input.addEventListener("blur", () => {
    el.remove();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      el.remove();
    }
  });

  el.querySelector(".__wizzy-quickedit-content").appendChild(input);

  return el;
}

/**
 * @param {Object} options
 * @param {HTMLElement} options.element
 */
function attributeEdit({ element }) {
  console.log(element.attributes);
  
  // Convert attributes into a serialized string, properly escaped
  let attributesArray = Array.from(element.attributes)
    .filter((attr) => attr.name !== "__wizzy-selected")
    .map(
      (attr) => `${attr.name}="${attr.value.replace(/"/g, '&quot;')}"`
    ); // Escape quotes in attribute values

  const attributes = attributesArray.join(" "); // Join with spaces for proper formatting

  console.log(attributes);

  // Wrap the entire value in quotes to avoid breaking the HTML
  const el = html`
    <input
      type="text"
      class="__wizzy-quickedit-input"
      value="${attributes.replace(/"/g, '&quot;')}" 
      style="width: 100%; height: 100%; font-size: 12px; font-family: monospace;"
    />
  `;
  
  console.log(el);
  return el;
}

/**
 * @param {Object} options
 * @param {HTMLElement} options.element
 * @returns {HTMLElement}
 */
function classEdit({ element }) {
  const el = html`
    <input
      type="text"
      class="__wizzy-quickedit-input"
      value="${element.className}"
    />
  `;

  return el;
}


export default quickEdit;
