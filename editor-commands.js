/**
 * @abstract
 * Represents a command that can be executed by the editor.
 * Should have a reverse operation that can be executed to undo the command.
 * 
 */
export class EditorCommand {
  constructor({ editor, params = {} }) {
    this.editor = editor;
    this.params = params;
  }

  get history() {
    return this.editor.history;
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