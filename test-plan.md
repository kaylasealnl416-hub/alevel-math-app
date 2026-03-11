# A-Level Math App 测试计划

## 📋 测试工具栈

### 前端测试
- **Vitest** - 单元测试和集成测试（已安装）
- **jsdom** - DOM 环境模拟（已安装）
- **React Testing Library** - 组件测试（需安装）

### 后端测试
- **Bun Test** - 内置测试运行器
- **Supertest** - API 端点测试（需安装）

### E2E 测试
- **Playwright** - 端到端测试（可选）

---

## 🎯 测试优先级

### Phase 1: API 集成测试（高优先级）
测试后端 API 端点的功能和数据流

**测试文件**: `backend/tests/api/`
- `auth.test.js` - 注册、登录、token 验证
- `exams.test.js` - 考试 CRUD 操作
- `questions.test.js` - 题目管理
- `grading.test.js` - 自动批改功能

### Phase 2: 前端组件测试（中优先级）
测试 React 组件的渲染和交互

**测试文件**: `src/__tests__/`
- `ExamListPage.test.jsx` - 考试列表页面
- `ExamTakePage.test.jsx` - 答题页面
- `ExamResultPage.test.jsx` - 结果页面
- `api.test.js` - API 工具函数

### Phase 3: E2E 测试（低优先级）
测试完整的用户流程

**测试场景**:
- 用户注册 → 登录 → 创建考试 → 答题 → 查看结果

---

## 🚀 快速开始

### 1. 安装测试依赖

```bash
# 前端测试依赖
npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom

# 后端测试依赖
cd backend
bun add -d supertest
```

### 2. 运行测试

```bash
# 前端测试
npm run test              # 运行一次
npm run test:watch        # 监听模式

# 后端测试
cd backend
bun test                  # 运行所有测试
bun test auth.test.js     # 运行单个文件
```

---

## 📝 测试示例

### API 测试示例 (backend/tests/api/auth.test.js)

```javascript
import { describe, test, expect, beforeAll, afterAll } from 'bun:test'
import app from '../../src/index.js'

describe('Auth API', () => {
  test('POST /api/auth/register - 成功注册', async () => {
    const res = await app.request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test123!',
        name: 'Test User'
      })
    })

    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.data.token).toBeDefined()
  })

  test('POST /api/auth/login - 成功登录', async () => {
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test123!'
      })
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.data.token).toBeDefined()
  })
})
```

### 组件测试示例 (src/__tests__/ExamListPage.test.jsx)

```javascript
import { describe, test, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ExamListPage from '../components/ExamListPage'

// Mock fetch
global.fetch = vi.fn()

describe('ExamListPage', () => {
  test('显示考试列表', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          exams: [
            { id: 1, type: 'chapter_test', status: 'graded', totalScore: 80 }
          ],
          total: 1
        }
      })
    })

    render(
      <BrowserRouter>
        <ExamListPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/chapter_test/i)).toBeInTheDocument()
    })
  })
})
```

---

## ✅ 测试检查清单

### 后端 API 测试
- [ ] 用户注册（成功、失败、验证错误）
- [ ] 用户登录（成功、失败、token 生成）
- [ ] 获取考试列表（分页、过滤、排序）
- [ ] 创建考试（成功、验证错误）
- [ ] 提交答案（成功、超时处理）
- [ ] 自动批改（正确率计算、统计生成）
- [ ] AI 反馈生成

### 前端组件测试
- [ ] 考试列表渲染
- [ ] 考试详情加载
- [ ] 答题交互（选择答案、标记题目）
- [ ] 倒计时功能
- [ ] 提交确认对话框
- [ ] 结果页面展示

### 集成测试
- [ ] 完整的考试流程（创建 → 答题 → 提交 → 查看结果）
- [ ] 认证流程（注册 → 登录 → 访问受保护路由）
- [ ] 错误处理（网络错误、API 错误）

---

## 🎯 当前建议

**立即执行**:
1. 创建 `backend/tests/api/exams.test.js` 测试考试 API
2. 测试当前的 Mock 认证流程
3. 验证 CORS 配置是否正确

**短期目标**:
- 为所有 API 端点添加测试
- 测试覆盖率达到 60%+

**长期目标**:
- 添加 E2E 测试
- 测试覆盖率达到 80%+
- CI/CD 集成自动测试
