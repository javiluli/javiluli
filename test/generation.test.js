import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getRepositoriesData, getMemeResource } from '../src/services/index.js'
import { time } from '../src/utils/index.js'

// Simular las API evita depender de GitHub o Reddit durante los tests.
const withFetch = async (stub, task) => {
  const original = globalThis.fetch
  globalThis.fetch = stub
  try {
    await task()
  } finally {
    globalThis.fetch = original
  }
}

test('conserva el formato original de los datos de los repositorios', async () => {
  await withFetch(async () => ({ ok: true, json: async () => [{ name: 'my-repo', html_url: 'https://github.com/example/my-repo', archived: false }] }), async () => {
    assert.deepEqual(await getRepositoriesData(), [{ name: 'my-repo', html_url: 'https://github.com/example/my-repo', archived: false }])
  })
})

test('avisa cuando la API de repositorios falla', async () => {
  await withFetch(async () => ({ ok: false, status: 503 }), async () => {
    await assert.rejects(getRepositoriesData(), /HTTP 503/)
  })
})

test('rechaza una respuesta inesperada de GitHub', async () => {
  await withFetch(async () => ({ ok: true, json: async () => ({ message: 'API limit' }) }), async () => {
    await assert.rejects(getRepositoriesData(), /Invalid GitHub/)
  })
})

test('rechaza un meme con una URL no válida', async () => {
  await withFetch(async () => ({ ok: true, json: async () => ({ title: 'meme', url: 'javascript:alert(1)', author: 'reddit' }) }), async () => {
    await assert.rejects(getMemeResource(), /Invalid Reddit/)
  })
})

test('busca las festividades según el día de Madrid, no UTC', () => {
  const output = time({ '1-1': [{ evento: 'Año Nuevo', emojis: '🎉' }] }, new Date('2026-12-31T23:30:00Z'))
  assert.match(output, /Año Nuevo 🎉/)
  assert.match(output, /00:30 CET/)
})

test('ajusta correctamente el día y la hora durante el verano', () => {
  const output = time({ '9-17': [{ evento: 'Día especial', emojis: '⭐' }] }, new Date('2026-09-16T22:30:00Z'))
  assert.match(output, /Día especial ⭐/)
  assert.match(output, /00:30 CEST/)
})
