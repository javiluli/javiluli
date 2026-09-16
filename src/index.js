import { promises as fs } from 'node:fs'
import { PLACEHOLDERS } from './constants/index.js'
import { MAIN_SKILLS, COMPETENCES_TRAIN } from './data/badges.js'
import { HOLIDAYS } from './data/holidays.js'
import { getRepositoriesData, getMemeResource } from './services/index.js'
import { renderBadge, renderRepositories, renderMeme, renderTemplate } from './render.js'
import { time } from './utils/index.js'

const generateReadme = async () => {
  // Fallar antes de escribir protege el último README publicado si una API no responde.
  const [template, meme, repos] = await Promise.all([
    fs.readFile(new URL('./README.md.tpl', import.meta.url), 'utf-8'),
    getMemeResource(),
    getRepositoriesData(),
  ])
  const sections = {
    [PLACEHOLDERS.LATEST_REPOS]: renderRepositories(repos),
    [PLACEHOLDERS.MAIN_SKILLS_BADGE]: MAIN_SKILLS.map(renderBadge).join(' '),
    [PLACEHOLDERS.COMPETENCES_TRAIN_BADGE]: COMPETENCES_TRAIN.map(renderBadge).join(' '),
    [PLACEHOLDERS.REDDIT_MEME]: renderMeme(meme),
    [PLACEHOLDERS.DATE]: time(HOLIDAYS),
  }
  await fs.writeFile(new URL('../README.md', import.meta.url), renderTemplate(template, sections))
}

try {
  await generateReadme()
} catch (error) {
  console.error('Error generating README:', error)
  process.exitCode = 1
}
