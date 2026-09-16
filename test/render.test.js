import test from 'node:test'
import assert from 'node:assert/strict'
import { renderBadge, renderRepositories, renderMeme, renderTemplate } from '../src/render.js'
import { time } from '../src/utils/index.js'

test('renderiza insignias sin enlaces vacíos y escapa el texto', () => {
  const badge = renderBadge({ message: 'React', iconName: 'react', labelColor: '20232A', logoColor: 'FFFFFF' })
  assert.match(badge, /^!\[React\]\(https:\/\/img\.shields\.io/)
  assert.doesNotMatch(badge, /\]\(#\)/)
})

test('renderiza repositorios filtrados y listado vacío legible', () => {
  assert.equal(renderRepositories([]), 'No hay repositorios recientes para mostrar.')
  assert.match(renderRepositories([{ name: 'prueba', html_url: 'https://github.com/javiluli/prueba' }]), /\[prueba\]/)
})

test('escapa los datos del meme en HTML', () => {
  const meme = renderMeme({ title: '<script>alert(1)</script>', author: 'A&B', url: 'https://i.redd.it/test.png' })
  assert.match(meme, /&lt;script&gt;/)
  assert.match(meme, /A&amp;B/)
  assert.doesNotMatch(meme, /<script>/)
})

test('sustituye marcadores y detecta secciones ausentes', () => {
  assert.equal(renderTemplate('Hola %{{name}}%', { '%{{name}}%': 'Javier' }), 'Hola Javier')
  assert.throws(() => renderTemplate('Hola', { '%{{name}}%': 'Javier' }), /Falta el marcador/)
  assert.throws(() => renderTemplate('Hola %{{missing}}%', {}), /Quedan marcadores/)
})

test('usa fecha local de Madrid tanto para texto como para festividades', () => {
  const formatted = time({ '1-2': [{ evento: 'Prueba', emojis: '✨' }] }, new Date('2026-01-01T23:30:00Z'))
  assert.match(formatted, /2 de enero, 00:30/)
  assert.match(formatted, /Prueba ✨/)
})

test('la plantilla permite generar el README completo sin llamadas HTTP', async () => {
  const { readFile } = await import('node:fs/promises')
  const { PLACEHOLDERS } = await import('../src/constants/index.js')
  const { MAIN_SKILLS, COMPETENCES_TRAIN } = await import('../src/data/badges.js')
  const template = await readFile(new URL('../src/README.md.tpl', import.meta.url), 'utf8')
  const result = renderTemplate(template, {
    [PLACEHOLDERS.LATEST_REPOS]: renderRepositories([]),
    [PLACEHOLDERS.MAIN_SKILLS_BADGE]: MAIN_SKILLS.map(renderBadge).join(' '),
    [PLACEHOLDERS.COMPETENCES_TRAIN_BADGE]: COMPETENCES_TRAIN.map(renderBadge).join(' '),
    [PLACEHOLDERS.REDDIT_MEME]: renderMeme({ title: 'Ejemplo', url: 'https://i.redd.it/test.jpg', author: 'test' }),
    [PLACEHOLDERS.DATE]: time({}, new Date('2026-09-16T10:00:00Z')),
  })
  assert.match(result, /Create: Pipe Connector/)
  assert.match(result, /StarRupture Planner/)
  assert.doesNotMatch(result, /%\{\{/)
})
