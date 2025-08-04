/**
 * Layout Manager - Handles drag-and-drop layout editing and section management
 */

class LayoutManager {
    constructor() {
        this.currentLayout = [];
        this.availableElements = {};
        this.draggedElement = null;
        this.initializeElements();
        this.initializeDragAndDrop();
        this.loadSavedLayout();
    }

    /**
     * Initialize available elements for the layout
     */
    initializeElements() {
        this.availableElements = {
            hero: {
                name: '英雄區塊',
                icon: 'fas fa-star',
                template: `
                    <section class="hero fullwidth-section" data-section="hero">
                        <div class="container">
                            <div class="hero-content">
                                <div class="hero-text">
                                    <h1>哈囉，我是 Tony</h1>
                                    <p class="tagline">創業家、內容創作者與專業領域專家</p>
                                    <p class="description">
                                        我致力於透過創新思維和實際行動，為世界帶來正面的改變。通過分享知識、經驗和洞察，
                                        幫助更多人實現他們的夢想，建立一個更美好的未來。
                                    </p>
                                    <div class="flex gap-4">
                                        <a href="#newsletter" class="btn btn-primary">訂閱電子報</a>
                                        <a href="/about/" class="btn btn-secondary">了解更多</a>
                                    </div>
                                </div>
                                <div class="hero-image">
                                    <img src="https://via.placeholder.com/240x240/ff6b35/ffffff?text=TONY" alt="Tony 的照片">
                                </div>
                            </div>
                        </div>
                    </section>
                `,
                editable: true,
                movable: true
            },
            stats: {
                name: '統計數據',
                icon: 'fas fa-chart-bar',
                template: `
                    <section class="stats-section fullwidth-section" data-section="stats">
                        <div class="container">
                            <div class="stats-grid">
                                <div class="stat-card">
                                    <div class="stat-number">50+</div>
                                    <div class="stat-label">發表文章</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-number">10K+</div>
                                    <div class="stat-label">社群追蹤者</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-number">5+</div>
                                    <div class="stat-label">成功專案</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-number">3+</div>
                                    <div class="stat-label">年經驗</div>
                                </div>
                            </div>
                        </div>
                    </section>
                `,
                editable: true,
                movable: true
            },
            articles: {
                name: '文章列表',
                icon: 'fas fa-newspaper',
                template: `
                    <section class="section" data-section="articles">
                        <div class="container">
                            <div class="section-header">
                                <h2 class="section-title">最新文章</h2>
                                <p class="section-subtitle">
                                    探索創業、個人成長、科技趨勢和生活見解的最新想法
                                </p>
                            </div>
                            
                            <div class="grid grid-cols-3">
                                <article class="article-card">
                                    <div class="article-image">📝</div>
                                    <div class="article-content">
                                        <div class="article-date">2025年01月15日</div>
                                        <h3 class="article-title">歡迎來到我的個人網站！</h3>
                                        <p class="article-excerpt">很高興能夠與大家分享我新建立的個人網站。在這裡，我將記錄我的創業旅程...</p>
                                        <a href="#" class="article-link">閱讀更多 →</a>
                                    </div>
                                </article>
                                <article class="article-card">
                                    <div class="article-image">💡</div>
                                    <div class="article-content">
                                        <div class="article-date">2025年01月10日</div>
                                        <h3 class="article-title">個人品牌建立指南</h3>
                                        <p class="article-excerpt">在這個數位時代，每個人都需要建立自己的個人品牌...</p>
                                        <a href="#" class="article-link">閱讀更多 →</a>
                                    </div>
                                </article>
                                <article class="article-card">
                                    <div class="article-image">🚀</div>
                                    <div class="article-content">
                                        <div class="article-date">2025年01月05日</div>
                                        <h3 class="article-title">創業心得分享</h3>
                                        <p class="article-excerpt">分享我在創業路上的一些經驗和教訓...</p>
                                        <a href="#" class="article-link">閱讀更多 →</a>
                                    </div>
                                </article>
                            </div>
                            
                            <div class="text-center mt-8">
                                <a href="/blog/" class="btn btn-outline">查看所有文章</a>
                            </div>
                        </div>
                    </section>
                `,
                editable: true,
                movable: true
            },
            newsletter: {
                name: '電子報訂閱',
                icon: 'fas fa-envelope',
                template: `
                    <section class="newsletter-section fullwidth-section" data-section="newsletter">
                        <div class="container">
                            <div class="newsletter-content">
                                <h2>加入我的電子報</h2>
                                <p>每週收到關於創業、個人成長和生產力的深度見解</p>
                                <form class="newsletter-form" action="#" method="post">
                                    <input type="email" class="newsletter-input" placeholder="輸入您的電子郵件" required>
                                    <button type="submit" class="newsletter-button">立即訂閱</button>
                                </form>
                                <p style="font-size: 0.875rem; opacity: 0.8; margin-top: 1rem;">
                                    已有 <strong>5,000+</strong> 人訂閱 • 隨時可取消訂閱
                                </p>
                            </div>
                        </div>
                    </section>
                `,
                editable: true,
                movable: true
            },
            courses: {
                name: '課程展示',
                icon: 'fas fa-graduation-cap',
                template: `
                    <section class="section" data-section="courses">
                        <div class="container">
                            <div class="section-header">
                                <h2 class="section-title">精選課程</h2>
                                <p class="section-subtitle">
                                    深度學習課程，幫助您在創業和個人發展路上更進一步
                                </p>
                            </div>
                            
                            <div class="grid grid-cols-2">
                                <div class="course-card">
                                    <div class="course-image">🚀 創業基礎</div>
                                    <div class="course-body">
                                        <h3 class="course-title">創業從0到1完整指南</h3>
                                        <p class="course-description">
                                            從想法驗證到產品上市，學習完整的創業流程和關鍵策略
                                        </p>
                                        <div class="course-meta">
                                            <span class="course-price">NT$ 2,999</span>
                                            <span class="course-students">150+ 學員</span>
                                        </div>
                                        <a href="/courses/" class="btn btn-primary">了解更多</a>
                                    </div>
                                </div>
                                
                                <div class="course-card">
                                    <div class="course-image">💡 個人品牌</div>
                                    <div class="course-body">
                                        <h3 class="course-title">打造個人品牌影響力</h3>
                                        <p class="course-description">
                                            學習如何建立強大的個人品牌，在數位時代脫穎而出
                                        </p>
                                        <div class="course-meta">
                                            <span class="course-price">NT$ 1,999</span>
                                            <span class="course-students">200+ 學員</span>
                                        </div>
                                        <a href="/courses/" class="btn btn-primary">了解更多</a>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="text-center mt-8">
                                <a href="/courses/" class="btn btn-outline">查看所有課程</a>
                            </div>
                        </div>
                    </section>
                `,
                editable: true,
                movable: true
            },
            youtube: {
                name: 'YouTube 頻道',
                icon: 'fab fa-youtube',
                template: `
                    <section class="youtube-section fullwidth-section" data-section="youtube">
                        <div class="container">
                            <div class="section-header">
                                <h2 class="section-title" style="color: var(--text-primary);">YouTube 頻道</h2>
                                <p class="section-subtitle">
                                    訂閱我的頻道，獲得最新的創業見解和實用建議
                                </p>
                            </div>
                            
                            <div class="youtube-embed">
                                <iframe 
                                    src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                                    title="YouTube video player" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen>
                                </iframe>
                            </div>
                            
                            <div class="youtube-cta">
                                <a href="https://youtube.com/@yourchannel" class="btn btn-primary" target="_blank">
                                    訂閱 YouTube 頻道
                                </a>
                            </div>
                        </div>
                    </section>
                `,
                editable: true,
                movable: true
            },
            testimonials: {
                name: '客戶見證',
                icon: 'fas fa-quote-left',
                template: `
                    <section class="testimonials-section" data-section="testimonials">
                        <div class="container">
                            <div class="section-header">
                                <h2 class="section-title">客戶見證</h2>
                                <p class="section-subtitle">聽聽他們怎麼說</p>
                            </div>
                            
                            <div class="grid grid-cols-3">
                                <div class="testimonial-card">
                                    <div class="testimonial-content">
                                        <p>"Tony 的課程真的改變了我的思維模式，讓我在創業路上少走了很多彎路。"</p>
                                    </div>
                                    <div class="testimonial-author">
                                        <img src="https://via.placeholder.com/60x60" alt="客戶頭像">
                                        <div>
                                            <h4>張小明</h4>
                                            <p>科技創業家</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="testimonial-card">
                                    <div class="testimonial-content">
                                        <p>"非常實用的內容，每一篇文章都讓我有新的收穫和啟發。"</p>
                                    </div>
                                    <div class="testimonial-author">
                                        <img src="https://via.placeholder.com/60x60" alt="客戶頭像">
                                        <div>
                                            <h4>李小華</h4>
                                            <p>產品經理</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="testimonial-card">
                                    <div class="testimonial-content">
                                        <p>"Tony 的見解深入淺出，幫助我建立了更清晰的個人品牌策略。"</p>
                                    </div>
                                    <div class="testimonial-author">
                                        <img src="https://via.placeholder.com/60x60" alt="客戶頭像">
                                        <div>
                                            <h4>王小美</h4>
                                            <p>行銷專家</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                `,
                editable: true,
                movable: true
            },
            contact: {
                name: '聯絡資訊',
                icon: 'fas fa-phone',
                template: `
                    <section class="contact-section" data-section="contact">
                        <div class="container">
                            <div class="section-header">
                                <h2 class="section-title">聯絡我</h2>
                                <p class="section-subtitle">有任何問題或合作提案，歡迎與我聯繫</p>
                            </div>
                            
                            <div class="contact-grid">
                                <div class="contact-info">
                                    <div class="contact-item">
                                        <i class="fas fa-envelope"></i>
                                        <div>
                                            <h4>電子郵件</h4>
                                            <p>tony@example.com</p>
                                        </div>
                                    </div>
                                    
                                    <div class="contact-item">
                                        <i class="fab fa-linkedin"></i>
                                        <div>
                                            <h4>LinkedIn</h4>
                                            <p>linkedin.com/in/tony</p>
                                        </div>
                                    </div>
                                    
                                    <div class="contact-item">
                                        <i class="fab fa-twitter"></i>
                                        <div>
                                            <h4>Twitter</h4>
                                            <p>@tony</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="contact-form">
                                    <h3>發送訊息</h3>
                                    <form>
                                        <input type="text" placeholder="您的姓名" required>
                                        <input type="email" placeholder="您的電子郵件" required>
                                        <textarea placeholder="您的訊息" rows="5" required></textarea>
                                        <button type="submit" class="btn btn-primary">發送訊息</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                `,
                editable: true,
                movable: true
            }
        };
    }

