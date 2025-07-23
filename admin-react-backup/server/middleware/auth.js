const axios = require('axios');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Middleware to check if user is authorized (tonyonier99 only)
const requireOwner = (req, res, next) => {
  if (!req.session.user || req.session.user.login !== 'tonyonier99') {
    return res.status(403).json({ error: 'Access denied. Owner only.' });
  }
  next();
};

// GitHub OAuth helper functions
const getGitHubUser = async (accessToken) => {
  try {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch GitHub user');
  }
};

const exchangeCodeForToken = async (code) => {
  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    }, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    return response.data.access_token;
  } catch (error) {
    throw new Error('Failed to exchange code for token');
  }
};

module.exports = {
  requireAuth,
  requireOwner,
  getGitHubUser,
  exchangeCodeForToken
};