import { command } from "./elements/editor-commands.js";

/**
 * @abstract
 * Represents a command that can be executed by the editor.
 * Should have a reverse operation that can be executed to undo the command
 *
 * @property {Object} params - The parameters for the command.
 * @property {string} description - A description of the command.
 * @property {string} name - The name of the command.
 * @property {typeof import("./wizzy.js").WizzyEditor} editor - The editor instance.
 */
export class EditorCommand {
  /**
   * @param {Object} options
   * @param {typeof import("./wizzy.js").WizzyEditor} options.editor - The editor instance.
   * @param {Object} options.params - The parameters for the command.
   * @param {string} options.description - A description of the command. (any length)
   * @param {string} options.name - The name of the command.
   * @param {string} options.brief - A brief description of the command. (10-50) characters.
   * @param {string} options.icon - The icon to display for the command (material-icons).
   */
  constructor({
    editor,
    params = {},
    description = "",
    name = "",
    brief = "",
    icon = "",
  }) {
    this.editor = editor;
    this.params = params;
    this._description = description;
    this._name = name;
    this._brief = brief;
    this._icon = icon;
  }

  get name() {
    return this.name || this.constructor.name;
  }

  get icon() {
    return this._icon || "javascript";
  }

  get brief() {
    return this._brief || "";
  }

  get description() {
    return this._description || "";
  }

  createElement() {
    const cmd = command({
      name: this.name,
      description: this.description,
      brief: this.brief,
      icon: this._icon,
      action: () => this.do(),
    });

    return cmd;
  }

  /**
   * Executes the command.
   */
  do() {
    throw new Error("Not implemented");
  }

  /**
   * The reverse equivalent of `do()`.
   */
  undo() {
    throw new Error("Not implemented");
  }
}
