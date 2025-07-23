# 部署指南

## 環境需求

- Node.js 18+ 
- npm 8+
- GitHub OAuth 應用程式
- GitHub Personal Access Token

## 快速開始

### 1. 安裝依賴

```bash
cd admin
npm install
cd server
npm install
```

### 2. 環境設定

在 `admin/server/` 目錄下建立 `.env` 檔案：

```env
# 基本設定
PORT=3001
NODE_ENV=production

# GitHub OAuth
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
GITHUB_REDIRECT_URI=https://yourdomain.com/api/auth/github/callback

# GitHub API
GITHUB_TOKEN=ghp_your_token_here
GITHUB_OWNER=tonyonier99
GITHUB_REPO=tonyonier99.github.io

# 安全性
SESSION_SECRET=your-very-secure-random-string

# 前端 URL
CLIENT_URL=https://yourdomain.com
```

### 3. GitHub OAuth 設定

1. 前往 [GitHub Developer Settings](https://github.com/settings/developers)
2. 建立新的 OAuth App
3. 設定：
   - Application name: "Tony's Blog Admin"
   - Homepage URL: https://yourdomain.com
   - Authorization callback URL: https://yourdomain.com/api/auth/github/callback
4. 複製 Client ID 和 Client Secret

### 4. GitHub Token 設定

1. 前往 [GitHub Personal Access Tokens](https://github.com/settings/tokens)
2. 建立新的 token
3. 選擇權限：
   - ✅ `repo` (Full control of private repositories)
4. 複製 token

### 5. 建置與啟動

```bash
# 建置前端
cd admin
npm run build

# 啟動伺服器
cd server
npm start
```

## 部署選項

### Vercel 部署

1. 將專案推送到 GitHub
2. 在 Vercel 匯入專案
3. 設定建置命令：
   ```
   cd admin && npm install && npm run build
   ```
4. 設定輸出目錄：`admin/dist`
5. 設定 Serverless Functions：在 `api/` 目錄建立 API 路由
6. 在 Vercel 設定環境變數

### Netlify 部署

1. 將專案推送到 GitHub
2. 在 Netlify 匯入專案
3. 設定建置設定：
   - Build command: `cd admin && npm install && npm run build`
   - Publish directory: `admin/dist`
4. 設定環境變數
5. 使用 Netlify Functions 處理後端

### 傳統 VPS 部署

```bash
# 安裝 PM2
npm install -g pm2

# 建置前端
cd admin
npm run build

# 複製建置檔案到伺服器靜態目錄
cp -r dist/* /var/www/html/

# 啟動後端服務
cd server
pm2 start index.js --name "blog-admin"

# 設定 Nginx 反向代理
# /etc/nginx/sites-available/blog-admin
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        try_files $uri $uri/ /index.html;
        root /var/www/html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 安全性檢查清單

- ✅ 使用強隨機字串作為 SESSION_SECRET
- ✅ 確保 GitHub Token 只有必要權限
- ✅ 在生產環境設定 NODE_ENV=production
- ✅ 使用 HTTPS
- ✅ 定期更新依賴套件
- ✅ 監控伺服器日誌

## 故障排除

### 認證問題
- 檢查 GitHub OAuth 設定
- 確認回調 URL 正確
- 驗證 Client ID 和 Secret

### API 錯誤
- 檢查 GitHub Token 權限
- 確認 repo 存在且可訪問
- 查看伺服器日誌

### 建置問題
- 清除 node_modules 重新安裝
- 檢查 Node.js 版本
- 確認環境變數設定