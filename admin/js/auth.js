/**
 * Authentication module for GitHub Admin Interface
 * Handles OAuth flow and token-based authentication
 */

const Auth = {
    // GitHub OAuth configuration
    oauth: {
        clientId: 'Ov23li2qZauNq6WF0wRQ', // This would be your GitHub OAuth App Client ID
        redirectUri: window.location.origin + '/admin/login.html',
        scope: 'repo,user,delete_repo',
        state: null
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} - Authentication status
     */
    isAuthenticated() {
        const token = GitHubAPI.getToken();
        return !!token;
    },

    /**
     * Get current user info
     * @returns {Object|null} - User data
     */
    getCurrentUser() {
        const userStr = localStorage.getItem('github_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Initiate OAuth flow
     */
    initiateOAuth() {
        // Generate random state for CSRF protection
        this.oauth.state = this.generateRandomString(32);
        localStorage.setItem('oauth_state', this.oauth.state);

        // Build OAuth URL
        const params = new URLSearchParams({
            client_id: this.oauth.clientId,
            redirect_uri: this.oauth.redirectUri,
            scope: this.oauth.scope,
            state: this.oauth.state,
            allow_signup: 'false'
        });

        const oauthUrl = `https://github.com/login/oauth/authorize?${params}`;
        
        // Show loading state
        this.showLoginStatus('正在重定向到 GitHub...');
        
        // Redirect to GitHub
        window.location.href = oauthUrl;
    },

    /**
     * Handle OAuth callback
     * @param {string} code - Authorization code from GitHub
     */
    async handleOAuthCallback(code) {
        try {
            this.showLoginStatus('正在驗證授權碼...');
            
            // Verify state parameter
            const urlParams = new URLSearchParams(window.location.search);
            const returnedState = urlParams.get('state');
            const storedState = localStorage.getItem('oauth_state');
            
            if (!returnedState || returnedState !== storedState) {
                throw new Error('Invalid state parameter');
            }
            
            // Exchange code for token
            const token = await this.exchangeCodeForToken(code);
            
            if (!token) {
                throw new Error('Failed to get access token');
            }
            
            // Set token and get user info
            GitHubAPI.setToken(token);
            await this.loadUserInfo();
            
            // Clean up OAuth state
            localStorage.removeItem('oauth_state');
            
            // Redirect to main app
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('OAuth callback error:', error);
            this.showLoginError('OAuth 驗證失敗: ' + error.message);
        }
    },

    /**
     * Exchange authorization code for access token
     * Since this is frontend-only, we need to use a proxy service or GitHub's device flow
     * For demo purposes, this simulates the exchange
     * @param {string} code - Authorization code
     * @returns {Promise<string>} - Access token
     */
    async exchangeCodeForToken(code) {
        // In a real implementation, you would either:
        // 1. Use a serverless function/proxy to exchange the code
        // 2. Use GitHub's device flow for pure frontend apps
        // 3. Use a service like Auth0 or similar
        
        // For now, we'll show an error asking user to use Personal Access Token
        throw new Error('請使用 Personal Access Token 登入。完整的 OAuth 流程需要後端服務。');
    },

    /**
     * Login with Personal Access Token
     * @param {string} token - GitHub Personal Access Token
     */
    async loginWithToken(token) {
        try {
            this.showLoginStatus('正在驗證 Token...');
            
            if (!token || token.length < 20) {
                throw new Error('請輸入有效的 Personal Access Token');
            }
            
            // Validate token by making API call
            GitHubAPI.setToken(token);
            
            // Test token and get user info
            const user = await GitHubAPI.getCurrentUser();
            
            if (!user) {
                throw new Error('無法獲取用戶資訊');
            }
            
            // Store user info
            localStorage.setItem('github_user', JSON.stringify(user));
            
            Utils.showNotification('登入成功！', 'success');
            
            // Redirect to main app
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } catch (error) {
            console.error('Token login error:', error);
            GitHubAPI.clearAuth();
            this.showLoginError('Token 驗證失敗: ' + error.message);
        }
    },

    /**
     * Logout user
     */
    logout() {
        // Clear all stored data
        GitHubAPI.clearAuth();
        localStorage.removeItem('github_user');
        localStorage.removeItem('oauth_state');
        
        Utils.showNotification('已登出', 'info');
        
        // Redirect to login
        window.location.href = 'login.html';
    },

    /**
     * Load user information
     */
    async loadUserInfo() {
        try {
            const user = await GitHubAPI.getCurrentUser();
            localStorage.setItem('github_user', JSON.stringify(user));
            return user;
        } catch (error) {
            console.error('Failed to load user info:', error);
            throw error;
        }
    },

    /**
     * Validate current session
     * @returns {Promise<boolean>} - Is session valid
     */
    async validateSession() {
        try {
            if (!this.isAuthenticated()) {
                return false;
            }
            
            // Try to make an API call to validate token
            await GitHubAPI.getCurrentUser();
            return true;
            
        } catch (error) {
            console.error('Session validation failed:', error);
            this.logout();
            return false;
        }
    },

    /**
     * Show login status message
     * @param {string} message - Status message
     */
    showLoginStatus(message) {
        const statusEl = document.getElementById('login-status');
        const messageEl = document.getElementById('status-message');
        const errorEl = document.getElementById('login-error');
        
        if (statusEl && messageEl) {
            messageEl.textContent = message;
            statusEl.classList.remove('hidden');
        }
        
        if (errorEl) {
            errorEl.classList.add('hidden');
        }
        
        // Disable login buttons
        this.disableLoginButtons(true);
    },

    /**
     * Show login error message
     * @param {string} message - Error message
     */
    showLoginError(message) {
        const statusEl = document.getElementById('login-status');
        const errorEl = document.getElementById('login-error');
        const messageEl = document.getElementById('error-message');
        
        if (statusEl) {
            statusEl.classList.add('hidden');
        }
        
        if (errorEl && messageEl) {
            messageEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
        
        // Re-enable login buttons
        this.disableLoginButtons(false);
    },

    /**
     * Hide login status and error messages
     */
    hideLoginMessages() {
        const statusEl = document.getElementById('login-status');
        const errorEl = document.getElementById('login-error');
        
        if (statusEl) statusEl.classList.add('hidden');
        if (errorEl) errorEl.classList.add('hidden');
        
        this.disableLoginButtons(false);
    },

    /**
     * Disable/enable login buttons
     * @param {boolean} disabled - Should disable buttons
     */
    disableLoginButtons(disabled) {
        const oauthBtn = document.getElementById('github-oauth-btn');
        const tokenBtn = document.getElementById('token-login-btn');
        const tokenInput = document.getElementById('personal-token');
        
        if (oauthBtn) oauthBtn.disabled = disabled;
        if (tokenBtn) tokenBtn.disabled = disabled;
        if (tokenInput) tokenInput.disabled = disabled;
    },

    /**
     * Generate random string for OAuth state
     * @param {number} length - String length
     * @returns {string} - Random string
     */
    generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    /**
     * Check token permissions
     * @returns {Promise<Object>} - Token permissions info
     */
    async checkTokenPermissions() {
        try {
            // Make a test request to check permissions
            const headers = {};
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${GitHubAPI.getToken()}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            // Get scopes from response headers
            const scopes = response.headers.get('X-OAuth-Scopes');
            const scopesArray = scopes ? scopes.split(', ') : [];
            
            return {
                scopes: scopesArray,
                hasRepo: scopesArray.includes('repo') || scopesArray.includes('public_repo'),
                hasUser: scopesArray.includes('user'),
                hasDelete: scopesArray.includes('delete_repo'),
                isValid: response.ok
            };
            
        } catch (error) {
            console.error('Failed to check token permissions:', error);
            return {
                scopes: [],
                hasRepo: false,
                hasUser: false,
                hasDelete: false,
                isValid: false
            };
        }
    },

    /**
     * Get token creation guide
     * @returns {Object} - Guide information
     */
    getTokenGuide() {
        return {
            url: 'https://github.com/settings/tokens/new',
            requiredScopes: [
                { name: 'repo', description: '完整控制私有倉庫', required: true },
                { name: 'public_repo', description: '公開倉庫存取', required: true },
                { name: 'user', description: '讀取用戶資訊', required: true },
                { name: 'delete_repo', description: '刪除倉庫', required: false }
            ],
            instructions: [
                '前往 GitHub Settings > Developer settings > Personal access tokens',
                '點擊 "Generate new token"',
                '選擇適當的權限範圍 (scopes)',
                '複製生成的 token',
                '將 token 貼到登入表單中'
            ]
        };
    },

    /**
     * Initialize authentication system
     */
    init() {
        // Check if already authenticated
        if (this.isAuthenticated()) {
            // Validate session in background
            this.validateSession().catch(console.error);
        }
        
        // Set up automatic token refresh (if needed)
        this.setupTokenRefresh();
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isAuthenticated()) {
                this.validateSession().catch(console.error);
            }
        });
    },

    /**
     * Setup token refresh mechanism
     */
    setupTokenRefresh() {
        // Check token validity every 10 minutes
        setInterval(async () => {
            if (this.isAuthenticated()) {
                try {
                    await GitHubAPI.getCurrentUser();
                } catch (error) {
                    console.warn('Token validation failed, logging out');
                    this.logout();
                }
            }
        }, 10 * 60 * 1000); // 10 minutes
    },

    /**
     * Handle authentication errors
     * @param {Error} error - Authentication error
     */
    handleAuthError(error) {
        console.error('Authentication error:', error);
        
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            Utils.showNotification('認證已過期，請重新登入', 'warning');
            this.logout();
        } else if (error.message.includes('403') || error.message.includes('rate limit')) {
            Utils.showNotification('API 請求限制，請稍後再試', 'warning');
        } else {
            Utils.showNotification('認證錯誤: ' + error.message, 'error');
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}