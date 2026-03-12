# 用户体验与内容质量测试指南

**日期**: 2026-03-12
**目标**: 在没有真实用户的情况下，全面测试产品的可用性、美观性和内容准确性

---

## 🎯 测试维度

### 1. 功能可用性测试
### 2. 页面美观性测试
### 3. 视频链接有效性测试
### 4. 知识点准确性测试
### 5. AI 题目质量测试
### 6. 答案准确性测试

---

## 1️⃣ 功能可用性测试

### 1.1 用户注册与登录流程

**测试步骤**:
```bash
# 1. 启动前端和后端
cd backend && bun run dev &
cd .. && bun run dev

# 2. 打开浏览器
open http://localhost:3000/register
```

**测试清单**:
- [ ] 注册页面是否正常显示
- [ ] 输入验证是否工作（邮箱格式、密码强度）
- [ ] 注册成功后是否自动登录
- [ ] 登录页面是否正常显示
- [ ] "记住我" 功能是否工作
- [ ] 错误提示是否清晰友好

**预期结果**:
- ✅ 所有表单验证正常
- ✅ 错误提示清晰易懂
- ✅ 成功后自动跳转

---

### 1.2 考试创建与答题流程

**测试脚本**:
```javascript
// backend/tests/user-flow-exam.test.js
import { test, expect } from '@playwright/test'

test('完整考试流程', async ({ page }) => {
  // 1. 登录
  await page.goto('http://localhost:3000/login')
  await page.fill('input[type="email"]', 'test@example.com')
  await page.fill('input[type="password"]', 'test123')
  await page.click('button[type="submit"]')

  // 2. 创建考试
  await page.goto('http://localhost:3000/exams')
  await page.click('text=创建考试')
  await page.selectOption('select[name="questionSetId"]', '1')
  await page.click('button:has-text("开始考试")')

  // 3. 答题
  await page.fill('input[name="answer"]', 'A')
  await page.click('button:has-text("下一题")')

  // 4. 提交
  await page.click('button:has-text("提交考试")')
  await page.click('button:has-text("确认提交")')

  // 5. 查看结果
  await expect(page.locator('text=考试结果')).toBeVisible()
  await expect(page.locator('text=得分')).toBeVisible()
})
```

**手动测试清单**:
- [ ] 考试列表是否正常显示
- [ ] 创建考试流程是否流畅
- [ ] 答题界面是否清晰
- [ ] 题目导航是否方便
- [ ] 答题卡是否准确显示答题状态
- [ ] 倒计时是否正常工作
- [ ] 自动保存是否生效
- [ ] 提交确认对话框是否清晰
- [ ] 结果页面是否完整显示

---

### 1.3 错题本与学习计划

**测试清单**:
- [ ] 错题本是否正确显示所有错题
- [ ] 筛选功能是否工作（主题、难度、类型）
- [ ] 错题详情是否完整（题目、答案、解析）
- [ ] 学习计划是否基于薄弱点生成
- [ ] 学习计划是否可以标记完成
- [ ] 进度追踪是否准确

---

## 2️⃣ 页面美观性测试

### 2.1 视觉设计检查

**工具**: Lighthouse、浏览器开发者工具

**测试步骤**:
```bash
# 1. 运行 Lighthouse 审计
npx lighthouse http://localhost:3000 --view

# 2. 检查响应式设计
# 在浏览器中按 F12，切换设备模拟器
# 测试：iPhone 12, iPad, Desktop
```

**检查清单**:
- [ ] **色彩搭配**: 是否协调、专业
- [ ] **字体大小**: 是否易读（最小 14px）
- [ ] **间距**: 是否舒适（不拥挤、不空旷）
- [ ] **对齐**: 是否整齐
- [ ] **图标**: 是否清晰、一致
- [ ] **按钮**: 是否明显、易点击
- [ ] **加载状态**: 是否有友好的加载提示
- [ ] **错误提示**: 是否醒目但不刺眼

**评分标准**:
```
优秀 (90-100分): 设计专业，细节完善
良好 (70-89分): 设计合理，有小瑕疵
及格 (60-69分): 基本可用，需改进
不及格 (<60分): 影响使用体验
```

---

### 2.2 响应式设计测试

**测试设备**:
- 📱 手机: iPhone 12 (390x844)
- 📱 手机: Samsung Galaxy S21 (360x800)
- 📱 平板: iPad (768x1024)
- 💻 桌面: 1920x1080
- 💻 桌面: 1366x768

