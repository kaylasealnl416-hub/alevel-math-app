// ============================================================
// AppRouter.jsx - route configuration
// All routes wrapped in Layout for consistent Navbar
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import ALevelMathApp from './alevel-math-app.jsx'
import ApiTestPage from './ApiTestPage.jsx'
import Phase1TestPage from './components/Phase1TestPage.jsx'
import Phase2TestPage from './components/Phase2TestPage.jsx'
import AuthPage from './components/AuthPage.jsx'
import UserProfilePage from './components/UserProfilePage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ExamListPage from './components/ExamListPage.jsx'
import ExamTakingPage from './components/ExamTakingPage.jsx'
import ExamResultPage from './components/ExamResultPage.jsx'
import LearningPlanPage from './components/LearningPlanPage.jsx'
import WrongQuestionsPage from './components/WrongQuestionsPage.jsx'
import QuestionUploadPage from './components/QuestionUploadPage.jsx'
import PracticePage from './components/PracticePage.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

export default function AppRouter() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Layout wraps all pages with unified Navbar */}
            <Route element={<Layout />}>
              {/* Main app */}
              <Route path="/" element={<ALevelMathApp />} />

              {/* Auth pages */}
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              } />

              {/* Test pages */}
              <Route path="/test/api" element={<ApiTestPage />} />
              <Route path="/test/phase1" element={<Phase1TestPage />} />
              <Route path="/test/phase2" element={<Phase2TestPage />} />

              {/* Exam system (requires auth) */}
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

              {/* Learning recommendations (requires auth) */}
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

              {/* Topic Practice (requires auth) */}
              <Route path="/practice" element={
                <ProtectedRoute>
                  <PracticePage />
                </ProtectedRoute>
              } />

              {/* Question bank upload (requires auth) */}
              <Route path="/questions/upload" element={
                <ProtectedRoute>
                  <QuestionUploadPage />
                </ProtectedRoute>
              } />

              {/* 404 fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}
