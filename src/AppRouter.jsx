// ============================================================
// AppRouter.jsx - route configuration with code splitting
// All routes wrapped in Layout for consistent Navbar
// ============================================================

import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Lazy-loaded route components for code splitting
const ALevelMathApp = lazy(() => import('./alevel-math-app.jsx'))
const AuthPage = lazy(() => import('./components/AuthPage.jsx'))
const UserProfilePage = lazy(() => import('./components/UserProfilePage.jsx'))
const ExamListPage = lazy(() => import('./components/ExamListPage.jsx'))
const ExamTakingPage = lazy(() => import('./components/ExamTakingPage.jsx'))
const ExamResultPage = lazy(() => import('./components/ExamResultPage.jsx'))
const LearningPlanPage = lazy(() => import('./components/LearningPlanPage.jsx'))
const WrongQuestionsPage = lazy(() => import('./components/WrongQuestionsPage.jsx'))
const PracticePage = lazy(() => import('./components/PracticePage.jsx'))
const QuestionUploadPage = lazy(() => import('./components/QuestionUploadPage.jsx'))
const ChatPage = lazy(() => import('./components/ChatPage.jsx'))

// Minimal loading fallback
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    color: '#5f6368',
    fontSize: 14,
  }}>
    Loading...
  </div>
)

export default function AppRouter() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
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

                {/* AI Chat (requires auth) */}
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <ChatPage />
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
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}
