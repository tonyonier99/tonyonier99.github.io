/**
 * GitHub API 服務模組
 * 處理所有與 GitHub API 相關的操作
 */

class GitHubAPI {
    constructor(token) {
        this.token = token;
        this.baseURL = 'https://api.github.com';
        this.owner = 'tonyonier99';
        this.repo = 'tonyonier99.github.io';
        this.headers = {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
        };
    }

    /**
     * 通用 API 請求方法
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.headers,
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            // 如果是 204 No Content，直接返回 null
            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('GitHub API request failed:', error);
            throw error;
        }
    }

    /**
     * 驗證用戶身份
     */
    async verifyUser() {
        try {
            const user = await this.request('/user');
            if (user.login !== this.owner) {
                throw new Error('您無權限訪問此管理後台');
            }
            return user;
        } catch (error) {
            throw new Error('身份驗證失敗：' + error.message);
        }
    }

    /**
     * 獲取倉庫資訊
     */
    async getRepository() {
        return await this.request(`/repos/${this.owner}/${this.repo}`);
    }

    /**
     * 獲取文件內容
     */
    async getFile(path) {
        try {
            const response = await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`);
            if (response.type === 'file') {
                return {
                    ...response,
                    content: atob(response.content.replace(/\s/g, '')),
                };
            }
            return response;
        } catch (error) {
            if (error.message.includes('404')) {
                return null;
            }
            throw error;
        }
    }

    /**
     * 創建或更新文件
     */
    async createOrUpdateFile(path, content, message, sha = null) {
        const data = {
            message,
            content: btoa(unescape(encodeURIComponent(content))), // 處理 UTF-8 編碼
        };

        if (sha) {
            data.sha = sha;
        }

        return await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    /**
     * 刪除文件
     */
    async deleteFile(path, message, sha) {
        const data = {
            message,
            sha,
        };

        return await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
            method: 'DELETE',
            body: JSON.stringify(data),
        });
    }

    /**
     * 獲取目錄內容
     */
    async getDirectoryContents(path = '') {
        return await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`);
    }

