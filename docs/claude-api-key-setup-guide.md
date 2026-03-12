# Claude API Key 配置指南

**日期**: 2026-03-12

---

## 📋 如何获取 Claude API Key

### 步骤 1: 访问 Anthropic Console
访问：https://console.anthropic.com/settings/keys

### 步骤 2: 登录或注册
- 如果没有账号，点击 "Sign Up" 注册
- 如果已有账号，直接登录

### 步骤 3: 创建 API Key
1. 在左侧菜单点击 "API Keys"
2. 点击 "Create Key" 按钮
3. 给 Key 起一个名字（例如：A-Level Math App）
4. 点击 "Create Key"

### 步骤 4: 复制 API Key
- API Key 格式：`sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **重要**：API Key 只显示一次，请立即复制保存！

---

## 🔧 配置 API Key

### 本地开发环境

编辑 `backend/.env` 文件：

```env
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

**注意**：
- 替换 `your-actual-key-here` 为你的真实 API Key
- 不要提交 `.env` 文件到 Git（已在 `.gitignore` 中）

### Railway 生产环境

1. 打开 Railway 项目：https://railway.app
2. 选择你的项目
3. 点击 "Variables" 标签
4. 点击 "New Variable"
5. 添加：
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: `sk-ant-api03-your-actual-key-here`
6. 点击 "Add" 保存
7. Railway 会自动重新部署

---

## ✅ 验证配置

### 本地测试

```bash
# 启动后端服务器
cd backend
bun run dev

# 在另一个终端测试 API
curl -X POST http://localhost:4000/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "mathematics",
    "book": "P1",
    "chapterTitle": "Algebraic Expressions",
    "difficulty": "medium",
    "count": 5
  }'
```

### 检查日志

如果配置正确，你应该看到：
- ✅ 服务器启动成功
- ✅ API 返回生成的题目

如果配置错误，你会看到：
- ❌ `ANTHROPIC_API_KEY 未配置`
- ❌ `401 Unauthorized`（API Key 无效）

---

## 🔒 安全最佳实践

### ✅ 应该做的
- ✅ 将 API Key 存储在环境变量中
- ✅ 使用 `.gitignore` 忽略 `.env` 文件
- ✅ 定期轮换 API Key
- ✅ 为不同环境使用不同的 API Key

### ❌ 不应该做的
- ❌ 不要将 API Key 硬编码在代码中
- ❌ 不要提交 API Key 到 Git
- ❌ 不要在前端暴露 API Key
- ❌ 不要在公开的地方分享 API Key

---

## 💰 费用说明

### Claude API 定价（2026年）
- **Claude Sonnet 4**: ~$3 / 1M input tokens, ~$15 / 1M output tokens
- **免费额度**: 新用户通常有 $5 免费额度

### 估算使用量
- 每次生成 5 道题目：约 2000 tokens（输入）+ 1500 tokens（输出）
- 成本：约 $0.03 / 次
- $5 免费额度可生成：约 150-200 次

### 监控使用量
访问：https://console.anthropic.com/settings/usage

---

## 🐛 常见问题

### Q1: API Key 无效
**错误**: `401 Unauthorized`

**解决方案**:
1. 检查 API Key 格式是否正确（应以 `sk-ant-api03-` 开头）
2. 确认 API Key 没有过期
3. 在 Anthropic Console 重新生成新的 Key

### Q2: API Key 未配置
**错误**: `ANTHROPIC_API_KEY 未配置`

**解决方案**:
1. 检查 `.env` 文件是否存在
2. 确认环境变量名称正确（`ANTHROPIC_API_KEY`）
3. 重启后端服务器

### Q3: 超出配额
**错误**: `429 Too Many Requests` 或 `Insufficient credits`

**解决方案**:
1. 检查 Anthropic Console 的使用量
2. 添加付款方式或购买更多额度
3. 优化 API 调用频率

---

## 📞 获取帮助

- **Anthropic 文档**: https://docs.anthropic.com
- **API 参考**: https://docs.anthropic.com/claude/reference
- **支持**: support@anthropic.com

---

**最后更新**: 2026-03-12
