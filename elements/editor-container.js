import html from "../lib/html.js";

export function editorContainer() {
  const el = html`
    <div __wizzy-editor style="pointer-events: none; user-select: none; visibility: hidden;">
      <style>
        @scope ([__wizzy-editor]) {
          :scope {
            & {
              position: fixed;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              background: transparent;
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              z-index: 100000000;
            }

            * {
              visibility: visible;
              pointer-events: all;
            }
          }
        }
      </style>
    </div>
  `;

  function watch() {
    if (!el.parentElement) {
      return;
    }

    if (el.parentElement !== document.body) {
      document.body.appendChild(el);
    } else {  
      if (el.nextSibling) {
        document.body.appendChild(el);
      }
    }
    
    requestAnimationFrame(watch);
  }

  Object.defineProperty(el, "watch", {
    value: watch
  });

  return el;
}

export default editorContainer;