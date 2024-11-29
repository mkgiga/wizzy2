import html from "../lib/html.js";

export default function resizeHandle({ container, direction = "row", onResize = () => {} }) {

  const handle = html`
    <div class="__wizzy-resize-handle">
      <style>
        @scope (.__wizzy-resize-handle) {
          
          :scope {
            flex: 0 0 auto;
            & {
              position: relative;
              margin: 0;
              padding: 0;
            }

            &[direction="row"] {
              cursor: ew-resize;
              width: 4px;
              height: 100%;
              min-height: 100%;
              position: absolute;
              top: 0;

              border-right: 1px solid #ccc;
              border-left: 1px solid #ccc;
            }
            &[direction="column"] {
              cursor: ns-resize;
              height: 4px;
              width: 100%;

              left: 0;

              border-top: 1px solid #ccc;
              border-bottom: 1px solid #ccc;
            }
          }
        }
      </style>
    </div>
  `;

  handle.setAttribute("direction", direction);

  let isResizing = false;
  let lastX = 0;
  let lastY = 0;

  const onMouseDown = (e) => {
    e.preventDefault();
    isResizing = true;
    lastX = e.clientX;
    lastY = e.clientY;
  
    // Capture the siblings
    const previousSibling = handle.previousElementSibling;
    const nextSibling = handle.nextElementSibling;
  
    
    const onMouseMove = (e) => {
      if (isResizing) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
  
        lastX = e.clientX;
        lastY = e.clientY;
  
        if (direction === "row") {
          const prevWidth = parseFloat(window.getComputedStyle(previousSibling).width);
          const nextWidth = parseFloat(window.getComputedStyle(nextSibling).width);
  
          previousSibling.style.flexBasis = `${prevWidth + dx}px`;
          nextSibling.style.flexBasis = `${nextWidth - dx}px`;
        } else if (direction === "column") {
          const prevHeight = parseFloat(window.getComputedStyle(previousSibling).height);
          const nextHeight = parseFloat(window.getComputedStyle(nextSibling).height);
  
          previousSibling.style.flexBasis = `${prevHeight + dy}px`;
          nextSibling.style.flexBasis = `${nextHeight - dy}px`;
        }
  
        onResize({ dx, dy });
      }
    };

    

    const onMouseUp = (e) => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  
  handle.addEventListener("mousedown", onMouseDown);
  




  return handle;
}