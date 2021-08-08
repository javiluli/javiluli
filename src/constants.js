const PLACEHOLDERS = {
  LATEST_REPOS: "%{{latest_repos}}%",
  LONG_AGO_CREATED: "%{{long_ago_created}}%",
};

const API = {
  REPOS_GITHUB: "https://api.github.com/users/javiluli/repos?sort=created&per_page=3",
  REPO_GITHUB: "https://api.github.com/repos/javiluli/javiluli",
};

module.exports = { PLACEHOLDERS, API };
