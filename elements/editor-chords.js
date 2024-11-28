import html from "../lib/html.js";
import randomUUID from "../util/randomUUID.js";

/**
 * Meant to be the top-level container for the chord menus
 * @param {{options: Object}} options
 * @returns {HTMLElement}
 */
export function chordContainer({ options = {} }) {
  const el = html` <div id="__wizzy-current-chords"></div> `;

  return el;
}

/**
 * Create a new chord container
 * @param {Object} options
 * @returns {HTMLElement}
 */
function createChordBranchContainer(options = {}) {
  const uuid = randomUUID();

  const el = html`
    <div class="__wizzy-chord-branch-container" id="${uuid}">
      <div class="__wizzy-chord-branch-header">
        <h4>${options.text || ""}</h4>
      </div>
      <div class="__wizzy-chord-branch-options"></div>

      <style>
        @scope (.__wizzy-chord-branch-container) {
          :scope {
            & {
              display: flex;
              flex-direction: column;
              margin: 0;
              padding: 0.5rem;
              min-width: 200px;
              max-width: 100%;
              min-height: 24px;
              background: #f1f1f1;
              border: none;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 0.25rem;
              transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }

            &:not(:has(.__wizzy-chord-option)) {
              display: none;
            }

            .__wizzy-chord-branch-header {
              padding: 0.5rem;
              color: #333;
            }

            .__wizzy-chord-branch-options {
              display: flex;
              flex-direction: column;
              padding: 0.5rem;
              background: #f1f1f1;
              border-bottom: 1px solid #ccc;
            }
          }
        }
      </style>
    </div>
  `;

  el.options = options;

  const optionsContainer = el.querySelector(".__wizzy-chord-branch-options");

  for (const [key, value] of Object.entries(options)) {
    const id = `${randomUUID()}`;

    switch (key) {
      case "text":
      case "key":
        continue;
    }

    const option = html`
      <div
        class="__wizzy-chord-option"
        id="${id}"
        style="anchor-name: --${key}-${id}; width: 100%;"
      >
        <span class="__wizzy-chord-option-text">
          ${options[key].text || ""}
        </span>
        <kbd>${key}</kbd>
      </div>
    `;

    optionsContainer.appendChild(option);
  }

  return el;
}

/**
 * Visual link between two chord menus (its predecessor and its successor)
 * @todo: Implement the visual link between two chord menus using anchor-position/anchor-name
 * @param {HTMLElement} from The predecessor chord menu's option element of the key that is being linked
 * @param {HTMLElement | null} to The successor chord menu container element that is being linked
 * @param {string} key The key which was pressed to trigger the chord menu
 * @returns {HTMLElement} The visual link element
 */
function createBranchLink(from, to, key) {
  const uuid = randomUUID();

  const el = html`
    <div class="__wizzy-chord-branch-link" id="${uuid}">
      <style>
        @scope (.__wizzy-chord-branch-link[id="${uuid}"]) {
          :scope {
            & {
              anchor-name: --line-${uuid};
              top: anchor(${key}-${from.id} center);
              bottom: anchor(--${key}-${to.id} center);
              left: anchor(${key}-${from.id} center);
              right: anchor(--${key}-${to.id} center);
              position: absolute;
              z-index: -1;
              background: linear-gradient(#2d2d2d, #2d2d2d) no-repeat center/2px
                100%;
            }
            &::before,
            &::after {
              position: fixed;
              display: block;
              content: "";
              background: #2d2d2d;
              height: 2px;
            }

            &::before {
              bottom: anchor(${key}-${from.id} center);
              left: anchor(${key}-${from.id} right);
              right: anchor(--line-${uuid} center);
            }

            &::after {
              bottom: anchor(--${key}-${to.id} center);
              right: anchor(--${key}-${to.id} left);
              left: anchor(--line-${uuid} center);
            }
          }
        }
      </style>
    </div>
  `;

  return el;
}

/**
 * Add a new chord to the current chord container
 * @param {{options: Object}} options
 * @returns {HTMLElement} The new chord container that was added
 */
export function addChord({ options = {}, key }) {
  const containerTarget = document.querySelector("#__wizzy-current-chords");
  const branch = createChordBranchContainer(options);
  containerTarget.appendChild(branch);

  if (containerTarget.children.length > 1) {
    const from = containerTarget.children[containerTarget.children.length - 2];
    const to = containerTarget.children[containerTarget.children.length - 1];

    const link = createBranchLink(from, to, key || Object.keys(options)[0]);
    containerTarget.appendChild(link);
  }

  return branch;
}

export function removeChords(n = 1) {
  const allChords = document.getElementById("__wizzy-current-chords").children;

  const chords = [];
  let i = allChords.length - 1;

  // delete only the last n recent chords
  while (i >= 0 && n > 0) {
    const el = allChords[i];

    // only remove elements that are chord containers.
    if (
      el instanceof HTMLElement &&
      el.classList.contains("__wizzy-chord-branch-container")
    ) {
      chords.push(el);
      el.remove();
      n--;
    }

    i--;
  }

  if (n > 0) {
    console.warn(`Only ${chords.length} chords were removed.`);
  }
}

export function removeLastChord() {
  removeChords(1);
}

export function removeAllChords() {
  document.getElementById("__wizzy-current-chords").innerHTML = "";
}

export default {
  addChord,
  removeChords,
  removeLastChord,
  removeAllChords,
  chordContainer,
};
