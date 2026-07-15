import { COMPLEXITY_LEVELS } from './constants.js';

/**
 * Calculate story points based on complexity dimensions
 * @param {Object} complexity - {ambiguity, artifactComplexity, stakeholderRisk, iterationLikelihood?}
 * @returns {number} Story points (1, 2, 3, 5, 8, or 13)
 */
export function calculateStoryPoints(complexity) {
  let total = 0;

  // Sum up complexity scores (Low=1, Medium=2, High=3)
  if (complexity.ambiguity) {
    total += COMPLEXITY_LEVELS[complexity.ambiguity].value;
  }
  if (complexity.artifactComplexity) {
    total += COMPLEXITY_LEVELS[complexity.artifactComplexity].value;
  }
  if (complexity.stakeholderRisk) {
    total += COMPLEXITY_LEVELS[complexity.stakeholderRisk].value;
  }
  if (complexity.iterationLikelihood) {
    total += COMPLEXITY_LEVELS[complexity.iterationLikelihood].value;
  }

  // Map total to Fibonacci scale
  if (total <= 4) return 1;
  if (total <= 6) return 2;
  if (total <= 8) return 3;
  if (total <= 10) return 5;
  if (total <= 12) return 8;
  return 13;
}

/**
 * Generate explanation text for the calculation
 * @param {Object} estimation - Full estimation object
 * @returns {string} Markdown-formatted breakdown
 */
export function generateBreakdown(estimation) {
  const {
    finalPoints,
    calculatedPoints,
    complexity,
    activities,
    weeks,
    isOverridden,
    overrideReason
  } = estimation;

  let breakdown = `# Story Points: ${finalPoints}\n\n`;

  if (isOverridden && calculatedPoints !== finalPoints) {
    breakdown += `*Calculated: ${calculatedPoints} → Adjusted to: ${finalPoints}*\n\n`;
  }

  breakdown += `## Complexity Assessment\n\n`;
  breakdown += `- **Problem/Solution Ambiguity:** ${complexity.ambiguity} (${COMPLEXITY_LEVELS[complexity.ambiguity].ambiguity})\n`;
  breakdown += `- **Artifact/Deliverable Complexity:** ${complexity.artifactComplexity} (${COMPLEXITY_LEVELS[complexity.artifactComplexity].artifactComplexity})\n`;
  breakdown += `- **Stakeholder/Dependency Risk:** ${complexity.stakeholderRisk} (${COMPLEXITY_LEVELS[complexity.stakeholderRisk].stakeholderRisk})\n`;

  if (complexity.iterationLikelihood) {
    breakdown += `- **Iteration Likelihood:** ${complexity.iterationLikelihood} (${COMPLEXITY_LEVELS[complexity.iterationLikelihood].iterationLikelihood})\n`;
  }

  breakdown += `\n## Selected Activities\n\n`;
  breakdown += activities.map(a => `- ${a}`).join('\n');

  breakdown += `\n\n## Analysis\n\n`;
  breakdown += generateNarrative(complexity, activities, finalPoints);

  if (weeks) {
    breakdown += `\n\n**Estimated Duration:** ${weeks} week${weeks > 1 ? 's' : ''}\n`;
  }

  if (isOverridden && overrideReason) {
    breakdown += `\n**Adjustment Reason:** ${overrideReason}\n`;
  }

  if (finalPoints === 13) {
    breakdown += `\n⚠️ **Recommendation:** This work may be too large. Consider breaking into smaller Discovery, Define, or Design items.\n`;
  }

  return breakdown;
}

/**
 * Generate narrative explanation based on complexity scores
 */
function generateNarrative(complexity, activities, points) {
  const levels = {
    low: 0,
    medium: 0,
    high: 0
  };

  Object.values(complexity).forEach(level => {
    if (level === 'Low') levels.low++;
    if (level === 'Medium') levels.medium++;
    if (level === 'High') levels.high++;
  });

  let narrative = `Based on your inputs, this work scores as ${points} story point${points > 1 ? 's' : ''}. `;

  if (levels.high >= 2) {
    narrative += `The high complexity across multiple dimensions (${levels.high} high ratings) indicates significant uncertainty and effort. `;
  } else if (levels.medium >= 2) {
    narrative += `The moderate complexity across several dimensions suggests meaningful work without being overly complex. `;
  } else {
    narrative += `The relatively low complexity indicates straightforward, well-understood work. `;
  }

  const activityCount = activities.length;
  if (activityCount >= 5 && points <= 3) {
    narrative += `Note: ${activityCount} activities selected, which may indicate higher complexity than the current ${points}-point estimate suggests. `;
  }

  return narrative;
}
