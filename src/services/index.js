// Aísla las peticiones HTTP y propaga los fallos para no publicar un README incompleto.
const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} consultando ${new URL(url).hostname}`)
  }
  return response.json()
}

export const getRepositoriesData = async () => {
  const headers = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

  // Solo interesa una muestra reciente: 100 resultados bastan para filtrar y mostrar ocho.
  const data = await fetchJson('https://api.github.com/users/javiluli/repos?sort=updated&per_page=100', { headers })
  if (!Array.isArray(data)) throw new Error('Respuesta de repositorios de GitHub no válida')

  return data
    .filter((repo) => !repo.archived && !repo.fork && repo.name !== 'javiluli')
    .slice(0, 8)
    .map(({ name, html_url }) => ({ name, html_url }))
}

export const getMemeResource = async () => {
  const meme = await fetchJson('https://meme-api.com/gimme/memes')
  if (typeof meme.title !== 'string' || typeof meme.author !== 'string' || typeof meme.url !== 'string') {
    throw new Error('Respuesta del servicio de memes no válida')
  }
  const url = new URL(meme.url)
  if (url.protocol !== 'https:') throw new Error('La URL del meme debe utilizar HTTPS')
  return { title: meme.title, author: meme.author, url: url.href }
}
