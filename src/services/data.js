import fetch from 'node-fetch'
import { APIS } from '../constants.js'

export const getRepositoriesData = async () => {
  const response = await fetch(APIS.REPOS_GITHUB)
  const data = await response.json()
  return data.map(({ name, html_url }) => ({ name, html_url }))
}

export const getShieldsSkills = (shields) =>
  shields.map(({ message, iconName, colorlabel, colorlogo, link }) => ({
    message,
    iconName,
    colorlabel,
    colorlogo,
    link,
  }))

export const getMemeResource = async () => {
  const response = await fetch('https://www.reddit.com/r/memes/top/.json?limit=1&t=day')
  const { data } = await response.json()
  return { url: data.children[0]?.data?.url }
}