    /**
     * 獲取所有文章
     */
    async getPosts() {
        try {
            const contents = await this.getDirectoryContents('posts');
            const posts = [];

            for (const item of contents) {
                if (item.type === 'file' && item.name.endsWith('.md')) {
                    const file = await this.getFile(item.path);
                    if (file && file.content) {
                        const metadata = this.parsePostMetadata(file.content);
                        posts.push({
                            filename: item.name,
                            path: item.path,
                            sha: file.sha,
                            content: file.content,
                            metadata,
                            lastModified: item.updated_at || item.created_at,
                        });
                    }
                }
            }

            // 按日期排序
            return posts.sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));
        } catch (error) {
            console.error('Failed to get posts:', error);
            return [];
        }
    }

    /**
     * 獲取所有頁面
     */
    async getPages() {
        try {
            const contents = await this.getDirectoryContents('');
            const pages = [];

            for (const item of contents) {
                if (item.type === 'file' && item.name.endsWith('.md') && 
                    !item.name.startsWith('_') && item.name !== 'README.md') {
                    const file = await this.getFile(item.path);
                    if (file && file.content) {
                        const metadata = this.parsePageMetadata(file.content);
                        pages.push({
                            filename: item.name,
                            path: item.path,
                            sha: file.sha,
                            content: file.content,
                            metadata,
                            lastModified: item.updated_at || item.created_at,
                        });
                    }
                }
            }

            return pages;
        } catch (error) {
            console.error('Failed to get pages:', error);
            return [];
        }
    }

    /**
     * 獲取媒體文件
     */
    async getMediaFiles() {
        try {
            const assets = await this.getDirectoryContents('assets');
            const mediaFiles = [];

            for (const item of assets) {
                if (item.type === 'file' && this.isMediaFile(item.name)) {
                    mediaFiles.push({
                        filename: item.name,
                        path: item.path,
                        sha: item.sha,
                        size: item.size,
                        downloadUrl: item.download_url,
                        lastModified: item.updated_at || item.created_at,
                    });
                }
            }

            return mediaFiles;
        } catch (error) {
            console.error('Failed to get media files:', error);
            return [];
        }
    }

    /**
     * 上傳媒體文件
     */
    async uploadMedia(file, targetPath = null) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const content = e.target.result.split(',')[1]; // 移除 data URL 前綴
                    const filename = targetPath || `assets/images/${file.name}`;
                    const message = `Upload media: ${file.name}`;

                    const result = await this.request(`/repos/${this.owner}/${this.repo}/contents/${filename}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            message,
                            content,
                        }),
                    });

                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('文件讀取失敗'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * 獲取網站配置
     */
    async getSiteConfig() {
        try {
            const file = await this.getFile('_config.yml');
            return file ? file.content : '';
        } catch (error) {
            console.error('Failed to get site config:', error);
            return '';
        }
    }

    /**
     * 更新網站配置
     */
    async updateSiteConfig(content) {
        const file = await this.getFile('_config.yml');
        return await this.createOrUpdateFile(
            '_config.yml',
            content,
            'Update site configuration',
            file ? file.sha : null
        );
    }

    /**
     * 獲取倉庫統計
     */
    async getRepositoryStats() {
        try {
            const repo = await this.getRepository();
            const posts = await this.getPosts();
            const pages = await this.getPages();
            const media = await this.getMediaFiles();

            return {
                posts: posts.length,
                pages: pages.length,
                media: media.length,
                size: repo.size,
                language: repo.language,
                lastPush: repo.pushed_at,
                watchers: repo.watchers_count,
                forks: repo.forks_count,
                stars: repo.stargazers_count,
            };
        } catch (error) {
            console.error('Failed to get repository stats:', error);
            return {
                posts: 0,
                pages: 0,
                media: 0,
                size: 0,
                language: 'Unknown',
                lastPush: null,
                watchers: 0,
                forks: 0,
                stars: 0,
            };
        }
    }

    /**
     * 解析文章元數據
     */
    parsePostMetadata(content) {
        const metadata = {
            title: '',
            date: '',
            author: '',
            categories: [],
            tags: [],
            description: '',
            excerpt: '',
            layout: 'post',
        };

        if (!content.startsWith('---')) {
            return metadata;
        }

        const endIndex = content.indexOf('---', 3);
        if (endIndex === -1) {
            return metadata;
        }

        const frontMatter = content.substring(3, endIndex);
        const lines = frontMatter.split('\n');

        for (const line of lines) {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
                const cleanKey = key.trim();

                if (cleanKey === 'categories' || cleanKey === 'tags') {
                    if (value.startsWith('[') && value.endsWith(']')) {
                        metadata[cleanKey] = value.slice(1, -1).split(',').map(t => t.trim().replace(/^["']|["']$/g, ''));
                    } else {
                        metadata[cleanKey] = [value];
                    }
                } else {
                    metadata[cleanKey] = value;
                }
            }
        }

        return metadata;
    }

    /**
     * 解析頁面元數據
     */
    parsePageMetadata(content) {
        const metadata = {
            title: '',
            layout: 'page',
            permalink: '',
            description: '',
        };

        if (!content.startsWith('---')) {
            return metadata;
        }

        const endIndex = content.indexOf('---', 3);
        if (endIndex === -1) {
            return metadata;
        }

        const frontMatter = content.substring(3, endIndex);
        const lines = frontMatter.split('\n');

        for (const line of lines) {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
                metadata[key.trim()] = value;
            }
        }

        return metadata;
    }

    /**
     * 生成文章前端內容
     */
    generatePostFrontMatter(metadata) {
        const lines = ['---'];
        
        const fields = ['layout', 'title', 'date', 'author', 'categories', 'tags', 'description', 'excerpt'];
        
        for (const field of fields) {
            if (metadata[field] !== undefined && metadata[field] !== '') {
                if (Array.isArray(metadata[field])) {
                    if (metadata[field].length > 0) {
                        lines.push(`${field}: [${metadata[field].map(t => `"${t}"`).join(', ')}]`);
                    }
                } else {
                    lines.push(`${field}: "${metadata[field]}"`);
                }
            }
        }
        
        lines.push('---');
        return lines.join('\n');
    }

    /**
     * 生成頁面前端內容
     */
    generatePageFrontMatter(metadata) {
        const lines = ['---'];
        
        const fields = ['layout', 'title', 'permalink', 'description'];
        
        for (const field of fields) {
            if (metadata[field] !== undefined && metadata[field] !== '') {
                lines.push(`${field}: "${metadata[field]}"`);
            }
        }
        
        lines.push('---');
        return lines.join('\n');
    }

    /**
     * 檢查是否為媒體文件
     */
    isMediaFile(filename) {
        const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.pdf', '.mp4', '.mp3'];
        return mediaExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    }

    /**
     * 格式化文件大小
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * 格式化日期
     */
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    /**
     * 生成文章文件名
     */
    generatePostFilename(title, date) {
        const dateStr = new Date(date).toISOString().split('T')[0];
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
            .replace(/^-|-$/g, '');
        return `_posts_${dateStr}-${slug}.md`;
    }
}