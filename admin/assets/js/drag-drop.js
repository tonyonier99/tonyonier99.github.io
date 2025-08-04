// Drag and Drop Manager for Page Builder
class DragDropManager {
    constructor(customizeAdmin) {
        this.admin = customizeAdmin;
        this.draggedElement = null;
        this.init();
    }

    init() {
        this.setupElementLibrary();
        this.setupPageBuilder();
        this.setupSectionControls();
    }

    setupElementLibrary() {
        const elementItems = document.querySelectorAll('.element-item');
        
        elementItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedElement = e.target.dataset.element;
                e.target.classList.add('dragging');
                
                // Create ghost image
                const ghost = e.target.cloneNode(true);
                ghost.style.transform = 'rotate(5deg)';
                e.dataTransfer.setDragImage(ghost, 50, 25);
            });

            item.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
                this.draggedElement = null;
            });
        });
    }

    setupPageBuilder() {
        const pageBuilder = document.getElementById('page-builder');
        
        pageBuilder.addEventListener('dragover', (e) => {
            e.preventDefault();
            pageBuilder.classList.add('drag-over');
        });

        pageBuilder.addEventListener('dragleave', (e) => {
            if (!pageBuilder.contains(e.relatedTarget)) {
                pageBuilder.classList.remove('drag-over');
            }
        });

        pageBuilder.addEventListener('drop', (e) => {
            e.preventDefault();
            pageBuilder.classList.remove('drag-over');
            
            if (this.draggedElement) {
                this.addSectionToBuilder(this.draggedElement, e);
            }
        });
    }

    addSectionToBuilder(elementType, dropEvent) {
        const pageBuilder = document.getElementById('page-builder');
        const placeholder = pageBuilder.querySelector('.section-placeholder');
        
        // Remove placeholder if it exists
        if (placeholder) {
            placeholder.remove();
        }

        // Create new section
        const section = this.createBuilderSection(elementType);
        
        // Determine drop position
        const dropPosition = this.getDropPosition(dropEvent, pageBuilder);
        
        if (dropPosition.insertBefore) {
            pageBuilder.insertBefore(section, dropPosition.insertBefore);
        } else {
            pageBuilder.appendChild(section);
        }

        // Add animation
        section.classList.add('fade-in');
        
        // Update admin settings
        this.admin.updateLayoutFromDOM();
        this.admin.updatePreview();
        
        // Auto-select the new section for editing
        setTimeout(() => {
            this.admin.editSection(section);
        }, 300);
    }

    getDropPosition(dropEvent, container) {
        const sections = container.querySelectorAll('.builder-section');
        const dropY = dropEvent.clientY;
        
        let insertBefore = null;
        let minDistance = Infinity;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const distance = Math.abs(dropY - sectionCenter);
            
            if (distance < minDistance && dropY < sectionCenter) {
                minDistance = distance;
                insertBefore = section;
            }
        });
        
        return { insertBefore };
    }

    createBuilderSection(elementType) {
        const section = document.createElement('div');
        section.className = 'builder-section';
        section.dataset.elementType = elementType;
        section.setAttribute('data-tooltip', `${elementType} 區塊`);
        
        const sectionData = this.getSectionData(elementType);
        
        section.innerHTML = `
            <div class="section-controls">
                <button class="section-control tooltip" data-action="move" data-tooltip="拖拉移動">
                    <i class="fas fa-grip-vertical"></i>
                </button>
                <button class="section-control tooltip" data-action="edit" data-tooltip="編輯設定">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="section-control tooltip" data-action="copy" data-tooltip="複製區塊">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="section-control tooltip" data-action="delete" data-tooltip="刪除區塊">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="section-header">
                <h3>${sectionData.title}</h3>
                <span class="section-status ${sectionData.status}">${sectionData.statusText}</span>
            </div>
            <div class="section-content">
                ${sectionData.preview}
            </div>
        `;

        this.setupSectionEvents(section);
        return section;
    }

    getSectionData(elementType) {
        const sectionTypes = {
            hero: {
                title: '英雄區塊 (Hero Section)',
                status: 'active',
                statusText: '啟用',
                preview: `
                    <div class="section-preview">
                        <div class="preview-hero">
                            <h4>主標題區域</h4>
                            <p>副標題和描述文字</p>
                            <div class="preview-buttons">
                                <span class="preview-btn">主要按鈕</span>
                                <span class="preview-btn secondary">次要按鈕</span>
                            </div>
                        </div>
                        <div class="preview-image">
                            <i class="fas fa-user-circle"></i>
                        </div>
                    </div>
                `
            },
            stats: {
                title: '統計數據 (Statistics)',
                status: 'active',
                statusText: '啟用',
                preview: `
                    <div class="section-preview stats-preview">
                        <div class="stat-item">
                            <strong>50+</strong>
                            <span>發表文章</span>
                        </div>
                        <div class="stat-item">
                            <strong>10K+</strong>
                            <span>追蹤者</span>
                        </div>
                        <div class="stat-item">
                            <strong>5+</strong>
                            <span>專案</span>
                        </div>
                        <div class="stat-item">
                            <strong>3+</strong>
                            <span>年經驗</span>
                        </div>
                    </div>
                `
            },
            articles: {
                title: '文章列表 (Articles)',
                status: 'active',
                statusText: '啟用',
                preview: `
                    <div class="section-preview">
                        <h4>最新文章</h4>
                        <div class="articles-grid">
                            <div class="article-preview">
                                <div class="article-image"></div>
                                <div class="article-content">
                                    <h5>文章標題</h5>
                                    <p>文章摘要...</p>
                                </div>
                            </div>
                            <div class="article-preview">
                                <div class="article-image"></div>
                                <div class="article-content">
                                    <h5>文章標題</h5>
                                    <p>文章摘要...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            courses: {
                title: '課程展示 (Courses)',
                status: 'active',
                statusText: '啟用',
                preview: `
                    <div class="section-preview">
                        <h4>精選課程</h4>
                        <div class="courses-grid">
                            <div class="course-preview">
                                <div class="course-icon">🚀</div>
                                <h5>創業課程</h5>
                                <p>NT$ 2,999</p>
                            </div>
                            <div class="course-preview">
                                <div class="course-icon">💡</div>
                                <h5>品牌課程</h5>
                                <p>NT$ 1,999</p>
                            </div>
                        </div>
                    </div>
                `
            },
            newsletter: {
                title: '電子報訂閱 (Newsletter)',
                status: 'active',
                statusText: '啟用',
                preview: `
                    <div class="section-preview newsletter-preview">
                        <h4>加入我的電子報</h4>
                        <p>每週收到最新內容</p>
                        <div class="newsletter-form-preview">
                            <span class="input-preview">電子郵件地址</span>
                            <span class="button-preview">訂閱</span>
                        </div>
                    </div>
                `
            },
            youtube: {
                title: 'YouTube 頻道 (YouTube)',
                status: 'active',
                statusText: '啟用',
                preview: `
                    <div class="section-preview">
                        <h4>YouTube 頻道</h4>
                        <div class="youtube-preview">
                            <i class="fab fa-youtube"></i>
                            <p>影片嵌入區域</p>
                        </div>
                    </div>
                `
            },
            testimonials: {
                title: '客戶見證 (Testimonials)',
                status: 'inactive',
                statusText: '未啟用',
                preview: `
                    <div class="section-preview">
                        <h4>客戶見證</h4>
                        <div class="testimonials-grid">
                            <div class="testimonial-preview">
                                <div class="testimonial-avatar"></div>
                                <div class="testimonial-content">
                                    <p>"很棒的課程..."</p>
                                    <strong>客戶姓名</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            contact: {
                title: '聯絡資訊 (Contact)',
                status: 'inactive',
                statusText: '未啟用',
                preview: `
                    <div class="section-preview">
                        <h4>聯絡我們</h4>
                        <div class="contact-preview">
                            <div class="contact-info">
                                <i class="fas fa-envelope"></i>
                                <i class="fas fa-phone"></i>
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                        </div>
                    </div>
                `
            }
        };

        return sectionTypes[elementType] || {
            title: '自定義區塊',
            status: 'active',
            statusText: '啟用',
            preview: '<div class="section-preview"><p>自定義內容</p></div>'
        };
    }

    setupSectionEvents(section) {
        // Edit button
        section.querySelector('[data-action="edit"]').addEventListener('click', (e) => {
            e.stopPropagation();
            this.admin.editSection(section);
        });

        // Delete button
        section.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteSection(section);
        });

        // Copy button
        section.querySelector('[data-action="copy"]').addEventListener('click', (e) => {
            e.stopPropagation();
            this.copySection(section);
        });

        // Move handle
        const moveHandle = section.querySelector('[data-action="move"]');
        moveHandle.addEventListener('mousedown', () => {
            section.setAttribute('draggable', 'true');
        });

        // Section click to select
        section.addEventListener('click', () => {
            this.selectSection(section);
        });

        // Make section sortable
        this.makeSectionSortable(section);
    }

    makeSectionSortable(section) {
        section.addEventListener('dragstart', (e) => {
            if (e.target === section) {
                section.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        section.addEventListener('dragend', () => {
            section.classList.remove('dragging');
            section.setAttribute('draggable', 'false');
        });
    }

    selectSection(section) {
        // Remove previous selection
        document.querySelectorAll('.builder-section.selected').forEach(s => {
            s.classList.remove('selected');
        });

        // Add selection to current section
        section.classList.add('selected');
        
        // Show properties panel
        this.admin.editSection(section);
    }

    deleteSection(section) {
        const sectionType = section.dataset.elementType;
        const sectionTitle = this.getSectionData(sectionType).title;
        
        if (confirm(`確定要刪除「${sectionTitle}」區塊嗎？`)) {
            // Add delete animation
            section.style.transform = 'scale(0.9)';
            section.style.opacity = '0';
            section.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                section.remove();
                this.admin.updateLayoutFromDOM();
                this.admin.updatePreview();
                
                // Show placeholder if no sections left
                const pageBuilder = document.getElementById('page-builder');
                if (!pageBuilder.querySelector('.builder-section')) {
                    this.showPlaceholder(pageBuilder);
                }
            }, 300);
        }
    }

    copySection(section) {
        const sectionType = section.dataset.elementType;
        const newSection = this.createBuilderSection(sectionType);
        
        // Insert after current section
        section.parentNode.insertBefore(newSection, section.nextSibling);
        
        // Add animation
        newSection.classList.add('slide-in');
        
        // Update admin settings
        this.admin.updateLayoutFromDOM();
        this.admin.updatePreview();
        
        // Show success message
        this.admin.showNotification('區塊已複製', 'success');
    }

    showPlaceholder(container) {
        const placeholder = document.createElement('div');
        placeholder.className = 'section-placeholder';
        placeholder.innerHTML = `
            <i class="fas fa-plus"></i>
            <p>拖拉元素到這裡開始建立頁面</p>
        `;
        container.appendChild(placeholder);
    }

    setupSectionControls() {
        // Initialize sortable for existing sections
        const pageBuilder = document.getElementById('page-builder');
        
        if (pageBuilder && typeof Sortable !== 'undefined') {
            new Sortable(pageBuilder, {
                animation: 150,
                ghostClass: 'dragging',
                chosenClass: 'drag-over',
                handle: '[data-action="move"]',
                onEnd: () => {
                    this.admin.updateLayoutFromDOM();
                    this.admin.updatePreview();
                }
            });
        }
    }
}

// Export for use in main application
window.DragDropManager = DragDropManager;