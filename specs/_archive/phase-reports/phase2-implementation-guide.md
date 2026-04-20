# Phase 2 实施指南

**创建时间**：2026-03-07
**状态**：✅ 代码审查完成，待测试

---

## 📋 已完成的工作

### 1. 后端实现 ✅

#### 数据库表结构
- ✅ `chat_sessions` - 会话表
- ✅ `chat_messages` - 消息表
- ✅ `chat_contexts` - 上下文表
- ✅ `user_knowledge_graph` - 用户知识图谱表

#### API 路由
- ✅ `/api/chat/sessions` - 会话管理（创建、查询、更新、删除）
- ✅ `/api/chat/messages/send` - 发送消息并获取 AI 回复
- ✅ `/api/chat/sessions/:id/messages` - 获取消息历史

#### 核心服务
- ✅ `claudeClient.js` - Claude API 客户端
- ✅ `promptBuilder.js` - Prompt 构建器（苏格拉底式教学）
- ✅ `contextManager.js` - 上下文管理器

### 2. 前端实现 ✅

#### 核心组件
- ✅ `ChatPage.jsx` - 主聊天页面
- ✅ `MessageList.jsx` - 消息列表
- ✅ `InputBox.jsx` - 输入框（支持 LaTeX）
- ✅ `SessionSidebar.jsx` - 会话列表侧边栏
- ✅ `ContextPanel.jsx` - 上下文面板
- ✅ `UserMessage.jsx` - 用户消息组件
- ✅ `AssistantMessage.jsx` - AI 消息组件
- ✅ `MessageContent.jsx` - 消息内容渲染（Markdown + LaTeX）

#### 自定义 Hook
- ✅ `useChat.js` - 聊天功能 Hook

#### API 客户端
- ✅ `api.js` - 完整的 `chatAPI` 实现

### 3. 代码审查修复 ✅

- ✅ 修复数据库迁移文件中的 `relevance_score` 字段类型（integer → real）
- ✅ 修复 API 路由配置（避免路径冲突）
- ✅ 修复 `contextManager.js` 缺失的 `desc` 导入
- ✅ 补全 `api.js` 中的 `chatAPI` 实现
- ✅ 创建环境变量配置示例文件

---

## 🚀 启动步骤

### 1. 环境配置

#### 后端环境变量

创建 `backend/.env` 文件：

```bash
# 复制示例文件
cp backend/.env.example backend/.env
```

编辑 `backend/.env`，配置以下关键变量：

```env
# 数据库连接（Supabase）
DATABASE_URL=postgresql://user:password@host:5432/database

# Anthropic Claude API Key（必需）
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Claude 模型配置
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_MAX_TOKENS=4096
CLAUDE_TEMPERATURE=0.7

# 服务器端口
PORT=4000
```

#### 前端环境变量

创建 `.env.local` 文件：

```bash
# 复制示例文件
cp .env.example .env.local
```

编辑 `.env.local`：

```env
# 后端 API 地址
VITE_API_URL=http://localhost:4000

# 启用后端 API
VITE_USE_API=true
```

### 2. 数据库迁移

```bash
cd backend

# 推送数据库 Schema
bun run db:push

# 或者运行迁移
bun run db:migrate
```

### 3. 启动服务

#### 启动后端

```bash
cd backend
bun install
bun run dev
```

后端将在 `http://localhost:4000` 启动。

#### 启动前端

```bash
# 在项目根目录
bun install
bun run dev
```

前端将在 `http://localhost:3000` 启动。

---

## 🧪 测试

### 方式 1：使用测试页面

访问测试页面：

```
http://localhost:3000?test=phase2
```

或者在主应用中添加路由逻辑来显示 `Phase2TestPage` 组件。

测试页面功能：
- ✅ 自动化 API 测试
- ✅ 环境检查
- ✅ 集成聊天界面预览

### 方式 2：直接访问聊天页面

在主应用中切换到 `chat` 视图（需要在主应用中添加导航按钮）。

### 方式 3：手动 API 测试

使用 curl 或 Postman 测试 API：

