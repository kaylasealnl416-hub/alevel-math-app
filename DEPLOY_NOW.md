# 🚀 Railway 部署 - 超简化版（3分钟）

**所有配置已准备好，只需复制粘贴！**

---

## 📋 准备信息（已为你准备好）

### 环境变量（复制这段）
```
DATABASE_URL=postgresql://postgres.mozzqjeusrjuxycwpyld:MySecure%40Pass2026@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
NODE_ENV=production
JWT_SECRET=db4e6e64e16dcd80bee82ec4bdc4f6c63ab246df79436f9015d1ac0cfdfe3711
FRONTEND_URL=https://alevel-math-app.vercel.app
```

### GitHub 仓库
- 仓库地址：`kaylasealnl416-hub/alevel-math-app`
- 后端目录：`backend`

---

## 🎯 操作步骤

### 1️⃣ 打开 Railway（30秒）
1. 访问：https://railway.app
2. 点击 **"Login with GitHub"**
3. 授权 Railway 访问你的 GitHub

### 2️⃣ 创建项目（30秒）
1. 点击 **"New Project"**
2. 选择 **"Deploy from GitHub repo"**
3. 找到并选择：**`alevel-math-app`**
4. Railway 开始自动部署（先不管，继续下一步）

### 3️⃣ 配置根目录（30秒）
1. 点击你的服务（Service 卡片）
2. 点击 **"Settings"** 标签
3. 找到 **"Root Directory"**
4. 输入：`backend`
5. 点击右侧的 ✅ 保存

### 4️⃣ 添加环境变量（1分钟）
1. 点击 **"Variables"** 标签
2. 点击 **"RAW Editor"** 按钮（右上角）
3. **复制上面的环境变量，粘贴进去**
4. 点击 **"Update Variables"**
5. Railway 会自动重新部署

### 5️⃣ 生成域名（30秒）
1. 等待部署完成（看到绿色 ✅）
2. 点击 **"Settings"** 标签
3. 滚动到 **"Domains"** 部分
4. 点击 **"Generate Domain"**
5. **复制生成的 URL**

---

## ✅ 测试

在浏览器打开：
```
https://你的URL/health
```

应该看到：
```json
{"status":"ok","timestamp":"..."}
```

---

## 📞 完成后

**把 Railway 生成的 URL 发给我**，我会自动完成：
- ✅ 更新前端环境变量
- ✅ 重新部署前端
- ✅ 运行完整测试

---

## 🆘 遇到问题？

### 部署失败
- 查看 **"Deployments"** 标签的日志
- 确认 Root Directory = `backend`

### 数据库连接失败
- 检查 `DATABASE_URL` 是否完整复制
- 确认没有多余的空格或换行

### 404 错误
- 等待部署完全完成（约2分钟）
- 刷新页面重试

---

**开始吧！** 🎉

打开 https://railway.app 开始部署！
