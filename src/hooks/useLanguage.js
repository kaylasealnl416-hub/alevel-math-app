import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'alevel_math_language';
const SUPPORTED_LANGUAGES = ['en', 'zh'];

// ============================================================
// useLanguage Hook
// Manages language state with localStorage persistence
// ============================================================
function useLanguage(defaultLang = 'en') {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
        return saved;
      }
    } catch (e) {
      console.warn('Failed to load language preference:', e);
    }
    return defaultLang;
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (e) {
      console.warn('Failed to save language preference:', e);
    }
  }, [language]);

  // Toggle language
  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => prev === 'en' ? 'zh' : 'en');
  }, []);

  // Set specific language
  const setLanguage = useCallback((lang) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setLanguageState(lang);
    } else {
      console.warn(`Unsupported language: ${lang}`);
    }
  }, []);

  // Check if current language is English
  const isEnglish = language === 'en';

  // Check if current language is Chinese
  const isChinese = language === 'zh';

  return {
    language,
    setLanguage,
    toggleLanguage,
    isEnglish,
    isChinese,
    supportedLanguages: SUPPORTED_LANGUAGES
  };
}

export default useLanguage;
