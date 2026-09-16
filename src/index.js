import { readFile, writeFile } from 'node:fs/promises'
import { MAIN_SKILLS, COMPETENCES_TRAIN } from './data/badges.js'
import { HOLIDAYS } from './data/holidays.js'
import { getRepositoriesData, getMemeResource } from './services.js'
import { formatDate } from './date.js'

const generateBadgeByGithubRepos = ({ name, html_url, archived }) => {
  const labelColor = archived ? 'FFA500' : '28A745'

  return `
[![${name}](https://img.shields.io/badge/${name.replaceAll('-', '_')}-${labelColor}.svg?style=flat-square&logo=github&logoColor=000000)](${html_url})`
}

const generateBadgeBySkills = ({ message, iconName, labelColor, logoColor }) => `
[![${message}](https://img.shields.io/badge/${message}-${labelColor}.svg?style=flat-square&logo=${iconName}&logoColor=${logoColor})](#)`

const generateRedditMemeSection = ({ title, url, author }) => `
<h2>
  <img src="./images/emojis/clown_face.png" alt="🤡" width="25" height="25" /> Un meme al día de Reddit
</h2>

![${title}](${url})

<p align="right">${author}<i> - ${title}</i> - </p>
`

const generateSectionContent = async () => {
  const [template, meme, repos] = await Promise.all([
    readFile('./src/README.md.tpl', 'utf-8'),
    getMemeResource(),
    getRepositoriesData(),
  ])

  return {
    template,
    sections: {
      '%{{latest_repos}}%': repos.map(generateBadgeByGithubRepos).join(''),
      '%{{main_skills_badge}}%': MAIN_SKILLS.map(generateBadgeBySkills).join(''),
      '%{{competences_train_badge}}%': COMPETENCES_TRAIN.map(generateBadgeBySkills).join(''),
      '%{{reddit_meme}}%': generateRedditMemeSection(meme),
      '%{{date}}%': formatDate(HOLIDAYS),
    },
  }
}

const applyPlaceholders = ({ template, sections }) =>
  Object.entries(sections).reduce((content, [placeholder, value]) => content.replace(placeholder, value), template)

const main = async () => {
  const { template, sections } = await generateSectionContent()
  await writeFile('README.md', applyPlaceholders({ template, sections }))
}

main().catch((error) => {
  console.error('Error generating README:', error)
  process.exitCode = 1 // Conservar el README anterior si falla alguna API.
})
