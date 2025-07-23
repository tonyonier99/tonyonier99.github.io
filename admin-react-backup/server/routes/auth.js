const express = require('express');
const router = express.Router();
const { requireAuth, requireOwner, getGitHubUser, exchangeCodeForToken } = require('../middleware/auth');

// GitHub OAuth login URL
router.get('/github', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3001/api/auth/github/callback';
  const scope = 'repo'; // Need repo access to manage the repository
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  
  res.json({ authUrl });
});

// GitHub OAuth callback
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided' });
  }

  try {
    // Exchange code for access token
    const accessToken = await exchangeCodeForToken(code);
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Failed to get access token' });
    }

    // Get user information
    const user = await getGitHubUser(accessToken);
    
    // Check if user is the owner
    if (user.login !== 'tonyonier99') {
      return res.status(403).json({ error: 'Access denied. Only tonyonier99 can access this admin panel.' });
    }

    // Store user and token in session
    req.session.user = user;
    req.session.accessToken = accessToken;

    // Redirect to frontend
    const frontendUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/dashboard?auth=success`);
    
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Get current user info
router.get('/me', requireAuth, (req, res) => {
  res.json({
    user: req.session.user,
    isOwner: req.session.user.login === 'tonyonier99'
  });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Check authentication status
router.get('/status', (req, res) => {
  res.json({
    authenticated: !!req.session.user,
    user: req.session.user || null
  });
});

module.exports = router;