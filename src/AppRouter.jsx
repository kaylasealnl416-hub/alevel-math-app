// ============================================================
// AppRouter.jsx - 路由配置
// Phase 4: 考试系统路由
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import ALevelMathApp from './alevel-math-app.jsx'
import ApiTestPage from './ApiTestPage.jsx'
import Phase1TestPage from './components/Phase1TestPage.jsx'
import Phase2TestPage from './components/Phase2TestPage.jsx'
import LoginPage from './components/LoginPage.jsx'
import RegisterPage from './components/RegisterPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ExamListPage from './components/ExamListPage.jsx'
import ExamTakingPage from './components/ExamTakingPage.jsx'
import ExamResultPage from './components/ExamResultPage.jsx'
import LearningPlanPage from './components/LearningPlanPage.jsx'
import WrongQuestionsPage from './components/WrongQuestionsPage.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

export default function AppRouter() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* 主应用 */}
            <Route path="/" element={<ALevelMathApp />} />

            {/* 认证页面 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 测试页面 */}
            <Route path="/test/api" element={<ApiTestPage />} />
            <Route path="/test/phase1" element={<Phase1TestPage />} />
            <Route path="/test/phase2" element={<Phase2TestPage />} />

            {/* Phase 4: 考试系统（需要认证） */}
            <Route path="/exams" element={
              <ProtectedRoute>
                <ExamListPage />
              </ProtectedRoute>
            } />
            <Route path="/exams/:examId/take" element={
              <ProtectedRoute>
                <ExamTakingPage />
              </ProtectedRoute>
            } />
            <Route path="/exams/:examId/result" element={
              <ProtectedRoute>
                <ExamResultPage />
              </ProtectedRoute>
            } />

            {/* Phase 4: 学习建议系统（需要认证） */}
            <Route path="/learning-plan" element={
              <ProtectedRoute>
                <LearningPlanPage />
              </ProtectedRoute>
            } />
            <Route path="/wrong-questions" element={
              <ProtectedRoute>
                <WrongQuestionsPage />
              </ProtectedRoute>
            } />

            {/* 404 重定向 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}
