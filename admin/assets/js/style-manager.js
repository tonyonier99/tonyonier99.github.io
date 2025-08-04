/**
 * Style Manager - Handles all visual customization and real-time styling
 */

class StyleManager {
    constructor() {
        this.styleSheet = null;
        this.globalStyles = {};
        this.elementStyles = {};
        this.createStyleSheet();
        this.initializeControls();
        this.loadSavedStyles();
    }

    /**
     * Create a dynamic style sheet for injecting custom styles
     */
    createStyleSheet() {
        this.styleSheet = document.createElement('style');
        this.styleSheet.id = 'dynamic-styles';
        document.head.appendChild(this.styleSheet);
    }

    /**
     * Initialize style control handlers
     */
    initializeControls() {
        // Global color controls
        this.initColorControls();
        
        // Typography controls
        this.initTypographyControls();
        
        // Spacing controls
        this.initSpacingControls();
        
        // Effects controls
        this.initEffectsControls();
        
        // Tab switching
        this.initTabSwitching();
    }

    /**
     * Initialize color controls
     */
    initColorControls() {
        const colorInputs = {
            'brand-primary': '--brand-primary',
            'brand-secondary': '--brand-secondary',
            'text-primary': '--text-primary',
            'text-secondary': '--text-secondary',
            'bg-primary': '--bg-primary',
            'bg-secondary': '--bg-secondary'
        };

        Object.entries(colorInputs).forEach(([inputId, cssVar]) => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', (e) => {
                    this.updateCSSVariable(cssVar, e.target.value);
                    this.saveGlobalStyle(cssVar, e.target.value);
                });
            }
        });
    }

    /**
     * Initialize typography controls
     */
    initTypographyControls() {
        // Font family controls
        const headingFont = document.getElementById('heading-font');
        const bodyFont = document.getElementById('body-font');

        if (headingFont) {
            headingFont.addEventListener('change', (e) => {
                this.updateCSSVariable('--heading-font', e.target.value);
                this.saveGlobalStyle('--heading-font', e.target.value);
            });
        }

        if (bodyFont) {
            bodyFont.addEventListener('change', (e) => {
                this.updateCSSVariable('--body-font', e.target.value);
                this.saveGlobalStyle('--body-font', e.target.value);
            });
        }

        // Font size controls
        const headingSize = document.getElementById('heading-size');
        const bodySizeInput = document.getElementById('body-size');

        if (headingSize) {
            headingSize.addEventListener('input', (e) => {
                const value = e.target.value + 'px';
                this.updateCSSVariable('--heading-size', value);
                this.saveGlobalStyle('--heading-size', value);
                document.getElementById('heading-size-value').textContent = value;
            });
        }

        if (bodySizeInput) {
            bodySizeInput.addEventListener('input', (e) => {
                const value = e.target.value + 'px';
                this.updateCSSVariable('--body-size', value);
                this.saveGlobalStyle('--body-size', value);
                document.getElementById('body-size-value').textContent = value;
            });
        }
    }

    /**
     * Initialize spacing controls
     */
    initSpacingControls() {
        const spacingControls = {
            'section-spacing': '--section-spacing',
            'element-spacing': '--element-spacing',
            'container-width': '--container-width'
        };

        Object.entries(spacingControls).forEach(([inputId, cssVar]) => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', (e) => {
                    const value = e.target.value + 'px';
                    this.updateCSSVariable(cssVar, value);
                    this.saveGlobalStyle(cssVar, value);
                    document.getElementById(inputId + '-value').textContent = value;
                });
            }
        });
    }

    /**
     * Initialize effects controls
     */
    initEffectsControls() {
        const borderRadius = document.getElementById('border-radius');
        const shadowIntensity = document.getElementById('shadow-intensity');
        const animationStyle = document.getElementById('animation-style');

        if (borderRadius) {
            borderRadius.addEventListener('input', (e) => {
                const value = e.target.value + 'px';
                this.updateCSSVariable('--border-radius', value);
                this.saveGlobalStyle('--border-radius', value);
                document.getElementById('border-radius-value').textContent = value;
            });
        }

        if (shadowIntensity) {
            shadowIntensity.addEventListener('input', (e) => {
                const level = parseInt(e.target.value);
                const shadows = [
                    'none',
                    '0 1px 3px rgba(0,0,0,0.1)',
                    '0 4px 6px rgba(0,0,0,0.1)',
                    '0 10px 15px rgba(0,0,0,0.1)',
                    '0 20px 25px rgba(0,0,0,0.15)',
                    '0 25px 50px rgba(0,0,0,0.25)'
                ];
                const labels = ['無', '輕微', '中等', '明顯', '強烈', '極強'];
                
                this.updateCSSVariable('--box-shadow', shadows[level]);
                this.saveGlobalStyle('--box-shadow', shadows[level]);
                document.getElementById('shadow-intensity-value').textContent = labels[level];
            });
        }

        if (animationStyle) {
            animationStyle.addEventListener('change', (e) => {
                this.updateCSSVariable('--animation-style', e.target.value);
                this.saveGlobalStyle('--animation-style', e.target.value);
                this.applyAnimationStyle(e.target.value);
            });
        }
    }

    /**
     * Initialize tab switching
     */
    initTabSwitching() {
        const tabs = document.querySelectorAll('.style-tab');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked tab
                tab.classList.add('active');

                // Show corresponding content
                const targetTab = tab.dataset.tab;
                const targetContent = document.getElementById(targetTab + '-tab');
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    /**
     * Update CSS variable
     */
    updateCSSVariable(variable, value) {
        document.documentElement.style.setProperty(variable, value);
    }

    /**
     * Apply custom styles to elements
     */
    applyCustomStyles() {
        let css = '';

        // Global CSS variables
        css += ':root {\n';
        Object.entries(this.globalStyles).forEach(([variable, value]) => {
            css += `  ${variable}: ${value};\n`;
        });
        css += '}\n\n';

        // Element-specific styles
        Object.entries(this.elementStyles).forEach(([selector, styles]) => {
            css += `${selector} {\n`;
            Object.entries(styles).forEach(([property, value]) => {
                css += `  ${property}: ${value};\n`;
            });
            css += '}\n\n';
        });

        // Animation styles
        css += this.getAnimationCSS();

        // Responsive styles
        css += this.getResponsiveCSS();

        // Enhanced visual styles
        css += this.getEnhancedVisualCSS();

        this.styleSheet.textContent = css;
    }

    /**
     * Get animation CSS
     */
    getAnimationCSS() {
        return `
        /* Fade in animation */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: scale(0.3);
            }
            50% {
                opacity: 1;
                transform: scale(1.05);
            }
            70% {
                transform: scale(0.9);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }

        .fade-in-up {
            animation: fadeInUp 0.6s ease-out;
        }

        .slide-in-right {
            animation: slideInRight 0.6s ease-out;
        }

        .bounce-in {
            animation: bounceIn 0.8s ease-out;
        }
        `;
    }

    /**
     * Get responsive CSS
     */
    getResponsiveCSS() {
        return `
        /* Responsive Design */
        @media (max-width: 768px) {
            .hero {
                padding: var(--section-spacing, 60px) 20px !important;
            }
            
            .hero h1 {
                font-size: calc(var(--heading-size, 48px) * 0.7) !important;
            }
            
            .grid {
                grid-template-columns: 1fr !important;
                gap: var(--element-spacing, 24px) !important;
            }
            
            .stats-grid {
                grid-template-columns: repeat(2, 1fr) !important;
            }
        }

        @media (max-width: 480px) {
            .stats-grid {
                grid-template-columns: 1fr !important;
            }
            
            .hero .flex {
                flex-direction: column !important;
                gap: 1rem !important;
            }
        }
        `;
    }

    /**
     * Get enhanced visual CSS
     */
    getEnhancedVisualCSS() {
        return `
        /* Enhanced Visual Styles */
        .customizable-element {
            position: relative;
            transition: all 0.3s ease;
        }

        .customizable-element.element-hover {
            outline: 2px dashed var(--brand-primary, #ff6b35);
            outline-offset: 2px;
        }

        .customizable-element.element-selected {
            outline: 2px solid var(--brand-primary, #ff6b35);
            outline-offset: 2px;
            box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.2);
        }

        /* Apply global variables */
        h1, h2, h3, h4, h5, h6 {
            font-family: var(--heading-font, 'Inter') !important;
            color: var(--text-primary, #1f2937) !important;
        }

        h1 {
            font-size: var(--heading-size, 48px) !important;
        }

        body, p, span, div {
            font-family: var(--body-font, 'Inter') !important;
            font-size: var(--body-size, 16px) !important;
            color: var(--text-primary, #1f2937) !important;
        }

        .container {
            max-width: var(--container-width, 1200px) !important;
        }

        .section {
            padding: var(--section-spacing, 60px) 0 !important;
        }

        .stat-card, .article-card, .course-card {
            border-radius: var(--border-radius, 8px) !important;
            box-shadow: var(--box-shadow, 0 4px 6px rgba(0,0,0,0.1)) !important;
        }

        .btn {
            border-radius: var(--border-radius, 8px) !important;
        }

        .btn-primary {
            background-color: var(--brand-primary, #ff6b35) !important;
            border-color: var(--brand-primary, #ff6b35) !important;
        }

        .btn-secondary {
            background-color: var(--brand-secondary, #2a2a3a) !important;
            border-color: var(--brand-secondary, #2a2a3a) !important;
        }

        /* Background colors */
        .fullwidth-section {
            background-color: var(--bg-secondary, #f9fafb) !important;
        }

        body {
            background-color: var(--bg-primary, #ffffff) !important;
        }
        `;
    }

    /**
     * Apply animation style
     */
    applyAnimationStyle(style) {
        const animatedElements = document.querySelectorAll('.article-card, .course-card, .stat-card');
        
        animatedElements.forEach(element => {
            element.classList.remove('fade-in-up', 'slide-in-right', 'bounce-in');
            
            if (style !== 'none') {
                setTimeout(() => {
                    switch (style) {
                        case 'fade':
                            element.classList.add('fade-in-up');
                            break;
                        case 'slide':
                            element.classList.add('slide-in-right');
                            break;
                        case 'bounce':
                            element.classList.add('bounce-in');
                            break;
                    }
                }, 100);
            }
        });
    }

    /**
     * Save global style to localStorage
     */
    saveGlobalStyle(variable, value) {
        this.globalStyles[variable] = value;
        localStorage.setItem('globalStyles', JSON.stringify(this.globalStyles));
        this.applyCustomStyles();
    }

    /**
     * Save element style
     */
    saveElementStyle(selector, property, value) {
        if (!this.elementStyles[selector]) {
            this.elementStyles[selector] = {};
        }
        this.elementStyles[selector][property] = value;
        localStorage.setItem('elementStyles', JSON.stringify(this.elementStyles));
        this.applyCustomStyles();
    }

    /**
     * Load saved styles from localStorage
     */
    loadSavedStyles() {
        // Load global styles
        const savedGlobalStyles = localStorage.getItem('globalStyles');
        if (savedGlobalStyles) {
            this.globalStyles = JSON.parse(savedGlobalStyles);
            Object.entries(this.globalStyles).forEach(([variable, value]) => {
                this.updateCSSVariable(variable, value);
                this.updateControlValue(variable, value);
            });
        }

        // Load element styles
        const savedElementStyles = localStorage.getItem('elementStyles');
        if (savedElementStyles) {
            this.elementStyles = JSON.parse(savedElementStyles);
        }

        this.applyCustomStyles();
    }

    /**
     * Update control value in UI
     */
    updateControlValue(variable, value) {
        const mappings = {
            '--brand-primary': 'brand-primary',
            '--brand-secondary': 'brand-secondary',
            '--text-primary': 'text-primary',
            '--text-secondary': 'text-secondary',
            '--bg-primary': 'bg-primary',
            '--bg-secondary': 'bg-secondary',
            '--heading-font': 'heading-font',
            '--body-font': 'body-font'
        };

        const inputId = mappings[variable];
        if (inputId) {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = value;
            }
        }

        // Update range inputs
        if (variable.includes('size') || variable.includes('spacing') || variable.includes('width')) {
            const numericValue = parseInt(value);
            if (!isNaN(numericValue)) {
                if (variable === '--heading-size') {
                    const input = document.getElementById('heading-size');
                    if (input) input.value = numericValue;
                    const display = document.getElementById('heading-size-value');
                    if (display) display.textContent = value;
                } else if (variable === '--body-size') {
                    const input = document.getElementById('body-size');
                    if (input) input.value = numericValue;
                    const display = document.getElementById('body-size-value');
                    if (display) display.textContent = value;
                }
                // Add more mappings as needed
            }
        }
    }

    /**
     * Export current styles
     */
    exportStyles() {
        const exportData = {
            globalStyles: this.globalStyles,
            elementStyles: this.elementStyles,
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'website-styles.json';
        a.click();
        
        URL.revokeObjectURL(url);
    }

    /**
     * Import styles
     */
    importStyles(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.globalStyles) {
                    this.globalStyles = data.globalStyles;
                    localStorage.setItem('globalStyles', JSON.stringify(this.globalStyles));
                }
                
                if (data.elementStyles) {
                    this.elementStyles = data.elementStyles;
                    localStorage.setItem('elementStyles', JSON.stringify(this.elementStyles));
                }
                
                this.loadSavedStyles();
                this.showNotification('樣式已匯入', 'success');
            } catch (error) {
                this.showNotification('樣式檔案格式錯誤', 'error');
            }
        };
        reader.readAsText(file);
    }

    /**
     * Reset all styles
     */
    resetAllStyles() {
        if (confirm('確定要重設所有樣式嗎？此操作無法復原。')) {
            this.globalStyles = {};
            this.elementStyles = {};
            
            localStorage.removeItem('globalStyles');
            localStorage.removeItem('elementStyles');
            
            // Reset CSS variables to default
            const defaultStyles = {
                '--brand-primary': '#ff6b35',
                '--brand-secondary': '#2a2a3a',
                '--text-primary': '#1f2937',
                '--text-secondary': '#6b7280',
                '--bg-primary': '#ffffff',
                '--bg-secondary': '#f9fafb',
                '--heading-font': 'Inter',
                '--body-font': 'Inter',
                '--heading-size': '48px',
                '--body-size': '16px',
                '--section-spacing': '60px',
                '--element-spacing': '24px',
                '--container-width': '1200px',
                '--border-radius': '8px',
                '--box-shadow': '0 4px 6px rgba(0,0,0,0.1)'
            };

            Object.entries(defaultStyles).forEach(([variable, value]) => {
                this.updateCSSVariable(variable, value);
                this.updateControlValue(variable, value);
            });

            this.applyCustomStyles();
            this.showNotification('所有樣式已重設', 'info');
        }
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

// Initialize style manager
let styleManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        styleManager = new StyleManager();
    });
} else {
    styleManager = new StyleManager();
}