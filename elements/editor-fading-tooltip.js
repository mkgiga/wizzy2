import html from "../lib/html.js";
export default function fadingTooltip({
  text,
  x,
  y,
}) {
  const tooltip = html`
    <div 
      class="__wizzy-fading-tooltip"
      style="
        display: block;
        top: ${y}px; 
        left: ${x}px; 
        user-select: none; 
        pointer-events: none;
        overflow: hidden;
        position: fixed;
        z-index: 1000000000;
        background: #f1f1f1;
        color: black;
        padding: 0.25rem;
        border: 1px solid #333;
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        visibility: hidden;
      ">
      <p>${text}</p>
    </div>
  `;

  const wizzyEditorContainer = document.querySelector("[__wizzy-editor]");
  wizzyEditorContainer.appendChild(tooltip);

  const bounds = tooltip.getBoundingClientRect();
  const editorBounds = wizzyEditorContainer.getBoundingClientRect();

  function snapToViewport() {
    if (bounds.right > editorBounds.right) {
      tooltip.style.left = `${x - bounds.width}px`;
    }

    if (bounds.bottom > editorBounds.bottom) {
      tooltip.style.top = `${y - bounds.height}px`;
    }

    if (bounds.left < editorBounds.left) {
      tooltip.style.left = `${x}px`;
    }

    if (bounds.top < editorBounds.top) {
      tooltip.style.top = `${y}px`;
    }
  }

  snapToViewport();

  tooltip.style.opacity = 1;
  tooltip.style.visibility = "visible";
  tooltip.animate([
    { transform: "translateY(0)", opacity: 1 },
    { transform: "translateY(-2rem)", opacity: 0 },
  ], {
    duration: 2000,
    easing: "linear",
  }).onfinish = () => {
    tooltip.remove();
  };
}