**检查清单**:
- [ ] 所有页面在不同设备上都能正常显示
- [ ] 文字大小在小屏幕上仍然可读
- [ ] 按钮在触摸屏上足够大（最小 44x44px）
- [ ] 横向滚动条不应出现
- [ ] 图片不应变形

---

### 2.3 动画与交互测试

**检查清单**:
- [ ] 页面切换是否流畅
- [ ] 按钮点击是否有反馈（hover、active 状态）
- [ ] 加载动画是否自然
- [ ] 过渡效果是否合适（不过快、不过慢）
- [ ] 滚动是否平滑

---

## 3️⃣ 视频链接有效性测试

### 3.1 自动化链接检查

**创建测试脚本**:
```javascript
// backend/tests/video-links-validator.js
import { db } from '../src/db/index.js'
import { chapters } from '../src/db/schema.js'

async function validateVideoLinks() {
  console.log('🔍 开始检查视频链接...\n')

  const allChapters = await db.select().from(chapters)

  let totalVideos = 0
  let validVideos = 0
  let invalidVideos = 0
  const errors = []

  for (const chapter of allChapters) {
    if (!chapter.videos || chapter.videos.length === 0) {
      console.log(`⚠️  ${chapter.title}: 没有视频`)
      continue
    }

    console.log(`\n📚 检查章节: ${chapter.title}`)

    for (const video of chapter.videos) {
      totalVideos++

      // 检查 URL 格式
      if (!video.url || !video.url.startsWith('http')) {
        invalidVideos++
        errors.push({
          chapter: chapter.title,
          video: video.title,
          error: 'URL 格式无效'
        })
        console.log(`  ❌ ${video.title}: URL 格式无效`)
        continue
      }

      // 检查 YouTube 链接
      if (video.url.includes('youtube.com') || video.url.includes('youtu.be')) {
        try {
          const response = await fetch(video.url, { method: 'HEAD' })
          if (response.ok) {
            validVideos++
            console.log(`  ✅ ${video.title}: 链接有效`)
          } else {
            invalidVideos++
            errors.push({
              chapter: chapter.title,
              video: video.title,
              error: `HTTP ${response.status}`
            })
            console.log(`  ❌ ${video.title}: HTTP ${response.status}`)
          }
        } catch (error) {
          invalidVideos++
          errors.push({
            chapter: chapter.title,
            video: video.title,
            error: error.message
          })
          console.log(`  ❌ ${video.title}: ${error.message}`)
        }
      } else {
        validVideos++
        console.log(`  ⚠️  ${video.title}: 非 YouTube 链接，跳过检查`)
      }

      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  // 总结
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 检查结果总结:\n')
  console.log(`  总视频数: ${totalVideos}`)
  console.log(`  有效链接: ${validVideos} (${Math.round(validVideos/totalVideos*100)}%)`)
  console.log(`  无效链接: ${invalidVideos} (${Math.round(invalidVideos/totalVideos*100)}%)`)

  if (errors.length > 0) {
    console.log('\n❌ 无效链接列表:\n')
    for (const error of errors) {
      console.log(`  - ${error.chapter} > ${error.video}`)
      console.log(`    错误: ${error.error}\n`)
    }
  }

  if (invalidVideos === 0) {
    console.log('\n✅ 所有视频链接都有效！')
  } else {
    console.log(`\n⚠️  发现 ${invalidVideos} 个无效链接，请修复。`)
  }
}

validateVideoLinks()
```

**运行测试**:
```bash
cd backend
bun run tests/video-links-validator.js
```

---

### 3.2 视频内容准确性检查

**手动检查清单**:

创建一个检查表格：

| 章节 | 视频标题 | 链接 | 是否可播放 | 内容是否匹配 | 语言 | 质量 | 备注 |
|------|---------|------|-----------|-------------|------|------|------|
| Pure Math 1 - Algebra | Introduction to Algebra | [链接] | ✅ | ✅ | 英文 | 高清 | - |
| Pure Math 1 - Algebra | Quadratic Equations | [链接] | ✅ | ❌ | 英文 | 标清 | 内容是三角函数 |

**检查步骤**:
1. 打开每个章节页面
2. 点击视频链接
3. 检查视频是否能播放
4. 观看前 2-3 分钟，确认内容是否与章节匹配
5. 记录问题

