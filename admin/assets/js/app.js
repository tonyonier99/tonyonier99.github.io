// Main application logic
class BlogAdmin {
    constructor() {
        this.auth = new Auth();
        this.api = null;
        this.editor = new Editor();
        this.currentPage = 'dashboard';
        this.posts = [];
        this.currentPost = null;
        this.isLoading = false;
    }

    // Initialize the application
    async init() {
        this.showLoading();
        
        try {
            // Try to auto-login with stored token
            const isAuthenticated = await this.auth.init();
            
            if (isAuthenticated) {
                this.api = new GitHubAPI(this.auth);
                await this.showMainApp();
            } else {
                this.showLoginScreen();
            }
        } catch (error) {
            console.error('Initialization error:', error);
            this.showLoginScreen();
        }
    }

    // Show loading screen
    showLoading() {
        this.hideAllScreens();
        document.getElementById('loading').style.display = 'flex';
    }

    // Show login screen
    showLoginScreen() {
        this.hideAllScreens();
        document.getElementById('login-screen').style.display = 'block';
        this.setupLoginForm();
    }

    // Show main application
    async showMainApp() {
        this.hideAllScreens();
        document.getElementById('main-app').style.display = 'block';
        
        await this.initMainApp();
        this.setupNavigation();
        this.setupModals();
        this.showPage('dashboard');
    }

