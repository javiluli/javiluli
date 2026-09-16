// Las respuestas externas se escapan antes de insertarlas en HTML o Markdown.
export const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

export const escapeMarkdown = (value) => String(value).replace(/([\\`*_{}\[\]()#+.!|<>])/g, '\\$1')

export const renderBadge = ({ message, iconName, labelColor, logoColor }) => {
  const label = String(message).replace(/-/g, '--').replace(/ /g, '_')
  return `![${escapeMarkdown(message)}](https://img.shields.io/badge/${encodeURIComponent(label)}-${labelColor}?style=flat-square&logo=${encodeURIComponent(iconName)}&logoColor=${logoColor})`
}

export const renderRepositories = (repositories) =>
  repositories.length
    ? repositories.map(({ name, html_url }) => `- [${escapeMarkdown(name)}](${html_url})`).join('\n')
    : 'No hay repositorios recientes para mostrar.'

export const renderMeme = ({ title, url, author }) =>
  `<p><img src="${escapeHtml(url)}" alt="${escapeHtml(title)}" width="600" /></p>\n\n<sub>Compartido por ${escapeHtml(author)} en Reddit · ${escapeHtml(title)}</sub>`

export const renderTemplate = (template, sections) => {
  let result = template
  for (const [placeholder, content] of Object.entries(sections)) {
    if (!result.includes(placeholder)) throw new Error(`Falta el marcador ${placeholder} en la plantilla`)
    result = result.replaceAll(placeholder, content)
  }
  if (/%\{\{[^}]+\}\}%/.test(result)) throw new Error('Quedan marcadores sin sustituir en el README')
  return result
}