```bash
# 1. 创建会话
curl -X POST http://localhost:4000/api/chat/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "chapterId": "e1c1",
    "title": "学习供需理论",
    "sessionType": "learning"
  }'

# 2. 发送消息
curl -X POST http://localhost:4000/api/chat/messages/send \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": 1,
    "message": "什么是供需平衡？",
    "context": { "subject": "经济学" }
  }'

# 3. 获取消息历史
curl http://localhost:4000/api/chat/sessions/1/messages?limit=50
```

---

## 📊 功能清单

### 已实现功能

- ✅ 会话管理（创建、查询、更新、归档、删除）
- ✅ 消息发送与接收
- ✅ AI 回复（Claude API 集成）
- ✅ 苏格拉底式教学 Prompt
- ✅ 上下文管理（章节信息、知识图谱、学习进度）
- ✅ 消息历史查询
- ✅ LaTeX 数学公式支持
- ✅ Markdown 渲染
- ✅ 会话列表侧边栏
- ✅ 上下文面板
- ✅ 响应式 UI 设计

### 待实现功能（Week 2-3）

- ⏳ 流式响应（Server-Sent Events）
- ⏳ 消息加载状态优化
- ⏳ 错误重试机制
- ⏳ 离线消息缓存
- ⏳ 会话搜索功能
- ⏳ 导出对话功能
- ⏳ 知识点关联推荐
- ⏳ 学习路径建议

---

## ⚠️ 注意事项

### 1. API Key 安全

- ❌ **不要**将 `ANTHROPIC_API_KEY` 提交到 Git
- ✅ 确保 `.env` 文件在 `.gitignore` 中
- ✅ 使用环境变量管理敏感信息

### 2. 成本控制

Claude API 调用成本：
- Sonnet 4.6: $3 / 1M input tokens, $15 / 1M output tokens
- Opus 4.6: $15 / 1M input tokens, $75 / 1M output tokens

建议：
- 开发阶段使用 Sonnet 4.6
- 限制每日 API 调用次数
- 实现缓存机制

### 3. 数据库连接

确保 Supabase 数据库连接正常：

```bash
# 测试数据库连接
cd backend
bun run db:studio
```

### 4. CORS 配置

如果遇到 CORS 错误，检查后端 `index.js` 中的 CORS 配置：

```javascript
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app'],
  credentials: true,
}))
```

---

## 🐛 常见问题

### 1. API 调用失败

**错误**：`ANTHROPIC_API_KEY 未配置`

**解决**：
- 检查 `backend/.env` 文件是否存在
- 确认 `ANTHROPIC_API_KEY` 已正确配置
- 重启后端服务

### 2. 数据库连接失败

**错误**：`Connection refused`

**解决**：
- 检查 `DATABASE_URL` 是否正确
- 确认 Supabase 项目是否正常运行
- 检查网络连接

### 3. 前端无法连接后端

**错误**：`Failed to fetch`

**解决**：
- 确认后端服务已启动（`http://localhost:4000/health`）
- 检查 `VITE_API_URL` 配置
- 检查浏览器控制台的 CORS 错误

### 4. LaTeX 渲染失败

**错误**：公式显示为纯文本

**解决**：
- 确认 KaTeX CSS 已加载
- 检查公式语法是否正确
- 查看浏览器控制台错误

---

## 📝 下一步计划

### Week 2：前端优化（5天）

- [ ] 实现流式响应
- [ ] 优化加载状态
- [ ] 添加错误重试
- [ ] 实现消息编辑/删除
- [ ] 添加会话搜索

### Week 3：集成与测试（5天）

- [ ] 与用户系统深度集成
- [ ] 知识图谱更新逻辑
- [ ] 单元测试
- [ ] 集成测试
- [ ] 用户测试

---

## 📞 联系方式

如有问题，请查看：
- **项目文档**：`./specs/`
- **Phase 2 设计方案**：`./specs/phase2-design-plan.md`
- **快速参考**：`./specs/quick-reference.md`

---

**生成时间**：2026-03-07
**版本**：Phase 2 v0.1（代码审查完成）
