# Tony 的部落格管理後台

## 簡介

這是一個完全基於瀏覽器的部落格管理後台，無需安裝 Node.js 或執行任何命令列指令。透過 GitHub API 直接管理部落格內容，支援文章編寫、編輯、刪除以及網站設定。

## 功能特色

### ✅ 已實現功能
- 🔐 GitHub Personal Access Token 認證
- 📊 儀表板（文章統計、最近更新）
- 📝 文章管理（新增、編輯、刪除）
- ✍️ Markdown 編輯器（即時預覽）
- 🖼️ 圖片上傳支援
- ⚙️ 網站設定管理
- 📱 響應式設計
- 🎨 Ali Abdaal 風格介面

### 🎯 技術特點
- **純前端實現**：無需後端伺服器
- **GitHub API 整合**：直接操作 GitHub 儲存庫
- **即時同步**：所有變更立即反映到 GitHub Pages
- **安全認證**：使用 Personal Access Token
- **離線儲存**：本地快取認證資訊

## 使用方法

### 1. 取得 GitHub Personal Access Token

1. 前往 [GitHub Settings → Personal access tokens](https://github.com/settings/tokens)
2. 點選 "Generate new token (classic)"
3. 選擇適當的過期時間
4. 勾選以下權限：
   - `repo` (完整儲存庫存取權限)
   - `user:email` (讀取使用者 email)
5. 點選 "Generate token"
6. **重要：複製並妥善保存 token，離開頁面後將無法再次查看**

### 2. 存取管理後台

1. 開啟瀏覽器，前往：`https://tonyonier99.github.io/admin-web/`
2. 在登入頁面輸入你的 GitHub Personal Access Token
3. 點選「登入」按鈕

### 3. 開始管理部落格

登入成功後，你可以：

#### 📊 檢視儀表板
- 查看文章統計資訊
- 瀏覽最近的文章
- 快速建立新文章

#### 📝 管理文章
- **新增文章**：點選「新增文章」按鈕
- **編輯文章**：在文章列表中點選「編輯」
- **刪除文章**：在文章列表中點選「刪除」（需確認）

#### ✍️ 使用編輯器
- 支援 Markdown 語法
- 即時預覽功能
- 工具列快速插入格式
- 拖拽上傳圖片
- 自動儲存

#### ⚙️ 網站設定
- 修改網站標題和描述
- 更新作者資訊
- 調整其他設定

## 檔案結構

```
admin-web/
├── index.html          # 主頁面
├── assets/
│   ├── css/
│   │   └── style.css   # Ali Abdaal 風格樣式
│   └── js/
│       ├── app.js      # 主程式邏輯
│       ├── auth.js     # 認證管理
│       ├── github-api.js # GitHub API 封裝
│       └── editor.js   # Markdown 編輯器
└── README.md           # 使用說明
```

## 技術架構

### 前端技術
- **HTML5 + CSS3**：響應式介面設計
- **Vanilla JavaScript**：無框架依賴
- **GitHub API v3**：RESTful API 整合
- **Marked.js**：Markdown 渲染
- **Font Awesome**：圖示庫

### 認證機制
- 使用 GitHub Personal Access Token
- 本地加密儲存（Base64 編碼）
- 自動驗證 token 有效性
- 權限檢查（repo 存取權限）

### 檔案操作
- 透過 GitHub Contents API 進行 CRUD 操作
- 自動處理檔案編碼（UTF-8 → Base64）
- 支援檔案重新命名和移動
- 版本控制整合

## 安全考量

### ✅ 已實現
- Token 本地加密儲存
- API 請求驗證
- 輸入資料驗證
- 錯誤處理機制

### ⚠️ 注意事項
- Personal Access Token 具有完整 repo 權限
- 請勿在公共電腦上儲存 token
- 定期更新 token 以確保安全
- 建議使用較短的過期時間

## 瀏覽器支援

- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+

## 故障排除

### Token 相關問題
- **無法登入**：檢查 token 是否正確，是否具有 repo 權限
- **權限不足**：確認 token 包含必要的權限範圍
- **Token 過期**：重新產生新的 token

### 網路相關問題
- **API 請求失敗**：檢查網路連線，確認 GitHub 服務狀態
- **載入緩慢**：可能是網路問題或 GitHub API 限制

### 編輯器問題
- **無法儲存**：檢查檔案內容格式，確認網路連線
- **預覽異常**：重新整理頁面，檢查 Markdown 語法

## 常見問題

### Q: 可以多人同時使用嗎？
A: 可以，但建議不要同時編輯同一篇文章，以避免衝突。

### Q: 離線時可以使用嗎？
A: 部分功能可以離線使用（如編寫文章），但儲存需要網路連線。

### Q: 如何備份文章？
A: 所有文章都儲存在 GitHub 儲存庫中，GitHub 本身就是最好的備份。

### Q: 可以自訂佈景主題嗎？
A: 目前使用固定的 Ali Abdaal 風格，未來可能會支援自訂主題。

## 授權資訊

此專案採用 MIT 授權條款。

## 技術支援

如遇問題，請：
1. 檢查瀏覽器主控台的錯誤訊息
2. 確認 GitHub Personal Access Token 的權限設定
3. 提交 GitHub Issue 回報問題

---

**享受寫作的樂趣！** 🎉