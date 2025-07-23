const express = require('express');
const router = express.Router();
const yaml = require('js-yaml');
const { requireAuth, requireOwner } = require('../middleware/auth');
const { initGitHub } = require('../middleware/github');

// Use middleware
router.use(requireAuth);
router.use(requireOwner);
router.use(initGitHub);

// Helper function to parse page content
const parsePage = (content) => {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    // If no front matter, treat entire content as body
    return { frontMatter: {}, body: content };
  }
  
  const frontMatter = yaml.load(match[1]);
  const body = match[2];
  
  return { frontMatter, body };
};

// Helper function to create page content
const createPageContent = (frontMatter, body) => {
  if (Object.keys(frontMatter).length === 0) {
    return body;
  }
  const yamlString = yaml.dump(frontMatter);
  return `---\n${yamlString}---\n${body}`;
};

// Get all pages
router.get('/', async (req, res) => {
  try {
    const files = await req.github.listFiles('');
    const pages = [];
    
    for (const file of files) {
      if (file.name.endsWith('.md') && file.type === 'file' && !file.name.startsWith('_')) {
        try {
          const fileContent = await req.github.getFile(file.path);
          const { frontMatter } = parsePage(fileContent.content);
          
          pages.push({
            filename: file.name,
            path: file.path,
            sha: fileContent.sha,
            title: frontMatter.title || file.name.replace('.md', ''),
            layout: frontMatter.layout || 'page',
            size: file.size
          });
        } catch (error) {
          console.error(`Error parsing page ${file.name}:`, error);
        }
      }
    }
    
    res.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// Get a specific page
router.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    let filePath = filename;
    
    // Add .md extension if not present
    if (!filename.endsWith('.md')) {
      filePath = `${filename}.md`;
    }
    
    const fileContent = await req.github.getFile(filePath);
    if (!fileContent) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    const { frontMatter, body } = parsePage(fileContent.content);
    
    res.json({
      filename: filePath,
      path: filePath,
      sha: fileContent.sha,
      frontMatter,
      body,
      content: fileContent.content
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// Update an existing page
router.put('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const { content, frontMatter } = req.body;
    let filePath = filename;
    
    // Add .md extension if not present
    if (!filename.endsWith('.md')) {
      filePath = `${filename}.md`;
    }
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    // Get existing file
    const existingFile = await req.github.getFile(filePath);
    if (!existingFile) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Parse existing content to preserve original front matter structure
    const { frontMatter: existingFrontMatter } = parsePage(existingFile.content);
    
    // Merge front matter
    const updatedFrontMatter = {
      ...existingFrontMatter,
      ...frontMatter
    };
    
    // Create updated content
    const pageContent = createPageContent(updatedFrontMatter, content);
    
    // Commit to GitHub
    const result = await req.github.createOrUpdateFile(
      filePath,
      pageContent,
      `Update page: ${filePath}`,
      existingFile.sha
    );
    
    res.json({
      message: 'Page updated successfully',
      filename: filePath,
      path: filePath,
      sha: result.content.sha
    });
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: 'Failed to update page' });
  }
});

// Create a new page
router.post('/', async (req, res) => {
  try {
    const { filename, content, frontMatter } = req.body;
    
    if (!filename || !content) {
      return res.status(400).json({ error: 'Filename and content are required' });
    }
    
    let filePath = filename;
    
    // Add .md extension if not present
    if (!filename.endsWith('.md')) {
      filePath = `${filename}.md`;
    }
    
    // Check if file already exists
    const existingFile = await req.github.getFile(filePath);
    if (existingFile) {
      return res.status(409).json({ error: 'A page with this filename already exists' });
    }
    
    // Prepare front matter
    const pageFrontMatter = {
      layout: 'page',
      ...frontMatter
    };
    
    // Create page content
    const pageContent = createPageContent(pageFrontMatter, content);
    
    // Commit to GitHub
    const result = await req.github.createOrUpdateFile(
      filePath,
      pageContent,
      `Add new page: ${filePath}`
    );
    
    res.status(201).json({
      message: 'Page created successfully',
      filename: filePath,
      path: filePath,
      sha: result.content.sha
    });
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Failed to create page' });
  }
});

// Delete a page
router.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    let filePath = filename;
    
    // Add .md extension if not present
    if (!filename.endsWith('.md')) {
      filePath = `${filename}.md`;
    }
    
    // Get existing file to get SHA
    const existingFile = await req.github.getFile(filePath);
    if (!existingFile) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Delete from GitHub
    await req.github.deleteFile(
      filePath,
      `Delete page: ${filePath}`,
      existingFile.sha
    );
    
    res.json({
      message: 'Page deleted successfully',
      filename: filePath,
      path: filePath
    });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

module.exports = router;