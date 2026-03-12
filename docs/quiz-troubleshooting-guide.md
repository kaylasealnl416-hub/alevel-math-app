# Quiz 功能故障排查指南

**日期**: 2026-03-12
**问题**: Quiz 功能无法生成练习题，即使已输入 Zhipu AI API Key

---

## 🔍 问题诊断步骤

### 1. 检查 API Key 是否正确保存

打开浏览器控制台（F12），在 Console 中输入：

```javascript
// 检查 Provider 设置
localStorage.getItem('alevel_math_provider')
// 应该返回: "zhipu"

// 检查 Zhipu API Key 是否保存
localStorage.getItem('alevel_math_zhipu_key')
// 应该返回你的 API Key（类似 "xxx.yyy" 格式）
```

### 2. 检查浏览器控制台错误

在 Quiz 页面点击"Generate 5 Questions"按钮后，查看控制台是否有以下错误：

**可能的错误类型**：

#### A. API Key 未保存
```
Error: NO_ZHIPU_API_KEY
```
**解决方案**: 重新输入 API Key 并保存

#### B. API Key 无效
```
Error: INVALID_ZHIPU_API_KEY
HTTP 401
```
**解决方案**: 检查 API Key 是否正确，是否过期

#### C. 网络错误
```
Failed to fetch
CORS error
```
**解决方案**: 检查网络连接，可能是防火墙或代理问题

#### D. API 响应格式错误
```
Error: 无法解析 AI 返回的数据
```
**解决方案**: Zhipu AI 返回的格式可能不符合预期

---

## 🛠️ 代码层面的问题

### 问题 1: Provider 选择逻辑

**位置**: `src/alevel-math-app.jsx:2179-2188`

```javascript
async function callAI(systemPrompt, userMessage, maxTokens = 1500) {
  const provider = getProvider();
  if (provider === "minimax") {
    return await callMiniMax(systemPrompt, userMessage, maxTokens);
  }
  if (provider === "zhipu") {
    return await callZhipu(systemPrompt, userMessage, maxTokens);
  }
  return await callClaude(systemPrompt, userMessage, maxTokens);
}
```

**检查点**:
- `getProvider()` 是否返回 "zhipu"
- 如果没有设置 provider，默认会调用 Claude（需要 Anthropic API Key）

### 问题 2: Zhipu API 调用

**位置**: `src/alevel-math-app.jsx:2150-2176`

```javascript
async function callZhipu(systemPrompt, userMessage, maxTokens = 1500) {
  const apiKey = getZhipuApiKey();
  if (!apiKey) throw new Error("NO_ZHIPU_API_KEY");

  const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "glm-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: maxTokens,
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (response.status === 401) throw new Error("INVALID_ZHIPU_API_KEY");
    throw new Error(err?.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}
```

**可能的问题**:
1. API Key 格式不正确
2. Zhipu API 端点变更
3. 请求参数不符合 Zhipu API 规范
4. CORS 跨域问题（浏览器直接调用 API）

---

## 🔧 快速修复方案

### 方案 1: 手动设置 Provider

在浏览器控制台执行：

```javascript
localStorage.setItem('alevel_math_provider', 'zhipu')
localStorage.setItem('alevel_math_zhipu_key', '你的API_KEY')
```

然后刷新页面，重新尝试生成题目。

### 方案 2: 检查 API Key 格式

Zhipu AI API Key 格式通常是：`{api_key}.{secret}`

确保你输入的是完整的 API Key，包含点号（`.`）。

### 方案 3: 测试 API 连接

在控制台执行以下代码测试 Zhipu API：

```javascript
async function testZhipuAPI() {
  const apiKey = localStorage.getItem('alevel_math_zhipu_key');

  const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "glm-4",
      messages: [
        { role: "user", content: "Hello, test message" }
      ],
      max_tokens: 100,
    })
  });

  console.log('Status:', response.status);
  const data = await response.json();
  console.log('Response:', data);
}

testZhipuAPI();
```

---

## 📋 完整排查清单

- [ ] 1. 确认已在设置中输入 Zhipu API Key
- [ ] 2. 确认 Provider 选择为 "Zhipu AI"
- [ ] 3. 检查浏览器控制台是否有错误
- [ ] 4. 验证 localStorage 中是否保存了正确的 API Key
- [ ] 5. 测试 API Key 是否有效（使用上面的测试代码）
- [ ] 6. 检查网络连接（是否能访问 open.bigmodel.cn）
- [ ] 7. 尝试清除缓存并刷新页面
- [ ] 8. 尝试使用其他浏览器测试

---

## 🐛 已知问题

### 问题 A: CORS 跨域限制

**症状**: 控制台显示 CORS 错误

**原因**: 浏览器直接调用 Zhipu API 可能受到 CORS 限制

**解决方案**:
1. 使用后端代理（推荐）
2. 使用浏览器扩展禁用 CORS（仅开发环境）

### 问题 B: API 响应格式不匹配

**症状**: 显示"无法解析 AI 返回的数据"

**原因**: Zhipu AI 返回的 JSON 格式可能包含 markdown 代码块

**解决方案**: 需要改进 `parseAIResponse` 函数

---

## 📞 需要进一步帮助？

如果以上步骤都无法解决问题，请提供以下信息：

1. 浏览器控制台的完整错误信息
2. `localStorage.getItem('alevel_math_provider')` 的返回值
3. `localStorage.getItem('alevel_math_zhipu_key')` 是否有值（不要泄露完整 Key）
4. 测试 API 连接的返回结果

---

**创建时间**: 2026-03-12 22:00
**最后更新**: 2026-03-12 22:00
