import html from "../lib/html.js";
import editorWindow from "./editor-window.js";

export function editorPreferences(localStorageTarget = "") {
  
  const defaultPreferences = [
    {
      group: "Elements",
      items: [
        {
          name: "Prevent appending inside:",
          type: "textarea",
          value:
            `p,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nimg,\nbutton,\nlabel,\ninput,\ntextarea,\nembed`,
        },
      ]
    },
  ];

  // testing
  localStorage.removeItem(localStorageTarget);

  if (!localStorage.getItem(localStorageTarget)) {
    // initialize localStorage with default values
    localStorage.setItem(
      localStorageTarget,
      JSON.stringify(defaultPreferences)
    );
  }
  

  let preferences = JSON.parse(localStorage.getItem(localStorageTarget));

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
    }
  });
  
  const contentContainer = preferencesContainer.querySelector(".__wizzy-window-content");
  
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
        <hr>
        <div class="__wizzy-preferences-group-items"></div>
      </div>
    `;

    const itemsContainer = groupContainer.querySelector(".__wizzy-preferences-group-items");
    console.log(group.items);
    for (const item of group.items) {
      let res;

      switch(item.type) {
        case 'textarea': 
          res = html`
            <div class="__wizzy-preferences-item" style="display: flex; flex-direction: column; max-height: 200px;">
              <label for="${item.name}">${item.name}</label>
              <div class="__wizzy-preferences-item-value">
                <textarea id="${item.name}" name="${item.name}">${item.value}</textarea>
              </div>
            </div>
          `;

          const MAX_ROWS = 8;

          const textArea = res.querySelector("textarea");
          res.updateSize = () => {
            const rows = textArea.value.split("\n").length;
            textArea.rows = Math.min(rows, MAX_ROWS);
          }
          res.updateSize();
          textArea.addEventListener("input", res.updateSize);
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

  preferencesContainer.toggle = () => {
    if (preferencesContainer.style.display === "none") {
      preferencesContainer.style.display = "flex";
    } else {
      preferencesContainer.style.display = "none";
    }
  }

  const saveButton = preferencesContainer.querySelector(".__wizzy-preferences-save");

  saveButton.addEventListener("click", (e) => {
    e.target.animate([
      { color: "lime", transform: "scale(2)" },
      { color: "black", transform: "scale(1)" }
    ], {
      duration: 500,
      easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    });

    const groups = contentContainer.querySelectorAll(".__wizzy-preferences-group");

    const newPreferences = [];

    for (const group of groups) {
      const groupName = group.querySelector("h4").textContent;
      const items = group.querySelectorAll(".__wizzy-preferences-item");

      const newItems = [];

      for (const item of items) {
        const name = item.querySelector("label").textContent;
        const value = item.querySelector("textarea")?.value || item.querySelector("span").textContent;

        newItems.push({ name, value });
      }

      newPreferences.push({ group: groupName, items: newItems });
    }
  });

  return preferencesContainer;
}

export default {
  editorPreferences,
};
