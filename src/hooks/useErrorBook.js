import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'alevel_math_errorbook';

// ============================================================
// useErrorBook Hook
// Manages wrong answers notebook with localStorage persistence
// ============================================================
function useErrorBook() {
  const [errors, setErrors] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to load error book:', e);
      return [];
    }
  });

  // Persist to localStorage whenever errors change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(errors));
    } catch (e) {
      console.warn('Failed to save error book:', e);
    }
  }, [errors]);

  // Add a new error
  const addError = useCallback((error) => {
    setErrors(prev => {
      // Check if this exact error already exists
      const exists = prev.some(e =>
        e.question === error.question &&
        e.userAnswer === error.userAnswer
      );

      if (exists) {
        return prev; // Don't add duplicates
      }

      const newError = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...error
      };

      return [...prev, newError];
    });
  }, []);

  // Remove an error by ID
  const removeError = useCallback((errorId) => {
    setErrors(prev => prev.filter(e => e.id !== errorId));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Get errors by subject/book/chapter
  const getErrorsByContext = useCallback((subject, book, chapter) => {
    return errors.filter(e => {
      if (subject && e.subject !== subject) return false;
      if (book && e.book !== book) return false;
      if (chapter && e.chapter !== chapter) return false;
      return true;
    });
  }, [errors]);

  // Get error count
  const getErrorCount = useCallback((subject, book, chapter) => {
    return getErrorsByContext(subject, book, chapter).length;
  }, [getErrorsByContext]);

  return {
    errors,
    addError,
    removeError,
    clearErrors,
    getErrorsByContext,
    getErrorCount,
    errorCount: errors.length
  };
}

export default useErrorBook;
