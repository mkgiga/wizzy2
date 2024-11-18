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

    cssOverrides: {
      
      '.container': `
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        padding: 3rem;
        background: white;
        border: 1px solid #ccc;
        z-index: 10000000002;
        width: 100%;
        height: 100%;
      `,

      '.toolbar button': `
        font-family: 'Material Icons';
        font-size: 24px;
        width: 24px;
        height: 24px;
        padding: 0;
        margin: 0;
        text-align: center;
        cursor: pointer;
        border: none;
        background: none;
        align-items: center;
        justify-content: center;
      `,
      '.toolbar button:hover': `
        background: rgba(0, 0, 0, 0.1);
      `,
      '.toolbar button:active': `
        background: rgba(0, 0, 0, 0.2);
      `,
      '.toolbar': `
        justify-content: flex-start;
      `,
    },
    listeners: {
      onRemove: () => {
        preferencesContainer.toggle();
      },
    }
  });
  
  const contentContainer = preferencesContainer.querySelector(".__wizzy-window-content");
  
  const content = html`
    <div class="__wizzy-preferences-content"></div>
    
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
            <div class="__wizzy-preferences-item">
              <label for="${item.name}">${item.name}</label>
              <div class="__wizzy-preferences-item-value">
                <textarea id="${item.name}" name="${item.name}">${item.value}</textarea>
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

  preferencesContainer.toggle = () => {
    if (preferencesContainer.style.display === "none") {
      preferencesContainer.style.display = "flex";
    } else {
      preferencesContainer.style.display = "none";
    }
  }

  return preferencesContainer;
}

export default {
  editorPreferences,
};
