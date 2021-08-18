const fetch = require('node-fetch')
const { API, SHIELDS } = require('../constants')

// Obtener repositorios desde un perfil de GitHub
const getRepositoriesData = async () => {
  const response = await fetch(API.REPOS_GITHUB)
  const text = await response.text()
  const data = JSON.parse(text)
  return data.map((repositori) => {
    const { name, html_url } = repositori
    return { name, html_url }
  })
}

// Obtener los 'shields.io' de skills y otros
const getShieldsSkills = async () => {
  return SHIELDS.map((shield) => {
    const { message, labelColor, nameIcon, logoColor, link } = shield
    return { message, labelColor, nameIcon, logoColor, link }
  })
}

module.exports = { getRepositoriesData, getShieldsSkills }
