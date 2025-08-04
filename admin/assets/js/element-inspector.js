/**
 * Element Inspector - Identifies and manages all customizable elements on the frontend
 */

class ElementInspector {
    constructor() {
        this.elements = new Map();
        this.selectedElement = null;
        this.initializeElementMapping();
    }

    /**
     * Initialize mapping of all customizable elements
     */
    initializeElementMapping() {
        // Define all customizable elements with their selectors and properties
        this.elementDefinitions = {
            // Header elements
            'site-title': {
                selector: '.site-title',
                type: 'text',
                properties: ['content', 'color', 'font-size', 'font-weight', 'text-decoration'],
                editable: true,
                section: 'header'
            },
            'nav-links': {
                selector: '.nav-links',
                type: 'navigation',
                properties: ['background-color', 'padding', 'margin', 'border-radius'],
                editable: true,
                section: 'header'
            },
            'nav-link': {
                selector: '.nav-link',
                type: 'link',
                properties: ['color', 'hover-color', 'font-size', 'padding', 'text-decoration'],
                editable: true,
                section: 'header',
                multiple: true
            },

            // Hero section
            'hero-section': {
                selector: '.hero',
                type: 'section',
                properties: ['background-color', 'background-image', 'padding', 'margin', 'height'],
                editable: true,
                section: 'hero'
            },
            'hero-title': {
                selector: '.hero h1',
                type: 'text',
                properties: ['content', 'color', 'font-size', 'font-weight', 'line-height'],
                editable: true,
                section: 'hero'
            },
            'hero-subtitle': {
                selector: '.hero .tagline',
                type: 'text',
                properties: ['content', 'color', 'font-size', 'font-weight'],
                editable: true,
                section: 'hero'
            },
            'hero-description': {
                selector: '.hero .description',
                type: 'text',
                properties: ['content', 'color', 'font-size', 'line-height'],
                editable: true,
                section: 'hero'
            },
            'hero-image': {
                selector: '.hero-image img',
                type: 'image',
                properties: ['src', 'alt', 'width', 'height', 'border-radius'],
                editable: true,
                section: 'hero'
            },
            'hero-buttons': {
                selector: '.hero .btn',
                type: 'button',
                properties: ['background-color', 'color', 'padding', 'border-radius', 'font-size'],
                editable: true,
                section: 'hero',
                multiple: true
            },

            // Stats section
            'stats-section': {
                selector: '.stats-section',
                type: 'section',
                properties: ['background-color', 'padding', 'margin'],
                editable: true,
                section: 'stats'
            },
            'stat-cards': {
                selector: '.stat-card',
                type: 'card',
                properties: ['background-color', 'border', 'border-radius', 'padding', 'box-shadow'],
                editable: true,
                section: 'stats',
                multiple: true
            },
            'stat-numbers': {
                selector: '.stat-number',
                type: 'text',
                properties: ['content', 'color', 'font-size', 'font-weight'],
                editable: true,
                section: 'stats',
                multiple: true
            },
            'stat-labels': {
                selector: '.stat-label',
                type: 'text',
                properties: ['content', 'color', 'font-size'],
                editable: true,
                section: 'stats',
                multiple: true
            },

            // Articles section
            'articles-section': {
                selector: '.section:has(.article-card)',
                type: 'section',
                properties: ['background-color', 'padding', 'margin'],
                editable: true,
                section: 'articles'
            },
            'section-title': {
                selector: '.section-title',
                type: 'text',
                properties: ['content', 'color', 'font-size', 'font-weight'],
                editable: true,
                section: 'articles',
                multiple: true
            },
            'section-subtitle': {
                selector: '.section-subtitle',
                type: 'text',
                properties: ['content', 'color', 'font-size'],
                editable: true,
                section: 'articles',
                multiple: true
            },
            'article-cards': {
                selector: '.article-card',
                type: 'card',
                properties: ['background-color', 'border', 'border-radius', 'padding', 'box-shadow'],
                editable: true,
                section: 'articles',
                multiple: true
            },
            'article-titles': {
                selector: '.article-title',
                type: 'text',
                properties: ['content', 'color', 'font-size', 'font-weight'],
                editable: true,
                section: 'articles',
                multiple: true
            },

            // Newsletter section
            'newsletter-section': {
                selector: '.newsletter-section',
                type: 'section',
                properties: ['background-color', 'background-image', 'padding', 'margin'],
                editable: true,
                section: 'newsletter'
            },
            'newsletter-title': {
                selector: '.newsletter-section h2',
                type: 'text',
                properties: ['content', 'color', 'font-size', 'font-weight'],
                editable: true,
                section: 'newsletter'
            },
            'newsletter-form': {
                selector: '.newsletter-form',
                type: 'form',
                properties: ['background-color', 'border', 'border-radius', 'padding'],
                editable: true,
                section: 'newsletter'
            },
            'newsletter-input': {
                selector: '.newsletter-input',
                type: 'input',
                properties: ['background-color', 'border', 'border-radius', 'padding', 'color'],
                editable: true,
                section: 'newsletter'
            },
            'newsletter-button': {
                selector: '.newsletter-button',
                type: 'button',
                properties: ['background-color', 'color', 'border', 'border-radius', 'padding'],
                editable: true,
                section: 'newsletter'
            },

            // Courses section
            'courses-section': {
                selector: '.section:has(.course-card)',
                type: 'section',
                properties: ['background-color', 'padding', 'margin'],
                editable: true,
                section: 'courses'
            },
            'course-cards': {
                selector: '.course-card',
                type: 'card',
                properties: ['background-color', 'border', 'border-radius', 'padding', 'box-shadow'],
                editable: true,
                section: 'courses',
                multiple: true
            },
            'course-titles': {
                selector: '.course-title',
                type: 'text',
                properties: ['content', 'color', 'font-size', 'font-weight'],
                editable: true,
                section: 'courses',
                multiple: true
            },
            'course-prices': {
                selector: '.course-price',
                type: 'text',
                properties: ['content', 'color', 'font-size', 'font-weight'],
                editable: true,
                section: 'courses',
                multiple: true
            },

            // YouTube section
            'youtube-section': {
                selector: '.youtube-section',
                type: 'section',
                properties: ['background-color', 'padding', 'margin'],
                editable: true,
                section: 'youtube'
            },
            'youtube-embed': {
                selector: '.youtube-embed',
                type: 'embed',
                properties: ['width', 'height', 'border-radius'],
                editable: true,
                section: 'youtube'
            },

            // Footer
            'footer': {
                selector: 'footer',
                type: 'section',
                properties: ['background-color', 'color', 'padding', 'margin'],
                editable: true,
                section: 'footer'
            }
        };

        this.scanElements();
    }

