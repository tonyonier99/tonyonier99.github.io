// Main Customization Admin System
class CustomizeAdmin {
    constructor() {
        this.settings = {
            colors: {
                primary: '#ff6b35',
                secondary: '#2a2a3a',
                textPrimary: '#1f2937',
                textSecondary: '#6b7280',
                backgroundPrimary: '#ffffff',
                backgroundSecondary: '#f9fafb'
            },
            typography: {
                headingFont: 'Inter',
                bodyFont: 'Inter',
                headingSize: 48,
                bodySize: 16
            },
            spacing: {
                sectionSpacing: 60,
                elementSpacing: 24,
                containerWidth: 1200
            },
            effects: {
                borderRadius: 8,
                shadowIntensity: 2,
                animationStyle: 'fade'
            },
            content: {
                heroTitle: '哈囉，我是 Tony',
                heroSubtitle: '創業家、內容創作者與專業領域專家',
                heroDescription: '我致力於透過創新思維和實際行動，為世界帶來正面的改變。通過分享知識、經驗和洞察，幫助更多人實現他們的夢想，建立一個更美好的未來。',
                heroImage: 'https://via.placeholder.com/240x240/ff6b35/ffffff?text=TONY'
            },
            layout: {
                sections: ['hero', 'stats', 'articles', 'courses', 'newsletter', 'youtube']
            },
            responsive: {
                desktop: { columns: 2 },
                tablet: { columns: 2 },
                mobile: { columns: 1 }
            }
        };
        
        this.currentPage = 'layout';
        this.selectedElement = null;
        this.isPreviewMode = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedSettings();
        this.showMainApp();
        this.initializeModules();
        this.updatePreview();
    }

