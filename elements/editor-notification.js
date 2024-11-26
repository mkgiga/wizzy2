import html from "../lib/html.js";

/**
 * Create a new editor notification.
 * @param {Object} options
 * @param {string} options.title - The title of the notification.
 * @param {string} options.text - The text of the notification.
 * @param {Array<string>} options.tags - The tags of the notification.
 * @param {"good"|"bad"|"info"|"warning"} options.type - The type of the notification.
 * @returns {HTMLElement} The editor notification element.
 */
export default function editorNotification({
  title = "",
  text = "",
  tags = [],
  type = "info",
}) {
  let typeMaterialIcon = "";

  switch (type) {
    case "good":
      typeMaterialIcon = "check_circle";
      break;
    case "bad":
      typeMaterialIcon = "cancel";
      break;
    case "info":
      typeMaterialIcon = "info";
      break;
    case "warning":
      typeMaterialIcon = "warning";
      break;
    default:
      typeMaterialIcon = "info";
      break;
  }

  const el = html`
    <div class="__wizzy-notification">
      <span class="__wizzy-notification-top-bar">
        <h3 class="__wizzy-notification-title">${title}</h3>
        <div class="__wizzy-notification-actions">
          <span class="__wizzy-copy-button material-icons">content_copy</span>
          <span class="__wizzy-close-button material-icons">close</span>
        </div>
      </span>

      <p class="__wizzy-notification-text">${text}</p>

      <span class="__wizzy-notification-type-icon material-icons">
        ${typeMaterialIcon}
      </span>
    </div>
  `;

  el.classList.add(`__wizzy-notification-${type}`);

  el.tmr = null;

  el.querySelector(".__wizzy-close-button").addEventListener("click", () => {
    el.remove();
  });

  return el;
}
