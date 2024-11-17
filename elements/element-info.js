import html from "../lib/html.js";
import { getMaterialIconFor } from "../util/element-utils.js";

export default function elementInfo({ targetElement }) {
  const target = targetElement;
  const materialIconName = getMaterialIconFor(target.tagName);

  const el = html`
    <div class="__wizzy-element-info">
      <style>
        @scope (.__wizzy-element-info) {
          :scope {
            & {
              position: fixed;
              display: flex;
              flex-direction: row;
              font-size: 12px;
              color: #333;
              background: white;
              text-wrap: nowrap;
              text-justify: left;
              text-align: center;
              overflow: ellipsis;
              margin: 0;
              padding: 0.25rem;
              height: fit-content;
              font-family: monospace;
              align-items: center;
              justify-content: center;
              font-family: monospace;
              user-select: none;
              gap: 0.25rem;
              box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.5);
              z-index: 1000000002;
            }

            .material-icons {
              font-size: 16px;
              color: #333;
              margin: 0;
              padding: 0;
              width: 24px;
            }

            .__wizzy-element-info-tag {
              margin: 0;
              padding: 0;
            }

            .__wizzy-element-info-edit {
              transition: all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
              
              * {
                transition: all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
              }

              align-items: center;
              text-align: center;

              display: flex;
              flex-direction: row;
              padding: 0;
              margin: 0;

              .__wizzy-element-info-edit-expand {
                font-size: 16px;
                color: #333;
                font-family: "Material Icons";
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                border: none;
                background: transparent;
                cursor: pointer;
              }

              p[contenteditable] {
                min-width: 32px;
                border-bottom: 1px solid #333;
                text-justify: left;
                margin: 0;
                padding: 0;

                font-size: 12px;
                font-family: monospace;

                /* fit the text */
                white-space: nowrap;
                overflow: hidden;
                
                &:focus {
                  outline: none;
                }
              }
              
              &[collapsed] {
                & > :not(.__wizzy-element-info-edit-expand) {
                  width: 0;
                  max-width: 0;
                  min-width: 0;
                  opacity: 0;
                  overflow: hidden;
                }
              }
            }
          }
        }
      </style>
      <span class="material-icons __wizzy-element-icon">${materialIconName}</span>
      <p class="__wizzy-element-info-tag">&lt;${target.tagName.toLowerCase()}&gt;</p>
      <div class="__wizzy-element-info-edit" collapsed>
        
        <span class="material-icons">edit_attributes</span>
        <p class="__wizzy-element-info-attributes" contenteditable spellcheck="false"></p>
        <span class="material-icons">info</span>
        <p class="__wizzy-element-info-class" contenteditable>${target.className}</p>
        <span class="material-icons">style</span>
        <p class="__wizzy-element-info-style" contenteditable>${target.style.cssText}</p>
        <button class="material-icons __wizzy-element-info-edit-expand">chevron_right</button>
      </div>
    </div>
  `;

  const expandButton = el.querySelector(".__wizzy-element-info-edit-expand");
  const editContainer = el.querySelector(".__wizzy-element-info-edit");

  expandButton.addEventListener("click", () => {
    collapse();
  });

  const collapse = () => {
    if (editContainer.hasAttribute("collapsed")) {

      el.querySelector(".__wizzy-element-info-attributes").textContent = getAttributesString();
      el.querySelector(".__wizzy-element-info-class").textContent = getClassString();
      el.querySelector(".__wizzy-element-info-style").textContent = getStyleString();

      editContainer.removeAttribute("collapsed");
      expandButton.textContent = "chevron_right";
    } else {
      editContainer.setAttribute("collapsed", "");
      expandButton.textContent = "chevron_left";
    }
  }

  const inputAttributes = el.querySelector(".__wizzy-element-info-attributes");
  const inputClass = el.querySelector(".__wizzy-element-info-class");
  const inputStyle = el.querySelector(".__wizzy-element-info-style");

  const defaultKeyDownHandler = (e) => {
    e.stopPropagation();

    // remove the selection if the user presses escape
    if (e.key === "Escape") {
      const referent = el.refersTo;
      referent.removeAttribute("__wizzy-selected");
      el.remove();

      referent.infoElement = null;
    }
  }

  const onSavedFieldAnimation = (targetElement) => {
    /* 
     * rapidly blink the field to indicate that the value has been saved 
     * the rapid blinking should slow down and eventually stop after a few seconds
     */
    const start = Date.now();
    const duration = 2000;

    function blink() {
      const now = Date.now();
      const dt = now - start;
      const sin = Math.sin(dt / 100) * 0.5 + 0.5;

      const shouldBeVisible = () => sin > 0.5;

      if (shouldBeVisible()) {
        targetElement.style.visibility = "visible";
      } else {
        targetElement.style.visibility = "hidden";
      }

      if (dt < duration) {
        requestAnimationFrame(blink);
      } else {
        targetElement.style.visibility = "visible";
      }
    }

    blink();
  }

  const defaultValueChangedHandler = (e) => {
    e.stopPropagation();
    el.correctPosition();
  }

  const onEnterAttributes = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const oldAttributes = target.attributes;
      const attributes = inputAttributes.textContent.split(" ").map((attr) => {
        const [name, value] = attr.split("=");
        return { name, value };
      });

      for (const oldAttribute of oldAttributes) {
        if (!attributes.find((attr) => attr.name === oldAttribute.name)) {
          if (oldAttribute.name === "__wizzy-selected") {
            continue;
          }

          target.removeAttribute(oldAttribute.name);
        }
      }

      for (const attribute of attributes) {
        if (attribute.name === "__wizzy-selected") {
          continue;
        }

        target.setAttribute(attribute.name, attribute.value || "");
      }

      onSavedFieldAnimation(inputAttributes);
    }

    
  }

  const onEnterClass = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      target.className = inputClass.textContent;

      onSavedFieldAnimation(inputClass);
    }
  }

  const onEnterStyle = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      target.style.cssText = inputStyle.textContent;

      onSavedFieldAnimation(inputStyle);
    }
  }

  inputAttributes.addEventListener("keydown", defaultKeyDownHandler);
  inputAttributes.addEventListener("keydown", onEnterAttributes);
  inputAttributes.addEventListener("change", defaultValueChangedHandler);

  inputClass.addEventListener("keydown", defaultKeyDownHandler);
  inputClass.addEventListener("keydown", onEnterClass);
  inputClass.addEventListener("change", defaultValueChangedHandler);
  
  inputStyle.addEventListener("keydown", defaultKeyDownHandler);
  inputStyle.addEventListener("keydown", onEnterStyle);
  inputStyle.addEventListener("change", defaultValueChangedHandler);


  const getAttributesString = () => {
    const attrs = target.attributes;
    let str = "";

    for (const attr of attrs) {
      if (attr.name.startsWith("__wizzy")) {
        continue;
      }

      str += `${attr.name}="${attr.value}" `;
    }

    return str;
  }

  const getClassString = () => {
    return target.className;
  }

  const getStyleString = () => {
    return target.style.cssText;
  }

  if (el.hasAttribute("id")) {
    const idTag = html`<p class="__wizzy-element-info-id">${el.id}</p>`;
    el.appendChild(idTag);
  }

  el.setPosition = (x, y) => {
    el.style.top = `${y}px`;
    el.style.left = `${x}px`;
  }

  el.correctPosition = () => {
    // Make sure the element is always visible on the screen,
    // But also not covering the target element.
    // It should anchor to one of the corners of the target element,
    // in the following order of preference:
    // 1. Bottom left
    // 2. Top left
    // 3. Bottom right
    // 4. Top right

    const targetRect = target.getBoundingClientRect();
    
    const corners = [
      // bottom left
      { x: targetRect.left, y: targetRect.bottom },
      // top left
      { x: targetRect.left, y: targetRect.top },
      // bottom right
      { x: targetRect.right, y: targetRect.bottom },
      // top right
      { x: targetRect.right, y: targetRect.top }
    ];

    /**
     * Tries to place the element at the given x, y position.
     * Call it again if the position is not suitable, but at a different corner.
     * @param {number} x 
     * @param {number} y 
     * @returns {[number, number] | null} the corrected x, y position.
     */
    const tryPlace = (x, y) => {
      // first, place it to actually know where it will be.
      el.setPosition(x, y);

      const rect = el.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (rect.right > viewportWidth) {
        // not enough space on the right side
        return null;
      }

      if (rect.bottom > viewportHeight) {
        // not enough space on the bottom
        return null;
      }

      return [x, y];
    }

    let [x, y] = tryPlace(corners[0].x, corners[0].y);

    for (const corner of corners) {
      const res = tryPlace(corner.x, corner.y);

      if (res) {
        [x, y] = res;
        break;
      }
    }

    el.setPosition(x, y);

    // if, after all that, the element is still partially off-screen,
    // let's just call it a day by snapping it to be within the viewport as much as possible.
    const rect = el.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (rect.right > viewportWidth) {
      el.style.left = `${viewportWidth - rect.width}px`;
    }

    if (rect.bottom > viewportHeight) {
      el.style.top = `${viewportHeight - rect.height}px`;
    }

    if (rect.left < 0) {
      el.style.left = "0";
    }

    if (rect.top < 0) {
      el.style.top = "0";
    }

    return el; // 👍
  }

  targetElement.infoElement = el;
  Object.defineProperty(el, "refersTo", { value: target });

  return el;
}