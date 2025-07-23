// Authentication module for GitHub Personal Access Token
class Auth {
    constructor() {
        this.token = null;
        this.user = null;
        this.STORAGE_KEY = 'github_token';
        this.USER_STORAGE_KEY = 'github_user';
        this.REPO_OWNER = 'tonyonier99';
        this.REPO_NAME = 'tonyonier99.github.io';
    }

    // Initialize authentication
    async init() {
        const storedToken = this.getStoredToken();
        if (storedToken) {
            this.token = storedToken;
            try {
                await this.validateToken();
                return true;
            } catch (error) {
                console.warn('Stored token is invalid:', error);
                this.clearStorage();
                return false;
            }
        }
        return false;
    }

    // Login with GitHub token
    async login(token) {
        if (!token || !token.startsWith('ghp_')) {
            throw new Error('請輸入有效的 GitHub Personal Access Token (以 ghp_ 開頭)');
        }

        this.token = token;
        
        try {
            await this.validateToken();
            this.storeToken(token);
            return this.user;
        } catch (error) {
            this.token = null;
            throw new Error('Token 驗證失敗：' + error.message);
        }
    }

    // Validate token by fetching user info
    async validateToken() {
        if (!this.token) {
            throw new Error('No token provided');
        }

        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Token 無效或已過期');
            } else if (response.status === 403) {
                throw new Error('Token 權限不足，請確保具有 repo 權限');
            } else {
                throw new Error(`驗證失敗 (${response.status})`);
            }
        }

        const user = await response.json();
        
        // Check if user has access to the repository
        await this.checkRepoAccess();
        
        this.user = user;
        this.storeUser(user);
        return user;
    }

    // Check if user has access to the target repository
    async checkRepoAccess() {
        const response = await fetch(`https://api.github.com/repos/${this.REPO_OWNER}/${this.REPO_NAME}`, {
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('無法存取目標儲存庫，請確保 Token 具有正確權限');
            } else if (response.status === 403) {
                throw new Error('儲存庫存取權限不足');
            } else {
                throw new Error(`儲存庫存取檢查失敗 (${response.status})`);
            }
        }

        const repo = await response.json();
        return repo;
    }

    // Logout
    logout() {
        this.token = null;
        this.user = null;
        this.clearStorage();
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.token !== null && this.user !== null;
    }

    // Get current user
    getUser() {
        return this.user;
    }

    // Get authentication headers for API calls
    getAuthHeaders() {
        if (!this.token) {
            throw new Error('Not authenticated');
        }
        
        return {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };
    }

    // Store token in localStorage (with basic encoding)
    storeToken(token) {
        try {
            // Simple base64 encoding for basic obfuscation
            const encoded = btoa(token);
            localStorage.setItem(this.STORAGE_KEY, encoded);
        } catch (error) {
            console.error('Failed to store token:', error);
        }
    }

    // Store user info in localStorage
    storeUser(user) {
        try {
            localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
        } catch (error) {
            console.error('Failed to store user info:', error);
        }
    }

    // Get stored token
    getStoredToken() {
        try {
            const encoded = localStorage.getItem(this.STORAGE_KEY);
            if (encoded) {
                return atob(encoded);
            }
        } catch (error) {
            console.error('Failed to retrieve token:', error);
        }
        return null;
    }

    // Get stored user info
    getStoredUser() {
        try {
            const userJson = localStorage.getItem(this.USER_STORAGE_KEY);
            if (userJson) {
                this.user = JSON.parse(userJson);
                return this.user;
            }
        } catch (error) {
            console.error('Failed to retrieve user info:', error);
        }
        return null;
    }

    // Clear all stored data
    clearStorage() {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.USER_STORAGE_KEY);
    }

    // Get repository info
    getRepoInfo() {
        return {
            owner: this.REPO_OWNER,
            name: this.REPO_NAME,
            fullName: `${this.REPO_OWNER}/${this.REPO_NAME}`
        };
    }

    // Check if current user is the repository owner
    isRepoOwner() {
        return this.user && this.user.login === this.REPO_OWNER;
    }

    // Generate GitHub URLs
    getRepoUrl() {
        return `https://github.com/${this.REPO_OWNER}/${this.REPO_NAME}`;
    }

    getSiteUrl() {
        return `https://${this.REPO_OWNER}.github.io`;
    }
}

// Export for use in other modules
window.Auth = Auth;