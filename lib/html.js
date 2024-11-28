/**
 * Utility function to turn a string into a HTML element
 * (has nothing to do with lit-html)
 * @param {string} strings 
 * @param  {...any} values
 * @returns {HTMLElement}
 */
export function html(strings, ...values) {
  const template = document.createElement('template');
  template.innerHTML = strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
  const res = template.content.firstElementChild;
  res.addEvent = (event, handler) => {
    res.addEventListener(event, handler);
    return res;
  }
  return res;
}

export default html;