    // Hide all screens
    hideAllScreens() {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.style.display = 'none');
        document.getElementById('loading').style.display = 'none';
    }

    // Setup login form
    setupLoginForm() {
        const form = document.getElementById('login-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const tokenInput = document.getElementById('github-token');
            const token = tokenInput.value.trim();
            
            if (!token) {
                this.showAlert('請輸入 GitHub Personal Access Token', 'error');
                return;
            }

            try {
                this.setLoading(form, true);
                const user = await this.auth.login(token);
                
                this.api = new GitHubAPI(this.auth);
                await this.showMainApp();
                
                this.showAlert(`歡迎回來，${user.name || user.login}！`, 'success');
            } catch (error) {
                console.error('Login error:', error);
                this.showAlert(error.message, 'error');
            } finally {
                this.setLoading(form, false);
            }
        });
    }

    // Initialize main application
    async initMainApp() {
        // Setup user info
        const user = this.auth.getUser();
        const userInfo = document.getElementById('user-info');
        if (userInfo) {
            userInfo.textContent = `${user.name || user.login}`;
        }

        // Setup logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Load initial data
        await this.loadDashboardData();
    }

    // Setup navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.showPage(page);
            });
        });

        // Dashboard action buttons
        document.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]');
            if (!action) return;

            const actionType = action.dataset.action;
            switch (actionType) {
                case 'new-post':
                    this.showNewPostModal();
                    break;
                case 'view-site':
                    window.open(this.auth.getSiteUrl(), '_blank');
                    break;
            }
        });

        // New post button in posts page
        const newPostBtn = document.getElementById('new-post-btn');
        if (newPostBtn) {
            newPostBtn.addEventListener('click', () => {
                this.showNewPostModal();
            });
        }
    }

    // Setup modals
    setupModals() {
        // Post modal
        const postModal = document.getElementById('post-modal');
        const closeBtn = postModal.querySelector('.modal-close');
        const cancelBtn = document.getElementById('cancel-post');

        closeBtn.addEventListener('click', () => {
            this.hidePostModal();
        });

        cancelBtn.addEventListener('click', () => {
            this.hidePostModal();
        });

        // Click outside to close
        postModal.addEventListener('click', (e) => {
            if (e.target === postModal) {
                this.hidePostModal();
            }
        });

        // Post form
        const postForm = document.getElementById('post-form');
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.savePost();
        });

        // Initialize editor
        this.editor.init('post-content', 'preview-content');
        this.editor.setupDragAndDrop();

        // Auto-set today's date
        const dateInput = document.getElementById('post-date');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    }

    // Show page
    async showPage(pageName) {
        // Update navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageName);
        });

        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageName;

            // Load page data
            switch (pageName) {
                case 'dashboard':
                    await this.loadDashboardData();
                    break;
                case 'posts':
                    await this.loadPostsData();
                    break;
                case 'settings':
                    await this.loadSettingsData();
                    break;
            }
        }
    }

    // Load dashboard data
    async loadDashboardData() {
        try {
            const stats = await this.api.getStats();
            
            // Update stats
            const totalPostsEl = document.getElementById('total-posts');
            if (totalPostsEl) {
                totalPostsEl.textContent = stats.totalPosts;
            }

            const lastUpdateEl = document.getElementById('last-update');
            if (lastUpdateEl && stats.lastUpdate) {
                const date = new Date(stats.lastUpdate);
                lastUpdateEl.textContent = date.toLocaleDateString('zh-TW');
            }

            // Load recent posts
            await this.loadRecentPosts();
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            this.showAlert('載入儀表板資料失敗', 'error');
        }
    }

    // Load recent posts
    async loadRecentPosts() {
        try {
            const posts = await this.api.getPosts();
            const recentPosts = posts.slice(0, 5);
            
            const container = document.getElementById('recent-posts-list');
            if (!container) return;

            if (recentPosts.length === 0) {
                container.innerHTML = '<p>還沒有任何文章</p>';
                return;
            }

            const html = recentPosts.map(post => `
                <div class="post-item">
                    <div class="post-info">
                        <h3>${post.title}</h3>
                        <p>${post.excerpt || '無摘要'}</p>
                        <div class="post-meta">
                            <span>📅 ${post.date}</span>
                            <span>🏷️ ${Array.isArray(post.categories) ? post.categories.join(', ') : post.categories || '無分類'}</span>
                        </div>
                    </div>
                    <div class="post-actions">
                        <button class="btn btn-ghost btn-sm" onclick="app.editPost('${post.path}')">
                            <i class="fas fa-edit"></i> 編輯
                        </button>
                    </div>
                </div>
            `).join('');

            container.innerHTML = html;
        } catch (error) {
            console.error('Failed to load recent posts:', error);
        }
    }

    // Load posts data
    async loadPostsData() {
        const loadingEl = document.getElementById('posts-loading');
        const containerEl = document.getElementById('posts-container');
        
        if (loadingEl) loadingEl.style.display = 'block';
        if (containerEl) containerEl.innerHTML = '';

        try {
            this.posts = await this.api.getPosts();
            
            if (loadingEl) loadingEl.style.display = 'none';
            
            if (this.posts.length === 0) {
                containerEl.innerHTML = '<p>還沒有任何文章</p>';
                return;
            }

            const html = this.posts.map(post => `
                <div class="post-item">
                    <div class="post-info">
                        <h3>${post.title}</h3>
                        <p>${post.excerpt || '無摘要'}</p>
                        <div class="post-meta">
                            <span>📅 ${post.date}</span>
                            <span>🏷️ ${Array.isArray(post.categories) ? post.categories.join(', ') : post.categories || '無分類'}</span>
                            <span>📝 ${post.filename}</span>
                        </div>
                    </div>
                    <div class="post-actions">
                        <button class="btn btn-ghost btn-sm" onclick="app.editPost('${post.path}')">
                            <i class="fas fa-edit"></i> 編輯
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="app.deletePost('${post.path}', '${post.title}')">
                            <i class="fas fa-trash"></i> 刪除
                        </button>
                    </div>
                </div>
            `).join('');

            containerEl.innerHTML = html;
        } catch (error) {
            console.error('Failed to load posts:', error);
            if (loadingEl) loadingEl.style.display = 'none';
            if (containerEl) containerEl.innerHTML = '<p>載入文章失敗</p>';
            this.showAlert('載入文章失敗', 'error');
        }
    }

    // Load settings data
    async loadSettingsData() {
        try {
            const config = await this.api.getConfig();
            
            // Populate form fields
            const titleInput = document.getElementById('site-title');
            const descInput = document.getElementById('site-description');
            const authorInput = document.getElementById('author-name');
            
            if (titleInput) titleInput.value = config.title || '';
            if (descInput) descInput.value = config.description || '';
            if (authorInput) authorInput.value = (config.author && config.author.name) || '';

            // Setup settings form
            const settingsForm = document.getElementById('site-settings-form');
            if (settingsForm) {
                settingsForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await this.saveSettings();
                });
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            this.showAlert('載入設定失敗', 'error');
        }
    }

    // Show new post modal
    showNewPostModal() {
        this.currentPost = null;
        this.resetPostForm();
        document.getElementById('modal-title').textContent = '新增文章';
        this.showPostModal();
    }

    // Show edit post modal
    async editPost(postPath) {
        try {
            const post = this.posts.find(p => p.path === postPath);
            if (!post) {
                this.showAlert('找不到指定文章', 'error');
                return;
            }

            this.currentPost = post;
            this.populatePostForm(post);
            document.getElementById('modal-title').textContent = '編輯文章';
            this.showPostModal();
        } catch (error) {
            console.error('Failed to load post for editing:', error);
            this.showAlert('載入文章失敗', 'error');
        }
    }

    // Delete post
    async deletePost(postPath, postTitle) {
        if (!confirm(`確定要刪除文章「${postTitle}」嗎？這個動作無法復原。`)) {
            return;
        }

        try {
            const post = this.posts.find(p => p.path === postPath);
            if (!post) {
                this.showAlert('找不到指定文章', 'error');
                return;
            }

            await this.api.deletePost(postPath, post.sha, postTitle);
            this.showAlert('文章已刪除', 'success');
            
            // Refresh posts list
            if (this.currentPage === 'posts') {
                await this.loadPostsData();
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
            this.showAlert('刪除文章失敗：' + error.message, 'error');
        }
    }

    // Show post modal
    showPostModal() {
        const modal = document.getElementById('post-modal');
        modal.classList.add('active');
        modal.style.display = 'flex';
        
        // Focus on title input
        setTimeout(() => {
            const titleInput = document.getElementById('post-title');
            if (titleInput) titleInput.focus();
        }, 100);
    }

    // Hide post modal
    hidePostModal() {
        const modal = document.getElementById('post-modal');
        modal.classList.remove('active');
        modal.style.display = 'none';
        this.editor.hidePreview();
    }

    // Reset post form
    resetPostForm() {
        const form = document.getElementById('post-form');
        form.reset();
        
        // Set today's date
        const dateInput = document.getElementById('post-date');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
        
        this.editor.clear();
    }

    // Populate post form with existing data
    populatePostForm(post) {
        document.getElementById('post-title').value = post.title || '';
        document.getElementById('post-date').value = post.date || '';
        document.getElementById('post-categories').value = Array.isArray(post.categories) ? post.categories.join(', ') : (post.categories || '');
        document.getElementById('post-excerpt').value = post.excerpt || '';
        this.editor.setContent(post.content || '');
    }

    // Save post
    async savePost() {
        try {
            const formData = new FormData(document.getElementById('post-form'));
            const postData = {
                title: formData.get('title'),
                date: formData.get('date'),
                categories: formData.get('categories'),
                excerpt: formData.get('excerpt'),
                content: this.editor.getContent()
            };

            // Validate required fields
            if (!postData.title || !postData.date || !postData.content) {
                this.showAlert('請填寫所有必要欄位', 'error');
                return;
            }

            this.setLoading(document.getElementById('post-form'), true);

            if (this.currentPost) {
                // Update existing post
                await this.api.updatePost(this.currentPost.path, postData);
                this.showAlert('文章已更新', 'success');
            } else {
                // Create new post
                await this.api.createPost(postData);
                this.showAlert('文章已建立', 'success');
            }

            this.hidePostModal();
            
            // Refresh current page data
            if (this.currentPage === 'posts') {
                await this.loadPostsData();
            } else if (this.currentPage === 'dashboard') {
                await this.loadDashboardData();
            }

        } catch (error) {
            console.error('Failed to save post:', error);
            this.showAlert('儲存失敗：' + error.message, 'error');
        } finally {
            this.setLoading(document.getElementById('post-form'), false);
        }
    }

    // Save settings
    async saveSettings() {
        try {
            const formData = new FormData(document.getElementById('site-settings-form'));
            const config = {
                title: formData.get('title'),
                description: formData.get('description'),
                author: {
                    name: formData.get('author_name')
                }
            };

            this.setLoading(document.getElementById('site-settings-form'), true);
            
            await this.api.updateConfig(config);
            this.showAlert('設定已儲存', 'success');
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showAlert('儲存設定失敗：' + error.message, 'error');
        } finally {
            this.setLoading(document.getElementById('site-settings-form'), false);
        }
    }

    // Logout
    logout() {
        if (confirm('確定要登出嗎？')) {
            this.auth.logout();
            this.api = null;
            this.posts = [];
            this.currentPost = null;
            this.showLoginScreen();
            this.showAlert('已登出', 'info');
        }
    }

    // Show alert message
    showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        // Create new alert
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        // Insert at the top of main content or login form
        const container = document.querySelector('.main-content') || 
                         document.querySelector('.login-container');
        
        if (container) {
            container.insertBefore(alert, container.firstChild);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 5000);
        }
    }

    // Set loading state for forms
    setLoading(form, loading) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const inputs = form.querySelectorAll('input, textarea, select, button');

        if (loading) {
            form.classList.add('loading');
            inputs.forEach(input => input.disabled = true);
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 處理中...';
            }
        } else {
            form.classList.remove('loading');
            inputs.forEach(input => input.disabled = false);
            if (submitBtn) {
                const icon = submitBtn.querySelector('i');
                const iconClass = icon ? icon.className.replace('fa-spinner fa-spin', 'fa-save') : 'fas fa-save';
                submitBtn.innerHTML = `<i class="${iconClass}"></i> 儲存`;
            }
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BlogAdmin();
    app.init();
});

// Export for global access
window.BlogAdmin = BlogAdmin;