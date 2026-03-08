// ============================================================
// App.jsx - 主应用入口
// V2.0 - 模块化重构版本
// ============================================================

import { useState } from 'react';
import ALevelMathApp from './alevel-math-app.jsx';
import ApiTestPage from './ApiTestPage.jsx';
import Phase1TestPage from './components/Phase1TestPage.jsx';
import Phase2TestPage from './components/Phase2TestPage.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

export default function App() {
  // 检查URL参数，支持不同的测试页面
  const testMode = new URLSearchParams(window.location.search).get('test');

  // 根据测试模式渲染不同页面
  let content;
  switch (testMode) {
    case 'api':
      content = <ApiTestPage />;
      break;
    case 'phase1':
      content = <Phase1TestPage />;
      break;
    case 'phase2':
      content = <Phase2TestPage />;
      break;
    default:
      content = <ALevelMathApp />;
  }

  return (
    <ErrorBoundary>
      {content}
    </ErrorBoundary>
  );
}
