# API 接口文档 — A-Level Hub

> 最后更新：2026-04-17  
> 版本：v1.5.0  
> Base URL（生产）：`https://alevel-math-app.onrender.com`  
> Base URL（本地开发）：`http://localhost:4000`

---

## 通用约定

### 认证方式

所有受保护接口通过 **httpOnly Cookie** 携带身份信息：
- Cookie 名：`auth_token`（访问令牌，7天有效）
- Cookie 名：`refresh_token`（刷新令牌）

前端无需手动设置 Authorization 头，浏览器自动携带 Cookie（`credentials: 'include'`）。

### CSRF 保护

写操作（POST / PUT / DELETE）需在请求头附加：
```
X-CSRF-Token: <token>
```

Token 通过 `GET /api/csrf-token` 获取，前端 `apiClient.js` 自动管理。

### 响应格式

**成功：**
```json
{
  "success": true,
  "data": { ... }
}
```

**失败：**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "人类可读错误信息",
    "details": [...]   // 可选，验证错误详情
  }
}
```

> **前端注意**：`apiClient.get/post/put/del` 自动解包，返回 `data.data` 的值，调用方直接使用，不要再判断 `result.success`。

### 公共错误码

| HTTP 状态码 | error.code | 含义 |
|------------|-----------|------|
| 400 | `MISSING_PARAMETER` / `VALIDATION_ERROR` | 参数缺失或格式错误 |
| 401 | `UNAUTHORIZED` | 未登录或 Token 过期 |
| 403 | `FORBIDDEN` | 无权限访问 |
| 404 | `NOT_FOUND` | 资源不存在 |
| 409 | `EMAIL_EXISTS` | 邮箱已被注册 |
| 429 | `RATE_LIMIT_EXCEEDED` | 请求频率过高 |
| 500 | `SERVER_ERROR` | 服务器内部错误 |

---

## 目录

- [认证（/api/auth）](#认证-apiauth)
- [练习（/api/practice）](#练习-apipractice)
- [考试（/api/exams）](#考试-apiexams)
- [题集/试卷（/api/question-sets）](#题集试卷-apiquestion-sets)
- [错题本（/api/wrong-questions）](#错题本-apiwrong-questions)
- [学习进度（/api/progress）](#学习进度-apiprogress)
- [题库（/api/questions）](#题库-apiquestions)
- [学科/章节（/api/subjects、/api/chapters）](#学科章节-apisubjects-apichapters)
- [用户（/api/users）](#用户-apiusers)
- [学习计划（/api/learning-plans）](#学习计划-apilearning-plans)
- [其他](#其他)

---

## 认证 `/api/auth`

### POST `/api/auth/register` — 注册

**权限**：公开  
**速率限制**：3次 / 1小时

**请求体：**
```json
{
  "email": "student@example.com",
  "password": "mypassword",
  "nickname": "Alice",
  "grade": "AS"   // 可选，"AS" | "A2"，默认 "AS"
}
```

**成功响应（201）：**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "student@example.com",
      "nickname": "Alice",
      "role": "user",
      "grade": "AS",
      "createdAt": "2026-04-17T10:00:00.000Z"
    }
  }
}
```
登录态自动设置（httpOnly Cookie）。

---

### POST `/api/auth/login` — 登录

**权限**：公开  
**速率限制**：5次 / 15分钟

**请求体：**
```json
{
  "email": "student@example.com",
  "password": "mypassword"
}
```

**成功响应（200）：** 同 register，返回 user 对象并设置 Cookie。

---

### POST `/api/auth/logout` — 登出

**权限**：公开（清除 Cookie）

**成功响应（200）：**
```json
{ "success": true, "data": { "message": "登出成功" } }
```

---

### POST `/api/auth/refresh` — 刷新 Token

**权限**：公开（使用 refresh_token Cookie）

**成功响应（200）：** 更新 `auth_token` Cookie。

---

### GET `/api/auth/me` — 获取当前用户

**权限**：需登录

