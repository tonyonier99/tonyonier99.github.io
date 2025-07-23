# Tony 的部落格管理後台系統

一個完整的 Jekyll 部落格管理後台，提供文章、頁面、媒體和網站設定的管理功能。

## 功能特色

- 🔐 **GitHub OAuth 認證** - 安全的身份驗證
- 📝 **文章管理** - CRUD 操作，支援 Markdown 編輯
- 📄 **頁面管理** - 管理靜態頁面
- 🖼️ **媒體管理** - 圖片上傳和管理
- ⚙️ **網站設定** - 修改 Jekyll 配置
- 📊 **統計儀表板** - 網站統計和活動記錄

## 技術架構

### 前端
- **React 18** + **TypeScript**
- **Tailwind CSS** + **Headless UI**
- **React Query** 用於資料管理
- **React Router** 用於路由
- **Monaco Editor** 用於 Markdown 編輯

### 後端
- **Node.js** + **Express**
- **GitHub OAuth 2.0** 認證
- **GitHub REST API** 整合
- **Session-based** 驗證

## 安裝與設定

### 1. 安裝依賴

```bash
# 安裝根目錄依賴
cd admin
npm install

# 安裝伺服器依賴
cd server
npm install
```

### 2. 環境配置

複製伺服器環境變數檔案：

```bash
cd server
cp .env.example .env
```

編輯 `.env` 檔案，設定以下變數：

```env
# GitHub OAuth 應用程式
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# GitHub Personal Access Token (需要 repo 權限)
GITHUB_TOKEN=your_github_personal_access_token

# 其他設定
SESSION_SECRET=your-secure-session-secret
```

### 3. GitHub OAuth 應用程式設定

1. 前往 GitHub Settings > Developer settings > OAuth Apps
2. 建立新的 OAuth App
3. 設定回調 URL: `http://localhost:3001/api/auth/github/callback`
4. 複製 Client ID 和 Client Secret 到 `.env` 檔案

### 4. GitHub Personal Access Token

1. 前往 GitHub Settings > Developer settings > Personal access tokens
2. 建立新的 token，授予 `repo` 權限
3. 複製 token 到 `.env` 檔案

## 開發

### 啟動開發環境

```bash
# 在 admin 目錄下
npm run dev
```

這會同時啟動：
- 前端開發伺服器 (port 3000)
- 後端 API 伺服器 (port 3001)

### 單獨啟動

```bash
# 只啟動前端
npm run client:dev

# 只啟動後端
npm run server:dev
```

## 部署

### 建置前端

```bash
npm run build
```

### 生產環境

```bash
# 啟動後端伺服器
npm start
```

## 項目結構

```
admin/
├── src/                    # 前端源碼
│   ├── components/        # React 元件
│   │   ├── auth/         # 認證相關元件
│   │   ├── layout/       # 佈局元件
│   │   └── ui/           # UI 元件
│   ├── pages/            # 頁面元件
│   ├── services/         # API 服務
│   ├── types/            # TypeScript 類型定義
│   └── utils/            # 工具函數
├── server/               # 後端源碼
│   ├── routes/          # API 路由
│   ├── middleware/      # 中間件
│   ├── services/        # 服務層
│   └── index.js         # 伺服器入口
└── dist/                # 建置輸出
```

## API 文檔

### 認證
- `GET /api/auth/github` - 取得 GitHub OAuth URL
- `GET /api/auth/github/callback` - OAuth 回調
- `GET /api/auth/me` - 取得當前使用者資訊
- `POST /api/auth/logout` - 登出

### 文章管理
- `GET /api/posts` - 取得所有文章
- `GET /api/posts/:filename` - 取得特定文章
- `POST /api/posts` - 建立新文章
- `PUT /api/posts/:filename` - 更新文章
- `DELETE /api/posts/:filename` - 刪除文章

### 頁面管理
- `GET /api/pages` - 取得所有頁面
- `GET /api/pages/:filename` - 取得特定頁面
- `PUT /api/pages/:filename` - 更新頁面

### 媒體管理
- `GET /api/media` - 取得所有媒體檔案
- `POST /api/media/upload` - 上傳媒體檔案
- `DELETE /api/media/:path` - 刪除媒體檔案

### 網站設定
- `GET /api/settings/config` - 取得網站配置
- `PUT /api/settings/config` - 更新網站配置
- `GET /api/settings/stats` - 取得網站統計

## 安全性

- 只允許 `tonyonier99` 使用者訪問
- 使用 GitHub OAuth 認證
- Session-based 驗證
- CORS 保護
- Rate limiting
- 輸入驗證

## 授權

MIT License