# 产品使用指南 — A-Level Hub

> 最后更新：2026-04-17  
> 适用版本：v1.5.0（commit 18de15c）

---

## 目录

1. [产品概述](#1-产品概述)
2. [账号系统](#2-账号系统)
3. [首页与课程导航](#3-首页与课程导航)
4. [章节练习（Practice）](#4-章节练习practice)
5. [考试系统（Exam）](#5-考试系统exam)
6. [模拟卷 / Past Papers](#6-模拟卷--past-papers)
7. [错题本（Wrong Questions）](#7-错题本wrong-questions)
8. [学习计划（Learning Plan）](#8-学习计划learning-plan)
9. [题库上传（管理员）](#9-题库上传管理员)
10. [用户设置](#10-用户设置)

---

## 1. 产品概述

**A-Level Hub** 是一个面向 Pearson Edexcel IAL 学生的备考平台，支持以下学科：

| 学科 | 单元 |
|------|------|
| Mathematics | P1/P2/P3/P4、S1、M1 |
| Economics | WEC11/12/13/14（U1–U4） |
| Further Math | 基础模块（开发中） |
| History | 基础模块（开发中） |
| Politics | 基础模块（开发中） |
| Psychology | 基础模块（开发中） |

**核心能力：**
- AI 即时判题与讲解
- 按章节刷题（Practice）
- 完整考试计时流程（Exam）
- 模拟卷实战（Past Papers / Mock Exam）
- 错题追踪与掌握标记
- 学习进度可视化

---

## 2. 账号系统

### 2.1 注册

访问 `/register`，填写：
- **邮箱**（唯一，用于登录）
- **昵称**（显示名称）
- **密码**（≥ 6 位）
- **年级**：AS 或 A2（默认 AS）

首个注册账号自动成为 **admin**；ADMIN_EMAILS 环境变量中的邮箱也会自动获得管理员权限。

### 2.2 登录

支持两种方式：
1. **邮箱 + 密码**：访问 `/login`
2. **Google OAuth**：点击「Login with Google」按钮（需 Google Client ID 配置）

登录成功后，Token 以 `httpOnly Cookie` 形式存储（`auth_token` + `refresh_token`），有效期 7 天，自动静默续期。

### 2.3 退出

点击 Navbar 右上角头像 → Logout。

### 2.4 权限角色

| 角色 | 说明 |
|------|------|
| `user` | 普通学生，可使用所有学习功能 |
| `admin` | 额外权限：访问 `/questions/upload` 题库管理 |

---

## 3. 首页与课程导航

URL：`/`（无需登录）

### 3.1 学科选择

首页展示所有支持学科的卡片，点击任一学科进入课程结构。

### 3.2 课程结构（CurriculumView）

三级层级：
```
学科（Subject）
  └─ 单元（Unit）
       └─ 章节（Chapter）
```

每个章节卡片显示：
- 章节标题（中英双语）
- 学习状态（未开始 / 进行中 / 已完成）— 需登录后显示
- 快速操作按钮：Practice / Exam / Chat

### 3.3 章节详情（ChapterView）

点击章节卡片展开，包含：
- **Overview**：章节概述
- **Key Points**：知识要点列表
- **Formulas**：公式汇总（KaTeX 渲染）
- **Videos**：配套视频链接
- **Actions**：直接发起练习或考试

---

## 4. 章节练习（Practice）

URL：`/practice?chapter={chapterId}&subject={subjectId}`（需登录）

### 4.1 开始练习

1. 选择难度：Easy / Medium / Hard
2. 选择题数：1–20 题（默认 5 题）
3. 点击「Start」

系统从题库中随机抽取对应章节、对应难度的题目。

### 4.2 答题界面

**题型支持：**

| 题型 | 代码 | 答题方式 |
|------|------|----------|
| 选择题 | `multiple_choice` | 点击选项 A/B/C/D |
| 填空 / 计算题 | `fill_blank` / `calculation` | 文字输入框 + 数学符号小键盘 |
| 简答题 | `short_answer` | 大文本框 |
| 证明题 | `proof` | 大文本框 |

**数学符号键盘**（AnswerInput 组件）：
点击 `√ ² ³ ∫ θ π ≥ ≤ ≠ × ÷ ± ∞ → ∑` 可将符号插入当前光标位置。

### 4.3 即时反馈（Feedback）

提交后立即显示：
- ✅/❌ 对错标记
- 正确答案
- AI 详解（step-by-step solution）
- 关键公式、常见错误提示

**计分规则：**
- 选择题：精确匹配（大小写不敏感）
- 计算题：绝对误差 < 0.01 或相对误差 < 1%
- 简答/证明：标记为「需人工审核」，不计入分数

### 4.4 练习总结（Summary）

一轮结束后显示：
- 分数（正确/总数/百分比）
- 用时
- AI 推荐下一步方向
- 本轮错题 **自动写入错题本**

---

## 5. 考试系统（Exam）

URL：`/exams`（需登录）

### 5.1 考试列表

展示所有考试记录，按时间倒序排列，状态包括：

| 状态 | 说明 |
|------|------|
| `in_progress` | 进行中（可续考） |
| `submitted` | 已提交，等待批改 |
| `graded` | 已批改，可查看结果 |
| `abandoned` | 已放弃 / 超 48 小时自动过期 |

### 5.2 创建考试

两种入口：
1. **手动创建**（`/exams/create`）：选择章节、题数、难度、时限
2. **章节快速考试**：从首页章节 → Exam 按钮，自动从题库抽题

### 5.3 考试进行（ExamTakingPage）

功能特性：
- **题目导航**：右侧题号面板，点击跳转
- **标记题目**：点击小旗图标标记，方便复查
- **自动保存**：每次切换题目时静默保存答案
- **倒计时**：左上角显示剩余时间，10 分钟内变红
- **防作弊**：离开当前标签页记录次数（`focusLostCount`）

**提交时机：**
- 主动点击「Submit」
- 倒计时归零自动提交

### 5.4 考试结果（ExamResultPage）

批改完成后（`status = graded`）展示：
- **总分** 和 **百分比**
- 各题正误及 AI 点评
- 成绩写入学习进度（≥ 60% 标记为 `completed`，否则 `in_progress`）

---

## 6. 模拟卷 / Past Papers

URL：`/past-papers`（需登录）

### 6.1 功能说明

展示所有预置的 **模拟真题卷**（type = `mock_exam`），目前已入库：

| 试卷 | 题数 | 满分 | 时限 |
|------|------|------|------|
| WMA12/01 Mock Paper — May 2026 | 10 题 | 75 分 | 90 分钟 |

### 6.2 开始考试

点击卡片 → 弹出题集详情 → 「Start Exam」进入完整计时考试流程，与普通考试体验完全一致。

### 6.3 添加更多模拟卷

使用 `/mock` skill 生成题目并入库（见 [开发指南 §7](#7-mock-paper-skill)）。

---

## 7. 错题本（Wrong Questions）

URL：`/wrong-questions`（需登录）

### 7.1 错题来源

| 来源 | 标签 |
|------|------|
| 章节练习（Practice） | `Practice` |
| 章节考试（Exam） | `Chapter Test` |
| 模拟卷（Mock Exam） | `Mock Exam` |
| 诊断测试 | `Diagnostic Test` |

### 7.2 功能操作

- **筛选**：按 Topic / Difficulty / Exam Type 过滤
- **查看答案**：点击「Show Answer」展开标准答案和讲解
- **标记掌握**：点击「Mark as Mastered」，记录持久化到数据库
- **隐藏已掌握**：点击「Hide Mastered」过滤已掌握题目
- **重新练习**：点击「Retry Chapter」跳转到对应章节练习

### 7.3 统计面板

页面顶部显示：
- **Total Wrong**：错题总数
- **Topics**：涉及知识点数量
- **Filtered**：当前筛选条件下的题目数

---

## 8. 学习计划（Learning Plan）

URL：`/learning-plan`（需登录）

基于 AI 分析用户薄弱知识点，生成个性化学习建议：
- 推荐复习章节
- 推荐练习方向
- 每条建议可标记为「完成」或「跳过」

---

## 9. 题库上传（管理员）

URL：`/questions/upload`（仅 admin 可访问）

支持上传 PDF / DOCX 格式的题目文件，系统自动：
1. 解析文档内容（`documentParser` 服务）
2. AI 提取题目结构（题目、选项、答案、讲解）
3. 审核后发布到题库

---

## 10. 用户设置

URL：`/profile`（需登录）

可修改：
- 昵称
- 年级（AS / A2）
- 目标大学
- 学科偏好（`selectedSubjects`）
- 每周学习时长目标

---

## 附录：键盘快捷键

| 场景 | 操作 | 快捷键 |
|------|------|--------|
| 考试答题 | 选择选项 A | `A` 键 |
| 考试答题 | 选择选项 B | `B` 键 |
| 考试答题 | 下一题 | `→` / `Enter` |
| 考试答题 | 上一题 | `←` |

---

## 附录：公式渲染

全站使用 **KaTeX** 渲染数学公式：
- 行内公式：`$...$`
- 独立公式块：`$$...$$`

在答题输入框中可直接输入 LaTeX 语法，实时预览。
