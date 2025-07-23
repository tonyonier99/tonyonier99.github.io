const express = require('express');
const router = express.Router();
const yaml = require('js-yaml');
const { requireAuth, requireOwner } = require('../middleware/auth');
const { initGitHub } = require('../middleware/github');

// Use middleware
router.use(requireAuth);
router.use(requireOwner);
router.use(initGitHub);

// Get current site configuration
router.get('/config', async (req, res) => {
  try {
    const configFile = await req.github.getFile('_config.yml');
    if (!configFile) {
      return res.status(404).json({ error: 'Configuration file not found' });
    }
    
    const config = yaml.load(configFile.content);
    
    res.json({
      config,
      sha: configFile.sha
    });
  } catch (error) {
    console.error('Error fetching configuration:', error);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
});

// Update site configuration
router.put('/config', async (req, res) => {
  try {
    const { config } = req.body;
    
    if (!config) {
      return res.status(400).json({ error: 'Configuration data is required' });
    }
    
    // Get existing config file to get SHA
    const existingFile = await req.github.getFile('_config.yml');
    if (!existingFile) {
      return res.status(404).json({ error: 'Configuration file not found' });
    }
    
    // Convert config to YAML
    const yamlContent = yaml.dump(config, {
      indent: 2,
      lineWidth: -1
    });
    
    // Update the file
    const result = await req.github.createOrUpdateFile(
      '_config.yml',
      yamlContent,
      'Update site configuration',
      existingFile.sha
    );
    
    res.json({
      message: 'Configuration updated successfully',
      sha: result.content.sha
    });
  } catch (error) {
    console.error('Error updating configuration:', error);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
});

// Get site statistics
router.get('/stats', async (req, res) => {
  try {
    // Get posts count
    const postsFiles = await req.github.listFiles('posts');
    const postsCount = postsFiles.filter(file => 
      file.name.endsWith('.md') && file.name.startsWith('_posts_')
    ).length;
    
    // Get pages count
    const rootFiles = await req.github.listFiles('');
    const pagesCount = rootFiles.filter(file => 
      file.name.endsWith('.md') && file.type === 'file' && !file.name.startsWith('_')
    ).length;
    
    // Get repository stats
    const repoStats = await req.github.getRepoStats();
    
    // Get recent commits (last 5)
    const recentCommits = await req.github.getFileCommits('', 1, 5);
    
    // Analyze post categories
    const categoryStats = {};
    for (const file of postsFiles) {
      if (file.name.endsWith('.md') && file.name.startsWith('_posts_')) {
        try {
          const fileContent = await req.github.getFile(file.path);
          const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---/;
          const match = fileContent.content.match(frontMatterRegex);
          
          if (match) {
            const frontMatter = yaml.load(match[1]);
            const categories = frontMatter.categories || [];
            
            categories.forEach(category => {
              categoryStats[category] = (categoryStats[category] || 0) + 1;
            });
          }
        } catch (error) {
          console.error(`Error parsing post ${file.name}:`, error);
        }
      }
    }
    
    res.json({
      posts: {
        total: postsCount,
        categories: categoryStats
      },
      pages: {
        total: pagesCount
      },
      repository: {
        size: repoStats.size,
        language: repoStats.language,
        created_at: repoStats.created_at,
        updated_at: repoStats.updated_at,
        stargazers_count: repoStats.stargazers_count,
        forks_count: repoStats.forks_count
      },
      recentActivity: recentCommits.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date,
        url: commit.html_url
      }))
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get social media settings
router.get('/social', async (req, res) => {
  try {
    const configFile = await req.github.getFile('_config.yml');
    if (!configFile) {
      return res.status(404).json({ error: 'Configuration file not found' });
    }
    
    const config = yaml.load(configFile.content);
    
    res.json({
      social_links: config.social_links || {},
      author: config.author || {}
    });
  } catch (error) {
    console.error('Error fetching social settings:', error);
    res.status(500).json({ error: 'Failed to fetch social settings' });
  }
});

// Update social media settings
router.put('/social', async (req, res) => {
  try {
    const { social_links, author } = req.body;
    
    // Get existing config
    const existingFile = await req.github.getFile('_config.yml');
    if (!existingFile) {
      return res.status(404).json({ error: 'Configuration file not found' });
    }
    
    const config = yaml.load(existingFile.content);
    
    // Update social links and author info
    if (social_links) {
      config.social_links = { ...config.social_links, ...social_links };
    }
    
    if (author) {
      config.author = { ...config.author, ...author };
    }
    
    // Convert config to YAML
    const yamlContent = yaml.dump(config, {
      indent: 2,
      lineWidth: -1
    });
    
    // Update the file
    const result = await req.github.createOrUpdateFile(
      '_config.yml',
      yamlContent,
      'Update social media settings',
      existingFile.sha
    );
    
    res.json({
      message: 'Social media settings updated successfully',
      sha: result.content.sha
    });
  } catch (error) {
    console.error('Error updating social settings:', error);
    res.status(500).json({ error: 'Failed to update social settings' });
  }
});

module.exports = router;