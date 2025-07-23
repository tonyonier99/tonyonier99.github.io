/**
 * Markdown 編輯器模組
 * 提供豐富的 Markdown 編輯功能
 */

class MarkdownEditor {
    constructor(container) {
        this.container = container;
        this.textarea = null;
        this.preview = null;
        this.isPreviewMode = false;
        this.toolbar = null;
        this.currentContent = '';
        
        this.init();
    }

    /**
     * 初始化編輯器
     */
    init() {
        this.createEditor();
        this.bindEvents();
    }

    /**
     * 創建編輯器 DOM 結構
     */
    createEditor() {
        this.container.innerHTML = `
            <div class="editor-container">
                <div class="editor-toolbar">
                    <div class="toolbar-group">
                        <button class="editor-btn" data-action="bold" title="粗體 (Ctrl+B)">
                            <i class="fas fa-bold"></i>
                        </button>
                        <button class="editor-btn" data-action="italic" title="斜體 (Ctrl+I)">
                            <i class="fas fa-italic"></i>
                        </button>
                        <button class="editor-btn" data-action="strikethrough" title="刪除線">
                            <i class="fas fa-strikethrough"></i>
                        </button>
                    </div>
                    
                    <div class="toolbar-group">
                        <button class="editor-btn" data-action="heading" title="標題">
                            <i class="fas fa-heading"></i>
                        </button>
                        <button class="editor-btn" data-action="quote" title="引用">
                            <i class="fas fa-quote-left"></i>
                        </button>
                        <button class="editor-btn" data-action="code" title="代碼">
                            <i class="fas fa-code"></i>
                        </button>
                        <button class="editor-btn" data-action="codeblock" title="代碼塊">
                            <i class="fas fa-file-code"></i>
                        </button>
                    </div>
                    
                    <div class="toolbar-group">
                        <button class="editor-btn" data-action="link" title="鏈接">
                            <i class="fas fa-link"></i>
                        </button>
                        <button class="editor-btn" data-action="image" title="圖片">
                            <i class="fas fa-image"></i>
                        </button>
                        <button class="editor-btn" data-action="table" title="表格">
                            <i class="fas fa-table"></i>
                        </button>
                    </div>
                    
                    <div class="toolbar-group">
                        <button class="editor-btn" data-action="ul" title="無序列表">
                            <i class="fas fa-list-ul"></i>
                        </button>
                        <button class="editor-btn" data-action="ol" title="有序列表">
                            <i class="fas fa-list-ol"></i>
                        </button>
                        <button class="editor-btn" data-action="hr" title="分隔線">
                            <i class="fas fa-minus"></i>
                        </button>
                    </div>
                    
                    <div class="toolbar-group toolbar-right">
                        <button class="editor-btn" data-action="preview" title="預覽">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="editor-btn" data-action="fullscreen" title="全屏">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                </div>
                
                <div class="editor-content">
                    <textarea class="editor-input" placeholder="在這裡輸入您的 Markdown 內容..."></textarea>
                    <div class="editor-preview" style="display: none;">
                        <div class="preview-content"></div>
                    </div>
                </div>
            </div>
        `;

        this.toolbar = this.container.querySelector('.editor-toolbar');
        this.textarea = this.container.querySelector('.editor-input');
        this.preview = this.container.querySelector('.editor-preview');
        this.previewContent = this.container.querySelector('.preview-content');
    }

    /**
     * 綁定事件
     */
    bindEvents() {
        // 工具欄按鈕事件
        this.toolbar.addEventListener('click', (e) => {
            const button = e.target.closest('.editor-btn');
            if (button) {
                e.preventDefault();
                const action = button.dataset.action;
                this.executeAction(action);
            }
        });

        // 鍵盤快捷鍵
        this.textarea.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'b':
                        e.preventDefault();
                        this.executeAction('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        this.executeAction('italic');
                        break;
                    case 'k':
                        e.preventDefault();
                        this.executeAction('link');
                        break;
                }
            }
            
