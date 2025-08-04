// Style Editor Module
class StyleEditor {
    constructor(customizeAdmin) {
        this.admin = customizeAdmin;
        this.init();
    }

    init() {
        this.setupLivePreview();
        this.setupColorSync();
    }

    setupLivePreview() {
        // Real-time updates for all style inputs
        const styleInputs = document.querySelectorAll(
            '#styles-page input, #styles-page select'
        );
        
        styleInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.admin.updatePreview();
            });
        });
    }

    setupColorSync() {
        // Sync global colors with style page colors
        const colorMap = {
            'primary-color': 'brand-primary',
            'secondary-color': 'brand-secondary',
            'background-color': 'bg-primary'
        };

        Object.entries(colorMap).forEach(([globalId, styleId]) => {
            const globalInput = document.getElementById(globalId);
            const styleInput = document.getElementById(styleId);
            
            if (globalInput && styleInput) {
                globalInput.addEventListener('change', (e) => {
                    styleInput.value = e.target.value;
                    this.admin.updatePreview();
                });
                
                styleInput.addEventListener('change', (e) => {
                    globalInput.value = e.target.value;
                });
            }
        });
    }
}

// Content Manager Module
class ContentManager {
    constructor(customizeAdmin) {
        this.admin = customizeAdmin;
        this.init();
    }

    init() {
        this.setupContentSync();
        this.setupImageUpload();
    }

    setupContentSync() {
        // Sync content changes to preview in real-time
        const contentInputs = document.querySelectorAll('#content-page input, #content-page textarea');
        
        contentInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateContentPreview();
            });
        });
    }

    setupImageUpload() {
        // Handle image uploads (placeholder for now)
        const imageInputs = document.querySelectorAll('input[type="url"]');
        
        imageInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                if (this.isValidImageUrl(e.target.value)) {
                    this.admin.updatePreview();
                }
            });
        });
    }

    isValidImageUrl(url) {
        return /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(url) || url.includes('placeholder');
    }

    updateContentPreview() {
        // This would update the iframe content in real-time
        this.admin.updatePreview();
    }
}

// Responsive Manager Module
class ResponsiveManager {
    constructor(customizeAdmin) {
        this.admin = customizeAdmin;
        this.currentDevice = 'desktop';
        this.init();
    }

    init() {
        this.setupDeviceSettings();
        this.setupBreakpoints();
    }

    setupDeviceSettings() {
        // Handle responsive column settings
        ['desktop', 'tablet', 'mobile'].forEach(device => {
            const select = document.getElementById(`${device}-columns`);
            if (select) {
                select.addEventListener('change', (e) => {
                    this.admin.settings.responsive[device].columns = parseInt(e.target.value);
                    this.admin.updatePreview();
                });
            }
        });
    }

    setupBreakpoints() {
        // Custom breakpoint management would go here
        this.breakpoints = {
            mobile: 767,
            tablet: 1199,
            desktop: 1200
        };
    }

    getCurrentDevice() {
        return this.currentDevice;
    }

    setCurrentDevice(device) {
        this.currentDevice = device;
        this.updateDevicePreview();
    }

    updateDevicePreview() {
        // Update preview to show current device view
        const iframe = document.getElementById('preview-iframe');
        if (iframe) {
            const widths = {
                desktop: '100%',
                tablet: '768px',
                mobile: '375px'
            };
            iframe.style.width = widths[this.currentDevice];
        }
    }
}

// Preview Manager Module
class PreviewManager {
    constructor(customizeAdmin) {
        this.admin = customizeAdmin;
        this.iframe = null;
        this.init();
    }

    init() {
        this.iframe = document.getElementById('preview-iframe');
        this.setupIframeEvents();
        this.setupDeviceToggles();
    }

    setupIframeEvents() {
        if (this.iframe) {
            this.iframe.addEventListener('load', () => {
                this.injectCustomStyles();
            });
        }
    }

    setupDeviceToggles() {
        document.querySelectorAll('.preview-device').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const width = e.target.dataset.width;
                this.setPreviewWidth(width);
            });
        });
    }

    setPreviewWidth(width) {
        if (this.iframe) {
            this.iframe.style.width = width;
            this.iframe.style.maxWidth = width === '100%' ? '1200px' : width;
        }
    }

    injectCustomStyles() {
        try {
            const iframeDoc = this.iframe.contentDocument;
            if (iframeDoc) {
                let styleElement = iframeDoc.getElementById('admin-custom-styles');
                if (!styleElement) {
                    styleElement = iframeDoc.createElement('style');
                    styleElement.id = 'admin-custom-styles';
                    iframeDoc.head.appendChild(styleElement);
                }
                
                const customCSS = this.admin.generateCustomCSS();
                styleElement.textContent = customCSS;
            }
        } catch (error) {
            console.warn('Cannot inject styles into iframe:', error);
        }
    }

    refreshPreview() {
        if (this.iframe) {
            this.iframe.src = this.iframe.src;
        }
    }
}

// Export modules
window.StyleEditor = StyleEditor;
window.ContentManager = ContentManager;
window.ResponsiveManager = ResponsiveManager;
window.PreviewManager = PreviewManager;