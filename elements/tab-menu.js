import html from "../lib/html.js"

export function tabMenu({ editor }) {
  const el = html`
    <div class="__wizzy-tab-menu">
      <style>
        @scope (.__wizzy-tab-menu) {
          :scope {
            & {
              position: fixed;
              display: grid;
              grid-template-rows: 50px 1fr 64px;
              top: 0;
              left: 0;
              width: 50vw;
              height: 100vh;
              z-index: 100000001;

              transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
              
              background: rgba(0, 0, 0, 0.8);
              color: white;
            }
          }
        }
      </style>
      <div class="__wizzy-tab-menu-header">
        <h4>wizzy</h4>
        <div class="__wizzy-tab-menu-header-actions">
          <button class="material-icons" id="__wizzy-tab-btn-close">close</button>
          <button class="material-icons" id="__wizzy-tab-btn-settings">settings</button>
        </div>
      </div>
      <div class="__wizzy-tab-menu-content">

      </div>
      <div class="__wizzy-tab-menu-footer">
        
      </div>
    </div>
  `;
}

export default tabMenu;