    /**
     * Initialize drag and drop functionality
     */
    initializeDragAndDrop() {
        this.initializeSortable();
        this.initializeElementDragging();
    }

    /**
     * Initialize sortable for existing elements
     */
    initializeSortable() {
        const pageBuilder = document.getElementById('page-builder');
        if (pageBuilder && typeof Sortable !== 'undefined') {
            this.sortable = Sortable.create(pageBuilder, {
                group: 'shared',
                animation: 150,
                fallbackOnBody: true,
                swapThreshold: 0.65,
                onEnd: (evt) => {
                    this.updateLayout();
                    this.saveLayout();
                }
            });
        }
    }

    /**
     * Initialize dragging from element library
     */
    initializeElementDragging() {
        const elementItems = document.querySelectorAll('.element-item');
        
        elementItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedElement = e.target.dataset.element;
                e.dataTransfer.effectAllowed = 'copy';
            });

            item.addEventListener('dragend', () => {
                this.draggedElement = null;
            });
        });

        // Initialize drop zone
        const pageBuilder = document.getElementById('page-builder');
        if (pageBuilder) {
            pageBuilder.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            });

            pageBuilder.addEventListener('drop', (e) => {
                e.preventDefault();
                if (this.draggedElement) {
                    this.addElement(this.draggedElement);
                    this.draggedElement = null;
                }
            });
        }
    }

    /**
     * Add an element to the layout
     */
    addElement(elementType, position = null) {
        const elementData = this.availableElements[elementType];
        if (!elementData) return;

        const pageBuilder = document.getElementById('page-builder');
        const placeholder = pageBuilder.querySelector('.section-placeholder');
        
        // Remove placeholder if it exists
        if (placeholder) {
            placeholder.remove();
        }

        // Create element
        const elementDiv = document.createElement('div');
        elementDiv.className = 'layout-section';
        elementDiv.dataset.elementType = elementType;
        elementDiv.innerHTML = `
            <div class="section-controls">
                <button class="control-btn edit-btn" onclick="layoutManager.editElement('${elementType}', this)">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="control-btn duplicate-btn" onclick="layoutManager.duplicateElement('${elementType}', this)">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="control-btn delete-btn" onclick="layoutManager.deleteElement(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            ${elementData.template}
        `;

        // Add to layout
        if (position !== null) {
            const sections = pageBuilder.querySelectorAll('.layout-section');
            if (sections[position]) {
                pageBuilder.insertBefore(elementDiv, sections[position]);
            } else {
                pageBuilder.appendChild(elementDiv);
            }
        } else {
            pageBuilder.appendChild(elementDiv);
        }

        // Update layout and save
        this.updateLayout();
        this.saveLayout();

        // Re-initialize element inspector if available
        if (window.elementInspector) {
            window.elementInspector.scanElements();
        }

        this.showNotification(`已新增 ${elementData.name}`, 'success');
    }

    /**
     * Edit an element
     */
    editElement(elementType, buttonElement) {
        const section = buttonElement.closest('.layout-section');
        const elementData = this.availableElements[elementType];
        
        if (!section || !elementData) return;

        // Show element properties panel
        if (window.elementInspector) {
            const sectionElement = section.querySelector('[data-section]');
            if (sectionElement) {
                window.elementInspector.selectElement(sectionElement.dataset.section);
            }
        }
    }

    /**
     * Duplicate an element
     */
    duplicateElement(elementType, buttonElement) {
        const section = buttonElement.closest('.layout-section');
        if (!section) return;

        const newSection = section.cloneNode(true);
        section.parentNode.insertBefore(newSection, section.nextSibling);

        this.updateLayout();
        this.saveLayout();

        this.showNotification('元素已複製', 'success');
    }

    /**
     * Delete an element
     */
    deleteElement(buttonElement) {
        if (!confirm('確定要刪除這個元素嗎？')) return;

        const section = buttonElement.closest('.layout-section');
        if (!section) return;

        section.remove();
        
        // Check if page is empty and add placeholder
        const pageBuilder = document.getElementById('page-builder');
        if (pageBuilder.children.length === 0) {
            this.addPlaceholder();
        }

        this.updateLayout();
        this.saveLayout();

        this.showNotification('元素已刪除', 'info');
    }

    /**
     * Add placeholder when page is empty
     */
    addPlaceholder() {
        const pageBuilder = document.getElementById('page-builder');
        const placeholder = document.createElement('div');
        placeholder.className = 'section-placeholder';
        placeholder.innerHTML = `
            <i class="fas fa-plus"></i>
            <p>拖拉元素到這裡開始建立頁面</p>
        `;
        pageBuilder.appendChild(placeholder);
    }

    /**
     * Update current layout structure
     */
    updateLayout() {
        const pageBuilder = document.getElementById('page-builder');
        const sections = pageBuilder.querySelectorAll('.layout-section');
        
        this.currentLayout = Array.from(sections).map((section, index) => ({
            type: section.dataset.elementType,
            position: index,
            content: section.innerHTML
        }));
    }

    /**
     * Save layout to localStorage
     */
    saveLayout() {
        localStorage.setItem('currentLayout', JSON.stringify(this.currentLayout));
    }

    /**
     * Load saved layout
     */
    loadSavedLayout() {
        const savedLayout = localStorage.getItem('currentLayout');
        
        if (savedLayout) {
            try {
                const layout = JSON.parse(savedLayout);
                this.restoreLayout(layout);
            } catch (error) {
                console.error('Failed to load saved layout:', error);
                this.createDefaultLayout();
            }
        } else {
            this.createDefaultLayout();
        }
    }

    /**
     * Restore layout from saved data
     */
    restoreLayout(layout) {
        const pageBuilder = document.getElementById('page-builder');
        pageBuilder.innerHTML = '';

        if (layout.length === 0) {
            this.addPlaceholder();
            return;
        }

        layout.forEach(item => {
            const elementData = this.availableElements[item.type];
            if (elementData) {
                const elementDiv = document.createElement('div');
                elementDiv.className = 'layout-section';
                elementDiv.dataset.elementType = item.type;
                elementDiv.innerHTML = item.content;
                pageBuilder.appendChild(elementDiv);
            }
        });

        this.currentLayout = layout;
        this.initializeSortable();

        // Re-initialize element inspector
        if (window.elementInspector) {
            setTimeout(() => {
                window.elementInspector.scanElements();
            }, 100);
        }
    }

    /**
     * Create default layout
     */
    createDefaultLayout() {
        const defaultElements = ['hero', 'stats', 'articles', 'newsletter', 'courses', 'youtube'];
        
        defaultElements.forEach(elementType => {
            this.addElement(elementType);
        });
    }

    /**
     * Export layout configuration
     */
    exportLayout() {
        const exportData = {
            layout: this.currentLayout,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'website-layout.json';
        a.click();
        
        URL.revokeObjectURL(url);
    }

    /**
     * Import layout configuration
     */
    importLayout(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.layout) {
                    this.restoreLayout(data.layout);
                    this.saveLayout();
                    this.showNotification('版面配置已匯入', 'success');
                } else {
                    this.showNotification('配置檔案格式錯誤', 'error');
                }
            } catch (error) {
                this.showNotification('配置檔案格式錯誤', 'error');
            }
        };
        reader.readAsText(file);
    }

    /**
     * Reset layout to default
     */
    resetLayout() {
        if (!confirm('確定要重設版面配置嗎？此操作無法復原。')) return;

        localStorage.removeItem('currentLayout');
        this.createDefaultLayout();
        
        this.showNotification('版面配置已重設', 'info');
    }

    /**
     * Get layout preview
     */
    getLayoutPreview() {
        const pageBuilder = document.getElementById('page-builder');
        return pageBuilder.innerHTML;
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize layout manager
let layoutManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        layoutManager = new LayoutManager();
    });
} else {
    layoutManager = new LayoutManager();
}