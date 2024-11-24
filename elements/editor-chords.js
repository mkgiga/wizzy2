import html from "../lib/html.js";

/**
 * Create a new chord container
 * @param {Object} options
 * @returns {HTMLElement}
 */
function createChordBranchContainer(options = {}) {
  const el = html`
    <div class="__wizzy-chord-branch-container">
      <div class="__wizzy-chord-branch-header">
        <h4>${options.text || ""}</h4>
      </div>
      <div class="__wizzy-chord-branch-options"></div>

      <style></style>
    </div>
  `;

  el.options = options;

  const optionsContainer = el.querySelector(".__wizzy-chord-branch-options");

  for (const [key, value] of Object.entries(options)) {
    const option = createChordOption(options, key);
    optionsContainer.appendChild(option);
  }

  return el;
}

/**
 * Visual link between two chord menus (its predecessor and its successor)
 * @todo: Implement the visual link between two chord menus using anchor-position/anchor-name
 * @param {HTMLElement} from
 * @param {HTMLElement | null} to
 * @returns
 */
function createBranchLink(from, to) {
  const el = html`
    <div class="__wizzy-chord-branch-link">
      <span class="material-icons">arrow_right</span>
    </div>
  `;

  el.link = { from, to };

  return el;
}

/**
 * Create a new chord option
 * @param {Object} parent
 * @param {string} key
 * @returns {HTMLElement}
 */
function createChordOption(parent = {}, key) {
  const text = `<span>${key}. ${parent[key].text || ""}</span>`;
  return html` <div class="__wizzy-chord-option">${text}</div> `;
}

/**
 * Add a new chord to the current chord container
 * @param {{options: Object}} options
 * @returns {HTMLElement} The new chord container that was added
 */
export function addChord({ options = {} }) {
  const containerTarget = document.querySelector(".__wizzy-current-chords");
  const container = chordContainer({ options });
  containerTarget.appendChild(container);

  return container;
}

/**
 * Meant to be the top-level container for the chord menus
 * @param {{options: Object}} options
 * @returns {HTMLElement}
 */
export function chordContainer({ options = {} }) {
  const el = html`
    <div class="__wizzy-current-chords" hidden>
      <div class="__wizzy-current-chords-header">
        <span class="__wizzy-current-chords-title"></span>
      </div>
      <div class="__wizzy-current-chords-branches"></div>
      <style>
        @scope (.__wizzy-current-chords) {
          :scope {
            .__wizzy-current-chords-header {
              padding: 0.5rem;
              background: #f1f1f1;
              color: #333;
            }

            .__wizzy-current-chords-branches {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              padding: 0.5rem;
              background: #f1f1f1;
              border-bottom: 1px solid #ccc;
            }
          }
        }
      </style>
    </div>
  `;

  el.addChord = (options = {}) => {
    const branchContainer = createChordBranchContainer(options);
    const branches = el.querySelector(".__wizzy-current-chords-branches");
    branches.appendChild(branchContainer);
  };

  el.options = options;

  for (const [key, value] of Object.entries(options)) {
    const option = createChordOption(options, key);
    el.appendChild(option);
  }

  return el;
}