**成功响应（200）：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "student@example.com",
    "nickname": "Alice",
    "role": "user",
    "grade": "AS",
    "avatar": null
  }
}
```

---

### POST `/api/auth/google` — Google OAuth 登录

**权限**：公开

**请求体：**
```json
{
  "accessToken": "<google_access_token>",
  "grade": "AS"   // 新用户注册时使用
}
```

---

### GET `/api/csrf-token` — 获取 CSRF Token

**权限**：需登录

**成功响应（200）：**
```json
{
  "success": true,
  "data": { "csrfToken": "xxx..." }
}
```

---

## 练习 `/api/practice`

所有接口需登录 + CSRF。

### POST `/api/practice/start` — 开始练习轮次

**请求体：**
```json
{
  "chapterId": "p1c1",
  "difficulty": "medium",   // "easy" | "medium" | "hard"
  "count": 5,               // 1–20，默认 5
  "subject": "mathematics", // 学科 ID
  "chapterTitle": "Algebra and Functions",
  "chapterKeyPoints": ["..."],
  "chapterFormulas": ["..."]
}
```

**成功响应（200）：**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": 101,
        "type": "multiple_choice",
        "difficulty": 3,
        "content": { "en": "...", "zh": "..." },
        "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
        "tags": ["algebra"]
      }
    ],
    "roundSize": 5,
    "requested": 5,
    "insufficient": false
  }
}
```

---

### POST `/api/practice/answer` — 提交单题答案

**请求体：**
```json
{
  "questionId": 101,
  "answer": "A",
  "timeSpent": 45   // 秒
}
```

**成功响应（200）：**
```json
{
  "success": true,
  "data": {
    "isCorrect": true,        // null = 主观题（需人工审核）
    "needsReview": false,
    "questionType": "multiple_choice",
    "correctAnswer": "A",
    "solution": "Step 1: ...",
    "deepExplanation": "...",
    "keyFormula": "...",
    "commonMistake": "..."
  }
}
```

---

### POST `/api/practice/summary` — 获取轮次总结

**请求体：**
```json
{
  "chapterId": "p1c1",
  "results": [
    { "questionId": 101, "isCorrect": true, "answer": "A", "timeSpent": 45 }
  ]
}
```

**成功响应（200）：**
```json
{
  "success": true,
  "data": {
    "score": { "correct": 4, "total": 5, "percentage": 80 },
    "recommendations": [
      { "type": "chapter", "chapterId": "p1c2", "reason": "..." }
    ]
  }
}
```

---

## 考试 `/api/exams`

所有接口需登录 + CSRF（除 GET 类）。

### POST `/api/exams` — 创建考试

**请求体：**
```json
{
  "questionSetId": 5,
  "type": "chapter_test",   // "chapter_test"|"unit_test"|"mock_exam"|"diagnostic"
  "mode": "exam",           // "practice"|"exam"|"challenge"
  "timeLimit": 3600,        // 秒，可空
  "allowReview": true
}
```

**成功响应（200）：**
```json
{
  "success": true,
  "data": {
    "exam": { "id": 42, "status": "in_progress", ... },
    "questionSet": { ... },
    "questions": [...]
  }
}
```

---

### POST `/api/exams/quick-start` — 快速创建考试

从题库抽题 + 自动创建 questionSet + 创建考试一步完成。

**请求体：**
```json
{
  "chapterId": "p1c1",
  "questionCount": 10,
  "difficulty": "medium",
  "timeLimit": 1800,
  "subject": "mathematics"
}
```

---

### GET `/api/exams` — 获取考试列表

**Query 参数：**
- `status`：过滤状态（`in_progress` / `graded` / `abandoned`）
- `type`：过滤类型
- `limit`：默认 20
- `offset`：默认 0

**成功响应（200）：**
```json
{
  "success": true,
  "data": {
    "exams": [...],
    "total": 15,
    "limit": 20,
    "offset": 0
  }
}
```

---

### GET `/api/exams/:id` — 获取考试详情

**权限**：仅考试所有者

---

### PUT `/api/exams/:id/answers` — 自动保存答案

**请求体：**
```json
{
  "questionId": 101,
  "answer": "A"
}
```

---

### POST `/api/exams/:id/submit` — 提交考试

触发自动批改，状态变为 `graded`。

---

### GET `/api/exams/:id/result` — 获取考试结果

