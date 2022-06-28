'use strict'

const fs = require('fs').promises
const { PLACEHOLDERS, API, URL_BASE, STYLE } = require('./constants')
const { getRepositoriesData, getShieldsSkills } = require('./services/getData')

// Genera un elemento MARKDOWN como elemento de una lista
const generateItemTableRepositoriesHTML = ({ name, html_url }) => `
<a href="${html_url}" target="_blank">
  <img src="${API.GITHUB_README_STATS_VERCEL_APP}/?username=javiluli&repo=${name}&theme=dark&bg_color=0D1117&title_color=64b0f7&icon_color=fff098&hide_border=true&show_icons=false" width="282" alt="${name}"/>
</a>`

/**
 *  Generacion de SHILEDS y elementos anidados MARKDOWN con referencias de enlaces.
 */
// Genera un elemento con una referencia de valor, Ej: [javascript_link]: https://www.javascript.com/
const generateSkillsShiledsIcons = ({ message, labelColor, nameIcon, logoColor }) => `
[${nameIcon}_img]: ${URL_BASE}/${message}-${labelColor}.svg?style=${STYLE}&logo=${nameIcon}&logoColor=${logoColor}`

// Genera un elemento con una referencia de valor, Ej: [javascript_shield]: https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=000000
const generateSkillsShiledsLinks = ({ nameIcon, link }) => `
[${nameIcon}_link]: ${link}`

// Genera un elemento MARKDOWN de link con un elemento interno imagen, ambos utilizando referencias de diversos elementos
const generateSkillsShileds = ({ message, nameIcon }) => `
[![${message}][${nameIcon}_img]][${nameIcon}_link]`

// Ej. final: [![JavaScript][javascript_shield]][javascript_link]
// ==============================================================

;(async () => {
  const [template, skills, repositories] = await Promise.all([
    fs.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
    getShieldsSkills(),
    getRepositoriesData(),
  ])

  // crea la lista con los ultimos repositorios
  const linksRepositories = repositories.map(generateItemTableRepositoriesHTML).join('')

  // crea las insignias de shields.io
  const primarySkills = skills.filter((skill) => skill.priority === 1)
  const secondarySkills = skills.filter((skill) => skill.priority === 2)

  const elementPrimarySkillShileds = primarySkills.map(generateSkillsShileds).join('')
  const elementSecondaySkillShileds = secondarySkills.map(generateSkillsShileds).join('')
  const elementSkillShiledsIcons = skills.map(generateSkillsShiledsIcons).join('')
  const elementSkillShiledsLinks = skills.map(generateSkillsShiledsLinks).join('')

  // reemplaza los 'PLACEHOLDERS' por los datos obtenidos
  const newMarkdown = template
    .replace(PLACEHOLDERS.LATEST_REPOS, linksRepositories)
    .replace(PLACEHOLDERS.PRIMARY_SKILLS_SHIELDS, elementPrimarySkillShileds)
    .replace(PLACEHOLDERS.SECONDAY_SKILLS_SHIELDS, elementSecondaySkillShileds)
    .replace(PLACEHOLDERS.SKILLS_SHIELDS_ICONS, elementSkillShiledsIcons)
    .replace(PLACEHOLDERS.SKILLS_SHIELDS_LINKS, elementSkillShiledsLinks)

  await fs.writeFile('README.md', newMarkdown)
})()
