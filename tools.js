/**
 * @file tools.js
 * @description Contains all the tools that can be selected and used by the user.
 */

import { tool } from "./elements/toolbar.js";
import html from "./lib/html.js";
import { getMaterialIconFor } from "./util/element-utils.js";

export default function ({ editor }) {
  const res = [
    tool({
      toolId: "div",
      icon: getMaterialIconFor("div"),
      title: "Div",
      onSelect: function (e) {
        console.log(editor);
      },

      onUse: (e, target) => {
        const el = html` <div>Hello, World!</div> `;

        target.appendChild(el);
      },
    }),

    tool({
      toolId: "p",
      icon: getMaterialIconFor("p"),
      title: "Paragraph",
      onSelect: function (e) {
        console.log("Paragraph selected");
        console.log(editor);
      },
      onUse: function (e, target) {
        const mouse = editor.state.mouse;
        const x = mouse.x;
        const y = mouse.y;

        console.log(x, y);

        const el = html` <p>Hello, World!</p> `;

        target.appendChild(el);
      },
    }),
  ];


  res.forEach((tool) => {
    
    tool.onUse = tool.onUse.bind({ editor });
    tool.onSelect = tool.onSelect.bind({ editor });
  });

  return res;
}
