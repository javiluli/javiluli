const fs = require("fs").promises;
const fetch = require("node-fetch");
const { PLACEHOLDERS, API } = require("./constants");

let latesResposMarkdown = "";
let latesTimeCreateRepo = "";

// obtener 3 repositorios desde perfil de GitHub
const repos = async () => {
  return fetch(API.REPOS_GITHUB)
    .then((response) => response.json())
    .then((data) => data);
};

// obtener data de un repositorio
const repoData = async () => {
  return fetch(API.REPO_GITHUB)
    .then((response) => response.json())
    .then((data) => data.created_at);
};

(async () => {
  const markdownTemplate = await fs.readFile("./src/README.md.tpl", { encoding: "utf-8" });

  // obtener 3 repositorios desde perfil de GitHub
  const REPOS_GITHUB = await repos();

  REPOS_GITHUB.map((item) => {
    latesResposMarkdown += `
- [${item.name}](${item.html_url})`;
  });

  // Tiempoo (en dias) que lleva creado el repositorio
  const REPO_GITHUB_CREATED_AT = await repoData();
  // Diferencia entre el dia actual y el dia de creacion del repositorio
  const DATE_TARGET = new Date(REPO_GITHUB_CREATED_AT);
  const MILLISECONDS_OF_A_DAY = 1000 * 60 * 60 * 24;

  const NOW = new Date();
  const DURATION = NOW - DATE_TARGET;
  const REMAINING_DAYS = Math.floor(DURATION / MILLISECONDS_OF_A_DAY);

  latesTimeCreateRepo = `${REMAINING_DAYS} días`;

  const newMarkdown = markdownTemplate.replace(PLACEHOLDERS.LATEST_REPOS, latesResposMarkdown).replace(PLACEHOLDERS.LONG_AGO_CREATED, latesTimeCreateRepo);

  await fs.writeFile("README.md", newMarkdown);
})();