**评分标准**:
- ✅ 完全匹配: 内容准确，质量良好
- ⚠️ 部分匹配: 内容相关但不完全准确
- ❌ 不匹配: 内容错误或无法播放

---

## 4️⃣ 知识点准确性测试

### 4.1 知识点完整性检查

**创建检查脚本**:
```javascript
// backend/tests/knowledge-points-validator.js
import { db } from '../src/db/index.js'
import { subjects, chapters } from '../src/db/schema.js'

async function validateKnowledgePoints() {
  console.log('📚 开始检查知识点完整性...\n')

  const allSubjects = await db.select().from(subjects)

  for (const subject of allSubjects) {
    console.log(`\n📖 科目: ${subject.name}`)

    const subjectChapters = await db.select()
      .from(chapters)
      .where(eq(chapters.subjectId, subject.id))

    console.log(`   章节数: ${subjectChapters.length}`)

    for (const chapter of subjectChapters) {
      console.log(`\n   📝 ${chapter.title}`)

      // 检查描述
      if (!chapter.description || chapter.description.length < 50) {
        console.log(`      ⚠️  描述过短或缺失`)
      } else {
        console.log(`      ✅ 描述完整 (${chapter.description.length} 字符)`)
      }

      // 检查知识点
      if (!chapter.keyPoints || chapter.keyPoints.length === 0) {
        console.log(`      ❌ 缺少知识点`)
      } else {
        console.log(`      ✅ 知识点数量: ${chapter.keyPoints.length}`)
        for (const point of chapter.keyPoints) {
          console.log(`         - ${point}`)
        }
      }

      // 检查学习目标
      if (!chapter.learningObjectives || chapter.learningObjectives.length === 0) {
        console.log(`      ⚠️  缺少学习目标`)
      } else {
        console.log(`      ✅ 学习目标数量: ${chapter.learningObjectives.length}`)
      }

      // 检查视频
      if (!chapter.videos || chapter.videos.length === 0) {
        console.log(`      ⚠️  缺少视频资源`)
      } else {
        console.log(`      ✅ 视频数量: ${chapter.videos.length}`)
      }
    }
  }
}

validateKnowledgePoints()
```

---

### 4.2 知识点准确性人工审核

**审核清单**:

为每个章节创建审核表：

```markdown
## Pure Mathematics 1 - Algebra

### 知识点列表
- [ ] 1. 代数基础
  - 准确性: ⭐⭐⭐⭐⭐
  - 完整性: ⭐⭐⭐⭐⭐
  - 清晰度: ⭐⭐⭐⭐⭐
  - 备注: 无

- [ ] 2. 二次方程
  - 准确性: ⭐⭐⭐⭐⭐
  - 完整性: ⭐⭐⭐⭐
  - 清晰度: ⭐⭐⭐⭐⭐
  - 备注: 缺少判别式的详细说明

### 总体评价
- 准确性: 95%
- 完整性: 90%
- 清晰度: 95%
- 建议: 补充判别式内容
```

**审核标准**:
- **准确性**: 知识点是否符合 A-Level 大纲
- **完整性**: 是否涵盖所有必要内容
- **清晰度**: 表述是否清晰易懂

---

## 5️⃣ AI 题目质量测试

### 5.1 题目生成测试

**测试脚本**:
```javascript
// backend/tests/ai-question-quality.test.js
import { generateQuestions } from '../src/services/questionGenerator.js'

async function testQuestionGeneration() {
  console.log('🤖 测试 AI 题目生成质量...\n')

  const testCases = [
    {
      topic: 'Quadratic Equations',
      difficulty: 3,
      count: 5
    },
    {
      topic: 'Trigonometry',
      difficulty: 4,
      count: 5
    },
    {
      topic: 'Calculus - Differentiation',
      difficulty: 5,
      count: 5
    }
  ]

  for (const testCase of testCases) {
    console.log(`\n📝 生成题目: ${testCase.topic} (难度 ${testCase.difficulty})`)

    const questions = await generateQuestions({
      topic: testCase.topic,
      difficulty: testCase.difficulty,
      count: testCase.count,
      type: 'multiple_choice'
    })

    console.log(`   生成数量: ${questions.length}/${testCase.count}`)

    // 检查每道题
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      console.log(`\n   题目 ${i + 1}:`)
      console.log(`   ${q.content}`)

      // 检查必需字段
      const checks = {
        '有题目内容': !!q.content && q.content.length > 10,
        '有选项': q.options && q.options.length === 4,
        '有答案': !!q.answer,
        '有解析': !!q.explanation && q.explanation.length > 20,
        '难度正确': q.difficulty === testCase.difficulty,
        '主题正确': q.tags && q.tags.includes(testCase.topic)
      }

      for (const [check, passed] of Object.entries(checks)) {
        console.log(`      ${passed ? '✅' : '❌'} ${check}`)
      }
    }
  }
}

testQuestionGeneration()
```

