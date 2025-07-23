/**
 * 主應用程式
 * 管理整個管理後台的狀態和路由
 */

class BlogAdmin {
    constructor() {
        this.authManager = new AuthManager();
        this.github = null;
        this.currentPage = 'dashboard';
        this.editor = null;
        this.posts = [];
        this.pages = [];
        this.mediaFiles = [];
        this.stats = {};
        
        this.init();
    }

    /**
     * 初始化應用程式
     */
    async init() {
        // 顯示載入狀態
        this.showLoading();

        try {
            // 嘗試自動登入
            const result = await this.authManager.autoInit();
            
            if (result.success) {
                this.github = this.authManager.getGitHubAPI();
                await this.showMainInterface();
                this.showNotification(result.message, 'success');
            } else {
                this.showAuthInterface();
            }
        } catch (error) {
            console.error('App initialization failed:', error);
            this.showAuthInterface();
        } finally {
            this.hideLoading();
        }

        // 綁定全域事件
        this.bindGlobalEvents();
    }

    /**
     * 綁定全域事件
     */
    bindGlobalEvents() {
        // 認證表單提交
        const authForm = document.getElementById('auth-form');
        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // 登出按鈕
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // 導航選單
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateTo(page);
            });
        });

        // 通知關閉
        const notificationClose = document.querySelector('.notification-close');
        if (notificationClose) {
            notificationClose.addEventListener('click', () => {
                this.hideNotification();
            });
        }

        // 全域快捷鍵
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        if (this.currentPage === 'posts' || this.currentPage === 'pages') {
                            this.handleSave();
                        }
                        break;
                }
            }
        });
    }

    /**
     * 處理登入
     */
    async handleLogin() {
        const tokenInput = document.getElementById('github-token');
        const token = tokenInput.value.trim();

        if (!token) {
            this.showNotification('請輸入 GitHub Personal Access Token', 'error');
            return;
        }

        this.showLoading();

        try {
            const result = await this.authManager.login(token);
            
            if (result.success) {
                this.github = this.authManager.getGitHubAPI();
                await this.showMainInterface();
                this.showNotification(result.message, 'success');
            } else {
                this.showNotification(result.error, 'error');
            }
        } catch (error) {
            console.error('Login failed:', error);
            this.showNotification('登入過程發生錯誤', 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * 處理登出
     */
    handleLogout() {
        const result = this.authManager.logout();
        this.showNotification(result.message, 'success');
        this.showAuthInterface();
    }

    /**
     * 顯示認證介面
     */
    showAuthInterface() {
        document.getElementById('auth-screen').style.display = 'flex';
        document.getElementById('main-screen').style.display = 'none';
    }

    /**
     * 顯示主要介面
     */
    async showMainInterface() {
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-screen').style.display = 'flex';

        // 載入初始數據
        await this.loadInitialData();
        
        // 顯示儀表板
        this.navigateTo('dashboard');
    }

    /**
     * 載入初始數據
     */
    async loadInitialData() {
        try {
            // 並行載入所有數據
            const [posts, pages, mediaFiles, stats] = await Promise.all([
                this.github.getPosts(),
                this.github.getPages(),
                this.github.getMediaFiles(),
                this.github.getRepositoryStats()
            ]);

            this.posts = posts;
            this.pages = pages;
            this.mediaFiles = mediaFiles;
            this.stats = stats;
        } catch (error) {
            console.error('Failed to load initial data:', error);
            this.showNotification('載入數據失敗：' + error.message, 'error');
        }
    }

    /**
     * 導航到指定頁面
     */
    navigateTo(page) {
        // 更新導航狀態
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });

        // 更新頁面標題
        const pageTitle = document.getElementById('page-title');
        const pageActions = document.getElementById('page-actions');
        
        this.currentPage = page;

        // 根據頁面載入相應內容
        switch (page) {
            case 'dashboard':
                pageTitle.textContent = '儀表板';
                pageActions.innerHTML = '';
                this.renderDashboard();
                break;
            case 'posts':
                pageTitle.textContent = '文章管理';
                pageActions.innerHTML = `
                    <button class="btn btn-primary" onclick="app.createPost()">
                        <i class="fas fa-plus"></i> 新增文章
                    </button>
                `;
                this.renderPosts();
                break;
            case 'pages':
                pageTitle.textContent = '頁面管理';
                pageActions.innerHTML = '';
                this.renderPages();
                break;
            case 'media':
                pageTitle.textContent = '媒體管理';
                pageActions.innerHTML = `
                    <input type="file" id="media-upload" accept="image/*,video/*,audio/*,application/pdf" multiple style="display: none;">
                    <button class="btn btn-primary" onclick="document.getElementById('media-upload').click()">
                        <i class="fas fa-upload"></i> 上傳媒體
                    </button>
                `;
                this.renderMedia();
                break;
            case 'settings':
                pageTitle.textContent = '網站設定';
                pageActions.innerHTML = `
                    <button class="btn btn-success" onclick="app.saveSettings()">
                        <i class="fas fa-save"></i> 儲存設定
                    </button>
                `;
                this.renderSettings();
                break;
        }
    }

    /**
     * 渲染儀表板
     */
    renderDashboard() {
        const contentArea = document.getElementById('content-area');
        const user = this.authManager.getCurrentUser();
        
        contentArea.innerHTML = `
            <div class="fade-in">
                <!-- 歡迎信息 -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <h3 class="card-title">歡迎回來，${user.name || user.login}！</h3>
                        <p class="card-description">這裡是您的部落格管理後台，您可以管理文章、頁面、媒體文件和網站設定。</p>
                    </div>
                </div>

                <!-- 統計卡片 -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon posts">
                            <i class="fas fa-edit"></i>
                        </div>
                        <div class="stat-value">${this.stats.posts || 0}</div>
                        <div class="stat-label">文章數量</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon pages">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="stat-value">${this.stats.pages || 0}</div>
                        <div class="stat-label">頁面數量</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon media">
                            <i class="fas fa-images"></i>
                        </div>
                        <div class="stat-value">${this.stats.media || 0}</div>
                        <div class="stat-label">媒體文件</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon views">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="stat-value">${this.stats.stars || 0}</div>
                        <div class="stat-label">GitHub Stars</div>
                    </div>
                </div>

                <!-- 最近文章 -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">最近文章</h3>
                        <p class="card-description">最新發布的文章列表</p>
                    </div>
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>標題</th>
                                    <th>日期</th>
                                    <th>狀態</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.posts.slice(0, 5).map(post => `
                                    <tr>
                                        <td><strong>${post.metadata.title || post.filename}</strong></td>
                                        <td>${this.github.formatDate(post.metadata.date)}</td>
                                        <td><span class="badge published">已發布</span></td>
                                        <td>
                                            <div class="actions">
                                                <button class="btn btn-sm btn-secondary" onclick="app.editPost('${post.filename}')">
                                                    <i class="fas fa-edit"></i> 編輯
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 渲染文章列表
     */
    renderPosts() {
        const contentArea = document.getElementById('content-area');
        
        contentArea.innerHTML = `
            <div class="fade-in">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>標題</th>
                                <th>日期</th>
                                <th>作者</th>
                                <th>分類</th>
                                <th>最後修改</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.posts.map(post => `
                                <tr>
                                    <td>
                                        <strong>${post.metadata.title || post.filename}</strong>
                                        ${post.metadata.excerpt ? `<br><small style="color: #64748b;">${post.metadata.excerpt}</small>` : ''}
                                    </td>
                                    <td>${this.github.formatDate(post.metadata.date)}</td>
                                    <td>${post.metadata.author || 'Tony'}</td>
                                    <td>
                                        ${post.metadata.categories.map(cat => `<span class="badge published">${cat}</span>`).join(' ')}
                                    </td>
                                    <td>${this.github.formatDate(post.lastModified)}</td>
                                    <td>
                                        <div class="actions">
                                            <button class="btn btn-sm btn-secondary" onclick="app.editPost('${post.filename}')" title="編輯">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-sm btn-danger" onclick="app.deletePost('${post.filename}')" title="刪除">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    /**
     * 渲染頁面列表
     */
    renderPages() {
        const contentArea = document.getElementById('content-area');
        
        contentArea.innerHTML = `
            <div class="fade-in">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>標題</th>
                                <th>文件名</th>
                                <th>佈局</th>
                                <th>最後修改</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.pages.map(page => `
                                <tr>
                                    <td>
                                        <strong>${page.metadata.title || page.filename}</strong>
                                        ${page.metadata.description ? `<br><small style="color: #64748b;">${page.metadata.description}</small>` : ''}
                                    </td>
                                    <td><code>${page.filename}</code></td>
                                    <td><span class="badge published">${page.metadata.layout || 'page'}</span></td>
                                    <td>${this.github.formatDate(page.lastModified)}</td>
                                    <td>
                                        <div class="actions">
                                            <button class="btn btn-sm btn-secondary" onclick="app.editPage('${page.filename}')" title="編輯">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    /**
     * 渲染媒體文件
     */
    renderMedia() {
        const contentArea = document.getElementById('content-area');
        
        // 綁定文件上傳事件
        setTimeout(() => {
            const uploadInput = document.getElementById('media-upload');
            if (uploadInput) {
                uploadInput.addEventListener('change', (e) => {
                    this.handleMediaUpload(e.target.files);
                });
            }
        }, 100);

        contentArea.innerHTML = `
            <div class="fade-in">
                <!-- 拖放上傳區域 -->
                <div class="dropzone" id="media-dropzone">
                    <div class="dropzone-icon">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                    <div class="dropzone-text">拖放文件到這裡上傳</div>
                    <div class="dropzone-hint">或點擊上方的"上傳媒體"按鈕選擇文件</div>
                </div>

                <!-- 媒體文件列表 -->
                <div class="table-container" style="margin-top: 24px;">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>預覽</th>
                                <th>文件名</th>
                                <th>大小</th>
                                <th>上傳日期</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.mediaFiles.map(file => `
                                <tr>
                                    <td>
                                        ${file.filename.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i) 
                                            ? `<img src="${file.downloadUrl}" alt="${file.filename}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">`
                                            : `<i class="fas fa-file" style="font-size: 24px; color: #64748b;"></i>`
                                        }
                                    </td>
                                    <td>
                                        <strong>${file.filename}</strong>
                                        <br><small style="color: #64748b;"><code>${file.path}</code></small>
                                    </td>
                                    <td>${this.github.formatFileSize(file.size)}</td>
                                    <td>${this.github.formatDate(file.lastModified)}</td>
                                    <td>
                                        <div class="actions">
                                            <button class="btn btn-sm btn-secondary" onclick="app.copyMediaURL('${file.downloadUrl}')" title="複製鏈接">
                                                <i class="fas fa-link"></i>
                                            </button>
                                            <button class="btn btn-sm btn-danger" onclick="app.deleteMedia('${file.path}', '${file.sha}')" title="刪除">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // 綁定拖放事件
        const dropzone = document.getElementById('media-dropzone');
        if (dropzone) {
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('drag-over');
            });

            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('drag-over');
            });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('drag-over');
                this.handleMediaUpload(e.dataTransfer.files);
            });
        }
    }

    /**
     * 渲染設定頁面
     */
    async renderSettings() {
        const contentArea = document.getElementById('content-area');
        
        try {
            const config = await this.github.getSiteConfig();
            
            contentArea.innerHTML = `
                <div class="fade-in">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">網站配置 (_config.yml)</h3>
                            <p class="card-description">編輯您的 Jekyll 網站配置文件</p>
                        </div>
                        <div id="settings-editor-container">
                            <!-- 編輯器將在這裡載入 -->
                        </div>
                    </div>
                </div>
            `;

            // 初始化設定編輯器
            const editorContainer = document.getElementById('settings-editor-container');
            this.settingsEditor = new MarkdownEditor(editorContainer);
            this.settingsEditor.setContent(config);
        } catch (error) {
            console.error('Failed to load settings:', error);
            this.showNotification('載入設定失敗：' + error.message, 'error');
        }
    }

    /**
     * 新增文章
     */
    createPost() {
        this.showPostEditor();
    }

    /**
     * 編輯文章
     */
    editPost(filename) {
        const post = this.posts.find(p => p.filename === filename);
        if (post) {
            this.showPostEditor(post);
        }
    }

    /**
     * 編輯頁面
     */
    editPage(filename) {
        const page = this.pages.find(p => p.filename === filename);
        if (page) {
            this.showPageEditor(page);
        }
    }

    /**
     * 顯示文章編輯器
     */
    showPostEditor(post = null) {
        const isEditing = !!post;
        const title = isEditing ? '編輯文章' : '新增文章';
        
        const modal = this.createModal(title, `
            <form id="post-form">
                <div class="form-row cols-2">
                    <div class="form-group">
                        <label for="post-title">標題</label>
                        <input type="text" id="post-title" value="${post ? post.metadata.title : ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="post-date">日期</label>
                        <input type="datetime-local" id="post-date" value="${post ? post.metadata.date : new Date().toISOString().slice(0, 16)}" required>
                    </div>
                </div>
                
                <div class="form-row cols-2">
                    <div class="form-group">
                        <label for="post-author">作者</label>
                        <input type="text" id="post-author" value="${post ? post.metadata.author : 'Tony'}">
                    </div>
                    <div class="form-group">
                        <label for="post-layout">佈局</label>
                        <select id="post-layout">
                            <option value="post" ${!post || post.metadata.layout === 'post' ? 'selected' : ''}>文章</option>
                            <option value="page" ${post && post.metadata.layout === 'page' ? 'selected' : ''}>頁面</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="post-categories">分類 (用逗號分隔)</label>
                        <input type="text" id="post-categories" value="${post ? post.metadata.categories.join(', ') : ''}">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="post-tags">標籤 (用逗號分隔)</label>
                        <input type="text" id="post-tags" value="${post ? post.metadata.tags.join(', ') : ''}">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="post-description">描述</label>
                        <textarea id="post-description" rows="3">${post ? post.metadata.description : ''}</textarea>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>內容</label>
                        <div id="post-editor-container">
                            <!-- Markdown 編輯器將在這裡載入 -->
                        </div>
                    </div>
                </div>
            </form>
        `, `
            <button type="button" class="btn btn-secondary" onclick="app.closeModal()">取消</button>
            <button type="button" class="btn btn-success" onclick="app.savePost(${isEditing})">
                <i class="fas fa-save"></i> ${isEditing ? '更新' : '發布'}
            </button>
        `);

        // 初始化編輯器
        const editorContainer = document.getElementById('post-editor-container');
        this.currentPostEditor = new MarkdownEditor(editorContainer);
        
        if (post) {
            // 提取文章內容 (移除前端內容)
            const contentMatch = post.content.match(/^---[\s\S]*?---\n([\s\S]*)$/);
            const content = contentMatch ? contentMatch[1] : post.content;
            this.currentPostEditor.setContent(content);
            this.currentEditingPost = post;
        } else {
            this.currentEditingPost = null;
        }
    }

    /**
     * 顯示頁面編輯器
     */
    showPageEditor(page) {
        const modal = this.createModal('編輯頁面', `
            <form id="page-form">
                <div class="form-row cols-2">
                    <div class="form-group">
                        <label for="page-title">標題</label>
                        <input type="text" id="page-title" value="${page.metadata.title}" required>
                    </div>
                    <div class="form-group">
                        <label for="page-layout">佈局</label>
                        <select id="page-layout">
                            <option value="page" ${page.metadata.layout === 'page' ? 'selected' : ''}>頁面</option>
                            <option value="default" ${page.metadata.layout === 'default' ? 'selected' : ''}>預設</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="page-permalink">永久鏈接</label>
                        <input type="text" id="page-permalink" value="${page.metadata.permalink || ''}">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="page-description">描述</label>
                        <textarea id="page-description" rows="3">${page.metadata.description || ''}</textarea>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>內容</label>
                        <div id="page-editor-container">
                            <!-- Markdown 編輯器將在這裡載入 -->
                        </div>
                    </div>
                </div>
            </form>
        `, `
            <button type="button" class="btn btn-secondary" onclick="app.closeModal()">取消</button>
            <button type="button" class="btn btn-success" onclick="app.savePage()">
                <i class="fas fa-save"></i> 更新
            </button>
        `);

        // 初始化編輯器
        const editorContainer = document.getElementById('page-editor-container');
        this.currentPageEditor = new MarkdownEditor(editorContainer);
        
        // 提取頁面內容 (移除前端內容)
        const contentMatch = page.content.match(/^---[\s\S]*?---\n([\s\S]*)$/);
        const content = contentMatch ? contentMatch[1] : page.content;
        this.currentPageEditor.setContent(content);
        this.currentEditingPage = page;
    }

    /**
     * 儲存文章
     */
    async savePost(isEditing) {
        try {
            this.showLoading();

            // 獲取表單數據
            const title = document.getElementById('post-title').value.trim();
            const date = document.getElementById('post-date').value;
            const author = document.getElementById('post-author').value.trim();
            const layout = document.getElementById('post-layout').value;
            const categories = document.getElementById('post-categories').value
                .split(',').map(c => c.trim()).filter(c => c);
            const tags = document.getElementById('post-tags').value
                .split(',').map(t => t.trim()).filter(t => t);
            const description = document.getElementById('post-description').value.trim();
            const content = this.currentPostEditor.getContent();

            if (!title) {
                throw new Error('請輸入標題');
            }

            // 構建文章元數據
            const metadata = {
                layout,
                title,
                date,
                author,
                categories,
                tags,
                description
            };

            // 生成前端內容
            const frontMatter = this.github.generatePostFrontMatter(metadata);
            const fullContent = frontMatter + '\n\n' + content;

            // 生成文件名
            const filename = isEditing 
                ? this.currentEditingPost.filename 
                : this.github.generatePostFilename(title, date);

            const message = isEditing 
                ? `Update post: ${title}` 
                : `Create new post: ${title}`;

            const sha = isEditing ? this.currentEditingPost.sha : null;

            // 儲存到 GitHub
            await this.github.createOrUpdateFile(`posts/${filename}`, fullContent, message, sha);

            // 重新載入文章列表
            this.posts = await this.github.getPosts();

            // 關閉模態框
            this.closeModal();

            // 顯示成功訊息
            this.showNotification(isEditing ? '文章更新成功！' : '文章發布成功！', 'success');

            // 如果在文章頁面，重新渲染
            if (this.currentPage === 'posts') {
                this.renderPosts();
            }
        } catch (error) {
            console.error('Failed to save post:', error);
            this.showNotification('儲存失敗：' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * 儲存頁面
     */
    async savePage() {
        try {
            this.showLoading();

            // 獲取表單數據
            const title = document.getElementById('page-title').value.trim();
            const layout = document.getElementById('page-layout').value;
            const permalink = document.getElementById('page-permalink').value.trim();
            const description = document.getElementById('page-description').value.trim();
            const content = this.currentPageEditor.getContent();

            if (!title) {
                throw new Error('請輸入標題');
            }

            // 構建頁面元數據
            const metadata = {
                layout,
                title,
                permalink,
                description
            };

            // 生成前端內容
            const frontMatter = this.github.generatePageFrontMatter(metadata);
            const fullContent = frontMatter + '\n\n' + content;

            const message = `Update page: ${title}`;

            // 儲存到 GitHub
            await this.github.createOrUpdateFile(
                this.currentEditingPage.path, 
                fullContent, 
                message, 
                this.currentEditingPage.sha
            );

            // 重新載入頁面列表
            this.pages = await this.github.getPages();

            // 關閉模態框
            this.closeModal();

            // 顯示成功訊息
            this.showNotification('頁面更新成功！', 'success');

            // 如果在頁面管理頁面，重新渲染
            if (this.currentPage === 'pages') {
                this.renderPages();
            }
        } catch (error) {
            console.error('Failed to save page:', error);
            this.showNotification('儲存失敗：' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * 儲存設定
     */
    async saveSettings() {
        try {
            this.showLoading();

            const config = this.settingsEditor.getContent();
            
            await this.github.updateSiteConfig(config);
            
            this.showNotification('設定儲存成功！', 'success');
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showNotification('儲存設定失敗：' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * 刪除文章
     */
    async deletePost(filename) {
        if (!confirm('確定要刪除這篇文章嗎？此操作無法撤銷。')) {
            return;
        }

        try {
            this.showLoading();

            const post = this.posts.find(p => p.filename === filename);
            if (!post) {
                throw new Error('找不到指定的文章');
            }

            await this.github.deleteFile(
                post.path, 
                `Delete post: ${post.metadata.title}`, 
                post.sha
            );

            // 重新載入文章列表
            this.posts = await this.github.getPosts();

            // 重新渲染文章列表
            this.renderPosts();

            this.showNotification('文章刪除成功！', 'success');
        } catch (error) {
            console.error('Failed to delete post:', error);
            this.showNotification('刪除失敗：' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * 處理媒體上傳
     */
    async handleMediaUpload(files) {
        const fileArray = Array.from(files);
        
        for (const file of fileArray) {
            try {
                this.showLoading(`正在上傳 ${file.name}...`);

                const result = await this.github.uploadMedia(file);
                
                this.showNotification(`${file.name} 上傳成功！`, 'success');
            } catch (error) {
                console.error('Failed to upload media:', error);
                this.showNotification(`${file.name} 上傳失敗：${error.message}`, 'error');
            }
        }

        // 重新載入媒體文件列表
        this.mediaFiles = await this.github.getMediaFiles();

        // 如果在媒體頁面，重新渲染
        if (this.currentPage === 'media') {
            this.renderMedia();
        }

        this.hideLoading();
    }

    /**
     * 複製媒體文件 URL
     */
    copyMediaURL(url) {
        navigator.clipboard.writeText(url).then(() => {
            this.showNotification('鏈接已複製到剪貼板！', 'success');
        }).catch(error => {
            console.error('Failed to copy URL:', error);
            this.showNotification('複製失敗', 'error');
        });
    }

    /**
     * 刪除媒體文件
     */
    async deleteMedia(path, sha) {
        if (!confirm('確定要刪除這個媒體文件嗎？')) {
            return;
        }

        try {
            this.showLoading();

            await this.github.deleteFile(path, `Delete media: ${path}`, sha);

            // 重新載入媒體文件列表
            this.mediaFiles = await this.github.getMediaFiles();

            // 重新渲染媒體列表
            this.renderMedia();

            this.showNotification('媒體文件刪除成功！', 'success');
        } catch (error) {
            console.error('Failed to delete media:', error);
            this.showNotification('刪除失敗：' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * 創建模態對話框
     */
    createModal(title, content, footer) {
        const modalContainer = document.getElementById('modal-container');
        
        modalContainer.innerHTML = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close" onclick="app.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        ${footer}
                    </div>
                </div>
            </div>
        `;

        return modalContainer.querySelector('.modal');
    }

    /**
     * 關閉模態對話框
     */
    closeModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = '';

        // 清理編輯器
        if (this.currentPostEditor) {
            this.currentPostEditor.destroy();
            this.currentPostEditor = null;
        }
        if (this.currentPageEditor) {
            this.currentPageEditor.destroy();
            this.currentPageEditor = null;
        }
    }

    /**
     * 顯示載入狀態
     */
    showLoading(message = '載入中...') {
        const loading = document.getElementById('loading');
        const loadingText = loading.querySelector('p');
        loadingText.textContent = message;
        loading.style.display = 'flex';
    }

    /**
     * 隱藏載入狀態
     */
    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    /**
     * 顯示通知訊息
     */
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const messageElement = notification.querySelector('.notification-message');
        
        messageElement.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';

        // 自動隱藏
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    }

    /**
     * 隱藏通知訊息
     */
    hideNotification() {
        document.getElementById('notification').style.display = 'none';
    }

    /**
     * 處理儲存快捷鍵
     */
    handleSave() {
        if (this.currentPostEditor) {
            const isEditing = !!this.currentEditingPost;
            this.savePost(isEditing);
        } else if (this.currentPageEditor) {
            this.savePage();
        } else if (this.settingsEditor && this.currentPage === 'settings') {
            this.saveSettings();
        }
    }
}

// 全域變數
let app;
let authManager;

// 初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
    app = new BlogAdmin();
    authManager = app.authManager;

    // 添加全域函數供 HTML 使用
    window.app = app;
    window.authManager = authManager;
    window.showNotification = app.showNotification.bind(app);
});

// 添加 CSS 動畫
const style = document.createElement('style');
style.textContent = `
    .editor-fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        background: white;
        padding: 20px;
    }
    
    .editor-fullscreen .editor-content {
        height: calc(100vh - 120px);
    }
    
    .toolbar-group {
        display: flex;
        gap: 4px;
        padding-right: 12px;
        border-right: 1px solid #e2e8f0;
    }
    
    .toolbar-group:last-child,
    .toolbar-right {
        border-right: none;
        margin-left: auto;
    }
`;
document.head.appendChild(style);