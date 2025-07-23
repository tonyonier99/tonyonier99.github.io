/**
 * UI Components and Interactions
 * Handles all UI-related functionality
 */

const UI = {
    currentSection: 'dashboard',
    sidebarCollapsed: false,

    /**
     * Initialize UI components
     */
    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.loadSavedState();
        this.showSection('dashboard');
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                if (section) {
                    this.showSection(section);
                }
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // User menu
        const userMenuBtn = document.getElementById('user-menu-btn');
        const userDropdown = document.getElementById('user-dropdown');
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('hidden');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                userDropdown.classList.add('hidden');
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.confirmLogout();
            });
        }

        // Window resize handler
        window.addEventListener('resize', Utils.throttle(() => {
            this.handleResize();
        }, 250));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    },

    /**
     * Initialize theme system
     */
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const theme = savedTheme || systemTheme;
        
        Utils.setTheme(theme);
        this.updateThemeIcon(theme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                Utils.setTheme(newTheme);
                this.updateThemeIcon(newTheme);
            }
        });
    },

    /**
     * Load saved UI state
     */
    loadSavedState() {
        // Load sidebar state
        const sidebarState = localStorage.getItem('sidebar_collapsed');
        if (sidebarState === 'true' && Utils.isDesktop()) {
            this.toggleSidebar();
        }

        // Load last visited section
        const lastSection = localStorage.getItem('last_section');
        if (lastSection) {
            this.currentSection = lastSection;
        }
    },

    /**
     * Toggle sidebar
     */
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        
        if (sidebar && mainContent) {
            this.sidebarCollapsed = !this.sidebarCollapsed;
            
            if (this.sidebarCollapsed) {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('full-width');
            } else {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('full-width');
            }
            
            // Save state for desktop
            if (Utils.isDesktop()) {
                localStorage.setItem('sidebar_collapsed', this.sidebarCollapsed.toString());
            }
        }
    },

    /**
     * Toggle theme
     */
    toggleTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.classList.add('transitioning');
            setTimeout(() => themeToggle.classList.remove('transitioning'), 300);
        }

        const newTheme = Utils.toggleTheme();
        this.updateThemeIcon(newTheme);
        Utils.showNotification(`已切換到${newTheme === 'dark' ? '深色' : '淺色'}主題`, 'info', 2000);
    },

    /**
     * Update theme icon
     * @param {string} theme - Current theme
     */
    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    },

    /**
     * Show specific section
     * @param {string} section - Section to show
     */
    async showSection(section) {
        try {
            // Update navigation
            this.updateNavigation(section);
            
            // Update current section
            this.currentSection = section;
            localStorage.setItem('last_section', section);
            
            // Load section content
            const content = await this.loadSectionContent(section);
            
            // Update main content
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = content;
                this.initializeSectionHandlers(section);
            }
            
            // Close sidebar on mobile after navigation
            if (Utils.isMobile()) {
                this.collapseSidebarOnMobile();
            }
            
        } catch (error) {
            console.error('Failed to show section:', error);
            Utils.showNotification('載入頁面失敗', 'error');
        }
    },

    /**
     * Update navigation active state
     * @param {string} section - Active section
     */
    updateNavigation(section) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const itemSection = item.getAttribute('data-section');
            if (itemSection === section) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    },

    /**
     * Load section content
     * @param {string} section - Section name
     * @returns {Promise<string>} - Section HTML content
     */
    async loadSectionContent(section) {
        const sections = {
            dashboard: () => this.createDashboardContent(),
            repositories: () => this.createRepositoriesContent(),
            issues: () => this.createIssuesContent(),
            'pull-requests': () => this.createPullRequestsContent(),
            files: () => this.createFilesContent(),
            settings: () => this.createSettingsContent()
        };

        const contentGenerator = sections[section];
        if (contentGenerator) {
            return await contentGenerator();
        } else {
            return '<div class="card"><h1>頁面不存在</h1></div>';
        }
    },

    /**
     * Initialize section-specific event handlers
     * @param {string} section - Section name
     */
    initializeSectionHandlers(section) {
        const handlers = {
            dashboard: () => this.initDashboardHandlers(),
            repositories: () => this.initRepositoriesHandlers(),
            issues: () => this.initIssuesHandlers(),
            'pull-requests': () => this.initPullRequestsHandlers(),
            files: () => this.initFilesHandlers(),
            settings: () => this.initSettingsHandlers()
        };

        const handler = handlers[section];
        if (handler) {
            handler();
        }
    },

    /**
     * Create dashboard content
     * @returns {Promise<string>} - Dashboard HTML
     */
    async createDashboardContent() {
        return `
            <div class="dashboard">
                <div class="dashboard-header">
                    <h1>儀表板</h1>
                    <p>歡迎回到 GitHub 管理後台</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="fas fa-folder"></i>
                                Repositories
                            </h3>
                        </div>
                        <div class="dashboard-stat">
                            <span class="stat-number" id="repo-count">-</span>
                            <span class="stat-label">個倉庫</span>
                        </div>
                        <button class="btn btn-primary" onclick="UI.showSection('repositories')">
                            管理倉庫
                        </button>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="fas fa-exclamation-circle"></i>
                                Issues
                            </h3>
                        </div>
                        <div class="dashboard-stat">
                            <span class="stat-number" id="issue-count">-</span>
                            <span class="stat-label">個 Issues</span>
                        </div>
                        <button class="btn btn-primary" onclick="UI.showSection('issues')">
                            管理 Issues
                        </button>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="fas fa-code-branch"></i>
                                Pull Requests
                            </h3>
                        </div>
                        <div class="dashboard-stat">
                            <span class="stat-number" id="pr-count">-</span>
                            <span class="stat-label">個 Pull Requests</span>
                        </div>
                        <button class="btn btn-primary" onclick="UI.showSection('pull-requests')">
                            管理 Pull Requests
                        </button>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 mt-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">最近活動</h3>
                        </div>
                        <div id="recent-activity" class="space-y-3">
                            <div class="loading-content">
                                <div class="loading-spinner"></div>
                                <p>載入中...</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">快速操作</h3>
                        </div>
                        <div class="space-y-3">
                            <button class="btn btn-secondary w-full" onclick="UI.showCreateRepoModal()">
                                <i class="fas fa-plus"></i>
                                建立新倉庫
                            </button>
                            <button class="btn btn-secondary w-full" onclick="UI.showSection('files')">
                                <i class="fas fa-file-alt"></i>
                                管理檔案
                            </button>
                            <button class="btn btn-secondary w-full" onclick="UI.showSection('settings')">
                                <i class="fas fa-cog"></i>
                                設定
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Create repositories content
     * @returns {Promise<string>} - Repositories HTML
     */
    async createRepositoriesContent() {
        return `
            <div class="repositories">
                <div class="section-header">
                    <div>
                        <h1>Repositories</h1>
                        <p>管理您的 GitHub 倉庫</p>
                    </div>
                    <div class="section-actions">
                        <button class="btn btn-primary" onclick="UI.showCreateRepoModal()">
                            <i class="fas fa-plus"></i>
                            建立倉庫
                        </button>
                    </div>
                </div>
                
                <div class="filters-bar">
                    <div class="search-box">
                        <input type="text" id="repo-search" placeholder="搜尋倉庫..." class="form-control">
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="filter-buttons">
                        <button class="btn btn-secondary active" data-filter="all">全部</button>
                        <button class="btn btn-secondary" data-filter="public">公開</button>
                        <button class="btn btn-secondary" data-filter="private">私有</button>
                    </div>
                </div>
                
                <div id="repositories-list" class="repositories-list">
                    <div class="loading-content">
                        <div class="loading-spinner"></div>
                        <p>載入倉庫中...</p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Create issues content
     * @returns {Promise<string>} - Issues HTML
     */
    async createIssuesContent() {
        return `
            <div class="issues">
                <div class="section-header">
                    <div>
                        <h1>Issues</h1>
                        <p>管理所有倉庫的 Issues</p>
                    </div>
                    <div class="section-actions">
                        <button class="btn btn-primary" onclick="UI.showCreateIssueModal()">
                            <i class="fas fa-plus"></i>
                            建立 Issue
                        </button>
                    </div>
                </div>
                
                <div class="filters-bar">
                    <div class="search-box">
                        <input type="text" id="issue-search" placeholder="搜尋 Issues..." class="form-control">
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="filter-buttons">
                        <button class="btn btn-secondary active" data-filter="open">開啟</button>
                        <button class="btn btn-secondary" data-filter="closed">已關閉</button>
                        <button class="btn btn-secondary" data-filter="all">全部</button>
                    </div>
                </div>
                
                <div id="issues-list" class="issues-list">
                    <div class="loading-content">
                        <div class="loading-spinner"></div>
                        <p>載入 Issues 中...</p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Create pull requests content
     * @returns {Promise<string>} - Pull Requests HTML
     */
    async createPullRequestsContent() {
        return `
            <div class="pull-requests">
                <div class="section-header">
                    <div>
                        <h1>Pull Requests</h1>
                        <p>管理所有倉庫的 Pull Requests</p>
                    </div>
                </div>
                
                <div class="filters-bar">
                    <div class="search-box">
                        <input type="text" id="pr-search" placeholder="搜尋 Pull Requests..." class="form-control">
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="filter-buttons">
                        <button class="btn btn-secondary active" data-filter="open">開啟</button>
                        <button class="btn btn-secondary" data-filter="closed">已關閉</button>
                        <button class="btn btn-secondary" data-filter="merged">已合併</button>
                    </div>
                </div>
                
                <div id="pull-requests-list" class="pull-requests-list">
                    <div class="loading-content">
                        <div class="loading-spinner"></div>
                        <p>載入 Pull Requests 中...</p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Create files content
     * @returns {Promise<string>} - Files HTML
     */
    async createFilesContent() {
        return `
            <div class="files">
                <div class="section-header">
                    <div>
                        <h1>檔案管理</h1>
                        <p>瀏覽和編輯倉庫檔案</p>
                    </div>
                </div>
                
                <div class="file-browser">
                    <div class="file-browser-header">
                        <div class="breadcrumb" id="file-breadcrumb">
                            <span class="breadcrumb-item active">選擇倉庫</span>
                        </div>
                        <div class="file-actions">
                            <button class="btn btn-secondary" onclick="UI.showCreateFileModal()" disabled>
                                <i class="fas fa-plus"></i>
                                新檔案
                            </button>
                            <button class="btn btn-secondary" onclick="UI.showUploadFileModal()" disabled>
                                <i class="fas fa-upload"></i>
                                上傳
                            </button>
                        </div>
                    </div>
                    
                    <div class="file-browser-content">
                        <div id="file-browser-list" class="file-list">
                            <div class="loading-content">
                                <div class="loading-spinner"></div>
                                <p>請先選擇倉庫</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Create settings content
     * @returns {Promise<string>} - Settings HTML
     */
    async createSettingsContent() {
        return `
            <div class="settings">
                <div class="section-header">
                    <div>
                        <h1>設定</h1>
                        <p>管理應用程式設定</p>
                    </div>
                </div>
                
                <div class="settings-content">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">帳戶資訊</h3>
                        </div>
                        <div id="user-info" class="user-info">
                            <div class="loading-content">
                                <div class="loading-spinner"></div>
                                <p>載入用戶資訊中...</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">偏好設定</h3>
                        </div>
                        <div class="settings-form">
                            <div class="form-group">
                                <label class="form-label">主題</label>
                                <select id="theme-select" class="form-control">
                                    <option value="auto">跟隨系統</option>
                                    <option value="light">淺色</option>
                                    <option value="dark">深色</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">語言</label>
                                <select id="language-select" class="form-control">
                                    <option value="zh-TW">繁體中文</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">API 狀態</h3>
                        </div>
                        <div id="api-status" class="api-status">
                            <div class="loading-content">
                                <div class="loading-spinner"></div>
                                <p>檢查 API 狀態中...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Handle window resize
     */
    handleResize() {
        // Auto-collapse sidebar on mobile
        if (Utils.isMobile() && !this.sidebarCollapsed) {
            this.collapseSidebarOnMobile();
        } else if (Utils.isDesktop() && this.sidebarCollapsed) {
            const savedState = localStorage.getItem('sidebar_collapsed');
            if (savedState !== 'true') {
                this.toggleSidebar();
            }
        }
    },

    /**
     * Collapse sidebar on mobile
     */
    collapseSidebarOnMobile() {
        if (Utils.isMobile()) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.add('collapsed');
                this.sidebarCollapsed = true;
            }
        }
    },

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboardShortcuts(e) {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    this.showSection('dashboard');
                    break;
                case '2':
                    e.preventDefault();
                    this.showSection('repositories');
                    break;
                case '3':
                    e.preventDefault();
                    this.showSection('issues');
                    break;
                case '4':
                    e.preventDefault();
                    this.showSection('pull-requests');
                    break;
                case '5':
                    e.preventDefault();
                    this.showSection('files');
                    break;
                case ',':
                    e.preventDefault();
                    this.showSection('settings');
                    break;
                case 'b':
                    e.preventDefault();
                    this.toggleSidebar();
                    break;
            }
        }

        // Toggle theme with 't'
        if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            this.toggleTheme();
        }
    },

    /**
     * Confirm logout
     */
    confirmLogout() {
        if (confirm('確定要登出嗎？')) {
            Auth.logout();
        }
    },

    /**
     * Show modal
     * @param {string} modalHtml - Modal HTML content
     * @returns {HTMLElement} - Modal element
     */
    showModal(modalHtml) {
        // Remove existing modals
        this.hideModal();

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal">
                ${modalHtml}
            </div>
        `;

        document.body.appendChild(modalOverlay);

        // Show modal with animation
        setTimeout(() => {
            modalOverlay.classList.add('active');
        }, 10);

        // Close on backdrop click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.hideModal();
            }
        });

        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        return modalOverlay;
    },

    /**
     * Hide modal
     */
    hideModal() {
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) {
            existingModal.classList.remove('active');
            setTimeout(() => {
                if (existingModal.parentElement) {
                    existingModal.parentElement.removeChild(existingModal);
                }
            }, 300);
        }
    },

    /**
     * Initialize dashboard handlers (placeholder)
     */
    initDashboardHandlers() {
        // Will be implemented with the dashboard functionality
    },

    /**
     * Initialize repositories handlers (placeholder)
     */
    initRepositoriesHandlers() {
        // Will be implemented with the repositories functionality
    },

    /**
     * Initialize issues handlers (placeholder)
     */
    initIssuesHandlers() {
        // Will be implemented with the issues functionality
    },

    /**
     * Initialize pull requests handlers (placeholder)
     */
    initPullRequestsHandlers() {
        // Will be implemented with the pull requests functionality
    },

    /**
     * Initialize files handlers (placeholder)
     */
    initFilesHandlers() {
        // Will be implemented with the files functionality
    },

    /**
     * Initialize settings handlers (placeholder)
     */
    initSettingsHandlers() {
        // Will be implemented with the settings functionality
    },

    /**
     * Show create repository modal (placeholder)
     */
    showCreateRepoModal() {
        Utils.showNotification('建立倉庫功能即將推出', 'info');
    },

    /**
     * Show create issue modal (placeholder)
     */
    showCreateIssueModal() {
        Utils.showNotification('建立 Issue 功能即將推出', 'info');
    },

    /**
     * Show create file modal (placeholder)
     */
    showCreateFileModal() {
        Utils.showNotification('建立檔案功能即將推出', 'info');
    },

    /**
     * Show upload file modal (placeholder)
     */
    showUploadFileModal() {
        Utils.showNotification('上傳檔案功能即將推出', 'info');
    }
};

// Add some additional CSS for dashboard
const additionalCSS = `
    /* Dashboard styles */
    .dashboard-header {
        margin-bottom: var(--spacing-8);
    }
    
    .dashboard-header h1 {
        font-size: var(--font-size-3xl);
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: var(--spacing-2);
    }
    
    .dashboard-header p {
        color: var(--text-secondary);
        font-size: var(--font-size-lg);
    }
    
    .dashboard-stat {
        margin: var(--spacing-4) 0;
        text-align: center;
    }
    
    .stat-number {
        display: block;
        font-size: var(--font-size-3xl);
        font-weight: 700;
        color: var(--primary-color);
    }
    
    .stat-label {
        color: var(--text-secondary);
        font-size: var(--font-size-sm);
    }
    
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-6);
        flex-wrap: wrap;
        gap: var(--spacing-4);
    }
    
    .section-header h1 {
        font-size: var(--font-size-2xl);
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: var(--spacing-1);
    }
    
    .section-header p {
        color: var(--text-secondary);
    }
    
    .section-actions {
        display: flex;
        gap: var(--spacing-3);
    }
    
    .filters-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-6);
        gap: var(--spacing-4);
        flex-wrap: wrap;
    }
    
    .search-box {
        position: relative;
        flex: 1;
        max-width: 400px;
    }
    
    .search-box i {
        position: absolute;
        right: var(--spacing-3);
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-muted);
    }
    
    .filter-buttons {
        display: flex;
        gap: var(--spacing-2);
    }
    
    .filter-buttons .btn.active {
        background: var(--primary-color);
        color: white;
    }
    
    /* File browser styles */
    .file-browser {
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        overflow: hidden;
    }
    
    .file-browser-header {
        padding: var(--spacing-4);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--spacing-4);
    }
    
    .breadcrumb {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
    }
    
    .breadcrumb-item {
        color: var(--text-secondary);
        font-size: var(--font-size-sm);
    }
    
    .breadcrumb-item.active {
        color: var(--text-primary);
        font-weight: 500;
    }
    
    .file-actions {
        display: flex;
        gap: var(--spacing-2);
    }
    
    .file-browser-content {
        padding: var(--spacing-4);
    }
    
    .settings-content {
        max-width: 800px;
    }
    
    .settings-form {
        space-y: var(--spacing-4);
    }
    
    .user-info {
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
    }
    
    .user-info img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
    }
    
    .api-status {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
    }
    
    .status-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-3);
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
    }
    
    .status-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--success-color);
    }
    
    .status-indicator.warning {
        background: var(--warning-color);
    }
    
    .status-indicator.error {
        background: var(--error-color);
    }
    
    /* Mobile responsive adjustments */
    @media (max-width: 767px) {
        .section-header {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .filters-bar {
            flex-direction: column;
            align-items: stretch;
        }
        
        .search-box {
            max-width: none;
        }
        
        .filter-buttons {
            justify-content: center;
        }
        
        .file-browser-header {
            flex-direction: column;
            align-items: stretch;
        }
        
        .breadcrumb {
            justify-content: center;
        }
        
        .file-actions {
            justify-content: center;
        }
    }
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}