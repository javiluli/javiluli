import fetch from 'node-fetch'

import { APIS } from '../constants.js'

// Obtener repositorios desde un perfil de GitHub
export const getRepositoriesData = async () => {
  const response = await fetch(APIS.REPOS_GITHUB)
  const text = await response.text()
  const data = JSON.parse(text)
  return data.map((repositori) => {
    const { name, html_url } = repositori
    return { name, html_url }
  })
}

// Obtener los 'shields.io' de skills y otros
export const getShieldsSkills = async (shields) => {
  return shields.map((shield) => {
    const { message, iconName, colorlabel, colorlogo, link } = shield
    return { message, iconName, colorlabel, colorlogo, link }
  })
}
