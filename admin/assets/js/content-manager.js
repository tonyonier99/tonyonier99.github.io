// Content Manager Module - simplified version
window.ContentManager = class ContentManager {
    constructor(customizeAdmin) {
        this.admin = customizeAdmin;
    }
};

// Responsive Manager Module - simplified version  
window.ResponsiveManager = class ResponsiveManager {
    constructor(customizeAdmin) {
        this.admin = customizeAdmin;
    }
};

// Preview Manager Module - simplified version
window.PreviewManager = class PreviewManager {
    constructor(customizeAdmin) {
        this.admin = customizeAdmin;
        this.iframe = document.getElementById('preview-iframe');
    }

    injectCustomStyles() {
        if (this.iframe && this.iframe.contentDocument) {
            try {
                let styleElement = this.iframe.contentDocument.getElementById('admin-custom-styles');
                if (!styleElement) {
                    styleElement = this.iframe.contentDocument.createElement('style');
                    styleElement.id = 'admin-custom-styles';
                    this.iframe.contentDocument.head.appendChild(styleElement);
                }
                
                const customCSS = this.admin.generateCustomCSS();
                styleElement.textContent = customCSS;
            } catch (error) {
                console.warn('Cannot inject styles into iframe:', error);
            }
        }
    }
};