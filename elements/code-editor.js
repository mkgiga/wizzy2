import html from "../lib/html.js";

/**
 * 
 * @param {Object} options
 * @param {String} options.className The class name to apply to the code editor
 * @param {Array} options.buttons Any buttons to add to this specific code editor's footer
 * @param {String} options.savePath The path in localStorage to save the code to
 * @returns {HTMLElement}
 */
export default function codeEditor({
  className = "",
  buttons = [],
  savePath = "",
}) {
  const el = html`
    <div class="__wizzy-code-editor __wizzy-window ${className}" __wizzy-save-target="${savePath}">
      <style>
        @scope (.__wizzy-code-editor) {
          :scope {
            & {
              position: relative;
              display: flex;
              flex-direction: column;
              width: 100%;
              height: 100%;
              background: white;
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              z-index: 100000006;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
              border-style: solid;
              border-width: 1px;
            }

            textarea {
              width: 100%;
              height: 100%;
              resize: none;
              border: none;
              padding: 0.125rem;
              padding-top: 0.5rem;
              font-family: monospace;
              font-size: 1rem;
              box-sizing: border-box;
              text-align: left;
              text-indent: 0;
              text-wrap: nowrap;
              overflow: auto;
              background: #f1f1f1;
              /* inset box shadow */
              box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);

              &:focus {
                outline: none;
              }
            }

            button.material-icons {
              font-size: 1rem;
              width: 1.5rem;
              height: 1.5rem;
              margin: 0;
              padding: 0;
              border: 0;
              background: transparent;
              color: inherit;
              cursor: pointer;
              font-family: "Material Icons";

              &:not([disabled]):hover {
                background: #e1e1e1;
              }

              &:not([disabled]):active {
                background: #d1d1d1;
              }

              &:disabled {
                color: #999;
                cursor: not-allowed;
              }
            }

            .__wizzy-code-editor-header {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
              background: #f1f1f1;
              color: #333;
              padding: 0;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

              h4 {
                font-size: 1rem;
                margin: 0;
                padding: 0.5rem;
                font-family: monospace;
              }
            }

            .__wizzy-code-editor-footer {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-end;
              background: #f1f1f1;
              color: #333;
              padding: 0;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

              button {
                font-size: 1rem;
                font-family: "Material Icons";
                background: transparent;
                color: #333;
                border: none;
                cursor: pointer;
                padding: 0.5rem;
                margin: 0;
                box-sizing: border-box;

                &:not([disabled]):hover {
                  background: #e1e1e1;
                }

                &:not([disabled]):active {
                  background: #d1d1d1;
                }
              }
            }
          }
        }
      </style>
      <div class="__wizzy-code-editor-header __wizzy-window-menu">
        <h4>Code Editor</h4>
        <div
          class="__wizzy-code-editor-header-actions __wizzy-window-menu-actions"
        >
          <button
            class="material-icons __wizzy-window-menu-action __wizzy-window-menu-action-settings"
            title="TODO: Implement settings"
            disabled
          >
            settings
          </button>
          <button
            class="material-icons __wizzy-window-menu-action __wizzy-window-menu-action-close"
          >
            close
          </button>
        </div>
      </div>

      <textarea class="__wizzy-code-editor-textarea"></textarea>

      <div class="__wizzy-code-editor-footer __wizzy-window-footer">
        <button class="__wizzy-code-editor-action __wizzy-window-action __wizzy-code-editor-action-save">save</button>
      </div>
    </div>
  `;

  el.save = () => {
    const path = el.getAttribute("__wizzy-save-target");
    const textarea = el.querySelector(".__wizzy-code-editor-textarea");
    localStorage.setItem(path, textarea.value);
  };

  el.close = () => {
    el.save();
    el.remove();
  };

  const textarea = el.querySelector(".__wizzy-code-editor-textarea");

  textarea.addEventListener("keydown", (e) => {
    e.stopPropagation();

    if (e.ctrlKey) {
      if (e.key === "s") {
        e.preventDefault();
        const saveBtn = el.querySelector(".__wizzy-code-editor-action-save");
        saveBtn.click();
      }
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const value = textarea.value;
      const newValue = value.substring(0, start) + "  " + value.substring(end);

      textarea.value = newValue;
      textarea.selectionStart = start + 2;
      textarea.selectionEnd = start + 2;
    }
  });

  const closeBtn = el.querySelector(".__wizzy-window-menu-action-close");

  closeBtn.addEventListener("click", () => {
    el.parentElement.style.display = "none";
  });
  
  const saveBtn = el.querySelector(".__wizzy-code-editor-action-save");

  saveBtn.addEventListener("click", () => {
    const localStorageTarget = "wizzy-css";
    
    const css = textarea.value;

    localStorage.setItem(localStorageTarget, css);

    const documentCss = document.querySelector("style#__wizzy-user-css");
    if (documentCss) {
      documentCss.innerHTML = css;
    } else {
      const style = document.createElement("style");
      style.id = "__wizzy-user-css";
      style.innerHTML = `
        ${css}
      `;
      document.head.appendChild(style);
    }
  });

  const actionsContainer = el.querySelector(".__wizzy-code-editor-footer");

  for (const button of buttons) {
    const btn = html`
      <button class="__wizzy-code-editor-action __wizzy-window-action">
        ${button.icon}
      </button>
    `;

    btn.addEventListener("click", button.onClick);

    actionsContainer.appendChild(btn);
  }

  return el;
}