**成功响应（200）：**
```json
{
  "success": true,
  "data": {
    "exam": {
      "id": 42,
      "status": "graded",
      "totalScore": 72,
      "maxScore": 100,
      "correctCount": 8,
      "totalCount": 10
    },
    "questions": [...],
    "questionResults": [
      {
        "questionId": 101,
        "isCorrect": true,
        "score": 10,
        "aiFeedback": { "explanation": "..." }
      }
    ]
  }
}
```

---

### PUT `/api/exams/:id/mark` — 标记/取消标记题目

**请求体：**
```json
{ "questionId": 101, "marked": true }
```

---

### DELETE `/api/exams/:id` — 放弃考试（状态 in_progress）

---

### POST `/api/exams/:id/focus-lost` — 记录失焦事件（防作弊）

---

### GET `/api/exams/:id/check-timeout` — 检查超时状态

---

### POST `/api/exams/:id/analyze` — 生成 AI 综合分析

---

### GET `/api/exams/:id/feedback` — 获取 AI 考试反馈

---

## 题集/试卷 `/api/question-sets`

所有接口需登录 + CSRF。

### GET `/api/question-sets/mock-exams` — 获取所有公开模拟卷

> ⚠️ 静态路由，必须先于 `/:id` 注册

**成功响应（200）：**
```json
{
  "success": true,
  "data": [
    {
      "id": 28,
      "title": "WMA12/01 Mock Paper — May 2026",
      "totalQuestions": 10,
      "totalPoints": 75,
      "timeLimit": 5400
    }
  ]
}
```

---

### GET `/api/question-sets` — 获取用户的试卷列表

**Query 参数：**`chapterId`, `type`, `limit`, `offset`

---

### GET `/api/question-sets/:id` — 获取试卷详情（含题目）

**权限**：所有者 or userId=null（公开模拟卷）

---

### POST `/api/question-sets/compose` — 智能组卷

**请求体：**
```json
{
  "chapterId": "p1c1",
  "strategy": "difficulty",  // "random"|"difficulty"|"knowledge"|"ai_recommend"|"exam_style"
  "count": 10,
  "types": ["multiple_choice", "calculation"],
  "timeLimit": 3600
}
```

---

### DELETE `/api/question-sets/:id` — 删除试卷

---

## 错题本 `/api/wrong-questions`

所有接口需登录 + CSRF。

### GET `/api/wrong-questions` — 获取错题列表

**Query 参数：**
- `subject`：学科过滤（可选）
- `limit`：默认 50，最大 200

**成功响应（200）：**
```json
{
  "success": true,
  "data": {
    "wrongQuestions": [
      {
        "id": 201,
        "examId": 42,           // null 表示来自 Practice
        "questionId": 101,
        "userAnswer": { "value": "B" },
        "isCorrect": false,
        "isMastered": false,
        "question": { "id": 101, "type": "...", "content": {...} },
        "exam": { "id": 42, "type": "chapter_test" },
        "chapter": { "id": "p1c1", "title": {...} }
      }
    ],
    "stats": {
      "total": 15,
      "byDifficulty": { "3": 8, "4": 7 },
      "byChapter": { "Algebra": 5, "Calculus": 10 }
    }
  }
}
```

---

### POST `/api/wrong-questions` — 记录错题

**权限**：需登录（Practice 错题通过此接口写入）

**请求体：**
```json
{
  "questionId": 101,
  "userAnswer": { "value": "B" },
  "examId": null   // 可选，Practice 时为 null
}
```

**成功响应（200）：**
```json
{
  "success": true,
  "data": { "id": 201, "recorded": true }
}
// 或者（重复时）：
{
  "success": true,
  "data": { "message": "该错题已存在", "duplicate": true }
}
// 或者（题目不在题库）：
{
  "success": true,
  "data": { "message": "题目不在题库中，跳过记录", "skipped": true }
}
```

---

### POST `/api/wrong-questions/:id/master` — 标记掌握状态

**请求体：**
```json
{ "mastered": true }   // false = 取消掌握
```

---

### GET `/api/wrong-questions/stats` — 获取错题统计

