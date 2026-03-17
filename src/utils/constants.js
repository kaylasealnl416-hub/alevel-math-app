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
  // Brand color (Math red / app accent) — used sparingly for interactive elements
  brand:        '#DA291C',
  brandHover:   '#B71C1C',
  brandLight:   '#FEF2F2',
  brandBorder:  '#FECACA',
  brandRing:    'rgba(218,41,28,0.12)',

  // Neutral text scale
  text:         '#0F172A',  // headings
  textSub:      '#1E293B',  // subheadings / nav
  textBody:     '#374151',  // form labels / body copy
  textMuted:    '#64748B',  // secondary / captions
  textFaint:    '#94A3B8',  // placeholders / hints
  textDisabled: '#CBD5E1',  // disabled states

  // Background scale
  bgPage:    '#F2F2F2',  // app background
  bgCard:    '#FFFFFF',  // card / panel
  bgSurface: '#F8FAFC',  // subtle surface
  bgHover:   '#F1F5F9',  // hover overlay

  // Borders
  border:      '#E2E8F0',
  borderLight: '#F1F5F9',

  // Semantic states
  success:      '#10B981',
  successLight: '#D1FAE5',
  successBorder:'#6EE7B7',
  warning:      '#F59E0B',
  warningLight: '#FEF3C7',
  warningBorder:'#FCD34D',
  error:        '#EF4444',
  errorLight:   '#FEE2E2',
  errorBorder:  '#FECACA',
  info:         '#3B82F6',
  infoLight:    '#DBEAFE',
  infoBorder:   '#BFDBFE',

  // Backward compatibility aliases
  primary:      '#DA291C',
  primaryLight: 'rgba(218,41,28,0.1)',
  secondary:    '#003087',
  accent:       '#FFC72C',
  background:   '#F2F2F2',
};

// ─── Subject Colors ──────────────────────────────────────────
// Each subject gets base + light + border for card styling.
// Designed to be fresh and visually distinct from each other.
export const SUBJECT_COLORS = {
  mathematics:  { base: '#DA291C', light: '#FEF2F2', border: '#FECACA', hover: '#B71C1C' },
  further_math: { base: '#7C3AED', light: '#F5F3FF', border: '#DDD6FE', hover: '#6D28D9' },
  economics:    { base: '#0891B2', light: '#ECFEFF', border: '#A5F3FC', hover: '#0E7490' },
  history:      { base: '#B45309', light: '#FFFBEB', border: '#FDE68A', hover: '#92400E' },
  politics:     { base: '#2563EB', light: '#EFF6FF', border: '#BFDBFE', hover: '#1D4ED8' },
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
  foundation:   { label: 'Foundation',   labelZh: 'Foundation',   color: '#10B981' },
  intermediate: { label: 'Intermediate', labelZh: 'Intermediate', color: '#F59E0B' },
  advanced:     { label: 'Advanced',     labelZh: 'Advanced',     color: '#EF4444' }
};

export default {
  COLORS,
  SUBJECT_COLORS,
  API_CONFIG,
  APP_INFO,
  DIFFICULTY_LEVELS
};
