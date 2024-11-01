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
import { getRepositoriesData, getShieldsSkills, getMemeResource } from './services/data.js'

const generateRepositoryLink = ({ name, html_url }) => `
<a href="${html_url}" target="_blank">
  <img src="${APIS.GITHUB_README_STATS_VERCEL_APP}/?username=javiluli&repo=${name}&theme=dark&bg_color=0D1117&title_color=64b0f7&icon_color=fff098&hide_border=true&show_icons=false" width="278" alt="${name}"/>
</a>`

const generateShield = ({ message, iconName, colorlabel, colorlogo, link }) => `
[![${message}](${SHIELDS_URL_BASE}/${message}-${colorlabel}.svg?style=${SHIELDS_STYLE}&logo=${iconName}&logoColor=${colorlogo})](${link})`

const generateSectionContent = async () => {
  const [template, primarySkills, secondarySkills, othersSkills, meme, repos] = await Promise.all([
    fs.readFile('./src/README.md.tpl', 'utf-8'),
    getShieldsSkills(PRIMARY_SHIELDS),
    getShieldsSkills(SECONDARY_SHIELDS),
    getShieldsSkills(OTHERS_SHIELDS),
    getMemeResource(),
    getRepositoriesData(),
  ])

  return {
    template,
    sections: {
      [PLACEHOLDERS.LATEST_REPOS]: repos.map(generateRepositoryLink).join(''),
      [PLACEHOLDERS.PRIMARY_SKILLS_SHIELDS]: primarySkills.map(generateShield).join(''),
      [PLACEHOLDERS.SECONDAY_SKILLS_SHIELDS]: secondarySkills.map(generateShield).join(''),
      [PLACEHOLDERS.OTHERS_SKILLS_SHIELDS]: othersSkills.map(generateShield).join(''),
      [PLACEHOLDERS.REDDIT_MEME]: meme.url,
    },
  }
}

const applyPlaceholders = ({ template, sections }) =>
  Object.entries(sections).reduce(
    (content, [placeholder, value]) => content.replace(placeholder, value),
    template
  )

;(async () => {
  try {
    const { template, sections } = await generateSectionContent()
    const newMarkdown = applyPlaceholders({ template, sections })
    await fs.writeFile('README.md', newMarkdown)
  } catch (error) {
    console.error('Error generating README:', error)
  }
})()
