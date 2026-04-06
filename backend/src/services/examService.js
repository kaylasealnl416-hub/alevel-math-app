import { db } from '../db/index.js'
import { exams, questionSets, questions } from '../db/schema.js'
import { eq, and, sql, inArray } from 'drizzle-orm'

/**
 * Phase 4 Day 2: 考试执行服务
 *
 * 功能：
 * - 考试状态管理
 * - 计时器逻辑
 * - 自动提交
 * - 防作弊检测
 */

// 考试状态枚举
export const ExamStatus = {
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  EXPIRED: 'expired'
}

// 考试类型枚举
export const ExamType = {
  CHAPTER_TEST: 'chapter_test',
  UNIT_TEST: 'unit_test',
  MOCK_EXAM: 'mock_exam',
  DIAGNOSTIC: 'diagnostic',
  REAL_EXAM: 'real_exam'
}

// 考试模式枚举
export const ExamMode = {
  PRACTICE: 'practice',  // 练习模式：可查看答案，不计时
  EXAM: 'exam',          // 考试模式：严格计时，不可查看答案
  CHALLENGE: 'challenge' // 挑战模式：限时答题，答对加分
}

/**
 * 创建考试
 */
export async function createExam({ userId, questionSetId, type, mode, timeLimit, allowReview }) {
  try {
    // 验证试卷是否存在
    const [questionSet] = await db.select()
      .from(questionSets)
      .where(eq(questionSets.id, questionSetId))
      .limit(1)

    if (!questionSet) {
      throw new Error('试卷不存在')
    }

    // 创建考试记录
    const [exam] = await db.insert(exams).values({
      userId,
      questionSetId,
      type,
      mode,
      timeLimit: timeLimit || questionSet.timeLimit || null,
      allowReview: allowReview !== undefined ? allowReview : true,
      status: ExamStatus.IN_PROGRESS,
      totalCount: questionSet.totalQuestions,
      maxScore: questionSet.totalPoints || questionSet.totalQuestions * 10,
      answers: {},
      markedQuestions: [],
      startedAt: new Date(),
      tabSwitchCount: 0,
      focusLostCount: 0
    }).returning()

    return {
      success: true,
      data: exam
    }

  } catch (error) {
    console.error('创建考试失败：', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * 获取考试详情（包含题目）
 */
export async function getExamDetail(examId) {
  try {
    // 查询考试
    const [exam] = await db.select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1)

    if (!exam) {
      throw new Error('考试不存在')
    }

    // 查询试卷
    const [questionSet] = await db.select()
      .from(questionSets)
      .where(eq(questionSets.id, exam.questionSetId))
      .limit(1)

    // 查询题目
    const questionIds = questionSet.questionIds
    const questionList = await db.select()
      .from(questions)
      .where(inArray(questions.id, questionIds))

    // 计算剩余时间
    let remainingTime = null
    if (exam.timeLimit && exam.status === ExamStatus.IN_PROGRESS) {
      const elapsedTime = Math.floor((new Date() - new Date(exam.startedAt)) / 1000)
      remainingTime = Math.max(0, exam.timeLimit - elapsedTime)
    }

    // 考试进行中且非练习模式时隐藏标准答案和解析，防止前端泄露
    // 练习模式（ExamMode.PRACTICE）允许查看答案
    const shouldHideAnswers = exam.status === ExamStatus.IN_PROGRESS && exam.mode !== ExamMode.PRACTICE
    const safeQuestions = shouldHideAnswers
      ? questionList.map(({ answer, explanation, ...rest }) => rest)
      : questionList

    return {
      success: true,
      data: {
        ...exam,
        remainingTime,
        questionSet: {
          ...questionSet,
          questions: safeQuestions
        }
      }
    }

  } catch (error) {
    console.error('获取考试详情失败：', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * 检查考试是否超时
 */
export async function checkExamTimeout(examId) {
  try {
    const [exam] = await db.select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1)

    if (!exam) {
      throw new Error('考试不存在')
    }

    // 如果考试已结束，返回
    if (exam.status !== ExamStatus.IN_PROGRESS) {
      return {
        success: true,
        data: { isTimeout: false, exam }
      }
    }

    // 如果没有时间限制，返回
    if (!exam.timeLimit) {
      return {
        success: true,
        data: { isTimeout: false, exam }
      }
    }

    // 计算已用时间
    const elapsedTime = Math.floor((new Date() - new Date(exam.startedAt)) / 1000)
    const isTimeout = elapsedTime >= exam.timeLimit

    // 如果超时，自动提交
    if (isTimeout && exam.status === ExamStatus.IN_PROGRESS) {
      await autoSubmitExam(examId, 'timeout')

      // 重新查询考试
      const [updatedExam] = await db.select()
        .from(exams)
        .where(eq(exams.id, examId))
        .limit(1)

      return {
        success: true,
        data: { isTimeout: true, exam: updatedExam }
      }
    }

    return {
      success: true,
      data: { isTimeout, exam }
    }

  } catch (error) {
    console.error('检查考试超时失败：', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * 自动提交考试
 */
export async function autoSubmitExam(examId, reason = 'auto') {
  try {
    const [exam] = await db.select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1)

    if (!exam) {
      throw new Error('考试不存在')
    }

    if (exam.status !== ExamStatus.IN_PROGRESS) {
      // 已提交过，直接返回成功
      return {
        success: true,
        data: { examId: exam.id, timeSpent: exam.timeSpent, alreadySubmitted: true }
      }
    }

    // 计算用时
    const timeSpent = Math.floor((new Date() - new Date(exam.startedAt)) / 1000)

    // 更新考试状态
    await db.update(exams)
      .set({
        status: ExamStatus.SUBMITTED,
        submittedAt: new Date(),
        timeSpent,
        updatedAt: new Date()
      })
      .where(eq(exams.id, examId))

    console.log(`考试 ${examId} 自动提交，原因：${reason}，用时：${timeSpent}秒`)

    // 自动提交也需要批改（与手动提交行为一致）
    try {
      const { gradeExam } = await import('./examGrader.js')
      const gradeResult = await gradeExam(examId)
      if (!gradeResult.success) {
        console.error(`考试 ${examId} 自动批改失败:`, gradeResult.error)
      } else {
        console.log(`考试 ${examId} 自动批改完成`)
      }
    } catch (gradeError) {
      console.error(`考试 ${examId} 自动批改异常:`, gradeError)
    }

    return {
      success: true,
      data: { examId, timeSpent, reason }
    }

  } catch (error) {
    console.error('自动提交考试失败：', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * 手动提交考试
 */
export async function submitExam(examId) {
  try {
    const [exam] = await db.select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1)

    if (!exam) {
      throw new Error('考试不存在')
    }

    if (exam.status !== ExamStatus.IN_PROGRESS) {
      // 已提交过，直接返回成功（防止重复提交报错）
      return {
        success: true,
        data: { examId: exam.id, timeSpent: exam.timeSpent, alreadySubmitted: true }
      }
    }

    // 计算用时
    const timeSpent = Math.floor((new Date() - new Date(exam.startedAt)) / 1000)

    // 更新考试状态为 submitted
    await db.update(exams)
      .set({
        status: ExamStatus.SUBMITTED,
        submittedAt: new Date(),
        timeSpent,
        updatedAt: new Date()
      })
      .where(eq(exams.id, examId))

    console.log(`考试 ${examId} 已提交，开始批改...`)

    // 立即执行批改（等待完成）
    const { gradeExam } = await import('./examGrader.js')
    const gradeResult = await gradeExam(examId)

    // 验证批改结果
    if (!gradeResult.success) {
      console.error(`考试 ${examId} 批改失败:`, gradeResult.error)
      throw new Error('批改失败: ' + gradeResult.error.message)
    }

    console.log(`考试 ${examId} 批改完成`)

    return {
      success: true,
      data: {
        examId,
        timeSpent,
        ...gradeResult.data
      }
    }

  } catch (error) {
    console.error('提交考试失败：', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * 保存答案
 */
export async function saveAnswer(examId, questionId, answer) {
  try {
    const [exam] = await db.select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1)

    if (!exam) {
      throw new Error('考试不存在')
    }

    if (exam.status !== ExamStatus.IN_PROGRESS) {
      // 考试已结束，静默忽略（避免自动保存在提交后报错）
      return {
        success: true,
        data: { message: '考试已结束，答案未保存' }
      }
    }

    // 检查是否超时
    const timeoutCheck = await checkExamTimeout(examId)
    if (timeoutCheck.data?.isTimeout) {
      throw new Error('考试时间已到，已自动提交')
    }

    // 更新答案
    const updatedAnswers = {
      ...exam.answers,
      [questionId]: answer
    }

    await db.update(exams)
      .set({
        answers: updatedAnswers,
        updatedAt: new Date()
      })
      .where(eq(exams.id, examId))

    return {
      success: true,
      data: { message: '答案已保存' }
    }

  } catch (error) {
    console.error('保存答案失败：', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * 标记题目
 */
export async function markQuestion(examId, questionId, marked) {
  try {
    const [exam] = await db.select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1)

    if (!exam) {
      throw new Error('考试不存在')
    }

    let markedQuestions = exam.markedQuestions || []

    if (marked) {
      // 添加标记
      if (!markedQuestions.includes(questionId)) {
        markedQuestions.push(questionId)
      }
    } else {
      // 移除标记
      markedQuestions = markedQuestions.filter(id => id !== questionId)
    }

    await db.update(exams)
      .set({
        markedQuestions,
        updatedAt: new Date()
      })
      .where(eq(exams.id, examId))

    return {
      success: true,
      data: { message: marked ? '已标记' : '已取消标记' }
    }

  } catch (error) {
    console.error('标记题目失败：', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * 记录防作弊事件
 */
export async function recordCheatingEvent(examId, eventType) {
  try {
    const [exam] = await db.select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1)

    if (!exam) {
      throw new Error('考试不存在')
    }

    const updates = { updatedAt: new Date() }

    if (eventType === 'tab_switch') {
      updates.tabSwitchCount = (exam.tabSwitchCount || 0) + 1
    } else if (eventType === 'focus_lost') {
      updates.focusLostCount = (exam.focusLostCount || 0) + 1
    }

    await db.update(exams)
      .set(updates)
      .where(eq(exams.id, examId))

    // 如果作弊次数过多，可以考虑自动提交或标记
    const totalCheatingEvents = (updates.tabSwitchCount || exam.tabSwitchCount || 0) +
                                (updates.focusLostCount || exam.focusLostCount || 0)

    let warning = null
    if (totalCheatingEvents >= 10) {
      warning = '检测到多次异常行为，请专注答题'
    }

    return {
      success: true,
      data: {
        message: '事件已记录',
        warning,
        totalCheatingEvents
      }
    }

  } catch (error) {
    console.error('记录作弊事件失败：', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * 获取考试统计信息
 */
export async function getExamStats(examId) {
  try {
    const [exam] = await db.select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1)

    if (!exam) {
      throw new Error('考试不存在')
    }

    // 查询试卷
    const [questionSet] = await db.select()
      .from(questionSets)
      .where(eq(questionSets.id, exam.questionSetId))
      .limit(1)

    // 计算答题进度
    const totalQuestions = questionSet.totalQuestions
    const answeredQuestions = Object.keys(exam.answers || {}).length
    const markedQuestions = (exam.markedQuestions || []).length

    // 计算剩余时间
    let remainingTime = null
    let elapsedTime = null
    if (exam.status === ExamStatus.IN_PROGRESS) {
      elapsedTime = Math.floor((new Date() - new Date(exam.startedAt)) / 1000)
      if (exam.timeLimit) {
        remainingTime = Math.max(0, exam.timeLimit - elapsedTime)
      }
    } else {
      elapsedTime = exam.timeSpent
    }

    return {
      success: true,
      data: {
        examId: exam.id,
        status: exam.status,
        totalQuestions,
        answeredQuestions,
        markedQuestions,
        progress: Math.round((answeredQuestions / totalQuestions) * 100),
        elapsedTime,
        remainingTime,
        timeLimit: exam.timeLimit,
        tabSwitchCount: exam.tabSwitchCount || 0,
        focusLostCount: exam.focusLostCount || 0
      }
    }

  } catch (error) {
    console.error('获取考试统计失败：', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * 批量检查超时考试（定时任务）
 */
export async function checkAllTimeoutExams() {
  try {
    // 查询所有进行中的考试
    const inProgressExams = await db.select()
      .from(exams)
      .where(eq(exams.status, ExamStatus.IN_PROGRESS))

    let timeoutCount = 0

    for (const exam of inProgressExams) {
      if (exam.timeLimit) {
        const elapsedTime = Math.floor((new Date() - new Date(exam.startedAt)) / 1000)
        if (elapsedTime >= exam.timeLimit) {
          await autoSubmitExam(exam.id, 'timeout_batch')
          timeoutCount++
        }
      }
    }

    console.log(`批量检查完成，自动提交 ${timeoutCount} 个超时考试`)

    return {
      success: true,
      data: {
        totalChecked: inProgressExams.length,
        timeoutCount
      }
    }

  } catch (error) {
    console.error('批量检查超时考试失败：', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}
