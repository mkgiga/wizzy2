import html from "../lib/html.js";

export function editorDomPath({ element }) {

  const el = html`
    <span class="__wizzy-dompath">
      <style>
        @scope (.__wizzy-dompath) {
          :scope {
            & {
              display: inline-block;
              font-size: 12px;
              color: #333;
              background: #f1f1f1;
              text-wrap: nowrap;
              text-justify: right;
              text-align: center;
              overflow: ellipsis;
              margin: 0;
              padding: 0;
              height: 16px;
              font-family: monospace;
              align-items: center;
              justify-content: center;
            }

            & .material-icons {
              font-size: 16px;
              color: #333;
              margin: 0;
              padding: 0;
            }
          }
        }
      </style>
    </span>`;
  const arrow = `<span class="material-icons">keyboard_arrow_right</span>`;

  const path = getDOMPath(element);

  for (const part of path) {
    el.innerHTML += `<p>${part}</p> ${arrow} `;
  }

  el.innerHTML += `<p>${element.tagName}</p>`;
  el.style.display = "flex";
  el.style.flexDirection = "row";
  el.style.justifyContent = "center";
  el.style.alignItems = "center"
  el.style.height = "24px";
  return el;
}

function getDOMPath(element) {
  let path = [];

  while (element.parentNode) {
    const index = Array.from(element.parentNode.children).indexOf(element);
    path.unshift(`${element.tagName}[${index}]`);
    element = element.parentNode;
  }

  return path;
}

export default editorDomPath;