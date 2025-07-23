/**
 * 認證管理模組
 * 處理用戶認證和 token 管理
 */

class AuthManager {
    constructor() {
        this.tokenKey = 'github_token_encrypted';
        this.userKey = 'github_user_info';
        this.secretKey = 'blog_admin_secret_2024';
        this.github = null;
        this.currentUser = null;
    }

    /**
     * 簡單的字符串加密（基於 XOR）
     */
    encrypt(text) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(
                text.charCodeAt(i) ^ this.secretKey.charCodeAt(i % this.secretKey.length)
            );
        }
        return btoa(result);
    }

    /**
     * 簡單的字符串解密
     */
    decrypt(encrypted) {
        try {
            const text = atob(encrypted);
            let result = '';
            for (let i = 0; i < text.length; i++) {
                result += String.fromCharCode(
                    text.charCodeAt(i) ^ this.secretKey.charCodeAt(i % this.secretKey.length)
                );
            }
            return result;
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }

    /**
     * 保存 token 到本地存儲
     */
    saveToken(token) {
        try {
            const encrypted = this.encrypt(token);
            localStorage.setItem(this.tokenKey, encrypted);
            return true;
        } catch (error) {
            console.error('Failed to save token:', error);
            return false;
        }
    }

    /**
     * 從本地存儲獲取 token
     */
    getToken() {
        try {
            const encrypted = localStorage.getItem(this.tokenKey);
            if (!encrypted) return null;
            return this.decrypt(encrypted);
        } catch (error) {
            console.error('Failed to get token:', error);
            return null;
        }
    }

    /**
     * 清除存儲的認證信息
     */
    clearAuth() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.github = null;
        this.currentUser = null;
    }

    /**
     * 保存用戶信息
     */
    saveUserInfo(user) {
        try {
            localStorage.setItem(this.userKey, JSON.stringify(user));
            this.currentUser = user;
        } catch (error) {
            console.error('Failed to save user info:', error);
        }
    }

    /**
     * 獲取用戶信息
     */
    getUserInfo() {
        try {
            const userJson = localStorage.getItem(this.userKey);
            if (userJson) {
                this.currentUser = JSON.parse(userJson);
                return this.currentUser;
            }
        } catch (error) {
            console.error('Failed to get user info:', error);
        }
        return null;
    }

    /**
     * 驗證 token 格式
     */
    validateTokenFormat(token) {
        // GitHub Personal Access Token 格式驗證
        const patterns = [
            /^ghp_[a-zA-Z0-9]{36}$/, // 新格式
            /^[a-f0-9]{40}$/,        // 舊格式
        ];
        
        return patterns.some(pattern => pattern.test(token));
    }

    /**
     * 使用 token 登入
     */
    async login(token) {
        try {
            // 驗證 token 格式
            if (!this.validateTokenFormat(token)) {
                throw new Error('Token 格式不正確。請確認您輸入的是有效的 GitHub Personal Access Token。');
            }

            // 創建 GitHub API 實例
            this.github = new GitHubAPI(token);

            // 驗證用戶身份
            const user = await this.github.verifyUser();

            // 保存認證信息
            this.saveToken(token);
            this.saveUserInfo(user);

            return {
                success: true,
                user: user,
                message: '登入成功！'
            };
        } catch (error) {
            console.error('Login failed:', error);
            this.clearAuth();
            
            return {
                success: false,
                error: error.message || '登入失敗，請檢查您的 token 是否正確。'
            };
        }
    }

    /**
     * 登出
     */
    logout() {
        this.clearAuth();
        return {
            success: true,
            message: '已成功登出'
        };
    }

    /**
     * 檢查是否已登入
     */
    isLoggedIn() {
        const token = this.getToken();
        const user = this.getUserInfo();
        return !!(token && user);
    }

    /**
     * 獲取當前 GitHub API 實例
     */
    getGitHubAPI() {
        if (!this.github) {
            const token = this.getToken();
            if (token) {
                this.github = new GitHubAPI(token);
            }
        }
        return this.github;
    }

    /**
     * 自動初始化（如果已有有效的認證信息）
     */
    async autoInit() {
        try {
            const token = this.getToken();
            const user = this.getUserInfo();

            if (token && user) {
                this.github = new GitHubAPI(token);
                this.currentUser = user;

                // 驗證 token 是否仍然有效
                try {
                    await this.github.verifyUser();
                    return {
                        success: true,
                        user: user,
                        message: '自動登入成功'
                    };
                } catch (error) {
                    // Token 已過期或無效，清除認證信息
                    this.clearAuth();
                    return {
                        success: false,
                        error: 'Token 已過期，請重新登入'
                    };
                }
            }

            return {
                success: false,
                error: '未找到有效的認證信息'
            };
        } catch (error) {
            console.error('Auto init failed:', error);
            return {
                success: false,
                error: '自動初始化失敗'
            };
        }
    }

    /**
     * 刷新用戶信息
     */
    async refreshUserInfo() {
        try {
            if (!this.github) {
                throw new Error('未初始化 GitHub API');
            }

            const user = await this.github.verifyUser();
            this.saveUserInfo(user);
            return user;
        } catch (error) {
            console.error('Failed to refresh user info:', error);
            throw error;
        }
    }

    /**
     * 檢查權限
     */
    hasPermission(permission) {
        if (!this.currentUser) return false;

        switch (permission) {
            case 'admin':
                return this.currentUser.login === 'tonyonier99';
            case 'write':
                return this.currentUser.login === 'tonyonier99';
            case 'read':
                return this.currentUser.login === 'tonyonier99';
            default:
                return false;
        }
    }

    /**
     * 生成新 token 的鏈接
     */
    getNewTokenURL() {
        const params = new URLSearchParams({
            scopes: 'repo',
            description: 'Blog Admin Panel - ' + new Date().toLocaleDateString()
        });
        
        return `https://github.com/settings/tokens/new?${params.toString()}`;
    }

    /**
     * 獲取當前用戶信息
     */
    getCurrentUser() {
        return this.currentUser || this.getUserInfo();
    }

    /**
     * 導出認證信息（用於備份）
     */
    exportAuthData() {
        const token = this.getToken();
        const user = this.getUserInfo();
        
        if (!token || !user) {
            throw new Error('沒有可導出的認證信息');
        }

        return {
            token: token,
            user: user,
            exportTime: new Date().toISOString()
        };
    }

    /**
     * 導入認證信息（用於恢復）
     */
    async importAuthData(authData) {
        try {
            if (!authData.token || !authData.user) {
                throw new Error('認證數據格式不正確');
            }

            // 驗證導入的 token
            const result = await this.login(authData.token);
            if (!result.success) {
                throw new Error(result.error);
            }

            return {
                success: true,
                message: '認證信息導入成功'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || '導入失敗'
            };
        }
    }

    /**
     * 檢查 token 健康狀態
     */
    async checkTokenHealth() {
        try {
            if (!this.github) {
                return {
                    healthy: false,
                    message: 'GitHub API 未初始化'
                };
            }

            // 嘗試獲取用戶信息
            const user = await this.github.verifyUser();
            
            // 檢查 rate limit
            const response = await fetch('https://api.github.com/rate_limit', {
                headers: {
                    'Authorization': `token ${this.getToken()}`
                }
            });
            
            const rateLimit = await response.json();
            
            return {
                healthy: true,
                user: user,
                rateLimit: rateLimit.rate,
                message: 'Token 健康狀態良好'
            };
        } catch (error) {
            return {
                healthy: false,
                message: error.message || 'Token 健康檢查失敗'
            };
        }
    }
}