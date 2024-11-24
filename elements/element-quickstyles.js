import html from "../lib/html.js";
export default function quickStyles({ element }) {
  const el = html`
    <div class="__wizzy-quickstyles">
      <style>
        @scope (.__wizzy-quickstyles) {
          :scope {
            & {
              display: flex;
              flex-direction: column;
              margin: 0;
              padding: 0;
              width: 400px;
              max-width: 100%;
              min-height: 24px;
            }

            [collapsed] {
              opacity: 0;
              height: 0;
              max-height: 0;
              overflow: hidden;
              pointer-events: none;

              * {
                pointer-events: none;
              }
            }

            .__wizzy-quickstyles-row {
              header {
                height: 24px;
                background: #f1f1f1;
                color: #333;
              }
            }
          }
        }
      </style>

      <div class="__wizzy-quickstyles-header">
        <span class="material-icons">search</span>
        <span class="material-icons">style</span>
        <h4>Quick Styles</h4>
        <button class="material-icons __wizzy-quickstyles-expand">
          chevron_up
        </button>
      </div>

      <div class="__wizzy-quickstyles-content" collapsed>
        <div class="__wizzy-quickstyles-row __wizzy-quickstyles-alignments">
          <header>
            <span class="material-icons">format_align_left</span>
            <h5>Alignments</h5>

            <button class="material-icons __wizzy-quickstyles-row-expand">
              chevron_up
            </button>
          </header>

          <div
            class="__wizzy-quickstyles-row-content __wizzy-quickstyles-alignments-content"
            collapsed
          ></div>
        </div>

        <div class="__wizzy-quickstyles-row __wizzy-quickstyles-dimensions">
          <header>
            <span class="material-icons">aspect_ratio</span>
            <h5>Dimensions</h5>
          </header>

          <div
            class="__wizzy-quickstyles-row-content __wizzy-quickstyles-dimensions-content"
            collapsed
          ></div>
        </div>

        <div class="__wizzy-quickstyles-row __wizzy-quickstyles-spacing">
          <header>
            <span class="material-icons">space_bar</span>
            <h5>Spacing</h5>
          </header>

          <div
            class="__wizzy-quickstyles-row-content __wizzy-quickstyles-spacing-content"
            collapsed
          ></div>
        </div>

        <div class="__wizzy-quickstyles-row __wizzy-quickstyles-typography">
          <header>
            <span class="material-icons">text_fields</span>
            <h5>Typography</h5>
          </header>

          <div
            class="__wizzy-quickstyles-row-content __wizzy-quickstyles-typography-content"
            collapsed
          ></div>
        </div>

        <div class="__wizzy-quickstyles-row __wizzy-quickstyles-border">
          <header>
            <span class="material-icons">border_outer</span>
            <h5>Border</h5>
          </header>

          <div
            class="__wizzy-quickstyles-row-content __wizzy-quickstyles-border-content"
            collapsed
          ></div>
        </div>
      </div>
    </div>
  `;

  const btnExpand = el.querySelector(".__wizzy-quickstyles-expand");
  const contentContainer = el.querySelector(".__wizzy-quickstyles-content");
  btnExpand.addEventListener("click", () => {
    if (contentContainer.hasAttribute("collapsed")) {
      contentContainer.removeAttribute("collapsed");
    } else {
      contentContainer.setAttribute("collapsed", "");
    }
  });
}
