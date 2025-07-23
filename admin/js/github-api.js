/**
 * GitHub API Interface
 * Handles all GitHub API interactions
 */

const GitHubAPI = {
    baseURL: 'https://api.github.com',
    token: null,
    user: null,

    /**
     * Set authentication token
     * @param {string} token - GitHub token
     */
    setToken(token) {
        this.token = token;
        // Store in localStorage (encrypted in production)
        localStorage.setItem('github_token', token);
    },

    /**
     * Get stored token
     * @returns {string|null} - Stored token
     */
    getToken() {
        if (!this.token) {
            this.token = localStorage.getItem('github_token');
        }
        return this.token;
    },

    /**
     * Clear authentication
     */
    clearAuth() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('github_token');
        localStorage.removeItem('github_user');
    },

    /**
     * Make API request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} - API response
     */
    async request(endpoint, options = {}) {
        const token = this.getToken();
        if (!token) {
            throw new Error('未提供 GitHub token');
        }

        const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
        
        const config = {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            // Handle different content types
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error('GitHub API request failed:', error);
            throw error;
        }
    },

    /**
     * Get current user
     * @returns {Promise<Object>} - User data
     */
    async getCurrentUser() {
        if (this.user) return this.user;
        
        try {
            this.user = await this.request('/user');
            localStorage.setItem('github_user', JSON.stringify(this.user));
            return this.user;
        } catch (error) {
            console.error('Failed to get current user:', error);
            throw error;
        }
    },

    /**
     * Get user repositories
     * @param {Object} params - Query parameters
     * @returns {Promise<Array>} - Repository list
     */
    async getRepositories(params = {}) {
        const queryParams = new URLSearchParams({
            sort: 'updated',
            per_page: 100,
            ...params
        });

        try {
            return await this.request(`/user/repos?${queryParams}`);
        } catch (error) {
            console.error('Failed to get repositories:', error);
            throw error;
        }
    },

    /**
     * Get repository details
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @returns {Promise<Object>} - Repository data
     */
    async getRepository(owner, repo) {
        try {
            return await this.request(`/repos/${owner}/${repo}`);
        } catch (error) {
            console.error('Failed to get repository:', error);
            throw error;
        }
    },

    /**
     * Create new repository
     * @param {Object} data - Repository data
     * @returns {Promise<Object>} - Created repository
     */
    async createRepository(data) {
        try {
            return await this.request('/user/repos', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('Failed to create repository:', error);
            throw error;
        }
    },

    /**
     * Update repository
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {Object} data - Update data
     * @returns {Promise<Object>} - Updated repository
     */
    async updateRepository(owner, repo, data) {
        try {
            return await this.request(`/repos/${owner}/${repo}`, {
                method: 'PATCH',
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('Failed to update repository:', error);
            throw error;
        }
    },

    /**
     * Delete repository
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @returns {Promise<void>}
     */
    async deleteRepository(owner, repo) {
        try {
            await this.request(`/repos/${owner}/${repo}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Failed to delete repository:', error);
            throw error;
        }
    },

    /**
     * Get repository issues
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {Object} params - Query parameters
     * @returns {Promise<Array>} - Issues list
     */
    async getIssues(owner, repo, params = {}) {
        const queryParams = new URLSearchParams({
            state: 'open',
            sort: 'updated',
            per_page: 100,
            ...params
        });

        try {
            return await this.request(`/repos/${owner}/${repo}/issues?${queryParams}`);
        } catch (error) {
            console.error('Failed to get issues:', error);
            throw error;
        }
    },

    /**
     * Get issue details
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {number} issueNumber - Issue number
     * @returns {Promise<Object>} - Issue data
     */
    async getIssue(owner, repo, issueNumber) {
        try {
            return await this.request(`/repos/${owner}/${repo}/issues/${issueNumber}`);
        } catch (error) {
            console.error('Failed to get issue:', error);
            throw error;
        }
    },

    /**
     * Create new issue
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {Object} data - Issue data
     * @returns {Promise<Object>} - Created issue
     */
    async createIssue(owner, repo, data) {
        try {
            return await this.request(`/repos/${owner}/${repo}/issues`, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('Failed to create issue:', error);
            throw error;
        }
    },

    /**
     * Update issue
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {number} issueNumber - Issue number
     * @param {Object} data - Update data
     * @returns {Promise<Object>} - Updated issue
     */
    async updateIssue(owner, repo, issueNumber, data) {
        try {
            return await this.request(`/repos/${owner}/${repo}/issues/${issueNumber}`, {
                method: 'PATCH',
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('Failed to update issue:', error);
            throw error;
        }
    },

    /**
     * Get repository pull requests
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {Object} params - Query parameters
     * @returns {Promise<Array>} - Pull requests list
     */
    async getPullRequests(owner, repo, params = {}) {
        const queryParams = new URLSearchParams({
            state: 'open',
            sort: 'updated',
            per_page: 100,
            ...params
        });

        try {
            return await this.request(`/repos/${owner}/${repo}/pulls?${queryParams}`);
        } catch (error) {
            console.error('Failed to get pull requests:', error);
            throw error;
        }
    },

    /**
     * Get pull request details
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {number} pullNumber - Pull request number
     * @returns {Promise<Object>} - Pull request data
     */
    async getPullRequest(owner, repo, pullNumber) {
        try {
            return await this.request(`/repos/${owner}/${repo}/pulls/${pullNumber}`);
        } catch (error) {
            console.error('Failed to get pull request:', error);
            throw error;
        }
    },

    /**
     * Merge pull request
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {number} pullNumber - Pull request number
     * @param {Object} data - Merge data
     * @returns {Promise<Object>} - Merge result
     */
    async mergePullRequest(owner, repo, pullNumber, data = {}) {
        try {
            return await this.request(`/repos/${owner}/${repo}/pulls/${pullNumber}/merge`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('Failed to merge pull request:', error);
            throw error;
        }
    },

    /**
     * Get repository contents
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {string} path - File path
     * @param {string} ref - Git reference
     * @returns {Promise<Object|Array>} - File contents or directory listing
     */
    async getContents(owner, repo, path = '', ref = 'main') {
        const queryParams = new URLSearchParams({ ref });
        
        try {
            return await this.request(`/repos/${owner}/${repo}/contents/${path}?${queryParams}`);
        } catch (error) {
            console.error('Failed to get contents:', error);
            throw error;
        }
    },

    /**
     * Get file content
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {string} path - File path
     * @param {string} ref - Git reference
     * @returns {Promise<string>} - File content
     */
    async getFileContent(owner, repo, path, ref = 'main') {
        try {
            const data = await this.getContents(owner, repo, path, ref);
            if (data.type === 'file') {
                return atob(data.content.replace(/\s/g, ''));
            }
            throw new Error('路徑不是檔案');
        } catch (error) {
            console.error('Failed to get file content:', error);
            throw error;
        }
    },

    /**
     * Create or update file
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {string} path - File path
     * @param {Object} data - File data
     * @returns {Promise<Object>} - Commit data
     */
    async createOrUpdateFile(owner, repo, path, data) {
        try {
            return await this.request(`/repos/${owner}/${repo}/contents/${path}`, {
                method: 'PUT',
                body: JSON.stringify({
                    ...data,
                    content: btoa(unescape(encodeURIComponent(data.content)))
                })
            });
        } catch (error) {
            console.error('Failed to create/update file:', error);
            throw error;
        }
    },

    /**
     * Delete file
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {string} path - File path
     * @param {Object} data - Delete data (message, sha)
     * @returns {Promise<Object>} - Commit data
     */
    async deleteFile(owner, repo, path, data) {
        try {
            return await this.request(`/repos/${owner}/${repo}/contents/${path}`, {
                method: 'DELETE',
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('Failed to delete file:', error);
            throw error;
        }
    },

    /**
     * Get repository branches
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @returns {Promise<Array>} - Branches list
     */
    async getBranches(owner, repo) {
        try {
            return await this.request(`/repos/${owner}/${repo}/branches`);
        } catch (error) {
            console.error('Failed to get branches:', error);
            throw error;
        }
    },

    /**
     * Get repository commits
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {Object} params - Query parameters
     * @returns {Promise<Array>} - Commits list
     */
    async getCommits(owner, repo, params = {}) {
        const queryParams = new URLSearchParams({
            per_page: 50,
            ...params
        });

        try {
            return await this.request(`/repos/${owner}/${repo}/commits?${queryParams}`);
        } catch (error) {
            console.error('Failed to get commits:', error);
            throw error;
        }
    },

    /**
     * Get repository labels
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @returns {Promise<Array>} - Labels list
     */
    async getLabels(owner, repo) {
        try {
            return await this.request(`/repos/${owner}/${repo}/labels`);
        } catch (error) {
            console.error('Failed to get labels:', error);
            throw error;
        }
    },

    /**
     * Create label
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {Object} data - Label data
     * @returns {Promise<Object>} - Created label
     */
    async createLabel(owner, repo, data) {
        try {
            return await this.request(`/repos/${owner}/${repo}/labels`, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('Failed to create label:', error);
            throw error;
        }
    },

    /**
     * Get repository collaborators
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @returns {Promise<Array>} - Collaborators list
     */
    async getCollaborators(owner, repo) {
        try {
            return await this.request(`/repos/${owner}/${repo}/collaborators`);
        } catch (error) {
            console.error('Failed to get collaborators:', error);
            throw error;
        }
    },

    /**
     * Search repositories
     * @param {string} query - Search query
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} - Search results
     */
    async searchRepositories(query, params = {}) {
        const queryParams = new URLSearchParams({
            q: query,
            sort: 'updated',
            per_page: 50,
            ...params
        });

        try {
            return await this.request(`/search/repositories?${queryParams}`);
        } catch (error) {
            console.error('Failed to search repositories:', error);
            throw error;
        }
    },

    /**
     * Search issues
     * @param {string} query - Search query
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} - Search results
     */
    async searchIssues(query, params = {}) {
        const queryParams = new URLSearchParams({
            q: query,
            sort: 'updated',
            per_page: 50,
            ...params
        });

        try {
            return await this.request(`/search/issues?${queryParams}`);
        } catch (error) {
            console.error('Failed to search issues:', error);
            throw error;
        }
    },

    /**
     * Get repository statistics
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @returns {Promise<Object>} - Repository statistics
     */
    async getRepositoryStats(owner, repo) {
        try {
            const [repository, commits, contributors, languages] = await Promise.all([
                this.getRepository(owner, repo),
                this.getCommits(owner, repo, { per_page: 1 }),
                this.request(`/repos/${owner}/${repo}/contributors`).catch(() => []),
                this.request(`/repos/${owner}/${repo}/languages`).catch(() => ({}))
            ]);

            return {
                repository,
                totalCommits: commits.length,
                contributors: contributors.length,
                languages: Object.keys(languages),
                primaryLanguage: Object.keys(languages)[0] || 'Unknown'
            };
        } catch (error) {
            console.error('Failed to get repository stats:', error);
            throw error;
        }
    },

    /**
     * Get user's activity
     * @param {string} username - Username (optional, defaults to current user)
     * @returns {Promise<Array>} - Activity events
     */
    async getUserActivity(username) {
        const user = username || (await this.getCurrentUser()).login;
        
        try {
            return await this.request(`/users/${user}/events/public`);
        } catch (error) {
            console.error('Failed to get user activity:', error);
            throw error;
        }
    },

    /**
     * Validate token
     * @param {string} token - Token to validate
     * @returns {Promise<boolean>} - Is token valid
     */
    async validateToken(token) {
        try {
            const tempToken = this.token;
            this.token = token;
            
            await this.request('/user');
            
            this.token = tempToken;
            return true;
        } catch (error) {
            this.token = tempToken;
            return false;
        }
    },

    /**
     * Get rate limit status
     * @returns {Promise<Object>} - Rate limit information
     */
    async getRateLimit() {
        try {
            return await this.request('/rate_limit');
        } catch (error) {
            console.error('Failed to get rate limit:', error);
            throw error;
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GitHubAPI;
}