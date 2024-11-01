'use strict'

import { promises as fs } from 'fs'
import {
  PLACEHOLDERS,
  APIS,
  SHIELDS_URL_BASE,
  SHIELDS_STYLE,
  PRIMARY_SHIELDS,
  SECONDARY_SHIELDS,
  OTHERS_SHIELDS,
} from './constants.js'
import { getRepositoriesData, getShieldsSkills, getMemeReource } from './services/data.js'

// Genera un elemento MARKDOWN como elemento de una lista
const generateItemTableRepositoriesHTML = ({ name, html_url }) => `
<a href="${html_url}" target="_blank">
  <img src="${APIS.GITHUB_README_STATS_VERCEL_APP}/?username=javiluli&repo=${name}&theme=dark&bg_color=0D1117&title_color=64b0f7&icon_color=fff098&hide_border=true&show_icons=false" width="278" alt="${name}"/>
</a>`

// Generacion de SHILEDS
const generateSkillsShileds = ({ message, iconName, colorlabel, colorlogo, link }) => `
[![${message}](${SHIELDS_URL_BASE}/${message}-${colorlabel}.svg?style=${SHIELDS_STYLE}&logo=${iconName}&logoColor=${colorlogo})](${link})`

// ### Funcion pinciapl ###
;(async () => {
  const [template, primarySkills, secondarySkills, othersSkills, redditMeme, repositories] =
    await Promise.all([
      fs.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
      getShieldsSkills(PRIMARY_SHIELDS),
      getShieldsSkills(SECONDARY_SHIELDS),
      getShieldsSkills(OTHERS_SHIELDS),
      getMemeReource(),
      getRepositoriesData(),
    ])

  // crea las insignias de shields.io
  const elementPrimarySkillShileds = primarySkills.map(generateSkillsShileds).join('')
  const elementSecondaySkillShileds = secondarySkills.map(generateSkillsShileds).join('')
  const elementOthersSkillShileds = othersSkills.map(generateSkillsShileds).join('')

  // creo la imagen con el meme/broma de reddit
  const imageRedditMeme = redditMeme

  // crea la lista con los ultimos repositorios
  const linksRepositories = repositories.map(generateItemTableRepositoriesHTML).join('')

  // reemplaza los 'PLACEHOLDERS' por los datos obtenidos
  const newMarkdown = template
    .replace(PLACEHOLDERS.LATEST_REPOS, linksRepositories)
    .replace(PLACEHOLDERS.PRIMARY_SKILLS_SHIELDS, elementPrimarySkillShileds)
    .replace(PLACEHOLDERS.SECONDAY_SKILLS_SHIELDS, elementSecondaySkillShileds)
    .replace(PLACEHOLDERS.OTHERS_SKILLS_SHIELDS, elementOthersSkillShileds)
    .replace(PLACEHOLDERS.REDDIT_MEME, imageRedditMeme.url)

  await fs.writeFile('README.md', newMarkdown)
})()
