# 临时数据初始化 API 使用指南

## 📋 概述

由于 Railway Shell 不可用，我创建了一个临时的 HTTP API 端点来初始化测试数据。

## 🔗 API 端点

### 1. 初始化数据
```
GET https://alevel-math-app-production-6e22.up.railway.app/api/seed/init?key=init-data-2026
```

**功能**：创建测试用户、题目、试卷和考试记录

**安全措施**：需要提供密钥参数 `key=init-data-2026`

### 2. 检查数据状态
```
GET https://alevel-math-app-production-6e22.up.railway.app/api/seed/status
```

**功能**：查看当前数据库中的数据数量

---

## 🚀 使用步骤

### 步骤 1：等待部署完成
1. 代码已提交到本地 Git
2. **需要你手动推送**：`git push origin main`（网络连接问题）
3. 等待 Railway 自动部署（2-3 分钟）

### 步骤 2：检查当前数据状态
在浏览器中访问：
```
https://alevel-math-app-production-6e22.up.railway.app/api/seed/status
```

**预期响应**：
```json
{
  "success": true,
  "data": {
    "users": 16,
    "questions": 0,
    "questionSets": 0,
    "exams": 1
  }
}
```

### 步骤 3：初始化数据
在浏览器中访问：
```
https://alevel-math-app-production-6e22.up.railway.app/api/seed/init?key=init-data-2026
```

**预期响应**：
```json
{
  "success": true,
  "message": "测试数据初始化完成！",
  "data": {
    "users": 3,
    "questions": 3,
    "questionSets": 2,
    "exams": 1,
    "testAccounts": [
      { "email": "student1@test.com", "password": "test123" },
      { "email": "student2@test.com", "password": "test123" },
      { "email": "demo@alevel.com", "password": "test123" }
    ]
  }
}
```

### 步骤 4：验证数据已创建
再次访问 status 端点，确认数据已增加：
```
https://alevel-math-app-production-6e22.up.railway.app/api/seed/status
```

**预期响应**：
```json
{
  "success": true,
  "data": {
    "users": 19,
    "questions": 3,
    "questionSets": 2,
    "exams": 2
  }
}
```

---

## ⚠️ 可能的错误

### 错误 1：密钥错误
```json
{
  "success": false,
  "error": "无效的密钥"
}
```
**解决**：确保 URL 中包含 `?key=init-data-2026`

### 错误 2：没有章节数据
```json
{
  "success": false,
  "error": "数据库中没有章节数据，无法创建题目。请先导入科目和章节数据。"
}
```
**解决**：需要先导入科目和章节数据（告诉我，我会帮你处理）

### 错误 3：重复创建
如果多次访问 init 端点，可能会因为邮箱重复而失败。这是正常的，说明数据已经创建过了。

---

## 🧹 清理工作

**数据初始化完成后，应该删除这个临时 API**：

1. 删除文件：`backend/src/routes/seed.js`
2. 修改 `backend/src/index.js`，移除：
   ```javascript
   import seedRoutes from './routes/seed.js'
   app.route('/api/seed', seedRoutes)
   ```
3. 提交并推送

---

## 📝 测试账号

初始化后可用的测试账号：
- **Email**: student1@test.com | **Password**: test123
- **Email**: student2@test.com | **Password**: test123
- **Email**: demo@alevel.com | **Password**: test123

---

**创建时间**: 2026-03-11 14:00
**状态**: 等待推送和部署
