# AI 提供商配置指南

本项目支持多个 AI 提供商，可以灵活切换。

## 支持的 AI 提供商

### 1. Anthropic Claude
- **模型**：Claude Sonnet 4.6, Claude Opus 4.6
- **优势**：强大的推理能力，适合复杂的教学场景
- **成本**：Sonnet 4.6: $3/1M input tokens, $15/1M output tokens

### 2. 智谱 AI (GLM)
- **模型**：GLM-4, GLM-4-Plus, GLM-4-Flash
- **优势**：中文理解能力强，成本较低
- **成本**：GLM-4-Plus: ¥0.05/1K tokens (约 $0.007/1K tokens)

---

## 配置步骤

### 方式 1：使用智谱 AI（推荐用于中文教学）

1. **获取 API Key**
   - 访问：https://open.bigmodel.cn/
   - 注册账号并创建 API Key

2. **配置环境变量**

   编辑 `backend/.env` 文件：
   ```env
   # 设置 AI 提供商为 glm
   AI_PROVIDER=glm

   # 配置智谱 AI API Key
   GLM_API_KEY=your-actual-api-key-here
   GLM_MODEL=glm-4-plus
   GLM_MAX_TOKENS=4096
   GLM_TEMPERATURE=0.7
   ```

3. **重启后端服务**
   ```bash
   cd backend
   bun run dev
   ```

### 方式 2：使用 Anthropic Claude

1. **获取 API Key**
   - 访问：https://console.anthropic.com/
   - 注册账号并创建 API Key

2. **配置环境变量**

   编辑 `backend/.env` 文件：
   ```env
   # 设置 AI 提供商为 claude
   AI_PROVIDER=claude

   # 配置 Claude API Key
   ANTHROPIC_API_KEY=sk-ant-xxxxx
   CLAUDE_MODEL=claude-sonnet-4-20250514
   CLAUDE_MAX_TOKENS=4096
   CLAUDE_TEMPERATURE=0.7
   ```

3. **重启后端服务**
   ```bash
   cd backend
   bun run dev
   ```

---

## 模型选择建议

### 智谱 AI 模型对比

| 模型 | 特点 | 适用场景 | 成本 |
|------|------|---------|------|
| **glm-4-plus** | 最强性能 | 复杂推理、深度教学 | ¥0.05/1K tokens |
| **glm-4** | 平衡性能 | 日常对话、基础教学 | ¥0.03/1K tokens |
| **glm-4-flash** | 快速响应 | 简单问答、快速反馈 | ¥0.001/1K tokens |

### Claude 模型对比

| 模型 | 特点 | 适用场景 | 成本 |
|------|------|---------|------|
| **claude-opus-4-6** | 最强推理 | 复杂问题、深度分析 | $15/$75 per 1M tokens |
| **claude-sonnet-4-6** | 平衡性能 | 日常教学、对话 | $3/$15 per 1M tokens |
| **claude-haiku-4-5** | 快速响应 | 简单问答 | $0.25/$1.25 per 1M tokens |

---

## 测试 AI 功能

### 1. 检查配置

```bash
# 查看当前配置的 AI 提供商
curl http://localhost:4000/api/chat/provider
```

### 2. 测试对话

```bash
# 创建会话
curl -X POST http://localhost:4000/api/chat/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "userId": 1,
    "chapterId": "e1c1",
    "title": "测试 AI 对话",
    "sessionType": "learning"
  }'

# 发送消息
curl -X POST http://localhost:4000/api/chat/messages/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "sessionId": 1,
    "message": "什么是供需平衡？",
    "context": {"subject": "经济学"}
  }'
```

---

## 常见问题

### Q1: 如何切换 AI 提供商？

只需修改 `backend/.env` 中的 `AI_PROVIDER` 变量，然后重启服务：
```env
AI_PROVIDER=glm    # 使用智谱 AI
# 或
AI_PROVIDER=claude # 使用 Claude
```

### Q2: 可以同时配置多个提供商吗？

可以！你可以同时配置多个 API Key，通过修改 `AI_PROVIDER` 随时切换。

### Q3: 智谱 AI 的 API Key 在哪里获取？

1. 访问 https://open.bigmodel.cn/
2. 注册并登录
3. 进入"API Keys"页面
4. 点击"创建新的 API Key"
5. 复制生成的 Key

### Q4: 如何查看 API 调用日志？

后端服务会在控制台输出日志：
```
使用 AI 提供商: 智谱 AI (GLM) (glm-4-plus)
```

### Q5: 成本如何控制？

1. **使用智谱 AI**：成本比 Claude 低约 10-20 倍
2. **选择合适的模型**：日常教学使用 glm-4 或 glm-4-flash
3. **限制 max_tokens**：减少单次响应的最大长度
4. **实现缓存**：对常见问题使用缓存

---

## 性能对比

基于实际测试（中文教学场景）：

| 指标 | Claude Sonnet 4.6 | GLM-4-Plus | GLM-4 |
|------|------------------|------------|-------|
| 响应速度 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 中文理解 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 推理能力 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 成本效益 | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**推荐配置**：
- **开发测试**：GLM-4-Flash（成本极低）
- **生产环境**：GLM-4-Plus（性能与成本平衡）
- **高端用户**：Claude Sonnet 4.6（最强性能）

---

## 技术实现

项目使用适配器模式，统一了不同 AI 提供商的接口：

```javascript
// 自动根据配置选择提供商
import { callAI } from './services/aiClient.js'

const response = await callAI(messages, {
  system: systemPrompt,
  temperature: 0.7
})
```

所有 AI 提供商返回统一的响应格式：
```javascript
{
  content: "AI 回复内容",
  usage: {
    inputTokens: 100,
    outputTokens: 200,
    totalTokens: 300
  },
  model: "glm-4-plus",
  stopReason: "stop"
}
```

---

**更新时间**：2026-03-08
**版本**：v1.0
