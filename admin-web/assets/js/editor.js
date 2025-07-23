// Markdown editor with preview functionality
class Editor {
    constructor() {
        this.textarea = null;
        this.previewContainer = null;
        this.isPreviewMode = false;
        this.currentContent = '';
    }

    // Initialize editor
    init(textareaId, previewId) {
        this.textarea = document.getElementById(textareaId);
        this.previewContainer = document.getElementById(previewId);
        
        if (!this.textarea) {
            console.error('Editor textarea not found:', textareaId);
            return;
        }

        this.setupEventListeners();
        this.setupToolbar();
    }

    // Setup event listeners
    setupEventListeners() {
        if (!this.textarea) return;

        // Auto-save content
        this.textarea.addEventListener('input', () => {
            this.currentContent = this.textarea.value;
        });

        // Handle tab key for indentation
        this.textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.insertAtCursor('    '); // 4 spaces for indentation
            }
        });

        // Handle Ctrl+S for save (prevent default browser save)
        this.textarea.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                // Trigger save event
                const saveEvent = new CustomEvent('editor:save');
                this.textarea.dispatchEvent(saveEvent);
            }
        });
    }

    // Setup toolbar event listeners
    setupToolbar() {
        const toolbar = document.querySelector('.editor-toolbar');
        if (!toolbar) return;

        toolbar.addEventListener('click', (e) => {
            const button = e.target.closest('[data-editor-action]');
            if (!button) return;

            e.preventDefault();
            const action = button.dataset.editorAction;
            this.executeAction(action);
        });
    }

    // Execute toolbar actions
    executeAction(action) {
        switch (action) {
            case 'bold':
                this.wrapSelection('**', '**');
                break;
            case 'italic':
                this.wrapSelection('*', '*');
                break;
            case 'link':
                this.insertLink();
                break;
            case 'image':
                this.insertImage();
                break;
            case 'preview':
                this.togglePreview();
                break;
            case 'heading':
                this.insertAtCursor('## ');
                break;
            case 'list':
                this.insertAtCursor('- ');
                break;
            case 'code':
                this.wrapSelection('`', '`');
                break;
            case 'quote':
                this.wrapSelection('> ', '');
                break;
        }
    }

    // Wrap selected text with given strings
    wrapSelection(prefix, suffix) {
        if (!this.textarea) return;

        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const selectedText = this.textarea.value.substring(start, end);
        const replacement = prefix + selectedText + suffix;

        this.textarea.setRangeText(replacement, start, end, 'select');
        this.textarea.focus();
        
        // Update current content
        this.currentContent = this.textarea.value;
    }

    // Insert text at cursor position
    insertAtCursor(text) {
        if (!this.textarea) return;

        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;

        this.textarea.setRangeText(text, start, end, 'end');
        this.textarea.focus();
        
        // Update current content
        this.currentContent = this.textarea.value;
    }

    // Insert link
    insertLink() {
        const url = prompt('請輸入連結網址：');
        if (!url) return;

        const text = prompt('請輸入連結文字：', url);
        if (text === null) return;

        const linkMarkdown = `[${text}](${url})`;
        this.insertAtCursor(linkMarkdown);
    }

    // Insert image
    insertImage() {
        const url = prompt('請輸入圖片網址：');
        if (!url) return;

        const alt = prompt('請輸入圖片描述：', '圖片');
        if (alt === null) return;

        const imageMarkdown = `![${alt}](${url})`;
        this.insertAtCursor(imageMarkdown);
    }

    // Toggle preview mode
    togglePreview() {
        if (!this.textarea || !this.previewContainer) return;

        this.isPreviewMode = !this.isPreviewMode;
        
        if (this.isPreviewMode) {
            this.showPreview();
        } else {
            this.hidePreview();
        }

        // Update button state
        const previewButton = document.querySelector('[data-editor-action="preview"]');
        if (previewButton) {
            previewButton.classList.toggle('active', this.isPreviewMode);
        }
    }

    // Show preview
    showPreview() {
        if (!this.textarea || !this.previewContainer) return;

        const content = this.textarea.value;
        const html = this.renderMarkdown(content);
        
        this.previewContainer.innerHTML = html;
        this.previewContainer.style.display = 'block';
        this.textarea.style.display = 'none';
    }

    // Hide preview
    hidePreview() {
        if (!this.textarea || !this.previewContainer) return;

        this.previewContainer.style.display = 'none';
        this.textarea.style.display = 'block';
    }

    // Render markdown to HTML
    renderMarkdown(content) {
        if (typeof marked !== 'undefined') {
            // Use marked.js if available
            return marked.parse(content);
        } else {
            // Fallback: basic markdown rendering
            return this.basicMarkdownToHtml(content);
        }
    }

    // Basic markdown to HTML conversion (fallback)
    basicMarkdownToHtml(markdown) {
        let html = markdown;

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Bold
        html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');

        // Images
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img alt="$1" src="$2" />');

        // Code (inline)
        html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

        // Lists
        html = html.replace(/^\- (.*)$/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');

        // Blockquotes
        html = html.replace(/^> (.*)$/gim, '<blockquote>$1</blockquote>');

        // Line breaks
        html = html.replace(/\n/gim, '<br>');

        return html;
    }

    // Get current content
    getContent() {
        return this.textarea ? this.textarea.value : this.currentContent;
    }

    // Set content
    setContent(content) {
        if (this.textarea) {
            this.textarea.value = content;
            this.currentContent = content;
        }
    }

    // Clear content
    clear() {
        this.setContent('');
    }

    // Get cursor position
    getCursorPosition() {
        if (!this.textarea) return 0;
        return this.textarea.selectionStart;
    }

    // Set cursor position
    setCursorPosition(position) {
        if (!this.textarea) return;
        this.textarea.setSelectionRange(position, position);
        this.textarea.focus();
    }

    // Insert template
    insertTemplate(template) {
        switch (template) {
            case 'post':
                this.insertPostTemplate();
                break;
            case 'image-gallery':
                this.insertImageGalleryTemplate();
                break;
            case 'code-block':
                this.insertCodeBlockTemplate();
                break;
            case 'table':
                this.insertTableTemplate();
                break;
        }
    }

    // Insert post template
    insertPostTemplate() {
        const template = `# 文章標題

## 簡介

在這裡寫下文章的開頭...

## 主要內容

### 小標題 1

內容...

### 小標題 2

內容...

## 結論

在這裡寫下結論...

---

你覺得這篇文章如何？歡迎在下方留言討論！
`;
        this.insertAtCursor(template);
    }

    // Insert image gallery template
    insertImageGalleryTemplate() {
        const template = `## 圖片集

![圖片描述 1](圖片網址1)
*圖片說明文字*

![圖片描述 2](圖片網址2)
*圖片說明文字*

![圖片描述 3](圖片網址3)
*圖片說明文字*
`;
        this.insertAtCursor(template);
    }

    // Insert code block template
    insertCodeBlockTemplate() {
        const language = prompt('請輸入程式語言 (例：javascript, python, html):', 'javascript');
        const template = `\`\`\`${language || ''}
// 在這裡輸入程式碼
console.log('Hello, World!');
\`\`\`
`;
        this.insertAtCursor(template);
    }

    // Insert table template
    insertTableTemplate() {
        const template = `| 欄位 1 | 欄位 2 | 欄位 3 |
|--------|--------|--------|
| 資料 1 | 資料 2 | 資料 3 |
| 資料 4 | 資料 5 | 資料 6 |
| 資料 7 | 資料 8 | 資料 9 |
`;
        this.insertAtCursor(template);
    }

    // Auto-resize textarea
    autoResize() {
        if (!this.textarea) return;
        
        this.textarea.style.height = 'auto';
        this.textarea.style.height = this.textarea.scrollHeight + 'px';
    }

    // Enable auto-resize
    enableAutoResize() {
        if (!this.textarea) return;
        
        this.textarea.addEventListener('input', () => {
            this.autoResize();
        });
        
        // Initial resize
        this.autoResize();
    }

    // Handle file upload
    handleFileUpload(file, callback) {
        if (!file.type.startsWith('image/')) {
            alert('請選擇圖片檔案');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            if (callback) {
                callback(dataUrl);
            } else {
                // Insert image markdown
                const imageMarkdown = `![${file.name}](${dataUrl})`;
                this.insertAtCursor(imageMarkdown);
            }
        };
        reader.readAsDataURL(file);
    }

    // Setup drag and drop for images
    setupDragAndDrop() {
        if (!this.textarea) return;

        this.textarea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.textarea.classList.add('drag-over');
        });

        this.textarea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.textarea.classList.remove('drag-over');
        });

        this.textarea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.textarea.classList.remove('drag-over');

            const files = Array.from(e.dataTransfer.files);
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    this.handleFileUpload(file);
                }
            });
        });
    }

    // Word count
    getWordCount() {
        const content = this.getContent();
        const words = content.trim().split(/\s+/).filter(word => word.length > 0);
        const characters = content.length;
        const charactersNoSpaces = content.replace(/\s/g, '').length;

        return {
            words: words.length,
            characters,
            charactersNoSpaces
        };
    }

    // Reading time estimation (assuming 200 words per minute)
    getReadingTime() {
        const wordCount = this.getWordCount().words;
        const minutes = Math.ceil(wordCount / 200);
        return minutes;
    }
}

// Export for use in other modules
window.Editor = Editor;