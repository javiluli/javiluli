'use strict'

import { promises as fs } from 'fs'
import {
  PLACEHOLDERS,
  API,
  URL_BASE,
  STYLE,
  PRIMARY_SHIELDS,
  SECONDARY_SHIELDS,
} from './constants.js'
import { getRepositoriesData, getShieldsSkills } from './services/data.js'

// Genera un elemento MARKDOWN como elemento de una lista
const generateItemTableRepositoriesHTML = ({ name, html_url }) => `
<a href="${html_url}" target="_blank">
  <img src="${API.GITHUB_README_STATS_VERCEL_APP}/?username=javiluli&repo=${name}&theme=dark&bg_color=0D1117&title_color=64b0f7&icon_color=fff098&hide_border=true&show_icons=false" width="278" alt="${name}"/>
</a>`

// Generacion de SHILEDS
const generateSkillsShileds = ({ message, iconName, colorlabel, colorlogo, link }) => `
[![${message}](${URL_BASE}/${message}-${colorlabel}.svg?style=${STYLE}&logo=${iconName}&logoColor=${colorlogo})](${link})`

// ### Funcion pinciapl ###
;(async () => {
  const [template, primarySkills, secondarySkills, repositories] = await Promise.all([
    fs.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
    getShieldsSkills(PRIMARY_SHIELDS),
    getShieldsSkills(SECONDARY_SHIELDS),
    getRepositoriesData(),
  ])

  // crea la lista con los ultimos repositorios
  const linksRepositories = repositories.map(generateItemTableRepositoriesHTML).join('')

  // crea las insignias de shields.io
  const elementPrimarySkillShileds = primarySkills.map(generateSkillsShileds).join('')
  const elementSecondaySkillShileds = secondarySkills.map(generateSkillsShileds).join('')

  // reemplaza los 'PLACEHOLDERS' por los datos obtenidos
  const newMarkdown = template
    .replace(PLACEHOLDERS.LATEST_REPOS, linksRepositories)
    .replace(PLACEHOLDERS.PRIMARY_SKILLS_SHIELDS, elementPrimarySkillShileds)
    .replace(PLACEHOLDERS.SECONDAY_SKILLS_SHIELDS, elementSecondaySkillShileds)

  await fs.writeFile('README.md', newMarkdown)
})()
