# Railway 快速部署指南（5分钟）

**所有配置已准备好，只需复制粘贴！**

---

## 🚀 第一步：创建项目（2分钟）

1. 打开 https://railway.app
2. 点击 **"Login with GitHub"**
3. 点击 **"New Project"**
4. 选择 **"Deploy from GitHub repo"**
5. 选择仓库：**`alevel-math-app`**
6. Railway 会自动开始部署

---

## ⚙️ 第二步：配置（2分钟）

### 2.1 设置根目录

1. 点击你的服务（Service）
2. 点击 **"Settings"** 标签
3. 找到 **"Root Directory"**
4. 输入：`backend`
5. 点击 **"Save"**

### 2.2 添加环境变量

1. 点击 **"Variables"** 标签
2. 点击 **"RAW Editor"**（更快）
3. **复制下面的内容，粘贴进去**：

```bash
DATABASE_URL=postgresql://postgres.mozzqjeusrjuxycwpyld:MySecure%40Pass2026@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
NODE_ENV=production
JWT_SECRET=db4e6e64e16dcd80bee82ec4bdc4f6c63ab246df79436f9015d1ac0cfdfe3711
FRONTEND_URL=https://alevel-math-app.vercel.app
```

4. 点击 **"Update Variables"**
5. Railway 会自动重新部署

---

## 🌐 第三步：获取 URL（1分钟）

1. 等待部署完成（约1-2分钟）
2. 点击 **"Settings"** 标签
3. 找到 **"Domains"** 部分
4. 点击 **"Generate Domain"**
5. **复制生成的 URL**（例如：`https://alevel-backend-production-xxxx.up.railway.app`）

---

## ✅ 第四步：测试

在浏览器打开：
```
https://你的URL/health
```

应该看到：
```json
{"status":"ok","timestamp":"2026-03-07T..."}
```

---

## 📋 完成后告诉我

把 Railway 生成的 URL 告诉我，我会：
1. 自动更新前端配置
2. 重新部署前端
3. 运行完整测试

---

**就这么简单！** 🎉
