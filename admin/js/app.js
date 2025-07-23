/**
 * Main Application Entry Point
 * Initializes and coordinates all components
 */

const App = {
    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🚀 Initializing GitHub Admin Interface...');
            
            // Show loading screen
            this.showLoadingScreen();
            
            // Initialize authentication
            Auth.init();
            
            // Check authentication status
            if (!Auth.isAuthenticated()) {
                this.redirectToLogin();
                return;
            }
            
            // Initialize UI
            await this.initializeUI();
            
            // Load user data
            await this.loadUserData();
            
            // Initialize features
            await this.initializeFeatures();
            
            // Hide loading screen and show app
            this.showMainApp();
            
            console.log('✅ Application initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.handleInitializationError(error);
        }
    },

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const loginScreen = document.getElementById('login-screen');
        const mainApp = document.getElementById('main-app');
        
        if (loadingScreen) loadingScreen.classList.remove('hidden');
        if (loginScreen) loginScreen.classList.add('hidden');
        if (mainApp) mainApp.classList.add('hidden');
    },

    /**
     * Redirect to login
     */
    redirectToLogin() {
        window.location.href = 'login.html';
    },

    /**
     * Show main application
     */
    showMainApp() {
        const loadingScreen = document.getElementById('loading-screen');
        const loginScreen = document.getElementById('login-screen');
        const mainApp = document.getElementById('main-app');
        
        if (loadingScreen) loadingScreen.classList.add('hidden');
        if (loginScreen) loginScreen.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');
    },

    /**
     * Initialize UI components
     */
    async initializeUI() {
        UI.init();
        
        // Initialize tooltips
        this.initializeTooltips();
        
        // Initialize keyboard shortcuts help
        this.initializeKeyboardShortcuts();
        
        // Initialize periodic tasks
        this.initializePeriodicTasks();
    },

    /**
     * Load user data and populate UI
     */
    async loadUserData() {
        try {
            const user = await GitHubAPI.getCurrentUser();
            this.populateUserInfo(user);
            
            // Load basic statistics
            await this.loadDashboardStats();
            
        } catch (error) {
            console.error('Failed to load user data:', error);
            Utils.showNotification('載入用戶資料失敗', 'error');
            
            // If user data fails to load, token might be invalid
            if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                Auth.logout();
            }
        }
    },

    /**
     * Populate user information in UI
     * @param {Object} user - User data from GitHub API
     */
    populateUserInfo(user) {
        // Update header user info
        const userAvatar = document.getElementById('user-avatar');
        const username = document.getElementById('username');
        const profileLink = document.getElementById('profile-link');
        
        if (userAvatar) {
            userAvatar.src = user.avatar_url;
            userAvatar.alt = user.name || user.login;
        }
        
        if (username) {
            username.textContent = user.name || user.login;
        }
        
        if (profileLink) {
            profileLink.href = user.html_url;
            profileLink.target = '_blank';
        }
        
        // Store user data for other components
        window.currentUser = user;
    },

    /**
     * Load dashboard statistics
     */
    async loadDashboardStats() {
        try {
            // Load repositories count
            const repos = await GitHubAPI.getRepositories({ per_page: 1 });
            const repoCount = document.getElementById('repo-count');
            if (repoCount) {
                // For accurate count, we'd need to check the response headers or paginate
                // For now, show a minimum count
                repoCount.textContent = repos.length;
            }
            
            // Load other stats in background
            this.loadAdditionalStats();
            
        } catch (error) {
            console.error('Failed to load dashboard stats:', error);
        }
    },

    /**
     * Load additional statistics in background
     */
    async loadAdditionalStats() {
        try {
            // Get a sample of repositories to count issues and PRs
            const repos = await GitHubAPI.getRepositories({ per_page: 10 });
            let totalIssues = 0;
            let totalPRs = 0;
            
            for (const repo of repos.slice(0, 5)) { // Limit to avoid rate limiting
                try {
                    const [issues, prs] = await Promise.all([
                        GitHubAPI.getIssues(repo.owner.login, repo.name, { per_page: 1 }),
                        GitHubAPI.getPullRequests(repo.owner.login, repo.name, { per_page: 1 })
                    ]);
                    totalIssues += issues.length;
                    totalPRs += prs.length;
                } catch (err) {
                    // Skip repos that cause errors
                    console.warn(`Failed to load stats for ${repo.name}:`, err);
                }
            }
            
            // Update UI
            const issueCount = document.getElementById('issue-count');
            const prCount = document.getElementById('pr-count');
            
            if (issueCount) issueCount.textContent = totalIssues;
            if (prCount) prCount.textContent = totalPRs;
            
        } catch (error) {
            console.error('Failed to load additional stats:', error);
        }
    },

    /**
     * Initialize application features
     */
    async initializeFeatures() {
        // Initialize repository management
        this.initializeRepositoryManagement();
        
        // Initialize issue management
        this.initializeIssueManagement();
        
        // Initialize pull request management
        this.initializePullRequestManagement();
        
        // Initialize file management
        this.initializeFileManagement();
        
        // Initialize settings
        this.initializeSettings();
    },

    /**
     * Initialize repository management
     */
    initializeRepositoryManagement() {
        // Repository management will be implemented here
        console.log('📁 Repository management initialized');
    },

    /**
     * Initialize issue management
     */
    initializeIssueManagement() {
        // Issue management will be implemented here
        console.log('🐛 Issue management initialized');
    },

    /**
     * Initialize pull request management
     */
    initializePullRequestManagement() {
        // Pull request management will be implemented here
        console.log('🔀 Pull request management initialized');
    },

    /**
     * Initialize file management
     */
    initializeFileManagement() {
        // File management will be implemented here
        console.log('📄 File management initialized');
    },

    /**
     * Initialize settings
     */
    initializeSettings() {
        // Settings will be implemented here
        console.log('⚙️ Settings initialized');
    },

    /**
     * Initialize tooltips
     */
    initializeTooltips() {
        // Add tooltip functionality for elements with data-tooltip attribute
        document.addEventListener('mouseover', (e) => {
            if (e.target.hasAttribute('data-tooltip')) {
                // Tooltip functionality is handled via CSS
            }
        });
    },

    /**
     * Initialize keyboard shortcuts help
     */
    initializeKeyboardShortcuts() {
        // Show keyboard shortcuts on Ctrl+?
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.showKeyboardShortcutsHelp();
            }
        });
    },

    /**
     * Show keyboard shortcuts help modal
     */
    showKeyboardShortcutsHelp() {
        const helpContent = `
            <div class="modal-header">
                <h3 class="modal-title">鍵盤快捷鍵</h3>
            </div>
            <div class="modal-body">
                <div class="keyboard-shortcuts">
                    <div class="shortcut-group">
                        <h4>導航</h4>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>1</kbd>
                            <span>儀表板</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>2</kbd>
                            <span>Repositories</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>3</kbd>
                            <span>Issues</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>4</kbd>
                            <span>Pull Requests</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>5</kbd>
                            <span>檔案管理</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>,</kbd>
                            <span>設定</span>
                        </div>
                    </div>
                    
                    <div class="shortcut-group">
                        <h4>介面</h4>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>B</kbd>
                            <span>切換側邊欄</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>T</kbd>
                            <span>切換主題</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>/</kbd>
                            <span>顯示快捷鍵說明</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="UI.hideModal()">關閉</button>
            </div>
        `;
        
        UI.showModal(helpContent);
    },

    /**
     * Initialize periodic tasks
     */
    initializePeriodicTasks() {
        // Check API rate limits every 5 minutes
        setInterval(async () => {
            try {
                const rateLimit = await GitHubAPI.getRateLimit();
                if (rateLimit.rate.remaining < 100) {
                    Utils.showNotification(
                        `API 請求次數剩餘 ${rateLimit.rate.remaining} 次`,
                        'warning'
                    );
                }
            } catch (error) {
                console.warn('Failed to check rate limit:', error);
            }
        }, 5 * 60 * 1000);
        
        // Refresh user data every 30 minutes
        setInterval(async () => {
            try {
                await this.loadUserData();
            } catch (error) {
                console.warn('Failed to refresh user data:', error);
            }
        }, 30 * 60 * 1000);
    },

    /**
     * Handle initialization errors
     * @param {Error} error - Initialization error
     */
    handleInitializationError(error) {
        const loadingScreen = document.getElementById('loading-screen');
        
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="loading-content">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--error-color); margin-bottom: 1rem;"></i>
                    <h2>初始化失敗</h2>
                    <p>應用程式無法正常啟動</p>
                    <p style="color: var(--text-muted); font-size: var(--font-size-sm); margin-top: 1rem;">
                        ${error.message}
                    </p>
                    <button class="btn btn-primary" onclick="window.location.reload()" style="margin-top: 2rem;">
                        重新載入
                    </button>
                </div>
            `;
        }
        
        // Log error for debugging
        console.error('Application initialization error:', error);
        
        // Show notification if possible
        try {
            Utils.showNotification('應用程式初始化失敗', 'error');
        } catch (notificationError) {
            console.error('Failed to show notification:', notificationError);
        }
    },

    /**
     * Handle application errors
     * @param {Error} error - Application error
     */
    handleError(error) {
        console.error('Application error:', error);
        
        // Handle authentication errors
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            Auth.handleAuthError(error);
            return;
        }
        
        // Handle rate limiting
        if (error.message.includes('403') && error.message.includes('rate limit')) {
            Utils.showNotification('API 請求限制已達上限，請稍後再試', 'warning');
            return;
        }
        
        // Handle network errors
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            Utils.showNotification('網路連線錯誤，請檢查網路狀態', 'error');
            return;
        }
        
        // Generic error handling
        Utils.showNotification(`發生錯誤: ${error.message}`, 'error');
    },

    /**
     * Cleanup application resources
     */
    cleanup() {
        // Clear intervals and timeouts
        // Remove event listeners
        // Clear stored data if needed
        console.log('🧹 Application cleanup completed');
    }
};

// Global error handler
window.addEventListener('error', (event) => {
    App.handleError(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    App.handleError(event.reason);
    event.preventDefault();
});

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    App.cleanup();
});

// Add keyboard shortcuts CSS
const keyboardShortcutsCSS = `
    .keyboard-shortcuts {
        display: grid;
        gap: var(--spacing-6);
    }
    
    .shortcut-group h4 {
        margin-bottom: var(--spacing-3);
        color: var(--text-primary);
        font-size: var(--font-size-base);
        font-weight: 600;
    }
    
    .shortcut-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-2) 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .shortcut-item:last-child {
        border-bottom: none;
    }
    
    kbd {
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: var(--spacing-1) var(--spacing-2);
        font-family: inherit;
        font-size: var(--font-size-xs);
        color: var(--text-primary);
        box-shadow: 0 1px 0 var(--border-color);
    }
    
    .shortcut-item span {
        color: var(--text-secondary);
        font-size: var(--font-size-sm);
    }
    
    @media (max-width: 767px) {
        .keyboard-shortcuts {
            gap: var(--spacing-4);
        }
        
        .shortcut-item {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-1);
        }
    }
`;

// Inject keyboard shortcuts CSS
const keyboardStyleSheet = document.createElement('style');
keyboardStyleSheet.textContent = keyboardShortcutsCSS;
document.head.appendChild(keyboardStyleSheet);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}