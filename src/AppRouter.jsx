// ============================================================
// AppRouter.jsx - 路由配置
// Phase 4: 考试系统路由
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ALevelMathApp from './alevel-math-app.jsx'
import ApiTestPage from './ApiTestPage.jsx'
import Phase1TestPage from './components/Phase1TestPage.jsx'
import Phase2TestPage from './components/Phase2TestPage.jsx'
import ExamListPage from './components/ExamListPage.jsx'
import ExamTakingPage from './components/ExamTakingPage.jsx'
import ExamResultPage from './components/ExamResultPage.jsx'
import LearningPlanPage from './components/LearningPlanPage.jsx'
import WrongQuestionsPage from './components/WrongQuestionsPage.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

export default function AppRouter() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* 主应用 */}
          <Route path="/" element={<ALevelMathApp />} />

          {/* 测试页面 */}
          <Route path="/test/api" element={<ApiTestPage />} />
          <Route path="/test/phase1" element={<Phase1TestPage />} />
          <Route path="/test/phase2" element={<Phase2TestPage />} />

          {/* Phase 4: 考试系统 */}
          <Route path="/exams" element={<ExamListPage />} />
          <Route path="/exams/:examId/take" element={<ExamTakingPage />} />
          <Route path="/exams/:examId/result" element={<ExamResultPage />} />

          {/* Phase 4: 学习建议系统 */}
          <Route path="/learning-plan" element={<LearningPlanPage />} />
          <Route path="/wrong-questions" element={<WrongQuestionsPage />} />

          {/* 404 重定向 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
