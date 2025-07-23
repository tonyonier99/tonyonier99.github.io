// GitHub API wrapper for blog management
class GitHubAPI {
    constructor(auth) {
        this.auth = auth;
        this.baseUrl = 'https://api.github.com';
        this.repoInfo = auth.getRepoInfo();
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            ...this.auth.getAuthHeaders(),
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`GitHub API Error (${response.status}): ${error.message}`);
        }

        return response.json();
    }

    // Get repository information
    async getRepository() {
        return this.request(`/repos/${this.repoInfo.fullName}`);
    }

    // List all files in a directory
    async listFiles(path = '') {
        const encodedPath = encodeURIComponent(path);
        return this.request(`/repos/${this.repoInfo.fullName}/contents/${encodedPath}`);
    }

    // Get file content
    async getFile(path) {
        const encodedPath = encodeURIComponent(path);
        const response = await this.request(`/repos/${this.repoInfo.fullName}/contents/${encodedPath}`);
        
        if (response.content) {
            // Decode base64 content
            response.decodedContent = atob(response.content);
        }
        
        return response;
    }

    // Create or update a file
    async createOrUpdateFile(path, content, message, sha = null) {
        const encodedPath = encodeURIComponent(path);
        const body = {
            message,
            content: btoa(unescape(encodeURIComponent(content))), // Handle UTF-8 encoding
            ...(sha && { sha })
        };

        return this.request(`/repos/${this.repoInfo.fullName}/contents/${encodedPath}`, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    // Delete a file
    async deleteFile(path, message, sha) {
        const encodedPath = encodeURIComponent(path);
        const body = {
            message,
            sha
        };

        return this.request(`/repos/${this.repoInfo.fullName}/contents/${encodedPath}`, {
            method: 'DELETE',
            body: JSON.stringify(body)
        });
    }

    // Get all posts from the posts directory
    async getPosts() {
        try {
            const files = await this.listFiles('posts');
            const posts = [];

            for (const file of files) {
                if (file.name.startsWith('_posts_') && file.name.endsWith('.md')) {
                    try {
                        const content = await this.getFile(file.path);
                        const post = this.parsePost(content.decodedContent, file);
                        posts.push(post);
                    } catch (error) {
                        console.warn(`Failed to load post ${file.name}:`, error);
                    }
                }
            }

            // Sort posts by date (newest first)
            return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (error) {
            console.error('Failed to get posts:', error);
            return [];
        }
    }

    // Parse markdown post content
    parsePost(content, file) {
        const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(frontMatterRegex);

        if (!match) {
            throw new Error('Invalid post format: missing front matter');
        }

        const frontMatter = this.parseFrontMatter(match[1]);
        const body = match[2].trim();

        // Extract date from filename if not in front matter
        const dateMatch = file.name.match(/_posts_(\d{4}-\d{2}-\d{2})-/);
        const fileDate = dateMatch ? dateMatch[1] : null;

        return {
            ...frontMatter,
            content: body,
            filename: file.name,
            path: file.path,
            sha: file.sha,
            date: frontMatter.date || fileDate,
            url: file.html_url,
            downloadUrl: file.download_url
        };
    }

    // Parse YAML front matter
    parseFrontMatter(yamlString) {
        const frontMatter = {};
        const lines = yamlString.split('\n');

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;

            const colonIndex = trimmed.indexOf(':');
            if (colonIndex === -1) continue;

            const key = trimmed.substring(0, colonIndex).trim();
            let value = trimmed.substring(colonIndex + 1).trim();

            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }

            // Handle arrays (simple format: [item1, item2])
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).split(',').map(item => item.trim());
            }

            frontMatter[key] = value;
        }

        return frontMatter;
    }

    // Generate front matter YAML
    generateFrontMatter(post) {
        let yaml = '---\n';
        
        const fields = ['layout', 'title', 'date', 'categories', 'excerpt'];
        for (const field of fields) {
            if (post[field] !== undefined && post[field] !== null) {
                let value = post[field];
                
                if (Array.isArray(value)) {
                    value = `[${value.join(', ')}]`;
                } else if (typeof value === 'string' && value.includes(':')) {
                    value = `"${value}"`;
                }
                
                yaml += `${field}: ${value}\n`;
            }
        }
        
        yaml += '---\n';
        return yaml;
    }

    // Create a new post
    async createPost(postData) {
        const { title, date, categories, excerpt, content } = postData;
        
        // Generate filename
        const slug = this.generateSlug(title);
        const filename = `_posts_${date}-${slug}.md`;
        const path = `posts/${filename}`;

        // Prepare post content
        const frontMatter = this.generateFrontMatter({
            layout: 'post',
            title: title,
            date: date,
            categories: categories ? categories.split(',').map(c => c.trim()).filter(c => c) : [],
            excerpt: excerpt || ''
        });

        const fullContent = frontMatter + '\n' + content;

        // Create the file
        const result = await this.createOrUpdateFile(
            path,
            fullContent,
            `新增文章：${title}`
        );

        return {
            ...result,
            filename,
            path
        };
    }

    // Update an existing post
    async updatePost(originalPath, postData) {
        const { title, date, categories, excerpt, content } = postData;
        
        // Get current file info
        const currentFile = await this.getFile(originalPath);
        
        // Generate new filename if title or date changed
        const slug = this.generateSlug(title);
        const newFilename = `_posts_${date}-${slug}.md`;
        const newPath = `posts/${newFilename}`;

        // Prepare updated content
        const frontMatter = this.generateFrontMatter({
            layout: 'post',
            title: title,
            date: date,
            categories: categories ? categories.split(',').map(c => c.trim()).filter(c => c) : [],
            excerpt: excerpt || ''
        });

        const fullContent = frontMatter + '\n' + content;

        // If filename changed, delete old file and create new one
        if (originalPath !== newPath) {
            // Create new file
            await this.createOrUpdateFile(
                newPath,
                fullContent,
                `更新文章：${title}`
            );
            
            // Delete old file
            await this.deleteFile(
                originalPath,
                `刪除舊文章檔案：${originalPath}`,
                currentFile.sha
            );
            
            return { path: newPath, filename: newFilename };
        } else {
            // Update existing file
            const result = await this.createOrUpdateFile(
                originalPath,
                fullContent,
                `更新文章：${title}`,
                currentFile.sha
            );
            
            return { ...result, path: originalPath };
        }
    }

    // Delete a post
    async deletePost(path, sha, title) {
        return this.deleteFile(path, `刪除文章：${title}`, sha);
    }

    // Generate URL-friendly slug from title
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim('-'); // Remove leading/trailing hyphens
    }

    // Get website configuration
    async getConfig() {
        try {
            const file = await this.getFile('_config.yml');
            return this.parseYamlConfig(file.decodedContent);
        } catch (error) {
            console.error('Failed to get config:', error);
            return {};
        }
    }

    // Update website configuration
    async updateConfig(config) {
        const currentFile = await this.getFile('_config.yml');
        const yamlContent = this.generateYamlConfig(config);
        
        return this.createOrUpdateFile(
            '_config.yml',
            yamlContent,
            '更新網站設定',
            currentFile.sha
        );
    }

    // Parse YAML configuration
    parseYamlConfig(yamlString) {
        const config = {};
        const lines = yamlString.split('\n');
        let currentSection = null;
        let inArray = false;

        for (const line of lines) {
            const trimmed = line.trim();
            
            if (!trimmed || trimmed.startsWith('#')) continue;

            if (trimmed.endsWith(':') && !trimmed.includes(' ')) {
                // Section header
                currentSection = trimmed.slice(0, -1);
                config[currentSection] = {};
                inArray = false;
                continue;
            }

            if (trimmed.startsWith('- ')) {
                // Array item
                const key = currentSection || 'root';
                if (!Array.isArray(config[key])) {
                    config[key] = [];
                }
                config[key].push(trimmed.slice(2));
                inArray = true;
                continue;
            }

            const colonIndex = trimmed.indexOf(':');
            if (colonIndex === -1) continue;

            const key = trimmed.substring(0, colonIndex).trim();
            let value = trimmed.substring(colonIndex + 1).trim();

            // Remove quotes
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }

            if (currentSection && !inArray) {
                config[currentSection][key] = value;
            } else {
                config[key] = value;
            }
        }

        return config;
    }

    // Generate YAML configuration
    generateYamlConfig(config) {
        let yaml = '# 網站基本設定\n';
        
        // Basic settings
        const basicSettings = ['title', 'description', 'baseurl', 'url'];
        for (const setting of basicSettings) {
            if (config[setting]) {
                yaml += `${setting}: "${config[setting]}"\n`;
            }
        }
        
        yaml += '\n# 作者資訊\n';
        if (config.author) {
            yaml += 'author:\n';
            for (const [key, value] of Object.entries(config.author)) {
                yaml += `  ${key}: "${value}"\n`;
            }
        }
        
        // Add other sections as needed
        // This is a simplified version - full YAML generation would be more complex
        
        return yaml;
    }

    // Upload image to repository
    async uploadImage(file, path = 'assets/images/') {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const content = reader.result.split(',')[1]; // Remove data:image/xxx;base64, prefix
                    const filename = `${Date.now()}-${file.name}`;
                    const fullPath = `${path}${filename}`;
                    
                    const result = await this.request(`/repos/${this.repoInfo.fullName}/contents/${fullPath}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            message: `上傳圖片：${filename}`,
                            content: content
                        })
                    });
                    
                    resolve({
                        ...result,
                        url: `https://${this.repoInfo.owner}.github.io/${filename}`,
                        path: fullPath
                    });
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    // Get repository statistics
    async getStats() {
        try {
            const [repo, commits] = await Promise.all([
                this.getRepository(),
                this.request(`/repos/${this.repoInfo.fullName}/commits?per_page=1`)
            ]);

            const posts = await this.getPosts();
            
            return {
                totalPosts: posts.length,
                lastUpdate: commits[0] ? commits[0].commit.author.date : null,
                repoStats: {
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    size: repo.size
                }
            };
        } catch (error) {
            console.error('Failed to get stats:', error);
            return {
                totalPosts: 0,
                lastUpdate: null,
                repoStats: { stars: 0, forks: 0, size: 0 }
            };
        }
    }
}

// Export for use in other modules
window.GitHubAPI = GitHubAPI;