            // Tab 鍵處理
            if (e.key === 'Tab') {
                e.preventDefault();
                this.insertText('    '); // 插入 4 個空格
            }
        });

        // 內容變化事件
        this.textarea.addEventListener('input', () => {
            this.currentContent = this.textarea.value;
            if (this.isPreviewMode) {
                this.updatePreview();
            }
        });

        // 拖放圖片支持
        this.textarea.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        this.textarea.addEventListener('drop', (e) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files);
            const imageFiles = files.filter(file => file.type.startsWith('image/'));
            
            if (imageFiles.length > 0) {
                this.handleImageUpload(imageFiles[0]);
            }
        });
    }

    /**
     * 執行編輯器動作
     */
    executeAction(action) {
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const selectedText = this.textarea.value.substring(start, end);

        switch (action) {
            case 'bold':
                this.wrapText('**', '**', '粗體文字');
                break;
            case 'italic':
                this.wrapText('*', '*', '斜體文字');
                break;
            case 'strikethrough':
                this.wrapText('~~', '~~', '刪除線文字');
                break;
            case 'heading':
                this.insertHeading();
                break;
            case 'quote':
                this.insertQuote();
                break;
            case 'code':
                this.wrapText('`', '`', '代碼');
                break;
            case 'codeblock':
                this.insertCodeBlock();
                break;
            case 'link':
                this.insertLink();
                break;
            case 'image':
                this.insertImage();
                break;
            case 'table':
                this.insertTable();
                break;
            case 'ul':
                this.insertList('-');
                break;
            case 'ol':
                this.insertList('1.');
                break;
            case 'hr':
                this.insertText('\n---\n');
                break;
            case 'preview':
                this.togglePreview();
                break;
            case 'fullscreen':
                this.toggleFullscreen();
                break;
        }
    }

    /**
     * 包裝選中文字
     */
    wrapText(prefix, suffix, placeholder = '') {
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const selectedText = this.textarea.value.substring(start, end);
        const replacement = selectedText || placeholder;
        
        this.insertText(prefix + replacement + suffix);
        
        if (!selectedText && placeholder) {
            // 選中占位符文字
            this.textarea.setSelectionRange(
                start + prefix.length,
                start + prefix.length + placeholder.length
            );
        }
    }

    /**
     * 插入文字
     */
    insertText(text) {
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const before = this.textarea.value.substring(0, start);
        const after = this.textarea.value.substring(end);
        
        this.textarea.value = before + text + after;
        this.textarea.focus();
        this.textarea.setSelectionRange(start + text.length, start + text.length);
        
        // 觸發 input 事件
        this.textarea.dispatchEvent(new Event('input'));
    }

    /**
     * 插入標題
     */
    insertHeading() {
        const level = prompt('請輸入標題級別 (1-6):', '1');
        if (level && /^[1-6]$/.test(level)) {
            const hashes = '#'.repeat(parseInt(level));
            this.insertText(`\n${hashes} 標題\n`);
        }
    }

    /**
     * 插入引用
     */
    insertQuote() {
        this.insertText('\n> 引用內容\n');
    }

    /**
     * 插入代碼塊
     */
    insertCodeBlock() {
        const language = prompt('請輸入程式語言 (可選):', 'javascript');
        this.insertText(`\n\`\`\`${language || ''}\n代碼內容\n\`\`\`\n`);
    }

    /**
     * 插入鏈接
     */
    insertLink() {
        const url = prompt('請輸入網址:', 'https://');
        if (url) {
            const text = prompt('請輸入鏈接文字:', '鏈接文字');
            this.insertText(`[${text || '鏈接文字'}](${url})`);
        }
    }

    /**
     * 插入圖片
     */
    insertImage() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleImageUpload(file);
            }
        };
        fileInput.click();
    }

    /**
     * 處理圖片上傳
     */
    async handleImageUpload(file) {
        try {
            // 顯示載入狀態
            const loadingText = `![上傳中...](${file.name})`;
            this.insertText(loadingText);

            // 獲取 GitHub API 實例
            const auth = window.authManager;
            const github = auth.getGitHubAPI();
            
            if (!github) {
                throw new Error('未初始化 GitHub API');
            }

            // 上傳圖片
            const result = await github.uploadMedia(file);
            
            // 替換載入文字為實際圖片鏈接
            const imageMarkdown = `![${file.name}](${result.content.download_url})`;
            this.textarea.value = this.textarea.value.replace(loadingText, imageMarkdown);
            
            // 觸發 input 事件
            this.textarea.dispatchEvent(new Event('input'));
            
            // 顯示成功通知
            window.showNotification('圖片上傳成功！', 'success');
        } catch (error) {
            console.error('Image upload failed:', error);
            
            // 移除載入文字
            this.textarea.value = this.textarea.value.replace(`![上傳中...](${file.name})`, '');
            
            // 顯示錯誤通知
            window.showNotification(`圖片上傳失敗：${error.message}`, 'error');
        }
    }

    /**
     * 插入表格
     */
    insertTable() {
        const table = '\n| 標題1 | 標題2 | 標題3 |\n|-------|-------|-------|\n| 內容1 | 內容2 | 內容3 |\n| 內容4 | 內容5 | 內容6 |\n';
        this.insertText(table);
    }

    /**
     * 插入列表
     */
    insertList(marker) {
        const lines = ['項目1', '項目2', '項目3'];
        const list = '\n' + lines.map((line, index) => {
            const prefix = marker === '1.' ? `${index + 1}.` : marker;
            return `${prefix} ${line}`;
        }).join('\n') + '\n';
        this.insertText(list);
    }

    /**
     * 切換預覽模式
     */
    togglePreview() {
        this.isPreviewMode = !this.isPreviewMode;
        
        if (this.isPreviewMode) {
            this.textarea.style.display = 'none';
            this.preview.style.display = 'block';
            this.updatePreview();
            
            // 更新按鈕狀態
            const previewBtn = this.toolbar.querySelector('[data-action="preview"]');
            previewBtn.innerHTML = '<i class="fas fa-edit"></i>';
            previewBtn.title = '編輯';
        } else {
            this.textarea.style.display = 'block';
            this.preview.style.display = 'none';
            
            // 更新按鈕狀態
            const previewBtn = this.toolbar.querySelector('[data-action="preview"]');
            previewBtn.innerHTML = '<i class="fas fa-eye"></i>';
            previewBtn.title = '預覽';
        }
    }

    /**
     * 更新預覽內容
     */
    updatePreview() {
        const markdown = this.textarea.value;
        const html = this.markdownToHTML(markdown);
        this.previewContent.innerHTML = html;
    }

    /**
     * 簡單的 Markdown 到 HTML 轉換
     */
    markdownToHTML(markdown) {
        let html = markdown;

        // 代碼塊
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang || 'text'}">${this.escapeHtml(code.trim())}</code></pre>`;
        });

        // 行內代碼
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // 標題
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // 粗體和斜體
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // 刪除線
        html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

        // 鏈接
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        // 圖片
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;">');

        // 引用
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

        // 水平線
        html = html.replace(/^---$/gim, '<hr>');

        // 列表
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

        // 包裝列表項
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // 段落
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';

        // 清理空段落
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>(<h[1-6]>)/g, '$1');
        html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<hr>)<\/p>/g, '$1');
        html = html.replace(/<p>(<blockquote>.*<\/blockquote>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ul>.*<\/ul>)<\/p>/g, '$1');
        html = html.replace(/<p>(<pre>.*<\/pre>)<\/p>/gs, '$1');

        return html;
    }

    /**
     * HTML 轉義
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 切換全屏模式
     */
    toggleFullscreen() {
        this.container.classList.toggle('editor-fullscreen');
        
        const fullscreenBtn = this.toolbar.querySelector('[data-action="fullscreen"]');
        if (this.container.classList.contains('editor-fullscreen')) {
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            fullscreenBtn.title = '退出全屏';
        } else {
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            fullscreenBtn.title = '全屏';
        }
    }

    /**
     * 設置編輯器內容
     */
    setContent(content) {
        this.textarea.value = content || '';
        this.currentContent = this.textarea.value;
        if (this.isPreviewMode) {
            this.updatePreview();
        }
    }

    /**
     * 獲取編輯器內容
     */
    getContent() {
        return this.textarea.value;
    }

    /**
     * 清空編輯器
     */
    clear() {
        this.setContent('');
    }

    /**
     * 插入模板
     */
    insertTemplate(template) {
        this.insertText(template);
    }

    /**
     * 獲取選中文字
     */
    getSelectedText() {
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        return this.textarea.value.substring(start, end);
    }

    /**
     * 替換選中文字
     */
    replaceSelectedText(text) {
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const before = this.textarea.value.substring(0, start);
        const after = this.textarea.value.substring(end);
        
        this.textarea.value = before + text + after;
        this.textarea.focus();
        this.textarea.setSelectionRange(start + text.length, start + text.length);
        
        // 觸發 input 事件
        this.textarea.dispatchEvent(new Event('input'));
    }

    /**
     * 銷毀編輯器
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}