---

### 5.2 题目质量人工审核

**审核维度**:

1. **题目规范性**
   - [ ] 题干表述清晰
   - [ ] 没有歧义
   - [ ] 符合 A-Level 考试风格
   - [ ] 数学符号正确

2. **选项质量**
   - [ ] 4 个选项都合理
   - [ ] 干扰项有迷惑性
   - [ ] 只有一个正确答案
   - [ ] 选项长度相近

3. **答案准确性**
   - [ ] 答案完全正确
   - [ ] 可以验证
   - [ ] 有详细解析
   - [ ] 解析步骤清晰

4. **知识点匹配**
   - [ ] 完全符合指定知识点
   - [ ] 难度适中
   - [ ] 考查重点明确

**评分表格**:

| 题目ID | 规范性 | 选项质量 | 答案准确性 | 知识点匹配 | 总分 | 备注 |
|--------|--------|---------|-----------|-----------|------|------|
| Q001 | 5/5 | 4/5 | 5/5 | 5/5 | 19/20 | 选项B略显简单 |
| Q002 | 5/5 | 5/5 | 5/5 | 5/5 | 20/20 | 优秀 |

---

## 6️⃣ 答案准确性测试

### 6.1 自动化答案验证

**创建验证脚本**:
```javascript
// backend/tests/answer-accuracy.test.js
import { db } from '../src/db/index.js'
import { questions } from '../src/db/schema.js'
import { gradeAnswer } from '../src/services/answerGrader.js'

async function validateAnswers() {
  console.log('✅ 开始验证答案准确性...\n')

  const allQuestions = await db.select().from(questions).limit(50)

  let totalTests = 0
  let passedTests = 0
  let failedTests = 0

  for (const question of allQuestions) {
    console.log(`\n📝 题目 ${question.id}: ${question.content.substring(0, 50)}...`)

    // 测试 1: 正确答案应该被判定为正确
    totalTests++
    const correctResult = await gradeAnswer({
      questionId: question.id,
      userAnswer: question.answer.value
    })

    if (correctResult.isCorrect) {
      passedTests++
      console.log(`   ✅ 正确答案测试通过`)
    } else {
      failedTests++
      console.log(`   ❌ 正确答案测试失败！`)
      console.log(`      期望: 正确`)
      console.log(`      实际: 错误`)
      console.log(`      答案: ${question.answer.value}`)
    }

    // 测试 2: 错误答案应该被判定为错误
    if (question.type === 'multiple_choice') {
      totalTests++
      const wrongAnswer = question.options.find(opt => opt !== question.answer.value)

      if (wrongAnswer) {
        const wrongResult = await gradeAnswer({
          questionId: question.id,
          userAnswer: wrongAnswer
        })

        if (!wrongResult.isCorrect) {
          passedTests++
          console.log(`   ✅ 错误答案测试通过`)
        } else {
          failedTests++
          console.log(`   ❌ 错误答案测试失败！`)
          console.log(`      期望: 错误`)
          console.log(`      实际: 正确`)
          console.log(`      答案: ${wrongAnswer}`)
        }
      }
    }
  }

  // 总结
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 验证结果总结:\n')
  console.log(`  总测试数: ${totalTests}`)
  console.log(`  通过: ${passedTests} (${Math.round(passedTests/totalTests*100)}%)`)
  console.log(`  失败: ${failedTests} (${Math.round(failedTests/totalTests*100)}%)`)

  if (failedTests === 0) {
    console.log('\n✅ 所有答案验证通过！')
  } else {
    console.log(`\n⚠️  发现 ${failedTests} 个问题，请检查。`)
  }
}

validateAnswers()
```

---

### 6.2 答案解析质量检查

**检查清单**:

