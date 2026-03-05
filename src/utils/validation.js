// ============================================================
// Validation Utility Module
// Input validation and sanitization helpers
// ============================================================

// ============================================================
// String Validation
// ============================================================

/**
 * Validate and sanitize string input
 */
export function sanitizeString(str, maxLength = 1000) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

/**
 * Validate non-empty string
 */
export function requireString(value, fieldName = 'Field') {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${fieldName} is required`);
  }
  return value.trim();
}

/**
 * Validate API key format (basic check)
 */
export function validateApiKey(key, provider = 'anthropic') {
  if (!key || typeof key !== 'string') {
    return { valid: false, error: 'API key is required' };
  }

  const trimmed = key.trim();

  if (trimmed.length < 10) {
    return { valid: false, error: 'API key is too short' };
  }

  // Provider-specific validation
  switch (provider) {
    case 'anthropic':
      // Anthropic keys typically start with 'sk-ant-'
      if (!trimmed.startsWith('sk-ant-') && trimmed.length < 20) {
        return { valid: false, error: 'Invalid Anthropic API key format' };
      }
      break;
    case 'minimax':
      // MiniMax keys are usually longer
      if (trimmed.length < 20) {
        return { valid: false, error: 'Invalid MiniMax API key format' };
      }
      break;
    case 'zhipu':
      // Zhipu keys
      if (trimmed.length < 10) {
        return { valid: false, error: 'Invalid Zhipu API key format' };
      }
      break;
    default:
      break;
  }

  return { valid: true };
}

// ============================================================
// Number Validation
// ============================================================

/**
 * Validate number is within range
 */
export function validateNumber(value, min, max, fieldName = 'Value') {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`${fieldName} must be a number`);
  }
  if (num < min || num > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}`);
  }
  return num;
}

/**
 * Validate positive number
 */
export function requirePositiveNumber(value, fieldName = 'Value') {
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    throw new Error(`${fieldName} must be a positive number`);
  }
  return num;
}

// ============================================================
// Array Validation
// ============================================================

/**
 * Validate array is not empty
 */
export function requireArray(value, fieldName = 'Array') {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${fieldName} cannot be empty`);
  }
  return value;
}

/**
 * Validate array contains specific type
 */
export function validateArrayType(arr, type, fieldName = 'Array') {
  if (!Array.isArray(arr)) {
    throw new Error(`${fieldName} must be an array`);
  }
  const invalidItems = arr.filter(item => typeof item !== type);
  if (invalidItems.length > 0) {
    throw new Error(`${fieldName} must contain only ${type} values`);
  }
  return arr;
}

// ============================================================
// Object Validation
// ============================================================

/**
 * Validate object has required keys
 */
export function requireKeys(obj, keys, fieldName = 'Object') {
  if (!obj || typeof obj !== 'object') {
    throw new Error(`${fieldName} must be an object`);
  }
  const missingKeys = keys.filter(key => !(key in obj));
  if (missingKeys.length > 0) {
    throw new Error(`${fieldName} is missing required keys: ${missingKeys.join(', ')}`);
  }
  return obj;
}

// ============================================================
// Quiz/Exam Answer Validation
// ============================================================

/**
 * Validate quiz answer format
 */
export function validateQuizAnswer(answer, questionType = 'multiple_choice') {
  switch (questionType) {
    case 'multiple_choice':
      if (!answer || !['A', 'B', 'C', 'D', 'a', 'b', 'c', 'd'].includes(answer.trim())) {
        return { valid: false, error: 'Answer must be A, B, C, or D' };
      }
      return { valid: true, answer: answer.trim().toUpperCase() };

    case 'short_answer':
      if (!answer || answer.trim().length === 0) {
        return { valid: false, error: 'Answer cannot be empty' };
      }
      return { valid: true, answer: sanitizeString(answer, 500) };

    case 'numeric':
      const num = Number(answer);
      if (isNaN(num)) {
        return { valid: false, error: 'Answer must be a number' };
      }
      return { valid: true, answer: num };

    default:
      return { valid: true, answer: sanitizeString(answer, 500) };
  }
}

/**
 * Validate exam time format (minutes)
 */
export function validateExamTime(minutes) {
  const num = Number(minutes);
  if (isNaN(num) || num < 1 || num > 180) {
    throw new Error('Exam time must be between 1 and 180 minutes');
  }
  return num;
}

// ============================================================
// URL Validation
// ============================================================

/**
 * Validate YouTube URL
 */
export function validateYouTubeUrl(url) {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }

  const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  if (!youtubeRegex.test(url)) {
    return { valid: false, error: 'Invalid YouTube URL' };
  }

  return { valid: true };
}

export default {
  sanitizeString,
  requireString,
  validateApiKey,
  validateNumber,
  requirePositiveNumber,
  requireArray,
  validateArrayType,
  requireKeys,
  validateQuizAnswer,
  validateExamTime,
  validateYouTubeUrl
};
