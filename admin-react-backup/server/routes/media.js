const express = require('express');
const router = express.Router();
const multer = require('multer');
const { requireAuth, requireOwner } = require('../middleware/auth');
const { initGitHub } = require('../middleware/github');

// Use middleware
router.use(requireAuth);
router.use(requireOwner);
router.use(initGitHub);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all media files
router.get('/', async (req, res) => {
  try {
    const assetsFiles = await req.github.listFiles('assets');
    const mediaFiles = [];
    
    // Look for images in assets directory and subdirectories
    for (const item of assetsFiles) {
      if (item.type === 'dir' && item.name === 'images') {
        const imageFiles = await req.github.listFiles(item.path);
        
        for (const file of imageFiles) {
          if (file.type === 'file' && /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file.name)) {
            mediaFiles.push({
              filename: file.name,
              path: file.path,
              sha: file.sha,
              size: file.size,
              url: `/${file.path}`,
              type: 'image'
            });
          }
        }
      } else if (item.type === 'file' && /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(item.name)) {
        mediaFiles.push({
          filename: item.name,
          path: item.path,
          sha: item.sha,
          size: item.size,
          url: `/${item.path}`,
          type: 'image'
        });
      }
    }
    
    res.json(mediaFiles);
  } catch (error) {
    console.error('Error fetching media files:', error);
    res.status(500).json({ error: 'Failed to fetch media files' });
  }
});

// Upload a new media file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { originalname, buffer, mimetype } = req.file;
    const { folder = 'images' } = req.body;
    
    // Create a safe filename
    const timestamp = Date.now();
    const safeFilename = originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${safeFilename}`;
    
    // Determine the upload path
    const uploadPath = `assets/${folder}/${filename}`;
    
    // Convert buffer to base64
    const base64Content = buffer.toString('base64');
    
    // Upload to GitHub
    const result = await req.github.createOrUpdateFile(
      uploadPath,
      base64Content,
      `Upload media file: ${filename}`,
      null,
      true // This indicates it's binary content
    );
    
    res.status(201).json({
      message: 'File uploaded successfully',
      filename,
      path: uploadPath,
      url: `/${uploadPath}`,
      sha: result.content.sha,
      size: buffer.length,
      type: 'image'
    });
  } catch (error) {
    console.error('Error uploading media file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Delete a media file
router.delete('/:path(*)', async (req, res) => {
  try {
    const filePath = req.params.path;
    
    // Get existing file to get SHA
    const existingFile = await req.github.getFile(filePath);
    if (!existingFile) {
      return res.status(404).json({ error: 'Media file not found' });
    }
    
    // Delete from GitHub
    await req.github.deleteFile(
      filePath,
      `Delete media file: ${filePath}`,
      existingFile.sha
    );
    
    res.json({
      message: 'Media file deleted successfully',
      path: filePath
    });
  } catch (error) {
    console.error('Error deleting media file:', error);
    res.status(500).json({ error: 'Failed to delete media file' });
  }
});

// Get media file info
router.get('/:path(*)', async (req, res) => {
  try {
    const filePath = req.params.path;
    
    const fileContent = await req.github.getFile(filePath);
    if (!fileContent) {
      return res.status(404).json({ error: 'Media file not found' });
    }
    
    res.json({
      filename: filePath.split('/').pop(),
      path: filePath,
      sha: fileContent.sha,
      url: `/${filePath}`,
      type: 'image'
    });
  } catch (error) {
    console.error('Error fetching media file info:', error);
    res.status(500).json({ error: 'Failed to fetch media file info' });
  }
});

module.exports = router;