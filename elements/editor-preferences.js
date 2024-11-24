import html from "../lib/html.js";
import editorWindow from "./editor-window.js";

const DEBUG_CLEAR_LOCAL_STORAGE = true;

export function editorPreferences(localStorageTarget = "", preferences) {
  console.log(preferences);

  const preferencesContainer = editorWindow({
    title: "Preferences",

    toolbarContent: `
      <button class="__wizzy-preferences-save material-icons">save</button>
    `,

    position: "fixed",

    listeners: {
      onRemove: () => {
        preferencesContainer.toggle();
      },
    },
  });

  const contentContainer = preferencesContainer.querySelector(
    ".__wizzy-window-content"
  );

  const content = html`
    <div class="__wizzy-preferences-content"></div>
      <style>
        @scope (.__wizzy-preferences-content) {
          :scope {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            gap: 1rem;
            width: 100%;
            height: 100%;
          }
        }
      </style>
    </div>
  `;

  for (const group of preferences) {
    const groupContainer = html`
      <div class="__wizzy-preferences-group">
        <style>
          @scope (.__wizzy-preferences-group) {
            :scope {
              & {
                padding: 1rem;
              }

              h4 {
                margin: 0;
              }

              hr {
                margin: 0.5rem 0;
                border: none;
                border-top: 1px solid #ccc;
              }
            }
          }
        </style>
        <h4>${group.group}</h4>
        <hr />
        <div class="__wizzy-preferences-group-items"></div>
      </div>
    `;

    const itemsContainer = groupContainer.querySelector(
      ".__wizzy-preferences-group-items"
    );
    console.log(group.items);
    for (const item of group.items) {
      let res;

      switch (item.type) {
        case "textarea":
          res = html`
            <div
              class="__wizzy-preferences-item"
              style="display: flex; flex-direction: column; max-height: 200px;"
            >
              <label for="${item.name}">${item.name}</label>
              <div class="__wizzy-preferences-item-value">
                <textarea id="${item.name}" name="${item.name}">
${item.value}</textarea
                >
              </div>
            </div>
          `;

          const MAX_ROWS = 8;

          const textArea = res.querySelector("textarea");
          /**
           *
           * @param {InputEvent} e
           */
          res.updateSize = (e) => {
            console.log(e);
            if (e) {
              e.stopPropagation();

              const data = e.data;

              if (data) {
                textArea.value += data;
              }
            }

            const rows = textArea.value.split("\n").length;
            textArea.rows = Math.min(rows, MAX_ROWS);
          };

          res.updateSize();
          textArea.addEventListener("input", res.updateSize);
          break;

        case "number":
          res = html`
            <div class="__wizzy-preferences-item">
              <label for="${item.name}">${item.name}</label>
              <div class="__wizzy-preferences-item-value">
                <input
                  type="number"
                  id="${item.name}"
                  name="${item.name}"
                  value="${item.value}"
                />
              </div>
            </div>
          `;
          break;

        case "checkbox":
          res = html`
            <div class="__wizzy-preferences-item">
              <label for="${item.name}">${item.name}</label>
              <div class="__wizzy-preferences-item-value">
                <input
                  type="checkbox"
                  id="${item.name}"
                  name="${item.name}"
                  ${item.value ? "checked" : ""}
                />
              </div>
            </div>
          `;
          break;

        default:
          res = html`
            <div class="__wizzy-preferences-item">
              <label for="${item.name}">${item.name}</label>
              <div class="__wizzy-preferences-item-value">
                <span>${item.value}</span>
              </div>
            </div>
          `;
          break;
      }

      itemsContainer.appendChild(res);
    }

    contentContainer.appendChild(groupContainer);
  }

  /**
   * Toggle the preferences container.
   * @param {boolean} [state=undefined] - The state to set the preferences container to. If not provided, the container will set to the opposite of its current state.
   */
  preferencesContainer.toggle = (state = undefined) => {
    if (state !== undefined) {
      preferencesContainer.style.display = state ? "flex" : "none";
    } else {
      if (preferencesContainer.style.display === "none") {
        preferencesContainer.style.display = "flex";
      } else {
        preferencesContainer.style.display = "none";
      }
    }
  };

  const saveButton = preferencesContainer.querySelector(
    ".__wizzy-preferences-save"
  );

  saveButton.addEventListener("click", (e) => {
    e.target.animate(
      [
        { color: "lime", transform: "scale(2)" },
        { color: "black", transform: "scale(1)" },
      ],
      {
        duration: 500,
        easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }
    );

    const groups = contentContainer.querySelectorAll(
      ".__wizzy-preferences-group"
    );

    const newPreferences = [];

    for (const group of groups) {
      const groupName = group.querySelector("h4").textContent;
      const items = group.querySelectorAll(".__wizzy-preferences-item");

      const newItems = [];

      for (const item of items) {
        const name = item.querySelector("label").textContent;
        const value =
          item.querySelector("textarea")?.value ||
          item.querySelector("span").textContent;

        newItems.push({ name, value });
      }

      newPreferences.push({ group: groupName, items: newItems });
    }
  });

  preferencesContainer.appendChild(html`
    <style>
      @scope (.__wizzy-window[id="${preferencesContainer.id}"]) {
        :scope {
          & {
            z-index: 10000000009;
            backdrop-filter: blur(12px);
          }
        }
      }
    </style>
  `);

  return preferencesContainer;
}

export default {
  editorPreferences,
};
