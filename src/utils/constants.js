// ============================================================
// App Constants Configuration
// ============================================================

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'auth_user',
  ERRORBOOK: 'alevel_math_errorbook'
};

// API Base URL
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Theme Colors
export const COLORS = {
  primary: '#DA291C',      // Math red
  primaryLight: '#DA291C55',
  secondary: '#003087',    // Edexcel blue
  accent: '#FFC72C',       // Gold
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  background: '#F2F2F2',
  text: '#111111',
  textMuted: '#666666',
  border: '#e0e0e0'
};

// Subject Colors
export const SUBJECT_COLORS = {
  mathematics: '#DA291C',
  further_math: '#6f42c1',
  economics: '#28a745',
  history: '#fd7e14',
  politics: '#17a2b8'
};

// API Configuration
export const API_CONFIG = {
  providers: [
    { id: 'anthropic', name: 'Anthropic Claude', nameZh: 'Anthropic Claude' },
    { id: 'minimax', name: 'MiniMax', nameZh: 'MiniMax' },
    { id: 'zhipu', name: 'Zhipu AI', nameZh: '智谱AI' }
  ],
  defaultProvider: 'anthropic',
  defaultModel: 'claude-3-haiku-20240307'
};

// App Information
export const APP_INFO = {
  name: 'A-Level Math Learning Hub',
  nameZh: 'A-Level 学习中心',
  version: '1.0.0',
  author: ''
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  foundation: { label: 'Foundation', labelZh: '基础', color: '#28a745' },
  intermediate: { label: 'Intermediate', labelZh: '中级', color: '#ffc107' },
  advanced: { label: 'Advanced', labelZh: '高级', color: '#dc3545' }
};

export default {
  COLORS,
  SUBJECT_COLORS,
  API_CONFIG,
  APP_INFO,
  DIFFICULTY_LEVELS
};
