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
export const API_BASE = import.meta.env.VITE_API_URL || '';

// ─── Color Tokens ────────────────────────────────────────────
// Single source of truth for all colors.
// Components should import COLORS and SUBJECT_COLORS from here.
export const COLORS = {
  // Brand color (Google Blue accent)
  brand:        '#1a73e8',
  brandHover:   '#1967d2',
  brandLight:   '#e8f0fe',
  brandBorder:  '#aecbfa',
  brandRing:    'rgba(26,115,232,0.12)',

  // Neutral text scale (Google Material)
  text:         '#202124',  // headings
  textSub:      '#202124',  // subheadings / nav
  textBody:     '#3c4043',  // form labels / body copy
  textMuted:    '#5f6368',  // secondary / captions
  textFaint:    '#80868b',  // placeholders / hints
  textDisabled: '#dadce0',  // disabled states

  // Background scale
  bgPage:    '#f8f9fa',  // app background
  bgCard:    '#ffffff',  // card / panel
  bgSurface: '#f8f9fa',  // subtle surface
  bgHover:   '#f1f3f4',  // hover overlay

  // Borders
  border:      '#dadce0',
  borderLight: '#f1f3f4',

  // Semantic states
  success:      '#188038',
  successLight: '#e6f4ea',
  successBorder:'#ceead6',
  warning:      '#f9ab00',
  warningLight: '#fef7e0',
  warningBorder:'#fdd663',
  error:        '#d93025',
  errorLight:   '#fce8e6',
  errorBorder:  '#fad2cf',
  info:         '#1a73e8',
  infoLight:    '#e8f0fe',
  infoBorder:   '#aecbfa',

  // Backward compatibility aliases
  primary:      '#1a73e8',
  primaryLight: 'rgba(26,115,232,0.1)',
  secondary:    '#1967d2',
  accent:       '#fbbc04',
  background:   '#f8f9fa',
};

// ─── Subject Colors ──────────────────────────────────────────
// Each subject gets base + light + border for card styling.
// Designed to be fresh and visually distinct from each other.
export const SUBJECT_COLORS = {
  mathematics:  { base: '#1a73e8', light: '#e8f0fe', border: '#aecbfa', hover: '#1967d2' },
  further_math: { base: '#7C3AED', light: '#F5F3FF', border: '#DDD6FE', hover: '#6D28D9' },
  economics:    { base: '#0891B2', light: '#ECFEFF', border: '#A5F3FC', hover: '#0E7490' },
  history:      { base: '#B45309', light: '#FFFBEB', border: '#FDE68A', hover: '#92400E' },
  politics:     { base: '#1967d2', light: '#e8f0fe', border: '#BFDBFE', hover: '#1D4ED8' },
  chemistry:    { base: '#4F46E5', light: '#EEF2FF', border: '#C7D2FE', hover: '#4338CA' },
  physics:      { base: '#0E7490', light: '#F0FDFF', border: '#67E8F9', hover: '#0C5F72' },
  biology:      { base: '#16A34A', light: '#F0FDF4', border: '#BBF7D0', hover: '#15803D' },
  business:     { base: '#EA580C', light: '#FFF7ED', border: '#FED7AA', hover: '#C2410C' },
};

// ─── API Configuration ───────────────────────────────────────
export const API_CONFIG = {
  providers: [
    { id: 'anthropic', name: 'Anthropic Claude', nameZh: 'Anthropic Claude' },
    { id: 'minimax', name: 'MiniMax', nameZh: 'MiniMax' },
    { id: 'zhipu', name: 'Zhipu AI', nameZh: 'Zhipu AI' }
  ],
  defaultProvider: 'anthropic',
  defaultModel: 'claude-3-haiku-20240307'
};

// App Information
export const APP_INFO = {
  name: 'A-Level Math Learning Hub',
  nameZh: 'A-Level Learning Hub',
  version: '1.0.0',
  author: ''
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  foundation:   { label: 'Foundation',   labelZh: 'Foundation',   color: '#188038' },
  intermediate: { label: 'Intermediate', labelZh: 'Intermediate', color: '#F59E0B' },
  advanced:     { label: 'Advanced',     labelZh: 'Advanced',     color: '#d93025' }
};

export default {
  COLORS,
  SUBJECT_COLORS,
  API_CONFIG,
  APP_INFO,
  DIFFICULTY_LEVELS
};