    initializeModules() {
        // Initialize all manager modules
        this.dragDropManager = new DragDropManager(this);
        this.styleEditor = new StyleEditor(this);
        this.contentManager = new ContentManager(this);
        this.responsiveManager = new ResponsiveManager(this);
        this.previewManager = new PreviewManager(this);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.switchPage(page);
            });
        });

        // Save and Publish buttons
        document.getElementById('save-changes').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('publish').addEventListener('click', () => {
            this.publishChanges();
        });

        // Style tabs
        document.querySelectorAll('.style-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchStyleTab(tabName);
            });
        });

        // Device selector
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const device = e.currentTarget.dataset.device;
                this.switchDevice(device);
            });
        });

        // Preview device selector
        document.querySelectorAll('.preview-device').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const width = e.currentTarget.dataset.width;
                this.setPreviewWidth(width);
            });
        });

        // Color inputs
        this.setupColorInputs();
        
        // Typography inputs
        this.setupTypographyInputs();
        
        // Spacing inputs
        this.setupSpacingInputs();
        
        // Effects inputs
        this.setupEffectsInputs();
        
        // Content inputs
        this.setupContentInputs();

        // Properties panel close
        document.getElementById('close-properties').addEventListener('click', () => {
            this.hidePropertiesPanel();
        });
    }

    setupColorInputs() {
        const colorInputs = {
            'brand-primary': 'colors.primary',
            'brand-secondary': 'colors.secondary',
            'text-primary': 'colors.textPrimary',
            'text-secondary': 'colors.textSecondary',
            'bg-primary': 'colors.backgroundPrimary',
            'bg-secondary': 'colors.backgroundSecondary'
        };

        Object.entries(colorInputs).forEach(([id, settingPath]) => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('change', (e) => {
                    this.updateNestedSetting(settingPath, e.target.value);
                    this.updatePreview();
                });
            }
        });
    }

    setupTypographyInputs() {
        // Heading font
        document.getElementById('heading-font').addEventListener('change', (e) => {
            this.settings.typography.headingFont = e.target.value;
            this.updatePreview();
        });

        // Body font
        document.getElementById('body-font').addEventListener('change', (e) => {
            this.settings.typography.bodyFont = e.target.value;
            this.updatePreview();
        });

        // Heading size
        const headingSizeInput = document.getElementById('heading-size');
        const headingSizeValue = document.getElementById('heading-size-value');
        headingSizeInput.addEventListener('input', (e) => {
            const value = e.target.value;
            this.settings.typography.headingSize = parseInt(value);
            headingSizeValue.textContent = value + 'px';
            this.updatePreview();
        });

        // Body size
        const bodySizeInput = document.getElementById('body-size');
        const bodySizeValue = document.getElementById('body-size-value');
        bodySizeInput.addEventListener('input', (e) => {
            const value = e.target.value;
            this.settings.typography.bodySize = parseInt(value);
            bodySizeValue.textContent = value + 'px';
            this.updatePreview();
        });
    }

    setupSpacingInputs() {
        // Section spacing
        const sectionSpacingInput = document.getElementById('section-spacing');
        const sectionSpacingValue = document.getElementById('section-spacing-value');
        sectionSpacingInput.addEventListener('input', (e) => {
            const value = e.target.value;
            this.settings.spacing.sectionSpacing = parseInt(value);
            sectionSpacingValue.textContent = value + 'px';
            this.updatePreview();
        });

        // Element spacing
        const elementSpacingInput = document.getElementById('element-spacing');
        const elementSpacingValue = document.getElementById('element-spacing-value');
        elementSpacingInput.addEventListener('input', (e) => {
            const value = e.target.value;
            this.settings.spacing.elementSpacing = parseInt(value);
            elementSpacingValue.textContent = value + 'px';
            this.updatePreview();
        });

        // Container width
        const containerWidthInput = document.getElementById('container-width');
        const containerWidthValue = document.getElementById('container-width-value');
        containerWidthInput.addEventListener('input', (e) => {
            const value = e.target.value;
            this.settings.spacing.containerWidth = parseInt(value);
            containerWidthValue.textContent = value + 'px';
            this.updatePreview();
        });
    }

    setupEffectsInputs() {
        // Border radius
        const borderRadiusInput = document.getElementById('border-radius');
        const borderRadiusValue = document.getElementById('border-radius-value');
        borderRadiusInput.addEventListener('input', (e) => {
            const value = e.target.value;
            this.settings.effects.borderRadius = parseInt(value);
            borderRadiusValue.textContent = value + 'px';
            this.updatePreview();
        });

        // Shadow intensity
        const shadowIntensityInput = document.getElementById('shadow-intensity');
        const shadowIntensityValue = document.getElementById('shadow-intensity-value');
        const intensityLabels = ['無', '輕微', '中等', '強', '很強', '極強'];
        shadowIntensityInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.settings.effects.shadowIntensity = value;
            shadowIntensityValue.textContent = intensityLabels[value];
            this.updatePreview();
        });

        // Animation style
        document.getElementById('animation-style').addEventListener('change', (e) => {
            this.settings.effects.animationStyle = e.target.value;
            this.updatePreview();
        });
    }

    setupContentInputs() {
        const contentInputs = {
            'hero-title': 'content.heroTitle',
            'hero-subtitle': 'content.heroSubtitle',
            'hero-description': 'content.heroDescription',
            'hero-image': 'content.heroImage'
        };

        Object.entries(contentInputs).forEach(([id, settingPath]) => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => {
                    this.updateNestedSetting(settingPath, e.target.value);
                    this.updatePreview();
                });
            }
        });
    }

    updateNestedSetting(path, value) {
        const keys = path.split('.');
        let obj = this.settings;
        for (let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
    }

    showMainApp() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
    }

    switchPage(pageName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

        // Update page content
        document.querySelectorAll('.admin-page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`${pageName}-page`).classList.add('active');

        this.currentPage = pageName;
    }

    switchStyleTab(tabName) {
        // Update tabs
        document.querySelectorAll('.style-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    switchDevice(deviceName) {
        // Update device buttons
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-device="${deviceName}"]`).classList.add('active');

        // Update device settings
        document.querySelectorAll('.device-settings').forEach(setting => {
            setting.classList.remove('active');
        });
        document.getElementById(`${deviceName}-settings`).classList.add('active');
    }

    setPreviewWidth(width) {
        // Update preview device buttons
        document.querySelectorAll('.preview-device').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-width="${width}"]`).classList.add('active');

        // Update iframe width
        const iframe = document.getElementById('preview-iframe');
        iframe.style.width = width;
        iframe.style.maxWidth = width === '100%' ? '1200px' : width;
    }

    initializeDragDrop() {
        // Initialize sortable for page builder
        const pageBuilder = document.getElementById('page-builder');
        if (pageBuilder) {
            new Sortable(pageBuilder, {
                group: 'sections',
                animation: 150,
                ghostClass: 'dragging',
                chosenClass: 'drag-over',
                onAdd: (evt) => {
                    this.handleElementDrop(evt);
                },
                onSort: (evt) => {
                    this.handleSectionReorder(evt);
                }
            });
        }

        // Make element library items draggable
        document.querySelectorAll('.element-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                const elementType = e.target.dataset.element;
                e.dataTransfer.setData('text/plain', elementType);
            });
        });
    }

    handleElementDrop(evt) {
        const elementType = evt.item.textContent.trim().split('\n')[1].trim();
        const sectionElement = this.createSectionElement(elementType);
        
        // Replace the dragged element with the actual section
        evt.item.replaceWith(sectionElement);
        
        // Update layout settings
        this.updateLayoutFromDOM();
        this.updatePreview();
    }

    handleSectionReorder(evt) {
        this.updateLayoutFromDOM();
        this.updatePreview();
    }

    createSectionElement(elementType) {
        const section = document.createElement('div');
        section.className = 'builder-section';
        section.dataset.elementType = elementType;
        
        section.innerHTML = `
            <div class="section-controls">
                <button class="section-control" data-action="edit" title="編輯">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="section-control" data-action="delete" title="刪除">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="section-content">
                ${this.getSectionPreview(elementType)}
            </div>
        `;

        // Add event listeners for section controls
        section.querySelector('[data-action="edit"]').addEventListener('click', () => {
            this.editSection(section);
        });

        section.querySelector('[data-action="delete"]').addEventListener('click', () => {
            this.deleteSection(section);
        });

        return section;
    }

    getSectionPreview(elementType) {
        const previews = {
            hero: `
                <h2 style="margin: 0 0 1rem 0; color: var(--primary-orange);">英雄區塊</h2>
                <p style="margin: 0; color: var(--text-secondary);">主要橫幅區域，包含標題、描述和圖片</p>
            `,
            stats: `
                <h2 style="margin: 0 0 1rem 0; color: var(--primary-orange);">統計數據</h2>
                <p style="margin: 0; color: var(--text-secondary);">顯示重要數據的統計區塊</p>
            `,
            articles: `
                <h2 style="margin: 0 0 1rem 0; color: var(--primary-orange);">文章列表</h2>
                <p style="margin: 0; color: var(--text-secondary);">最新文章展示區域</p>
            `,
            courses: `
                <h2 style="margin: 0 0 1rem 0; color: var(--primary-orange);">課程展示</h2>
                <p style="margin: 0; color: var(--text-secondary);">精選課程介紹區塊</p>
            `,
            newsletter: `
                <h2 style="margin: 0 0 1rem 0; color: var(--primary-orange);">電子報訂閱</h2>
                <p style="margin: 0; color: var(--text-secondary);">電子郵件收集表單</p>
            `,
            youtube: `
                <h2 style="margin: 0 0 1rem 0; color: var(--primary-orange);">YouTube 頻道</h2>
                <p style="margin: 0; color: var(--text-secondary);">YouTube 影片嵌入區域</p>
            `,
            testimonials: `
                <h2 style="margin: 0 0 1rem 0; color: var(--primary-orange);">客戶見證</h2>
                <p style="margin: 0; color: var(--text-secondary);">用戶評價和見證</p>
            `,
            contact: `
                <h2 style="margin: 0 0 1rem 0; color: var(--primary-orange);">聯絡資訊</h2>
                <p style="margin: 0; color: var(--text-secondary);">聯絡方式和表單</p>
            `
        };

        return previews[elementType] || `
            <h2 style="margin: 0 0 1rem 0; color: var(--primary-orange);">${elementType}</h2>
            <p style="margin: 0; color: var(--text-secondary);">自定義區塊</p>
        `;
    }

    editSection(sectionElement) {
        this.selectedElement = sectionElement;
        this.showPropertiesPanel(sectionElement.dataset.elementType);
    }

    deleteSection(sectionElement) {
        if (confirm('確定要刪除這個區塊嗎？')) {
            sectionElement.remove();
            this.updateLayoutFromDOM();
            this.updatePreview();
        }
    }

    showPropertiesPanel(elementType) {
        const panel = document.getElementById('properties-panel');
        const content = panel.querySelector('.properties-content');
        
        content.innerHTML = this.getPropertiesForm(elementType);
        panel.classList.add('show');
    }

    hidePropertiesPanel() {
        document.getElementById('properties-panel').classList.remove('show');
        this.selectedElement = null;
    }

    getPropertiesForm(elementType) {
        // This would return a form specific to the element type
        return `
            <div class="property-group">
                <label>元素類型</label>
                <input type="text" value="${elementType}" readonly>
            </div>
            <div class="property-group">
                <label>顯示狀態</label>
                <select>
                    <option value="visible">顯示</option>
                    <option value="hidden">隱藏</option>
                </select>
            </div>
            <div class="property-group">
                <label>自定義 CSS 類別</label>
                <input type="text" placeholder="輸入 CSS 類別名稱">
            </div>
        `;
    }

    updateLayoutFromDOM() {
        const sections = document.querySelectorAll('.builder-section');
        this.settings.layout.sections = Array.from(sections).map(section => 
            section.dataset.elementType
        );
    }

    updatePreview() {
        // Generate custom CSS based on current settings
        const customCSS = this.generateCustomCSS();
        
        // Update the preview iframe with new styles
        this.applyStylesToPreview(customCSS);
    }

    generateCustomCSS() {
        const { colors, typography, spacing, effects } = this.settings;
        
        return `
            :root {
                --primary-orange: ${colors.primary};
                --dark-blue-gray: ${colors.secondary};
                --text-primary: ${colors.textPrimary};
                --text-secondary: ${colors.textSecondary};
                --background-white: ${colors.backgroundPrimary};
                --light-background: ${colors.backgroundSecondary};
            }
            
            body {
                font-family: '${typography.bodyFont}', sans-serif;
                font-size: ${typography.bodySize}px;
            }
            
            h1, h2, h3, h4, h5, h6 {
                font-family: '${typography.headingFont}', sans-serif;
            }
            
            .hero-text h1 {
                font-size: ${typography.headingSize}px;
            }
            
            .section {
                padding: ${spacing.sectionSpacing}px 0;
            }
            
            .container {
                max-width: ${spacing.containerWidth}px;
            }
            
            .card, .course-card, .article-card {
                border-radius: ${effects.borderRadius}px;
                box-shadow: ${this.getShadowValue(effects.shadowIntensity)};
            }
            
            .btn {
                border-radius: ${effects.borderRadius}px;
            }
        `;
    }

    getShadowValue(intensity) {
        const shadows = [
            'none',
            '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        ];
        return shadows[intensity] || shadows[2];
    }

    applyStylesToPreview(css) {
        if (this.previewManager) {
            this.previewManager.injectCustomStyles();
        } else {
            // Fallback method
            try {
                const iframe = document.getElementById('preview-iframe');
                if (iframe && iframe.contentDocument) {
                    let styleElement = iframe.contentDocument.getElementById('custom-styles');
                    if (!styleElement) {
                        styleElement = iframe.contentDocument.createElement('style');
                        styleElement.id = 'custom-styles';
                        iframe.contentDocument.head.appendChild(styleElement);
                    }
                    styleElement.textContent = css;
                }
            } catch (error) {
                console.warn('無法更新預覽樣式:', error);
            }
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('websiteCustomization', JSON.stringify(this.settings));
            this.showNotification('設定已儲存', 'success');
        } catch (error) {
            console.error('儲存設定失敗:', error);
            this.showNotification('儲存失敗', 'error');
        }
    }

    loadSavedSettings() {
        try {
            const saved = localStorage.getItem('websiteCustomization');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
                this.applySavedSettingsToUI();
            }
        } catch (error) {
            console.error('載入設定失敗:', error);
        }
    }

    applySavedSettingsToUI() {
        // Apply color settings
        Object.entries({
            'brand-primary': this.settings.colors.primary,
            'brand-secondary': this.settings.colors.secondary,
            'text-primary': this.settings.colors.textPrimary,
            'text-secondary': this.settings.colors.textSecondary,
            'bg-primary': this.settings.colors.backgroundPrimary,
            'bg-secondary': this.settings.colors.backgroundSecondary
        }).forEach(([id, value]) => {
            const input = document.getElementById(id);
            if (input) input.value = value;
        });

        // Apply typography settings
        const headingFont = document.getElementById('heading-font');
        if (headingFont) headingFont.value = this.settings.typography.headingFont;
        
        const bodyFont = document.getElementById('body-font');
        if (bodyFont) bodyFont.value = this.settings.typography.bodyFont;

        // Apply content settings
        Object.entries({
            'hero-title': this.settings.content.heroTitle,
            'hero-subtitle': this.settings.content.heroSubtitle,
            'hero-description': this.settings.content.heroDescription,
            'hero-image': this.settings.content.heroImage
        }).forEach(([id, value]) => {
            const input = document.getElementById(id);
            if (input) input.value = value;
        });
    }

    publishChanges() {
        // This would integrate with GitHub API or other deployment system
        this.showNotification('發布功能開發中...', 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            zIndex: '9999',
            opacity: '0',
            transform: 'translateY(-20px)',
            transition: 'all 0.3s ease'
        });

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.customizeAdmin = new CustomizeAdmin();
});