**成功响应（200）：**
```json
{
  "success": true,
  "data": {
    "totalWrong": 15,
    "recentTrend": [
      { "date": "2026-04-17", "count": 3 }
    ]
  }
}
```

---

## 学习进度 `/api/progress`

所有接口需登录 + CSRF。

### POST `/api/progress` — 写入/更新学习进度

**请求体：**
```json
{
  "chapterId": "p1c1",
  "status": "completed",       // "not_started"|"in_progress"|"completed"
  "masteryLevel": 85,          // 0–100
  "timeSpent": 1800            // 秒
}
```

---

### GET `/api/progress/:userId` — 获取用户全部进度

**权限**：只能访问自己的数据

---

### GET `/api/progress/:userId/chapter/:chapterId` — 获取单章节进度

---

### GET `/api/progress/:userId/stats` — 获取学习统计

**成功响应（200）：**
```json
{
  "success": true,
  "data": {
    "totalStudyTime": 36000,
    "totalChaptersCompleted": 12,
    "currentStreak": 7,
    "progressByStatus": {
      "not_started": 35,
      "in_progress": 8,
      "completed": 12
    }
  }
}
```

---

## 题库 `/api/questions`

### GET `/api/questions` — 查询题目列表

**Query 参数：**
- `chapterId`：章节 ID
- `type`：题型
- `difficulty`：1–5
- `status`：`published` / `draft`
- `limit`：默认 20

---

### GET `/api/questions/:id` — 获取题目详情

---

### POST `/api/questions/upload` — 上传文档（管理员）

`multipart/form-data`，字段：`file`（PDF/DOCX）, `chapterId`

---

### GET `/api/questions/upload/:id/status` — 查询上传处理状态

---

### GET `/api/questions/upload/:id/result` — 获取提取题目结果

---

## 学科/章节 `/api/subjects`、`/api/chapters`

### GET `/api/subjects` — 获取所有学科（10 分钟缓存）

---

### GET `/api/subjects/:id` — 获取学科详情（含单元和章节）

---

### GET `/api/chapters` — 获取章节列表

**Query 参数：**`subjectId`, `unitId`

---

### GET `/api/chapters/:id` — 获取章节详情

---

## 用户 `/api/users`

所有接口需登录 + CSRF。

### GET `/api/users/:id` — 获取用户信息

**权限**：只能访问自己的数据

---

### PUT `/api/users/:id` — 更新用户信息

**请求体（部分更新）：**
```json
{
  "nickname": "新昵称",
  "grade": "A2",
  "targetUniversity": "UCL"
}
```

---

### GET `/api/users/:id/profile` — 获取用户画像

---

### PUT `/api/users/:id/profile` — 更新用户画像

---

### GET `/api/users/:id/stats` — 获取用户学习统计

---

## 学习计划 `/api/learning-plans`

所有接口需登录 + CSRF。

### POST `/api/learning-plans` — 生成学习计划

**请求体：**
```json
{
  "targetExamDate": "2026-05-15",
  "weeklyHours": 10,
  "focusSubjects": ["mathematics"]
}
```

---

### GET `/api/learning-plans` — 获取当前学习计划

---

## 其他

### GET `/health` — 健康检查（无需认证）

```json
{
  "status": "ok",
  "timestamp": "2026-04-17T10:00:00.000Z",
  "version": "1.0.0",
  "uptime": 3600
}
```

---

### GET `/api/question-sets/strategies` — 获取组卷策略列表

---

## 附录：接口权限矩阵

| 路由 | 公开 | 需登录 | 仅 Admin |
|------|------|--------|---------|
| POST /api/auth/register | ✅ | — | — |
| POST /api/auth/login | ✅ | — | — |
| GET /api/subjects/* | ✅ | — | — |
| GET /api/chapters/* | ✅ | — | — |
| GET /health | ✅ | — | — |
| POST /api/practice/* | — | ✅ | — |
| POST /api/exams | — | ✅ | — |
| GET /api/exams/:id | — | ✅ | — |
| GET /api/wrong-questions | — | ✅ | — |
| POST /api/progress | — | ✅ | — |
| POST /api/questions/upload | — | — | ✅ |
