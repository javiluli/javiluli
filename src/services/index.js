// Fallar explícitamente evita sobrescribir el README con datos incompletos si una API no responde.
const fetchJson = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw new Error(`HTTP ${response.status} fetching ${url}`)
  return response.json()
}

export const getRepositoriesData = async () => {
  const data = await fetchJson('https://api.github.com/users/javiluli/repos?sort=created')
  if (!Array.isArray(data)) throw new Error('Invalid GitHub repositories response')

  return data.map(({ name, html_url, archived }) => ({ name, html_url, archived }))
}

export const getShieldsSkills = (shields) =>
  shields.map(({ message, iconName, labelColor, logoColor }) => ({
    message,
    iconName,
    labelColor,
    logoColor,
  }))

export const getMemeResource = async () => {
  const data = await fetchJson('https://meme-api.com/gimme/memes')
  if (!data || typeof data.title !== 'string' || typeof data.url !== 'string' || typeof data.author !== 'string' || !/^https?:\/\//.test(data.url)) {
    throw new Error('Invalid Reddit meme response')
  }

  return { title: data.title, url: data.url, author: data.author }
}
