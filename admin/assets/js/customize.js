/**
 * Main Customize Application - Orchestrates all customization functionality
 */

class CustomizeApp {
    constructor() {
        this.currentPage = 'layout';
        this.isPreviewMode = false;
        this.initializeApp();
    }

    /**
     * Initialize the application
     */
    initializeApp() {
        this.initializeNavigation();
        this.initializeActions();
        this.setupEventListeners();
        this.loadApplication();
    }

    /**
     * Initialize navigation between pages
     */
    initializeNavigation() {
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        const pages = document.querySelectorAll('.admin-page');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.dataset.page;
                this.switchPage(targetPage);
            });
        });
    }

    /**
     * Switch between admin pages
     */
    switchPage(pageId) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

        // Update page content
        document.querySelectorAll('.admin-page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`${pageId}-page`).classList.add('active');

        this.currentPage = pageId;

        // Initialize page-specific functionality
        this.initializePageFunctionality(pageId);
    }

    /**
     * Initialize page-specific functionality
     */
    initializePageFunctionality(pageId) {
        switch (pageId) {
            case 'layout':
                this.initializeLayoutPage();
                break;
            case 'styles':
                this.initializeStylesPage();
                break;
            case 'content':
                this.initializeContentPage();
                break;
            case 'responsive':
                this.initializeResponsivePage();
                break;
            case 'preview':
                this.initializePreviewPage();
                break;
        }
    }

    /**
     * Initialize layout page
     */
    initializeLayoutPage() {
        // Layout manager should already be initialized
        if (window.layoutManager) {
            window.layoutManager.initializeSortable();
        }
    }

    /**
     * Initialize styles page
     */
    initializeStylesPage() {
        // Ensure style manager is properly initialized
        if (window.styleManager) {
            window.styleManager.loadSavedStyles();
        }
    }

    /**
     * Initialize content page
     */
    initializeContentPage() {
        this.initializeContentEditors();
    }

    /**
     * Initialize content editors
     */
    initializeContentEditors() {
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');
        const heroDescription = document.getElementById('hero-description');
        const heroImage = document.getElementById('hero-image');

        // Hero content editing
        if (heroTitle) {
            heroTitle.addEventListener('input', (e) => {
                this.updateFrontendContent('.hero h1', e.target.value);
            });
        }

        if (heroSubtitle) {
            heroSubtitle.addEventListener('input', (e) => {
                this.updateFrontendContent('.hero .tagline', e.target.value);
            });
        }

        if (heroDescription) {
            heroDescription.addEventListener('input', (e) => {
                this.updateFrontendContent('.hero .description', e.target.value);
            });
        }

        if (heroImage) {
            heroImage.addEventListener('input', (e) => {
                this.updateFrontendImage('.hero-image img', e.target.value);
            });
        }
    }

    /**
     * Update frontend content in real-time
     */
    updateFrontendContent(selector, content) {
        // Update in preview iframe if available
        const previewFrame = document.getElementById('preview-iframe');
        if (previewFrame && previewFrame.contentDocument) {
            const element = previewFrame.contentDocument.querySelector(selector);
            if (element) {
                element.textContent = content;
            }
        }

        // Save to localStorage
        const contentChanges = JSON.parse(localStorage.getItem('contentChanges') || '{}');
        contentChanges[selector] = content;
        localStorage.setItem('contentChanges', JSON.stringify(contentChanges));
    }

    /**
     * Update frontend image
     */
    updateFrontendImage(selector, src) {
        const previewFrame = document.getElementById('preview-iframe');
        if (previewFrame && previewFrame.contentDocument) {
            const element = previewFrame.contentDocument.querySelector(selector);
            if (element) {
                element.src = src;
            }
        }

        // Save to localStorage
        const contentChanges = JSON.parse(localStorage.getItem('contentChanges') || '{}');
        contentChanges[selector] = { type: 'image', src: src };
        localStorage.setItem('contentChanges', JSON.stringify(contentChanges));
    }

    /**
     * Initialize responsive page
     */
    initializeResponsivePage() {
        this.initializeDeviceSelector();
        this.initializeResponsiveControls();
    }

    /**
     * Initialize device selector
     */
    initializeDeviceSelector() {
        const deviceButtons = document.querySelectorAll('.device-btn');
        const deviceSettings = document.querySelectorAll('.device-settings');

        deviceButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                deviceButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update active settings
                deviceSettings.forEach(s => s.classList.remove('active'));
                const targetDevice = btn.dataset.device;
                document.getElementById(`${targetDevice}-settings`).classList.add('active');
            });
        });
    }

    /**
     * Initialize responsive controls
     */
    initializeResponsiveControls() {
        const columnSelectors = document.querySelectorAll('select[id$="-columns"]');
        
        columnSelectors.forEach(selector => {
            selector.addEventListener('change', (e) => {
                const deviceType = e.target.id.replace('-columns', '');
                const columns = e.target.value;
                this.updateResponsiveLayout(deviceType, columns);
            });
        });
    }

    /**
     * Update responsive layout
     */
    updateResponsiveLayout(deviceType, columns) {
        const responsiveSettings = JSON.parse(localStorage.getItem('responsiveSettings') || '{}');
        responsiveSettings[deviceType] = { columns: columns };
        localStorage.setItem('responsiveSettings', JSON.stringify(responsiveSettings));

        // Apply to preview
        this.applyResponsiveSettings();
    }

    /**
     * Apply responsive settings
     */
    applyResponsiveSettings() {
        const settings = JSON.parse(localStorage.getItem('responsiveSettings') || '{}');
        
        let css = '';
        Object.entries(settings).forEach(([device, config]) => {
            const breakpoints = {
                desktop: '(min-width: 1200px)',
                tablet: '(max-width: 1199px) and (min-width: 768px)',
                mobile: '(max-width: 767px)'
            };

            if (breakpoints[device]) {
                css += `@media ${breakpoints[device]} {
                    .grid { grid-template-columns: repeat(${config.columns}, 1fr) !important; }
                }\n`;
            }
        });

        // Inject responsive CSS
        this.injectCustomCSS(css, 'responsive-styles');
    }

    /**
     * Initialize preview page
     */
    initializePreviewPage() {
        this.initializePreviewControls();
        this.refreshPreview();
    }

    /**
     * Initialize preview controls
     */
    initializePreviewControls() {
        const deviceButtons = document.querySelectorAll('.preview-device');
        const iframe = document.getElementById('preview-iframe');

        deviceButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                deviceButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update iframe width
                const width = btn.dataset.width;
                if (iframe) {
                    iframe.style.width = width;
                    iframe.style.maxWidth = width === '100%' ? 'none' : width;
                }
            });
        });
    }

    /**
     * Refresh preview
     */
    refreshPreview() {
        const iframe = document.getElementById('preview-iframe');
        if (iframe) {
            iframe.src = iframe.src; // Force reload
            
            iframe.onload = () => {
                this.applyCustomizationsToPreview();
            };
        }
    }

    /**
     * Apply all customizations to preview
     */
    applyCustomizationsToPreview() {
        const iframe = document.getElementById('preview-iframe');
        if (!iframe || !iframe.contentDocument) return;

        // Apply style changes
        if (window.styleManager) {
            const customCSS = this.generateAllCustomCSS();
            this.injectCSSToIframe(iframe, customCSS);
        }

        // Apply content changes
        this.applyContentChangesToPreview(iframe);

        // Apply element changes
        this.applyElementChangesToPreview(iframe);
    }

    /**
     * Generate all custom CSS
     */
    generateAllCustomCSS() {
        let css = '';

        // Global styles
        const globalStyles = JSON.parse(localStorage.getItem('globalStyles') || '{}');
        if (Object.keys(globalStyles).length > 0) {
            css += ':root {\n';
            Object.entries(globalStyles).forEach(([variable, value]) => {
                css += `  ${variable}: ${value};\n`;
            });
            css += '}\n\n';
        }

        // Element styles
        const elementStyles = JSON.parse(localStorage.getItem('elementStyles') || '{}');
        Object.entries(elementStyles).forEach(([selector, styles]) => {
            css += `${selector} {\n`;
            Object.entries(styles).forEach(([property, value]) => {
                css += `  ${property}: ${value};\n`;
            });
            css += '}\n\n';
        });

        // Add the enhanced visual CSS from style manager
        if (window.styleManager) {
            css += window.styleManager.getEnhancedVisualCSS();
            css += window.styleManager.getResponsiveCSS();
            css += window.styleManager.getAnimationCSS();
        }

        return css;
    }

    /**
     * Inject CSS to iframe
     */
    injectCSSToIframe(iframe, css) {
        const doc = iframe.contentDocument;
        let styleElement = doc.getElementById('custom-styles');
        
        if (!styleElement) {
            styleElement = doc.createElement('style');
            styleElement.id = 'custom-styles';
            doc.head.appendChild(styleElement);
        }
        
        styleElement.textContent = css;
    }

    /**
     * Apply content changes to preview
     */
    applyContentChangesToPreview(iframe) {
        const contentChanges = JSON.parse(localStorage.getItem('contentChanges') || '{}');
        const doc = iframe.contentDocument;

        Object.entries(contentChanges).forEach(([selector, content]) => {
            const element = doc.querySelector(selector);
            if (element) {
                if (typeof content === 'object' && content.type === 'image') {
                    element.src = content.src;
                } else {
                    element.textContent = content;
                }
            }
        });
    }

    /**
     * Apply element changes to preview
     */
    applyElementChangesToPreview(iframe) {
        const elementChanges = JSON.parse(localStorage.getItem('elementChanges') || '{}');
        const doc = iframe.contentDocument;

        Object.entries(elementChanges).forEach(([elementId, properties]) => {
            const element = doc.querySelector(`[data-element-id="${elementId}"]`);
            if (element) {
                Object.entries(properties).forEach(([property, value]) => {
                    if (property === 'content') {
                        element.textContent = value;
                    } else if (property === 'src') {
                        element.src = value;
                    } else {
                        element.style[property] = value;
                    }
                });
            }
        });
    }

    /**
     * Initialize action buttons
     */
    initializeActions() {
        // Save changes
        const saveBtn = document.getElementById('save-changes');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveAllChanges();
            });
        }

        // Publish website
        const publishBtn = document.getElementById('publish');
        if (publishBtn) {
            publishBtn.addEventListener('click', () => {
                this.publishWebsite();
            });
        }

        // Import configuration
        const importBtn = document.getElementById('import-config');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.importConfiguration();
            });
        }

        // Export configuration
        const exportBtn = document.getElementById('export-config');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportConfiguration();
            });
        }
    }

    /**
     * Save all changes
     */
    saveAllChanges() {
        // All data is already saved to localStorage by individual managers
        // This just provides user feedback
        this.showNotification('所有變更已儲存', 'success');
        
        // Refresh preview to show latest changes
        if (this.currentPage === 'preview') {
            this.refreshPreview();
        }
    }

    /**
     * Publish website
     */
    publishWebsite() {
        // In a real implementation, this would push changes to GitHub
        // For now, we'll just show a success message
        this.showNotification('網站發布功能開發中...', 'info');
    }

    /**
     * Import configuration
     */
    importConfiguration() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const config = JSON.parse(event.target.result);
                        this.restoreConfiguration(config);
                        this.showNotification('配置已匯入', 'success');
                    } catch (error) {
                        this.showNotification('配置檔案格式錯誤', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }

    /**
     * Export configuration
     */
    exportConfiguration() {
        const config = {
            globalStyles: JSON.parse(localStorage.getItem('globalStyles') || '{}'),
            elementStyles: JSON.parse(localStorage.getItem('elementStyles') || '{}'),
            elementChanges: JSON.parse(localStorage.getItem('elementChanges') || '{}'),
            contentChanges: JSON.parse(localStorage.getItem('contentChanges') || '{}'),
            currentLayout: JSON.parse(localStorage.getItem('currentLayout') || '[]'),
            responsiveSettings: JSON.parse(localStorage.getItem('responsiveSettings') || '{}'),
            timestamp: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `website-config-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    /**
     * Restore configuration from imported data
     */
    restoreConfiguration(config) {
        // Restore all saved data
        if (config.globalStyles) {
            localStorage.setItem('globalStyles', JSON.stringify(config.globalStyles));
        }
        if (config.elementStyles) {
            localStorage.setItem('elementStyles', JSON.stringify(config.elementStyles));
        }
        if (config.elementChanges) {
            localStorage.setItem('elementChanges', JSON.stringify(config.elementChanges));
        }
        if (config.contentChanges) {
            localStorage.setItem('contentChanges', JSON.stringify(config.contentChanges));
        }
        if (config.currentLayout) {
            localStorage.setItem('currentLayout', JSON.stringify(config.currentLayout));
        }
        if (config.responsiveSettings) {
            localStorage.setItem('responsiveSettings', JSON.stringify(config.responsiveSettings));
        }

        // Reload all managers
        this.reloadAllManagers();
    }

    /**
     * Reload all managers
     */
    reloadAllManagers() {
        // Reload style manager
        if (window.styleManager) {
            window.styleManager.loadSavedStyles();
        }

        // Reload layout manager
        if (window.layoutManager) {
            window.layoutManager.loadSavedLayout();
        }

        // Reload element inspector
        if (window.elementInspector) {
            window.elementInspector.loadSavedChanges();
        }

        // Refresh current page
        this.initializePageFunctionality(this.currentPage);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for element selection events
        window.addEventListener('elementSelected', (e) => {
            const propertiesPanel = document.getElementById('properties-panel');
            if (propertiesPanel) {
                propertiesPanel.style.display = 'block';
            }
        });

        // Close properties panel
        const closePropertiesBtn = document.getElementById('close-properties');
        if (closePropertiesBtn) {
            closePropertiesBtn.addEventListener('click', () => {
                const propertiesPanel = document.getElementById('properties-panel');
                propertiesPanel.style.display = 'none';
            });
        }
    }

    /**
     * Load application
     */
    loadApplication() {
        // Hide loading screen
        const loading = document.getElementById('loading');
        const mainApp = document.getElementById('main-app');
        
        setTimeout(() => {
            if (loading) loading.style.display = 'none';
            if (mainApp) mainApp.style.display = 'block';
            
            // Initialize default page
            this.initializePageFunctionality(this.currentPage);
        }, 1000);
    }

    /**
     * Inject custom CSS
     */
    injectCustomCSS(css, id = 'custom-css') {
        let styleElement = document.getElementById(id);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = id;
            document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = css;
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

// Initialize the application
let customizeApp;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        customizeApp = new CustomizeApp();
    });
} else {
    customizeApp = new CustomizeApp();
}