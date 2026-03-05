// ============================================================
// App.jsx - 主应用入口
// V2.0 - 模块化重构版本
// ============================================================

import { useState, useEffect } from 'react';
import ALevelMathApp from './alevel-math-app.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

export default function App() {
  return (
    <ErrorBoundary>
      <ALevelMathApp />
    </ErrorBoundary>
  );
}
