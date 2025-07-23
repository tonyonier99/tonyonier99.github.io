# 線上版部落格管理後台

一個完全基於瀏覽器的部落格管理後台，無需安裝任何軟體或執行命令列指令，可直接透過 GitHub Pages 使用。

## 🌟 特色功能

### ✅ 免安裝免設定
- 純前端技術實現
- 直接透過瀏覽器使用
- 支援 GitHub Pages 部署
- 無需 Node.js 或後端伺服器

### ✅ 認證與安全
- 使用 GitHub Personal Access Token 認證
- 本地加密儲存認證信息
- 僅允許授權用戶訪問
- 完整的權限控制

### ✅ 內容管理
- **文章管理** - 新增、編輯、刪除部落格文章
- **頁面管理** - 管理靜態頁面內容
- **媒體管理** - 上傳和管理圖片等媒體文件
- **網站設定** - 編輯 Jekyll 配置文件

### ✅ 編輯體驗
- 豐富的 Markdown 編輯器
- 即時預覽功能
- 語法高亮顯示
- 拖放圖片上傳
- 快捷鍵支援

### ✅ 使用者界面
- Ali Abdaal 風格設計
- 完全響應式佈局
- 中文界面
- 直覺的操作流程

## 🚀 使用方法

### 1. 訪問管理後台
直接瀏覽器訪問：`https://tonyonier99.github.io/admin-web/`

### 2. 獲取 GitHub Token
1. 前往 [GitHub Settings > Personal access tokens](https://github.com/settings/tokens)
2. 點擊 "Generate new token"
3. 設定 token 名稱和到期時間
4. 勾選 `repo` 權限（完整倉庫訪問權限）
5. 點擊 "Generate token" 並複製 token

### 3. 登入系統
1. 在登入頁面貼上您的 GitHub Personal Access Token
2. 點擊「登入」按鈕
3. 系統會自動驗證您的身份和權限

### 4. 開始管理
登入成功後，您可以：
- 查看儀表板統計資訊
- 管理部落格文章
- 編輯網站頁面
- 上傳媒體文件
- 修改網站設定

## 📋 功能詳細說明

### 文章管理
- **新增文章**：支援完整的文章元數據設定（標題、日期、分類、標籤等）
- **編輯文章**：Markdown 編輯器，支援即時預覽
- **刪除文章**：安全刪除機制，防止誤操作
- **文章列表**：顯示所有文章及其狀態

### 頁面管理
- **編輯頁面**：修改現有的靜態頁面
- **設定佈局**：選擇適當的頁面佈局
- **永久鏈接**：自定義頁面 URL 結構

### 媒體管理
- **拖放上傳**：支援拖放操作上傳文件
- **格式支援**：圖片、影片、音訊、PDF 等
- **鏈接複製**：一鍵複製媒體文件鏈接
- **預覽功能**：圖片文件自動生成縮略圖

### 網站設定
- **配置編輯**：直接編輯 `_config.yml` 文件
- **語法高亮**：YAML 語法支援
- **即時儲存**：修改即時同步到 GitHub

## 🛠 技術架構

### 前端技術
- **Vanilla JavaScript** - 純 JS 實現，無框架依賴
- **GitHub REST API** - 直接與 GitHub 倉庫交互
- **Responsive CSS** - 適配各種設備螢幕
- **Font Awesome** - 豐富的圖示支援

### 認證機制
- **Personal Access Token** - 使用 GitHub PAT 進行認證
- **本地加密存儲** - XOR 加密存儲認證信息
- **權限驗證** - 確保只有授權用戶可以訪問

### 數據存儲
- **GitHub Repository** - 所有內容存儲在 GitHub 倉庫
- **File-based CMS** - 基於文件的內容管理
- **Git 版本控制** - 自動提交和版本追蹤

## 🔧 部署方式

### GitHub Pages 部署
1. 將 `admin-web` 目錄推送到 GitHub 倉庫
2. 在倉庫設定中啟用 GitHub Pages
3. 選擇來源分支和目錄
4. 訪問 `https://username.github.io/repository-name/admin-web/`

### 其他靜態託管
- **Netlify**: 拖放部署或 Git 連接
- **Vercel**: 一鍵部署
- **GitHub Codespaces**: 開發環境測試

## 🔒 安全考量

### Token 安全
- Token 在瀏覽器本地加密存儲
- 支援 Token 健康狀態檢查
- 提供 Token 更新機制

### 使用者驗證
- 限制特定用戶使用（tonyonier99）
- GitHub 用戶身份驗證
- 倉庫訪問權限確認

### 數據保護
- 所有操作通過 HTTPS 進行
- 輸入驗證和錯誤處理
- 防止惡意代碼注入

## 📱 瀏覽器支援

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🆘 故障排除

### 常見問題

**Q: Token 無效或過期**
A: 前往 GitHub 設定重新生成 Token，確保包含 `repo` 權限

**Q: 上傳圖片失敗**
A: 檢查檔案大小是否超過 GitHub 限制（25MB），檔案格式是否支援

**Q: 無法載入數據**
A: 檢查網路連接，確認 GitHub API 可正常訪問

**Q: 編輯器無法使用**
A: 嘗試重新整理頁面，或使用無痕模式排除擴充功能影響

### 獲取幫助
如遇到問題，請：
1. 檢查瀏覽器開發者工具的控制台錯誤
2. 確認 GitHub Token 權限設定正確
3. 嘗試清除瀏覽器快取和本地存儲

## 📄 授權
MIT License

---

**注意**: 此管理後台是為 Tony 個人部落格設計，僅限授權用戶使用。使用前請確保您有適當的權限。