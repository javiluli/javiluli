const fs = require('fs').promises
const fetch = require('node-fetch')
const { PLACEHOLDERS, API, URL_BASE, STYLE, SHIELDS } = require('./constants')

// Obtener repositorios desde un perfil de GitHub
const getRepositoriesData = async () => {
  const response = await fetch(API.REPOS_GITHUB)
  const text = await response.text()
  const data = JSON.parse(text)
  return data.map((repositori) => {
    const { name, html_url } = repositori
    return { name, html_url }
  })
}

// Obtener los 'shields.io' de skills y otros
const getShieldsSkills = async () => {
  return SHIELDS.map((shield) => {
    const { message, labelColor, nameIcon, logoColor, link } = shield
    return { message, labelColor, nameIcon, logoColor, link }
  })
}

// Genera un elemento MARKDOWN como elemento de una lista
const generateItemTableRepositoriesHTML = ({ name, html_url }) => `
<a href="${html_url}" target="_blank">
  <img src="${API.GITHUB_README_STATS_VERCEL_APP}/?username=javiluli&repo=${name}&theme=dark&bg_color=1F222E&title_color=64b0f7&icon_color=fff098&hide_border=true&show_icons=false" width="282" alt="${name}"/>
</a>`

/**
 *  Generacion de SHILEDS y elementos anidados MARKDOWN con referencias de enlaces.
 */
// Genera un elemento con una referencia de valor, Ej: [javascript_link]: https://www.javascript.com/
const generateSkillsShiledsIcons = ({ message, labelColor, nameIcon, logoColor }) => `
[${nameIcon}_shield]: ${URL_BASE}/${message}-${labelColor}.svg?style=${STYLE}&logo=${nameIcon}&logoColor=${logoColor}`

// Genera un elemento con una referencia de valor, Ej: [javascript_shield]: https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=000000
const generateSkillsShiledsLinks = ({ nameIcon, link }) => `
[${nameIcon}_link]: ${link}`

// Genera un elemento MARKDOWN de link con un elemento interno imagen, ambos utilizando referencias de diversos elementos
const generateSkillsShileds = ({ message, nameIcon }) => `
[![${message}][${nameIcon}_shield]][${nameIcon}_link]`

// Ej. final: [![JavaScript][javascript_shield]][javascript_link]
// ==============================================================

;(async () => {
  const [template, skills, repositories] = await Promise.all([
    fs.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
    getShieldsSkills(),
    getRepositoriesData(),
  ])

  // crea la lista con los ultimos repositorio
  const linksRepositories = repositories.map(generateItemTableRepositoriesHTML).join('')

  // crea las insignias de shields.io
  const elementSkillShileds = skills.map(generateSkillsShileds).join('')
  const elementSkillShiledsIcons = skills.map(generateSkillsShiledsIcons).join('')
  const elementSkillShiledsLinks = skills.map(generateSkillsShiledsLinks).join('')

  // reemplaza los 'PLACEHOLDERS' por los datos obtenidos
  const newMarkdown = template
    .replace(PLACEHOLDERS.LATEST_REPOS, linksRepositories)
    .replace(PLACEHOLDERS.SKILLS_SHIELDS, elementSkillShileds)
    .replace(PLACEHOLDERS.SKILLS_SHIELDS_ICONS, elementSkillShiledsIcons)
    .replace(PLACEHOLDERS.SKILLS_SHIELDS_LINKS, elementSkillShiledsLinks)

  await fs.writeFile('README.md', newMarkdown)
})()
