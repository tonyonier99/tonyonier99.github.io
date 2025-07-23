const express = require('express');
const router = express.Router();
const yaml = require('js-yaml');
const { requireAuth, requireOwner } = require('../middleware/auth');
const { initGitHub } = require('../middleware/github');

// Use middleware
router.use(requireAuth);
router.use(requireOwner);
router.use(initGitHub);

// Helper function to parse post content
const parsePost = (content) => {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    throw new Error('Invalid post format: Front matter not found');
  }
  
  const frontMatter = yaml.load(match[1]);
  const body = match[2];
  
  return { frontMatter, body };
};

// Helper function to create post content
const createPostContent = (frontMatter, body) => {
  const yamlString = yaml.dump(frontMatter);
  return `---\n${yamlString}---\n${body}`;
};

// Helper function to generate post filename
const generatePostFilename = (title, date) => {
  const dateStr = new Date(date).toISOString().split('T')[0];
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `_posts_${dateStr}-${slug}.md`;
};

// Get all posts
router.get('/', async (req, res) => {
  try {
    const files = await req.github.listFiles('posts');
    const posts = [];
    
    for (const file of files) {
      if (file.name.endsWith('.md') && file.name.startsWith('_posts_')) {
        try {
          const fileContent = await req.github.getFile(file.path);
          const { frontMatter } = parsePost(fileContent.content);
          
          posts.push({
            filename: file.name,
            path: file.path,
            sha: fileContent.sha,
            title: frontMatter.title || 'Untitled',
            date: frontMatter.date || new Date().toISOString().split('T')[0],
            categories: frontMatter.categories || [],
            excerpt: frontMatter.excerpt || '',
            layout: frontMatter.layout || 'post'
          });
        } catch (error) {
          console.error(`Error parsing post ${file.name}:`, error);
        }
      }
    }
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get a specific post
router.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = `posts/${filename}`;
    
    const fileContent = await req.github.getFile(filePath);
    if (!fileContent) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const { frontMatter, body } = parsePost(fileContent.content);
    
    res.json({
      filename,
      path: filePath,
      sha: fileContent.sha,
      frontMatter,
      body,
      content: fileContent.content
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  try {
    const { title, content, frontMatter } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    // Prepare front matter
    const postFrontMatter = {
      layout: 'post',
      title,
      date: new Date().toISOString().split('T')[0],
      categories: ['雜談'],
      excerpt: '',
      ...frontMatter
    };
    
    // Generate filename
    const filename = generatePostFilename(title, postFrontMatter.date);
    const filePath = `posts/${filename}`;
    
    // Check if file already exists
    const existingFile = await req.github.getFile(filePath);
    if (existingFile) {
      return res.status(409).json({ error: 'A post with this title and date already exists' });
    }
    
    // Create post content
    const postContent = createPostContent(postFrontMatter, content);
    
    // Commit to GitHub
    const result = await req.github.createOrUpdateFile(
      filePath,
      postContent,
      `Add new post: ${title}`
    );
    
    res.status(201).json({
      message: 'Post created successfully',
      filename,
      path: filePath,
      sha: result.content.sha
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update an existing post
router.put('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const { title, content, frontMatter } = req.body;
    const filePath = `posts/${filename}`;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    // Get existing file
    const existingFile = await req.github.getFile(filePath);
    if (!existingFile) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Parse existing content to preserve original front matter structure
    const { frontMatter: existingFrontMatter } = parsePost(existingFile.content);
    
    // Merge front matter
    const updatedFrontMatter = {
      ...existingFrontMatter,
      title,
      ...frontMatter
    };
    
    // Create updated content
    const postContent = createPostContent(updatedFrontMatter, content);
    
    // Commit to GitHub
    const result = await req.github.createOrUpdateFile(
      filePath,
      postContent,
      `Update post: ${title}`,
      existingFile.sha
    );
    
    res.json({
      message: 'Post updated successfully',
      filename,
      path: filePath,
      sha: result.content.sha
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete a post
router.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = `posts/${filename}`;
    
    // Get existing file to get SHA
    const existingFile = await req.github.getFile(filePath);
    if (!existingFile) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Parse to get title for commit message
    const { frontMatter } = parsePost(existingFile.content);
    const title = frontMatter.title || filename;
    
    // Delete from GitHub
    await req.github.deleteFile(
      filePath,
      `Delete post: ${title}`,
      existingFile.sha
    );
    
    res.json({
      message: 'Post deleted successfully',
      filename,
      path: filePath
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;