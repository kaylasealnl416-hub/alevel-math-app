/**
 * Content utility functions for English-first content access
 *
 * This utility ensures consistent English content retrieval from JSONB fields
 * that may contain multiple languages in the format: { en: "...", zh: "..." }
 */

/**
 * Get English content from a multilingual field
 * @param {string|object} content - Content that may be a string or object with language keys
 * @returns {string} English content, falling back to Chinese if English not available
 */
export const getEnglishContent = (content) => {
  if (!content) return ''
  if (typeof content === 'string') return content
  return content?.en || content?.zh || ''
}

/**
 * Get English text from an object that may have language-specific fields
 * @param {object} obj - Object with potential language fields
 * @param {string} field - Field name to access
 * @returns {string} English content
 */
export const getEnglishField = (obj, field) => {
  if (!obj || !field) return ''
  const value = obj[field]
  return getEnglishContent(value)
}
