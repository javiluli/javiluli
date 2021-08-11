const fs = require("fs").promises;
const fetch = require("node-fetch");
const { PLACEHOLDERS, API, URL_BASE, STYLE, SHIELDS } = require("./constants");

// Obtener el dia de creacion de un repositorio
const getCreationDay = async () => {
  return fetch(API.REPO_GITHUB)
    .then((response) => response.json())
    .then((data) => {
      return data.created_at;
    });
};

// Calcura la diferencia (en dias) entre dos fechas, con una fecha pasada y una actual (formato YYYY-MM-DDT00:00:00.000Z - ISO-8601 date)
const getDifferenceInDays = async () => {
  const REPO_GITHUB_CREATED_AT = await getCreationDay();
  const DATE_TARGET = new Date(REPO_GITHUB_CREATED_AT);
  const MILLISECONDS_OF_A_DAY = 1000 * 60 * 60 * 24;
  const NOW = new Date();
  const DURATION = NOW - DATE_TARGET;
  return (REMAINING_DAYS = Math.floor(DURATION / MILLISECONDS_OF_A_DAY));
};

// Obtener repositorios desde un perfil de GitHub
const getRepositoriesData = async () => {
  const response = await fetch(API.REPOS_GITHUB);
  const text = await response.text();
  const data = JSON.parse(text);
  return data.map((repositori) => {
    const { name } = repositori;
    return { name };
  });
};

// Obtener los 'shields.io' de skills y otros
const getShieldsSkills = async () => {
  return SHIELDS.map((shield) => {
    const { message, labelColor, logo, logoColor, link } = shield;
    return { message, labelColor, logo, logoColor, link };
  });
};

// Genera un elemento HTML como parrafo
const generateDaysParagraphsHTML = (days) => `
<p> Este repositorio lleva activo ${days} días </p>`;

// Genera un elemento MARKDOWN como elemento de una lista
const generateItemTableRepositoriesHTML = ({ name }) => `
<td> 
  <img src="${API.GITHUB_README_STATS_VERCEL_APP}/?username=javiluli&repo=${name}&theme=dark" />
</td>`;

// Genera un elemento de Shields.io dentro de un elemento <a> HTML
const generateShieldsSkillsHTML = ({ message, labelColor, logo, logoColor, link }) => `
<a href="${link}" target="_blank">
  <img src="${URL_BASE}/${message}-${labelColor}.svg?style=${STYLE}&logo=${logo}&logoColor=${logoColor}" alt="${message}"/>
</a>`;

(async () => {
  const [template, days, skills, repositories] = await Promise.all([
    fs.readFile("./src/README.md.tpl", { encoding: "utf-8" }),
    getDifferenceInDays(),
    getShieldsSkills(),
    getRepositoriesData(),
  ]);

  // crea el parrafo con los dias que leva creado el repositorio
  const daysParagraph = generateDaysParagraphsHTML(days);

  // crea la lista con los ultimos repositorio
  const linksRepositories = repositories.map(generateItemTableRepositoriesHTML).join("");

  // crea las insignias de shields.io
  const linksShildsSkills = skills.map(generateShieldsSkillsHTML).join("");

  // reemplaza los 'PLACEHOLDERS' por los datos obtenidos
  const newMarkdown = template
    .replace(PLACEHOLDERS.LATEST_REPOS, linksRepositories)
    .replace(PLACEHOLDERS.LONG_AGO_CREATED, daysParagraph)
    .replace(PLACEHOLDERS.SKILLS, linksShildsSkills);

  await fs.writeFile("README.md", newMarkdown);
})();
