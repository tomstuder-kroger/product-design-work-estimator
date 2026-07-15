const HISTORY_KEY = 'storypoint_history';
const DRAFT_KEY = 'storypoint_draft';
const MAX_HISTORY_ITEMS = 100;

/**
 * Save history to localStorage
 * @param {Array} history - Array of estimation objects
 */
export function saveHistory(history) {
  try {
    // Limit to max items, keep newest
    const limited = history.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

/**
 * Load history from localStorage
 * @returns {Array} Array of estimation objects
 */
export function loadHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

/**
 * Save draft wizard state
 * @param {Object} wizardData - Current wizard form data
 * @param {number} currentStep - Current step (1-5)
 */
export function saveDraft(wizardData, currentStep) {
  try {
    const draft = {
      wizardData,
      currentStep,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
}

/**
 * Load draft from localStorage
 * @returns {Object|null} Draft object or null if none exists or expired
 */
export function loadDraft() {
  try {
    const data = localStorage.getItem(DRAFT_KEY);
    if (!data) return null;

    const draft = JSON.parse(data);
    const lastSaved = new Date(draft.lastSaved);
    const now = new Date();
    const daysSince = (now - lastSaved) / (1000 * 60 * 60 * 24);

    // Expire drafts older than 7 days
    if (daysSince > 7) {
      clearDraft();
      return null;
    }

    return draft;
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
}

/**
 * Clear draft from localStorage
 */
export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error('Failed to clear draft:', error);
  }
}