    /**
     * Scan the page for all defined elements
     */
    scanElements() {
        this.elements.clear();
        
        Object.entries(this.elementDefinitions).forEach(([id, definition]) => {
            const elements = document.querySelectorAll(definition.selector);
            
            if (elements.length > 0) {
                if (definition.multiple) {
                    elements.forEach((element, index) => {
                        const elementId = `${id}-${index}`;
                        this.elements.set(elementId, {
                            ...definition,
                            element: element,
                            id: elementId,
                            index: index
                        });
                        this.addElementIdentifier(element, elementId);
                    });
                } else {
                    this.elements.set(id, {
                        ...definition,
                        element: elements[0],
                        id: id
                    });
                    this.addElementIdentifier(elements[0], id);
                }
            }
        });
    }

    /**
     * Add visual identifier to elements for easy selection
     */
    addElementIdentifier(element, id) {
        if (!element.dataset.elementId) {
            element.dataset.elementId = id;
            element.classList.add('customizable-element');
            
            // Add click handler for selection
            element.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.selectElement(id);
            });

            // Add hover effect
            element.addEventListener('mouseenter', () => {
                element.classList.add('element-hover');
            });

            element.addEventListener('mouseleave', () => {
                element.classList.remove('element-hover');
            });
        }
    }

    /**
     * Select an element for editing
     */
    selectElement(id) {
        // Remove previous selection
        if (this.selectedElement) {
            this.selectedElement.element.classList.remove('element-selected');
        }

        // Select new element
        const elementData = this.elements.get(id);
        if (elementData) {
            this.selectedElement = elementData;
            elementData.element.classList.add('element-selected');
            
            // Trigger property panel update
            this.updatePropertyPanel(elementData);
            
            // Dispatch selection event
            window.dispatchEvent(new CustomEvent('elementSelected', {
                detail: { elementData: elementData }
            }));
        }
    }

    /**
     * Update the property panel with selected element's properties
     */
    updatePropertyPanel(elementData) {
        const propertiesPanel = document.getElementById('properties-panel');
        const propertiesContent = propertiesPanel.querySelector('.properties-content');
        
        if (!propertiesContent) return;

        propertiesContent.innerHTML = `
            <div class="element-info">
                <h4>${elementData.id}</h4>
                <p class="element-type">${elementData.type} - ${elementData.section}</p>
            </div>
            
            <div class="properties-list">
                ${this.generatePropertyControls(elementData)}
            </div>
            
            <div class="element-actions">
                <button class="btn btn-primary" onclick="elementInspector.applyChanges('${elementData.id}')">
                    套用變更
                </button>
                <button class="btn btn-secondary" onclick="elementInspector.resetElement('${elementData.id}')">
                    重設
                </button>
            </div>
        `;

        propertiesPanel.style.display = 'block';
    }

    /**
     * Generate property control inputs
     */
    generatePropertyControls(elementData) {
        return elementData.properties.map(property => {
            const currentValue = this.getCurrentPropertyValue(elementData.element, property);
            
            switch (property) {
                case 'content':
                    return `
                        <div class="property-group">
                            <label for="${property}">${this.getPropertyLabel(property)}</label>
                            <textarea id="${property}" class="property-input" rows="3">${currentValue}</textarea>
                        </div>
                    `;
                case 'color':
                case 'background-color':
                case 'border-color':
                    return `
                        <div class="property-group">
                            <label for="${property}">${this.getPropertyLabel(property)}</label>
                            <input type="color" id="${property}" class="property-input" value="${currentValue}">
                        </div>
                    `;
                case 'font-size':
                case 'padding':
                case 'margin':
                case 'width':
                case 'height':
                    return `
                        <div class="property-group">
                            <label for="${property}">${this.getPropertyLabel(property)}</label>
                            <input type="text" id="${property}" class="property-input" value="${currentValue}" placeholder="例：16px, 1rem, 2em">
                        </div>
                    `;
                case 'src':
                case 'alt':
                    return `
                        <div class="property-group">
                            <label for="${property}">${this.getPropertyLabel(property)}</label>
                            <input type="text" id="${property}" class="property-input" value="${currentValue}">
                        </div>
                    `;
                default:
                    return `
                        <div class="property-group">
                            <label for="${property}">${this.getPropertyLabel(property)}</label>
                            <input type="text" id="${property}" class="property-input" value="${currentValue}">
                        </div>
                    `;
            }
        }).join('');
    }

    /**
     * Get current property value from element
     */
    getCurrentPropertyValue(element, property) {
        switch (property) {
            case 'content':
                return element.textContent || element.innerHTML;
            case 'color':
                return this.rgbToHex(getComputedStyle(element).color) || '#000000';
            case 'background-color':
                return this.rgbToHex(getComputedStyle(element).backgroundColor) || '#ffffff';
            case 'src':
                return element.src || '';
            case 'alt':
                return element.alt || '';
            default:
                return getComputedStyle(element)[property] || '';
        }
    }

    /**
     * Convert RGB to Hex
     */
    rgbToHex(rgb) {
        if (!rgb || rgb === 'rgba(0, 0, 0, 0)') return '#ffffff';
        const rgbMatch = rgb.match(/\d+/g);
        if (!rgbMatch) return '#000000';
        return '#' + rgbMatch.slice(0, 3).map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    /**
     * Get user-friendly property labels
     */
    getPropertyLabel(property) {
        const labels = {
            'content': '內容',
            'color': '文字顏色',
            'background-color': '背景顏色',
            'font-size': '字體大小',
            'font-weight': '字體粗細',
            'padding': '內距',
            'margin': '外距',
            'border-radius': '圓角',
            'width': '寬度',
            'height': '高度',
            'src': '圖片連結',
            'alt': '替代文字',
            'border': '邊框',
            'box-shadow': '陰影',
            'line-height': '行高'
        };
        return labels[property] || property;
    }

    /**
     * Apply changes to selected element
     */
    applyChanges(elementId) {
        const elementData = this.elements.get(elementId);
        if (!elementData) return;

        const propertiesPanel = document.getElementById('properties-panel');
        const inputs = propertiesPanel.querySelectorAll('.property-input');
        
        inputs.forEach(input => {
            const property = input.id;
            const value = input.value;
            
            this.setElementProperty(elementData.element, property, value);
        });

        // Save changes to localStorage
        this.saveElementChanges(elementId, elementData);
        
        // Show success message
        this.showNotification('變更已套用', 'success');
    }

    /**
     * Set property on element
     */
    setElementProperty(element, property, value) {
        switch (property) {
            case 'content':
                if (element.tagName.toLowerCase() === 'img') {
                    element.alt = value;
                } else {
                    element.textContent = value;
                }
                break;
            case 'src':
                if (element.tagName.toLowerCase() === 'img') {
                    element.src = value;
                }
                break;
            case 'alt':
                if (element.tagName.toLowerCase() === 'img') {
                    element.alt = value;
                }
                break;
            default:
                element.style[property] = value;
                break;
        }
    }

    /**
     * Reset element to default state
     */
    resetElement(elementId) {
        const elementData = this.elements.get(elementId);
        if (!elementData) return;

        // Remove all custom styles
        elementData.element.removeAttribute('style');
        
        // Remove from localStorage
        this.removeElementChanges(elementId);
        
        // Update property panel
        this.updatePropertyPanel(elementData);
        
        this.showNotification('元素已重設', 'info');
    }

    /**
     * Save element changes to localStorage
     */
    saveElementChanges(elementId, elementData) {
        const changes = JSON.parse(localStorage.getItem('elementChanges') || '{}');
        
        const propertiesPanel = document.getElementById('properties-panel');
        const inputs = propertiesPanel.querySelectorAll('.property-input');
        
        changes[elementId] = {};
        inputs.forEach(input => {
            changes[elementId][input.id] = input.value;
        });
        
        localStorage.setItem('elementChanges', JSON.stringify(changes));
    }

    /**
     * Remove element changes from localStorage
     */
    removeElementChanges(elementId) {
        const changes = JSON.parse(localStorage.getItem('elementChanges') || '{}');
        delete changes[elementId];
        localStorage.setItem('elementChanges', JSON.stringify(changes));
    }

    /**
     * Load and apply saved changes
     */
    loadSavedChanges() {
        const changes = JSON.parse(localStorage.getItem('elementChanges') || '{}');
        
        Object.entries(changes).forEach(([elementId, properties]) => {
            const elementData = this.elements.get(elementId);
            if (elementData) {
                Object.entries(properties).forEach(([property, value]) => {
                    this.setElementProperty(elementData.element, property, value);
                });
            }
        });
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    /**
     * Export current configuration
     */
    exportConfiguration() {
        const changes = JSON.parse(localStorage.getItem('elementChanges') || '{}');
        const blob = new Blob([JSON.stringify(changes, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'website-configuration.json';
        a.click();
        
        URL.revokeObjectURL(url);
    }

    /**
     * Import configuration
     */
    importConfiguration(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                localStorage.setItem('elementChanges', JSON.stringify(config));
                this.loadSavedChanges();
                this.showNotification('配置已匯入', 'success');
            } catch (error) {
                this.showNotification('配置檔案格式錯誤', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the element inspector
let elementInspector;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        elementInspector = new ElementInspector();
    });
} else {
    elementInspector = new ElementInspector();
}