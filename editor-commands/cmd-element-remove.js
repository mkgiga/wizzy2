import { EditorCommand } from "../editor-commands.js";
import randomUUID from "../util/randomUUID.js";

export default class CmdRemoveElement extends EditorCommand {
  // WARNING: If the previous parent is removed, we will have to either reinsert it into the body,
  // or assign the grandparent as the new parent.

  constructor({ editor, params = { target: null, previousParent: null } }) {
    super({ editor, params });
  }

  do() {
    const { target, previousParent } = this.params;

    if (target) {
      const shadowRealm = this.editor.shadowRealm;
      const uuid = randomUUID();
      this.params.target.__wizzy_uuid = uuid;
    } else {
      console.error("No target element to remove.");
    }
  }
}
