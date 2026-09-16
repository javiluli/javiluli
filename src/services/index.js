import fetch from 'node-fetch'

export const getRepositoriesData = async () => {
  try {
    const response = await fetch('https://api.github.com/users/javiluli/repos?sort=created')
    const data = await response.json()

    return data.map(({ name, html_url, archived }) => ({ name, html_url, archived }))
  } catch (error) {
    console.error('Error fetching github repositories:', error)
  }
}

export const getShieldsSkills = (shields) =>
  shields.map(({ message, iconName, labelColor, logoColor }) => ({
    message,
    iconName,
    labelColor,
    logoColor,
  }))

export const getMemeResource = async () => {
  try {
    const response = await fetch('https://meme-api.com/gimme/memes')
    const data = await response.json()

    return { title: data.title, url: data.url, author: data.author }
  } catch (error) {
    console.error('Error fetching meme:', error)
  }
}