对于每道题的解析：
- [ ] 解析是否完整
- [ ] 步骤是否清晰
- [ ] 是否有必要的公式
- [ ] 是否有图示（如需要）
- [ ] 语言是否易懂
- [ ] 是否指出常见错误

**评分标准**:
```
优秀 (9-10分): 解析详细，步骤清晰，有额外提示
良好 (7-8分): 解析完整，步骤清楚
及格 (6分): 解析基本完整
不及格 (<6分): 解析不完整或有错误
```

---

## 7️⃣ 综合测试流程

### 7.1 每日测试清单

**开发阶段**（每天执行）:
```bash
# 1. 启动服务
cd backend && bun run dev &
cd .. && bun run dev &

# 2. 运行自动化测试
cd backend
bun run tests/video-links-validator.js
bun run tests/knowledge-points-validator.js
bun run tests/ai-question-quality.test.js
bun run tests/answer-accuracy.test.js

# 3. 手动测试核心流程
# - 注册/登录
# - 创建考试
# - 答题
# - 查看结果
# - 错题本
# - 学习计划

# 4. 检查页面美观性
# - 打开 Lighthouse
# - 检查响应式设计
# - 检查动画效果
```

---

### 7.2 发布前测试清单

**完整测试**（发布前执行）:

#### 功能测试
- [ ] 所有页面都能正常访问
- [ ] 所有表单都能正常提交
- [ ] 所有按钮都有响应
- [ ] 所有链接都有效
- [ ] 错误处理正常

#### 内容测试
- [ ] 所有视频链接有效
- [ ] 所有知识点准确
- [ ] 所有题目质量合格
- [ ] 所有答案准确

#### 性能测试
- [ ] 页面加载时间 < 3 秒
- [ ] Lighthouse 性能分数 > 80
- [ ] 无内存泄漏
- [ ] 无卡顿

#### 兼容性测试
- [ ] Chrome 正常
- [ ] Firefox 正常
- [ ] Safari 正常
- [ ] Edge 正常
- [ ] 移动端正常

---

## 8️⃣ 测试工具推荐

### 自动化测试工具
- **Playwright**: E2E 测试
- **Vitest**: 单元测试
- **Lighthouse**: 性能测试
- **axe**: 可访问性测试

### 手动测试工具
- **浏览器开发者工具**: 调试
- **Responsively**: 响应式测试
- **ColorZilla**: 颜色检查
- **WhatFont**: 字体检查

### 内容验证工具
- **Grammarly**: 语法检查
- **Hemingway**: 可读性检查
- **MathJax**: 数学公式渲染

---

## 9️⃣ 问题追踪

### 问题记录模板

```markdown
## 问题 #001

**类型**: 视频链接失效
**严重性**: 高
**发现时间**: 2026-03-12
**页面**: Pure Math 1 - Algebra
**描述**: "Quadratic Equations" 视频链接返回 404

**重现步骤**:
1. 进入 Pure Math 1
2. 点击 Algebra 章节
3. 点击 "Quadratic Equations" 视频

**预期结果**: 视频正常播放
**实际结果**: 404 错误

**解决方案**: 更新视频链接为 [新链接]
**状态**: 待修复
**负责人**: [姓名]
```

---

## 🎯 质量标准

### 最低发布标准
- ✅ 核心功能 100% 可用
- ✅ 视频链接有效率 > 95%
- ✅ 知识点准确率 > 98%
- ✅ AI 题目质量 > 85 分
- ✅ 答案准确率 > 99%
- ✅ 页面美观度 > 80 分
- ✅ Lighthouse 性能 > 80 分

### 优秀产品标准
- ⭐ 核心功能 100% 可用
- ⭐ 视频链接有效率 > 99%
- ⭐ 知识点准确率 > 99%
- ⭐ AI 题目质量 > 90 分
- ⭐ 答案准确率 > 99.5%
- ⭐ 页面美观度 > 90 分
- ⭐ Lighthouse 性能 > 90 分

---

## 📝 总结

用户体验和内容质量是产品成功的关键。通过系统化的测试流程，我们可以在没有真实用户的情况下，确保产品的质量。

**关键要点**:
1. 自动化测试覆盖基础功能
2. 人工审核确保内容质量
3. 持续监控和改进
4. 建立质量标准和追踪机制

**下一步**:
1. 创建所有测试脚本
2. 执行完整测试
3. 记录和修复问题
4. 达到发布标准

---

**文档创建时间**: 2026-03-12
**维护者**: 开发团队
