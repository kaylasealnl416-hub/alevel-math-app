// ============================================================
// App.jsx - 主应用入口
// V2.0 - 模块化重构版本
// ============================================================

import { useState } from 'react';
import ALevelMathApp from './alevel-math-app.jsx';
import ApiTestPage from './ApiTestPage.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

export default function App() {
  // 检查URL参数，如果有 ?test=api 则显示API测试页面
  const isTestMode = new URLSearchParams(window.location.search).get('test') === 'api';

  return (
    <ErrorBoundary>
      {isTestMode ? <ApiTestPage /> : <ALevelMathApp />}
    </ErrorBoundary>
  );
}
