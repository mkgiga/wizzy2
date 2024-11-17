/**
 * Turn a string into a HTML element
 * @param {string} strings 
 * @param  {...any} values
 * @returns {HTMLElement}
 */
export function html(strings, ...values) {
  const template = document.createElement('template');
  template.innerHTML = strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
  return template.content.firstElementChild;
}

export default html;