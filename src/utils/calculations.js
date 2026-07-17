import { COMPLEXITY_LEVELS, ACTIVITIES_DATA } from './constants.js';

/**
 * Calculate activity contribution score based on weighted activities
 * @param {Array<string>} selectedActivities - Array of activity names
 * @param {Object} adjustments - Map of activity name to adjustment (-1, 0, +1)
 * @returns {number} Activity score contribution (0-4 points)
 */
export function calculateActivityScore(selectedActivities, adjustments = {}) {
  let totalWeight = 0;

  selectedActivities.forEach(activityName => {
    const activity = ACTIVITIES_DATA.find(a => a.name === activityName);
    if (!activity) return; // Skip if activity not found

    const adjustment = adjustments[activityName] || 0;
    const effectiveWeight = Math.max(1, Math.min(3, activity.defaultWeight + adjustment));
    totalWeight += effectiveWeight;
  });

  // Map total weight to contribution score
  if (totalWeight === 0) return 0;
  if (totalWeight <= 3) return 0;
  if (totalWeight <= 8) return 1;
  if (totalWeight <= 15) return 2;
  if (totalWeight <= 24) return 3;
  return 4;
}

/**
 * Map story points to T-shirt size
 * @param {number} storyPoints - Story points (1, 2, 3, 5, 8, 13)
 * @returns {string} T-shirt size ('XS', 'S', 'M', 'L', 'XL')
 */
export function calculateTShirtSize(storyPoints) {
  if (storyPoints <= 2) return 'XS';
  if (storyPoints === 3) return 'S';
  if (storyPoints === 5) return 'M';
  if (storyPoints === 8) return 'L';
  return 'XL';
}

/**
 * Calculate story points based on complexity dimensions, weighted activities, and duration
 * @param {Object} complexity - {ambiguity, artifactComplexity, stakeholderRisk, iterationLikelihood?}
 * @param {Array<string>|number} selectedActivities - Array of selected activity names OR legacy activityCount number
 * @param {Object} activityAdjustments - Map of activity name to adjustment (-1, 0, +1)
 * @param {number} weeks - Duration in weeks
 * @returns {number} Story points (1, 2, 3, 5, 8, or 13)
 */
export function calculateStoryPoints(complexity, selectedActivities = [], activityAdjustments = {}, weeks = 0) {
  let total = 0;

  // Base Score: Sum up complexity scores (Low=1, Medium=2, High=3)
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

  // Activity Score: Use weighted calculation if array, otherwise use legacy logic
  if (Array.isArray(selectedActivities)) {
    total += calculateActivityScore(selectedActivities, activityAdjustments);
  } else {
    // Legacy support: activityCount as number
    const activityCount = selectedActivities;
    if (activityCount >= 8) {
      total += 3;
    } else if (activityCount >= 4) {
      total += 2;
    } else if (activityCount >= 2) {
      total += 1;
    }
  }

  // Duration Factor: Longer timeframes indicate more complexity/unknowns
  const weeksNum = Number(weeks) || 0;
  if (weeksNum >= 11) {
    total += 3;
  } else if (weeksNum >= 6) {
    total += 2;
  } else if (weeksNum >= 3) {
    total += 1;
  }

  // Map total to Fibonacci scale
  if (total <= 4) return 1;
  if (total <= 6) return 2;
  if (total <= 8) return 3;
  if (total <= 11) return 5;
  if (total <= 15) return 8;
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
    activityAdjustments = {},
    weeks,
    isOverridden,
    overrideReason,
    finalTShirtSize,
    calculatedTShirtSize,
    isTShirtOverridden,
    tShirtOverrideReason
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

  // Calculate total weight for display
  let totalWeight = 0;
  const adjustedActivities = [];

  activities.forEach(activityName => {
    const activity = ACTIVITIES_DATA.find(a => a.name === activityName);
    if (activity) {
      const adjustment = activityAdjustments[activityName] || 0;
      const effectiveWeight = Math.max(1, Math.min(3, activity.defaultWeight + adjustment));
      totalWeight += effectiveWeight;

      if (adjustment !== 0) {
        const complexity = adjustment > 0 ? 'more complex' : 'less complex';
        adjustedActivities.push(`${activityName} (${complexity})`);
      }
    }
  });

  const activityScore = calculateActivityScore(activities, activityAdjustments);
  breakdown += `**Total:** ${activities.length} activit${activities.length === 1 ? 'y' : 'ies'} selected (total weight: ${totalWeight}, contribution: +${activityScore} point${activityScore === 1 ? '' : 's'})\n\n`;

  breakdown += activities.map(a => {
    const adjustment = activityAdjustments[a];
    if (adjustment && adjustment !== 0) {
      const label = adjustment > 0 ? 'more complex' : 'less complex';
      return `- ${a} *(${label})*`;
    }
    return `- ${a}`;
  }).join('\n');

  breakdown += `\n\n## T-Shirt Size\n\n`;
  if (isTShirtOverridden && calculatedTShirtSize !== finalTShirtSize) {
    breakdown += `**${finalTShirtSize}** *(calculated: ${calculatedTShirtSize}, adjusted)*\n`;
  } else {
    breakdown += `**${finalTShirtSize}** *(based on ${finalPoints} story point${finalPoints === 1 ? '' : 's'})*\n`;
  }

  breakdown += `\n## Analysis\n\n`;
  breakdown += generateNarrative(complexity, activities, finalPoints);

  if (weeks) {
    breakdown += `\n\n**Estimated Duration:** ${weeks} week${weeks > 1 ? 's' : ''}\n`;
  }

  if (isOverridden && overrideReason) {
    breakdown += `\n**Story Points Adjustment Reason:** ${overrideReason}\n`;
  }

  if (isTShirtOverridden && tShirtOverrideReason) {
    breakdown += `\n**T-Shirt Size Adjustment Reason:** ${tShirtOverrideReason}\n`;
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
