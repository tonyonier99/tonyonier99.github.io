/**
 * Utility functions for the GitHub Admin Interface
 */

const Utils = {
    /**
     * Show notification to user
     * @param {string} message - The message to display
     * @param {string} type - Type of notification (success, error, warning, info)
     * @param {number} duration - Duration in milliseconds (default: 5000)
     */
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notifications') || this.createNotificationContainer();
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOut 0.3s ease-in-out forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
        
        return notification;
    },

    /**
     * Get icon for notification type
     * @param {string} type - Notification type
     * @returns {string} - FontAwesome icon name
     */
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    },

    /**
     * Create notification container if it doesn't exist
     * @returns {HTMLElement} - Notification container
     */
    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notifications';
        container.className = 'notifications';
        document.body.appendChild(container);
        return container;
    },

    /**
     * Show loading spinner
     * @param {HTMLElement} element - Element to show spinner in
     * @param {string} message - Loading message
     */
    showLoading(element, message = '載入中...') {
        element.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
    },

    /**
     * Format date string
     * @param {string|Date} date - Date to format
     * @param {string} format - Format type (relative, short, long)
     * @returns {string} - Formatted date
     */
    formatDate(date, format = 'relative') {
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        
        if (format === 'relative') {
            if (diff < 60000) return '剛剛';
            if (diff < 3600000) return `${Math.floor(diff / 60000)} 分鐘前`;
            if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小時前`;
            if (diff < 2592000000) return `${Math.floor(diff / 86400000)} 天前`;
            return d.toLocaleDateString('zh-TW');
        }
        
        if (format === 'short') {
            return d.toLocaleDateString('zh-TW');
        }
        
        return d.toLocaleString('zh-TW');
    },

    /**
     * Format file size
     * @param {number} bytes - Size in bytes
     * @returns {string} - Formatted size
     */
    formatFileSize(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 B';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    },

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} - Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in milliseconds
     * @returns {Function} - Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Deep clone an object
     * @param {Object} obj - Object to clone
     * @returns {Object} - Cloned object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    },

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Generate unique ID
     * @returns {string} - Unique ID
     */
    generateId() {
        return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Parse markdown to HTML (simple implementation)
     * @param {string} markdown - Markdown text
     * @returns {string} - HTML
     */
    parseMarkdown(markdown) {
        return markdown
            .replace(/### (.*$)/gim, '<h3>$1</h3>')
            .replace(/## (.*$)/gim, '<h2>$1</h2>')
            .replace(/# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
            .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
            .replace(/\n/gim, '<br>');
    },

    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} - Is valid
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Validate URL
     * @param {string} url - URL to validate
     * @returns {boolean} - Is valid
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} - Success status
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('已複製到剪貼簿', 'success');
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                if (successful) {
                    this.showNotification('已複製到剪貼簿', 'success');
                    return true;
                }
            } catch (err) {
                document.body.removeChild(textArea);
            }
            this.showNotification('複製失敗', 'error');
            return false;
        }
    },

    /**
     * Download content as file
     * @param {string} content - File content
     * @param {string} filename - File name
     * @param {string} contentType - MIME type
     */
    downloadFile(content, filename, contentType = 'text/plain') {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Read file content
     * @param {File} file - File to read
     * @returns {Promise<string>} - File content
     */
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    },

    /**
     * Get file extension
     * @param {string} filename - File name
     * @returns {string} - File extension
     */
    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    },

    /**
     * Get file type from extension
     * @param {string} extension - File extension
     * @returns {string} - File type
     */
    getFileType(extension) {
        const types = {
            // Images
            jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', svg: 'image', webp: 'image',
            // Documents
            pdf: 'document', doc: 'document', docx: 'document', txt: 'document', rtf: 'document',
            // Code
            js: 'code', ts: 'code', html: 'code', css: 'code', json: 'code', xml: 'code',
            py: 'code', java: 'code', cpp: 'code', c: 'code', php: 'code', rb: 'code',
            // Archives
            zip: 'archive', rar: 'archive', '7z': 'archive', tar: 'archive', gz: 'archive',
            // Audio
            mp3: 'audio', wav: 'audio', flac: 'audio', aac: 'audio',
            // Video
            mp4: 'video', avi: 'video', mov: 'video', wmv: 'video', flv: 'video'
        };
        return types[extension] || 'unknown';
    },

    /**
     * Sanitize filename for download
     * @param {string} filename - Original filename
     * @returns {string} - Sanitized filename
     */
    sanitizeFilename(filename) {
        return filename.replace(/[^a-z0-9.-]/gi, '_').replace(/_{2,}/g, '_');
    },

    /**
     * Check if device is mobile
     * @returns {boolean} - Is mobile
     */
    isMobile() {
        return window.innerWidth <= 767;
    },

    /**
     * Check if device is tablet
     * @returns {boolean} - Is tablet
     */
    isTablet() {
        return window.innerWidth >= 768 && window.innerWidth <= 1023;
    },

    /**
     * Check if device is desktop
     * @returns {boolean} - Is desktop
     */
    isDesktop() {
        return window.innerWidth >= 1024;
    },

    /**
     * Get current theme
     * @returns {string} - Current theme (light/dark)
     */
    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 
               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    },

    /**
     * Set theme
     * @param {string} theme - Theme to set (light/dark)
     */
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    },

    /**
     * Toggle theme
     */
    toggleTheme() {
        const currentTheme = this.getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        return newTheme;
    },

    /**
     * Format number with thousand separators
     * @param {number} num - Number to format
     * @returns {string} - Formatted number
     */
    formatNumber(num) {
        return num.toLocaleString('zh-TW');
    },

    /**
     * Truncate text
     * @param {string} text - Text to truncate
     * @param {number} length - Maximum length
     * @returns {string} - Truncated text
     */
    truncateText(text, length = 100) {
        if (text.length <= length) return text;
        return text.substring(0, length).trim() + '...';
    },

    /**
     * Sleep for specified duration
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise} - Promise that resolves after delay
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Retry function with exponential backoff
     * @param {Function} fn - Function to retry
     * @param {number} maxRetries - Maximum number of retries
     * @param {number} baseDelay - Base delay in milliseconds
     * @returns {Promise} - Promise that resolves with function result
     */
    async retry(fn, maxRetries = 3, baseDelay = 1000) {
        let lastError;
        
        for (let i = 0; i <= maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                if (i === maxRetries) break;
                
                const delay = baseDelay * Math.pow(2, i);
                await this.sleep(delay);
            }
        }
        
        throw lastError;
    },

    /**
     * Check if string is JSON
     * @param {string} str - String to check
     * @returns {boolean} - Is valid JSON
     */
    isValidJSON(str) {
        try {
            JSON.parse(str);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Parse YAML front matter
     * @param {string} content - Content with front matter
     * @returns {Object} - Parsed front matter and body
     */
    parseFrontMatter(content) {
        const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontMatterRegex);
        
        if (!match) {
            return { frontMatter: {}, body: content };
        }
        
        try {
            // Simple YAML parser for basic key-value pairs
            const frontMatterText = match[1];
            const frontMatter = {};
            
            frontMatterText.split('\n').forEach(line => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    const key = line.substring(0, colonIndex).trim();
                    let value = line.substring(colonIndex + 1).trim();
                    
                    // Remove quotes if present
                    if ((value.startsWith('"') && value.endsWith('"')) || 
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    
                    // Try to parse as JSON for arrays/objects
                    try {
                        value = JSON.parse(value);
                    } catch {
                        // Keep as string if not valid JSON
                    }
                    
                    frontMatter[key] = value;
                }
            });
            
            return {
                frontMatter,
                body: match[2]
            };
        } catch (error) {
            console.error('Error parsing front matter:', error);
            return { frontMatter: {}, body: content };
        }
    },

    /**
     * Create front matter string
     * @param {Object} frontMatter - Front matter object
     * @param {string} body - Content body
     * @returns {string} - Combined content
     */
    createFrontMatter(frontMatter, body) {
        let yaml = '---\n';
        
        for (const [key, value] of Object.entries(frontMatter)) {
            if (typeof value === 'string') {
                yaml += `${key}: "${value}"\n`;
            } else if (Array.isArray(value)) {
                yaml += `${key}: [${value.map(v => `"${v}"`).join(', ')}]\n`;
            } else {
                yaml += `${key}: ${value}\n`;
            }
        }
        
        yaml += '---\n\n';
        return yaml + body;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}