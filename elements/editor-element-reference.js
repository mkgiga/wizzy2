import html from "../lib/html.js";

import { getMaterialIcon } from "../util/element-utils.js";

export default function elementReference({ editor, element = document.body }) {
  const el = html`
    <p class="__wizzy-element-reference">
      <style>
        @scope (.__wizzy-element-reference) {
          :scope {
            & {
              font-family: monospace;
              display: inline-flex;
              flex-direction: row;
              text-decoration: underline;
            }
          }
        }
      </style>
      <span class="material-icons">${getMaterialIcon(element)}</span>
      <span>&lt;${element.tagName.toLowerCase()}&gt;</span>
    </p>
  `;

  el.references = [element];

  el.addEventListener("click", (e) => {
    function calculateAverageRectPosition(...elements) {
      const rects = [];

      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        rects.push(rect);
      }

      if (rects.length === 0) {
        return { top: 0, left: 0, bottom: 0, right: 0 };
      }

      let top = 0;
      let left = 0;
      let bottom = 0;
      let right = 0;

      for (const rect of rects) {
        top += rect.top;
        left += rect.left;
        bottom += rect.bottom;
        right += rect.right;
      }

      top /= rects.length;
      left /= rects.length;
      bottom /= rects.length;
      right /= rects.length;

      return { top, left, bottom, right };
    }

    function calculateMiddlepoint(...elements) {
      const rect = calculateAverageRectPosition(...elements);
      const middlepoint = {
        x: (rect.left + rect.right) / 2,
        y: (rect.top + rect.bottom) / 2,
      };

      return middlepoint;
    }

    const middlepoint = calculateMiddlepoint(...el.references);

    editor.sel.empty().add(...el.references);

    window.scrollTo(middlepoint.x, middlepoint.y);
  });

  return el;
}
