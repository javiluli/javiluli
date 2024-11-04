'use strict'

import { promises as fs } from 'fs'
import { PLACEHOLDERS } from './constants/index.js'
import { MAIN_SKILLS, COMPETENCES_TRAIN } from './data/badges.js'
import { HOLIDAYS } from './data/holidays.js'
import { getRepositoriesData, getShieldsSkills, getMemeResource } from './services/index.js'
import { time } from './utils/index.js'

const generateBadgeByGithubRepos = ({ name, html_url, archived }) => {
  const title = name
  const normalizeTitle = title.replaceAll('-', '_')
  const url = html_url
  const laberlColor = !archived ? '28A745' : 'FFA500'

  return `
[![${title}](https://img.shields.io/badge/${normalizeTitle}-${laberlColor}.svg?style=flat-square&logo=github&logoColor=000000)](${url})`
}

const generateBadgeBySkills = ({ message, iconName, labelColor, logoColor }) => `
[![${message}](https://img.shields.io/badge/${message}-${labelColor}.svg?style=flat-square&logo=${iconName}&logoColor=${logoColor})](#)`

const generateRedditMemeSecctions = ({ title, url, author }) => `
<h3 align="center">
  <img src="./images/emojis/clown_face.png" alt="🤡" width="25" height="25" /> Un meme al dia, desde r/memes <img src="./images/emojis/clown_face.png" alt="🤡" width="25" height="25" />
</h3>

![${title}](${url})

<h4 align="right"> - ${author}<i>, ${title}</i> - </h4>
`

const generateDateHolidays = () => {
  const date = time(HOLIDAYS)
  return time(HOLIDAYS)
}

const generateSectionContent = async () => {
  const [template, mainSkills, competencesTrain, meme, repos] = await Promise.all([
    fs.readFile('./src/README.md.tpl', 'utf-8'),
    getShieldsSkills(MAIN_SKILLS),
    getShieldsSkills(COMPETENCES_TRAIN),
    getMemeResource(),
    getRepositoriesData(),
  ])

  return {
    template,
    sections: {
      [PLACEHOLDERS.LATEST_REPOS]: repos.map(generateBadgeByGithubRepos).join(''),
      [PLACEHOLDERS.MAIN_SKILLS_BADGE]: mainSkills.map(generateBadgeBySkills).join(''),
      [PLACEHOLDERS.COMPETENCES_TRAIN_BADGE]: competencesTrain.map(generateBadgeBySkills).join(''),
      [PLACEHOLDERS.REDDIT_MEME]: generateRedditMemeSecctions(meme),
      [PLACEHOLDERS.DATE]: generateDateHolidays(),
    },
  }
}

const applyPlaceholders = ({ template, sections }) =>
  Object.entries(sections).reduce((content, [placeholder, value]) => content.replace(placeholder, value), template)

;(async () => {
  try {
    const { template, sections } = await generateSectionContent()
    const newMarkdown = applyPlaceholders({ template, sections })
    await fs.writeFile('README.md', newMarkdown)
  } catch (error) {
    console.error('Error generating README:', error)
  }
})()
