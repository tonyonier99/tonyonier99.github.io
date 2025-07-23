const GitHubService = require('../services/github');

// Middleware to initialize GitHub service
const initGitHub = (req, res, next) => {
  req.github = new GitHubService();
  next();
};

module.exports = {
  initGitHub
};