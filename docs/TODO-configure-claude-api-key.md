# 待办事项：配置 Claude API Key

**创建时间**: 2026-03-12 23:30
**优先级**: 🔴 高（Quiz 功能需要）

---

## 📋 任务清单

### ⏳ 待完成

#### 1. 获取 Claude API Key
- [ ] 访问 https://console.anthropic.com/settings/keys
- [ ] 登录或注册 Anthropic 账号
- [ ] 点击 "Create Key" 创建新的 API Key
- [ ] 复制 API Key（格式：`sk-ant-api03-...`，约 108 字符）

#### 2. 配置本地开发环境
- [ ] 打开 `backend/.env` 文件
- [ ] 找到 `ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here`
- [ ] 替换为真实的 API Key
- [ ] 保存文件

#### 3. 配置 Railway 生产环境
- [ ] 访问 Railway 项目：https://railway.app
- [ ] 选择 alevel-math-app 项目
- [ ] 点击 "Variables" 标签
- [ ] 添加新变量：
  - Name: `ANTHROPIC_API_KEY`
  - Value: `sk-ant-api03-...`（你的真实 Key）
- [ ] 保存并等待自动重新部署

#### 4. 测试 Quiz 功能
- [ ] 启动本地后端：`cd backend && bun run dev`
- [ ] 启动本地前端：`bun run dev`
- [ ] 登录应用
- [ ] 进入任意科目的 Quiz 页面
- [ ] 点击 "Generate 5 Questions"
- [ ] 确认题目正常生成

---

## 📚 参考文档

- **配置指南**: `docs/claude-api-key-setup-guide.md`
- **迁移总结**: `docs/ai-migration-summary-2026-03-12.md`
- **故障排查**: `docs/quiz-troubleshooting-guide.md`

---

## 💰 费用说明

- **免费额度**: 新用户通常有 $5 免费额度
- **使用成本**: 约 $0.03 / 次生成（5 道题）
- **免费次数**: 约 150-200 次生成
- **监控使用**: https://console.anthropic.com/settings/usage

---

## 🔒 安全提醒

- ✅ API Key 存储在环境变量中（安全）
- ✅ `.env` 文件已在 `.gitignore` 中（不会提交到 Git）
- ❌ 不要在代码中硬编码 API Key
- ❌ 不要分享 API Key 给他人

---

## ✅ 完成后

配置完成后，Quiz 功能将：
- ✅ 通过后端 API 调用 Claude
- ✅ 生成高质量的 A-Level 考试题目
- ✅ 支持所有科目（Mathematics, Economics, History, Politics, Psychology, Further Math）
- ✅ 安全地管理 API Key（不暴露给前端）

---

**下次对话时，请告诉我你已经配置好 API Key，我们就可以测试 Quiz 功能了！** 🎉
