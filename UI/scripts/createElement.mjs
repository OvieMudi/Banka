/**
 * creates an html element
 * @param {String} html - html string
 * @returns {Object} - Created html element
 */
export default function createHtmlElement(html) {
  const template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  const element = template.content.firstChild;

  return element;
}
