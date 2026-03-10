# API 文档

## 基础信息

- **Base URL**: `http://localhost:4000/api`
- **认证方式**: JWT Bearer Token
- **响应格式**: JSON

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": { ... }
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

## 认证 API

### 注册
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123",
  "nickname": "Student Name",
  "grade": "AS"  // 可选: "AS" | "A2"
}

Response 201:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

### 登录
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

### 获取当前用户
```
GET /api/auth/me
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "id": 1,
    "email": "student@example.com",
    "nickname": "Student Name",
    "grade": "AS"
  }
}
```

### 刷新 Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token"
}

Response 200:
{
  "success": true,
  "data": {
    "token": "new-jwt-token"
  }
}
```

## 考试 API

### 创建考试
```
POST /api/exams
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": 1,
  "questionSetId": 1,
  "type": "chapter_test",  // "chapter_test" | "unit_test" | "mock_exam"
  "mode": "exam",          // "practice" | "exam" | "challenge"
  "timeLimit": 3600        // 秒，可选
}

Response 201:
{
  "success": true,
  "data": {
    "id": 1,
    "status": "in_progress",
    "startedAt": "2026-03-10T10:00:00Z",
    ...
  }
}
```

### 获取考试详情
```
GET /api/exams/:examId
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "id": 1,
    "status": "in_progress",
    "remainingTime": 3000,
    "questionSet": {
      "id": 1,
      "title": "Mathematics Test",
      "questions": [ ... ]
    }
  }
}
```

### 保存答案
```
POST /api/exams/:examId/answers
Authorization: Bearer {token}
Content-Type: application/json

{
  "questionId": 1,
  "answer": { "value": "B" }
}

Response 200:
{
  "success": true,
  "data": {
    "message": "答案已保存"
  }
}
```

### 提交考试
```
POST /api/exams/:examId/submit
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "examId": 1,
    "status": "graded",
    "totalScore": 85,
    "maxScore": 100,
    "correctCount": 17,
    "totalCount": 20
  }
}
```

### 获取考试结果
```
GET /api/exams/:examId/result
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "exam": { ... },
    "questionResults": [ ... ],
    "aiFeedback": { ... },
    "recommendations": [ ... ]
  }
}
```

## 学习建议 API

### 获取用户推荐
```
GET /api/recommendations?userId=1
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "review_chapter",
      "priority": 1,
      "chapterId": "e1c1",
      "reason": "Supply and Demand 正确率 60%，需要加强",
      "weakTopics": ["supply_demand", "market_equilibrium"],
      "status": "pending"
    }
  ]
}
```

### 生成学习计划
```
POST /api/learning-plans
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": 1,
  "examId": 1,
  "duration": 7  // 天数
}

Response 201:
{
  "success": true,
  "data": {
    "plan": {
      "totalDays": 7,
      "dailyTasks": [ ... ]
    },
    "recommendations": [ ... ]
  }
}
```

### 标记推荐完成
```
PATCH /api/recommendations/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "completed"
}

Response 200:
{
  "success": true,
  "data": {
    "message": "已标记为完成"
  }
}
```

## 题目和试卷 API

### 获取试卷列表
```
GET /api/question-sets?subject=mathematics&difficulty=medium
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Mathematics Quick Test",
      "subject": "mathematics",
      "difficulty": "medium",
      "totalQuestions": 20,
      "totalPoints": 100,
      "timeLimit": 3600
    }
  ]
}
```

### 获取试卷详情
```
GET /api/question-sets/:id
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Mathematics Quick Test",
    "questions": [ ... ]
  }
}
```

## 错误代码

| 代码 | 说明 |
|------|------|
| `UNAUTHORIZED` | 未认证或 Token 无效 |
| `FORBIDDEN` | 无权访问资源 |
| `NOT_FOUND` | 资源不存在 |
| `VALIDATION_ERROR` | 输入验证失败 |
| `EMAIL_EXISTS` | 邮箱已被注册 |
| `INVALID_CREDENTIALS` | 邮箱或密码错误 |
| `EXAM_TIMEOUT` | 考试时间已到 |
| `EXAM_ALREADY_SUBMITTED` | 考试已提交 |
| `SERVER_ERROR` | 服务器内部错误 |

## Rate Limiting

- **限制**: 15 分钟内最多 100 次请求
- **响应头**: 
  - `X-RateLimit-Limit`: 限制数量
  - `X-RateLimit-Remaining`: 剩余次数
  - `X-RateLimit-Reset`: 重置时间

超过限制返回 `429 Too Many Requests`

## 缓存

部分 GET 请求会被缓存：
- 科目和章节数据：10 分钟
- 响应头 `X-Cache`: `HIT` (命中) 或 `MISS` (未命中)

## 性能

- 响应头 `X-Response-Time`: 请求处理时间（毫秒）
- 慢请求（>1秒）会被记录到日志

## 测试账号

```
Email: student1@test.com
Email: student2@test.com
Email: demo@alevel.com
Password: test123
```
