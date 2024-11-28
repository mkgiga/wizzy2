import html from "../lib/html.js";
import randomUUID from "../util/randomUUID.js";

export default function codeEditor({
  text = "",
  settings = {},
  listeners = {
  },
  cssOverrides = {
    "textarea": "font-family: monospace; font-size: 1rem; width: 100%; height: 100%; padding: 1rem; box-sizing: border-box; border: none; outline: none;",
  },
  menuButtons = [],
}) {
  const id = randomUUID();
  const el = html`
    <div class="__wizzy-code-editor" id="__wizzy-code-editor-${id}">
      <textarea class="__wizzy-code-editor-textarea" style="${cssOverrides.textarea}">${text}</textarea>
      <style>
        @scope (#__wizzy-code-editor-${id}) {
          :scope {
            ${(() => {
              let res = "\n\n";

              for (let [selector, value] of Object.entries(settings)) {
                const arr = value.split(";").map((v) => v.replace(";", " !important;"));
                value = arr.join(";");
                res += `${selector} { ${value} }\n`;
              }

              return res;
            })()
          }
        }
      </style>
    </div>
  `;

  const textarea = el.querySelector("textarea");

  for (const [event, handler] of Object.entries(listeners)) {
    textarea.addEventListener(event.replace(/^on/, "").toLowerCase(), handler);
  }

  return el;
}