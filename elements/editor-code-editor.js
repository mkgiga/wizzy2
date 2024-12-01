import html from "../lib/html.js";
import randomUUID from "../util/randomUUID.js";

export default function codeEditor({
  text = "",
  settings = {
    "input": {
      "tabSize": 2,
    }
  },
  listeners = {
  },
  cssOverrides = {
    "textarea": "font-family: monospace; font-size: 1rem; width: 100%; height: 100%; padding: 1rem; box-sizing: border-box; border: none; outline: none;",
  },
  attr = {},
  menuButtons = [],
}) {
  const id = randomUUID();
  const el = html`
    <div class="__wizzy-code-editor" id="__wizzy-code-editor-${id}">
      <textarea
        class="__wizzy-code-editor-textarea"
        style="${cssOverrides.textarea}"
        autocomplete="off"
        spellcheck="false"
        lang="html"
      >
${text}</textarea
      >
      <style>
        @scope (#__wizzy-code-editor-${id}) {
          :scope {
            ${(() => {
          let res = "\n\n";

          for (let [selector, value] of Object.entries(cssOverrides)) {
            const arr = value
              .split(";")
              .map((v) => v.replace(";", " !important;"));
            value = arr.join(";");
            res += `${selector} { ${value} }\n`;
          }

          return res;
        })()}
        }
      </style>
    </div>
  `;

  const mirror = {
    value: text,

    x: 0, // column (current char on line)
    y: 0, // row (current line)

    setValue: (value) => {
      el.querySelector("textarea").value = value;
      mirror.value = value;
    },

    getValue: () => {
      return el.querySelector("textarea").value;
    },

    setCursor: (x, y) => {
      el.querySelector("textarea").selectionStart = x;
      el.querySelector("textarea").selectionEnd = x;
    }
  };

  el.mirror = mirror;

  for (const [prop, value] of Object.entries(attr)) {
    el.setAttribute(prop, value);
  }

  const textarea = el.querySelector("textarea");

  for (const [event, handler] of Object.entries(listeners)) {
    textarea.addEventListener(event.replace(/^on/, "").toLowerCase(), handler);
  }

  textarea.addEventListener("input", (e) => {
    mirror.setValue(textarea.value);
  });

  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      textarea.value =
        textarea.value.substring(0, start) +
        "  " +
        textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd =
        start + parseInt(settings.input.tabSize);

      textarea.dispatchEvent(new Event("input"));
    }

    if (e.key === "Enter") {
      
    }
  });

  return el;
}

function iToPos(text = "", i = 0) {
  const lines = text.split("\n");
  let x = 0;
  let y = 0;

  for (let j = 0; j < lines.length; j++) {
    if (i < lines[j].length) {
      x = i;
      y = j;
      break;
    }

    i -= lines[j].length + 1;
  }

  return { x, y };
}