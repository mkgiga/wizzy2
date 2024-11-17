import html from "../lib/html.js";

/**
 * Holds items that can be triggered with a keyboard shortcut.
 * Each item should be a HTML element with a callable 'action' method.
 * @param {Object} options
 * @param {Array} options.slots - Array of hotbar slots
 * @returns {HTMLElement} - The hotbar element
 */
export function hotbar({ slots = [] }) {}

/**
 * Holds a single item that can be triggered with a keyboard shortcut.
 * @param {Object} options
 * @param {Object} options.command - The command to be executed
 * @param {String} options.key - The keyboard shortcut to trigger the command
 * @returns {HTMLElement} - The hotbar slot element
 */
export function hotbarSlot({ command, key = "" }) {
  const el = html`
    <div class="__wizzy-hotbar-slot" key="${key}">
      <style>
        @scope (.__wizzy-hotbar-slot) {
          :scope {
            & {
              position: relative;
              display: flex;
              flex-direction: column;
              width: 100%;
              height: 100%;
              background: white;
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              z-index: 100000006;
              box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.25);
            }

            .__wizzy-command {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
              padding: 0.5rem;
              box-sizing: border-box;
              background: #f1f1f1;
              color: black;
              font-family: sans-serif;
              font-size: 1rem;
              cursor: pointer;
              transition: all 0.1s cubic-bezier(0.25, 0.1, 0.25, 1);
            }
          }
        }
      </style>
    </div>
  `;
}

/**
 * Creates a command element. This element will not have any styling by default,
 * and it is up to the container to style it.
 * All properties are placed as attributes on the container element,
 * so each child element's textContent can be (optionally) set using ::before/::after on
 * any of the child elements, should the host want to do so.
 *
 * @param {Object} options
 * @param {String} options.name - The name of the command
 * @param {String} options.icon - The icon of the command
 * @param {String} options.description - The description of the command
 * @param {String} options.brief - The brief description of the command
 * @param {Function} options.action - The action to be executed when the command is triggered
 * @returns {HTMLElement} - The command element
 */
export function command({
  name = "",
  icon = "",
  description = "",
  brief = "",
  action = () => {},
}) {
  const el = html`
    <span
      class="__wizzy-command"
      name="${name}"
      description="${description}"
      brief="${brief}"
      action="${action}"
    >
      <span class="__wizzy-command-icon material-icons"></span>
      <span class="__wizzy-command-name"></span>
      <span class="__wizzy-command-brief"></span>
      <span class="__wizzy-command-description"></span>
    </span>
  `;
}

/**
 * A VSCode-like command search menu that appears and expands when your press a keyboard shortcut.
 * @param {Object} options
 * @param {Array} options.commands - The commands to be displayed in the search menu
 * @returns {HTMLElement} - The command search menu element
 */
export function commandSearchMenu({ commands = [] }) {
  const el = html`
    <div class="__wizzy-command-search-menu">
      <style>
        @scope (.__wizzy-command-search-menu) {
          :scope {
            & {
              position: fixed;
              display: flex;
              flex-direction: column;
              width: 100%;
              height: 100%;
              background: white;
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              z-index: 100000006;
            }
            .__wizzy-command-search-menu-header {
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              width: 100%;
              padding: 0.5rem;
              box-sizing: border-box;
            }

            .__wizzy-command-search-menu-input {
              width: 100%;
              padding: 0.5rem;
              box-sizing: border-box;
              font-size: 1rem;
              font-family: sans-serif;
              border: 1px solid #ccc;
              border-radius: 4px;
              background: white;
              color: black;
            }

            .__wizzy-command-search-menu-results {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: center;
              width: 100%;
              padding: 1rem;
              box-sizing: border-box;
            }
          }
        }
      </style>
      <div class="__wizzy-command-search-menu-header">
        <input
          type="text"
          class="__wizzy-command-search-menu-input"
          placeholder="Search for a command by name or description"
        />
      </div>

      <div class="__wizzy-command-search-menu-results"></div>
    </div>
  `;
}
