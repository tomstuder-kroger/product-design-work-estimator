import { calculateActivityScore, calculateTShirtSize, calculateStoryPoints, calculateRecommendedWeeks, validateWeeksEstimate, generateBreakdown } from './calculations.js';
import { ACTIVITIES_DATA } from './constants.js';

describe('calculateActivityScore', () => {
  test('returns 0 for no activities', () => {
    expect(calculateActivityScore([], {})).toBe(0);
  });

  test('calculates score for low-weight activities', () => {
    // 3 activities with weight 1 each = total 3 → score 0
    const activities = ['Research planning', 'Surveys', 'Brainstorm session'];
    expect(calculateActivityScore(activities, {})).toBe(0);
  });

  test('calculates score for medium-weight activities', () => {
    // 4 activities with weight 2 each = total 8 → score 1
    const activities = ['User interviews (6-10)', 'Wireframing (high-fidelity)', 'Clickable prototype', 'User Flow - Current State'];
    expect(calculateActivityScore(activities, {})).toBe(1);
  });

  test('calculates score for high-weight activities', () => {
    // 5 activities with weight 3 each = total 15 → score 2
    const activities = ['Journey map creation', 'Service blueprint creation', 'Design system work', 'MVP definition', 'Gigamap'];
    expect(calculateActivityScore(activities, {})).toBe(2);
  });

  test('calculates score for very high total weight', () => {
    // 9 activities with weight 3 each = total 27 → score 4
    const activities = [
      'Journey map creation', 'Service blueprint creation', 'Design system work',
      'MVP definition', 'Gigamap', 'Ecosystem Map', 'Dependency Map',
      'Multi-platform design (responsive)', 'Champion/Challenger testing'
    ];
    expect(calculateActivityScore(activities, {})).toBe(4);
  });
});

describe('calculateActivityScore with adjustments', () => {
  test('applies positive adjustment (+1)', () => {
    // 1 activity weight 1, adjusted +1 = effective weight 2
    const activities = ['Research planning'];
    const adjustments = { 'Research planning': 1 };
    const scoreWithout = calculateActivityScore(activities, {});
    const scoreWith = calculateActivityScore(activities, adjustments);
    expect(scoreWith).toBeGreaterThanOrEqual(scoreWithout);
  });

  test('applies negative adjustment (-1)', () => {
    // 1 activity weight 3, adjusted -1 = effective weight 2
    const activities = ['Journey map creation'];
    const adjustments = { 'Journey map creation': -1 };
    // Total weight 2 vs 3, both map to score 0, but verify calculation works
    expect(calculateActivityScore(activities, adjustments)).toBe(0);
  });

  test('clamps adjustment to valid range', () => {
    // Weight 1 with -1 adjustment = minimum 1 (not 0)
    const activities = ['Research planning'];
    const adjustments = { 'Research planning': -1 };
    const score = calculateActivityScore(activities, adjustments);
    expect(score).toBe(0); // 1 weight still maps to 0 score
  });

  test('handles mixed adjustments', () => {
    const activities = ['Journey map creation', 'Research planning', 'Design system work'];
    const adjustments = {
      'Journey map creation': 1,  // 3+1=3 (clamped)
      'Research planning': -1,     // 1-1=1 (clamped)
      'Design system work': 0      // 3+0=3
    };
    // Total: 3 + 1 + 3 = 7 → score 1
    expect(calculateActivityScore(activities, adjustments)).toBe(1);
  });
});

describe('calculateTShirtSize', () => {
  test('maps 1 point to XS', () => {
    expect(calculateTShirtSize(1)).toBe('XS');
  });

  test('maps 2 points to XS', () => {
    expect(calculateTShirtSize(2)).toBe('XS');
  });

  test('maps 3 points to S', () => {
    expect(calculateTShirtSize(3)).toBe('S');
  });

  test('maps 5 points to M', () => {
    expect(calculateTShirtSize(5)).toBe('M');
  });

  test('maps 8 points to L', () => {
    expect(calculateTShirtSize(8)).toBe('L');
  });

  test('maps 13 points to XL', () => {
    expect(calculateTShirtSize(13)).toBe('XL');
  });
});

describe('calculateStoryPoints integration', () => {
  test('calculates points with weighted activities', () => {
    const complexity = {
      ambiguity: 'Medium',
      artifactComplexity: 'Medium',
      stakeholderRisk: 'Low',
      iterationLikelihood: 'Low'
    };
    const activities = ['Journey map creation', 'User interviews (6-10)', 'Wireframing (high-fidelity)'];
    const adjustments = {};
    const weeks = 4;

    const points = calculateStoryPoints(complexity, activities, adjustments, weeks);
    // Complexity: 2+2+1+1=6, Activities: 3+2+2=7→score 1, Weeks: 4→score 1
    // Total: 6+1+1=8 → 3 points
    expect(points).toBe(3);
  });

  test('calculates points with activity adjustments', () => {
    const complexity = {
      ambiguity: 'Low',
      artifactComplexity: 'Low',
      stakeholderRisk: 'Low'
    };
    const activities = ['Research planning', 'Surveys'];
    const adjustments = {
      'Research planning': 1,  // 1+1=2
      'Surveys': 1              // 1+1=2
    };
    const weeks = 0;

    const points = calculateStoryPoints(complexity, activities, adjustments, weeks);
    // Complexity: 1+1+1=3, Activities: 2+2=4→score 1, Weeks: 0→score 0
    // Total: 3+1+0=4 → 1 point
    expect(points).toBe(1);
  });
});

describe('calculateRecommendedWeeks', () => {
  test('returns 1-2 weeks for 1 point', () => {
    expect(calculateRecommendedWeeks(1)).toEqual({ min: 1, max: 2 });
  });

  test('returns 1-2 weeks for 2 points', () => {
    expect(calculateRecommendedWeeks(2)).toEqual({ min: 1, max: 2 });
  });

  test('returns 2-3 weeks for 3 points', () => {
    expect(calculateRecommendedWeeks(3)).toEqual({ min: 2, max: 3 });
  });

  test('returns 3-5 weeks for 5 points', () => {
    expect(calculateRecommendedWeeks(5)).toEqual({ min: 3, max: 5 });
  });

  test('returns 5-8 weeks for 8 points', () => {
    expect(calculateRecommendedWeeks(8)).toEqual({ min: 5, max: 8 });
  });

  test('returns 8-12 weeks for 13 points', () => {
    expect(calculateRecommendedWeeks(13)).toEqual({ min: 8, max: 12 });
  });
});

describe('validateWeeksEstimate', () => {
  test('returns severity none when no weeks entered', () => {
    const result = validateWeeksEstimate('', 5);
    expect(result.severity).toBe('none');
    expect(result.message).toBe('');
  });

  test('returns severity none when within recommended range', () => {
    const result = validateWeeksEstimate(4, 5); // 5 points recommends 3-5 weeks
    expect(result.severity).toBe('none');
    expect(result.recommendation).toEqual({ min: 3, max: 5 });
    expect(result.message).toBe('');
  });

  test('returns severity info when below recommended but within tolerance', () => {
    const result = validateWeeksEstimate(2, 5); // 5 points recommends 3-5, tolerance 2.1-6.5 → 2-7
    expect(result.severity).toBe('info');
    expect(result.message).toContain('on the low end');
    expect(result.message).toContain('3-5 weeks');
  });

  test('returns severity info when above recommended but within tolerance', () => {
    const result = validateWeeksEstimate(6, 5); // 5 points recommends 3-5, tolerance 2.1-6.5 → 2-7
    expect(result.severity).toBe('info');
    expect(result.message).toContain('on the high end');
    expect(result.message).toContain('3-5 weeks');
  });

  test('returns severity warning when below tolerance', () => {
    const result = validateWeeksEstimate(1, 5); // 5 points, tolerance min is 2
    expect(result.severity).toBe('warning');
    expect(result.message).toContain('too short');
    expect(result.message).toContain('3-5 weeks');
  });

  test('returns severity warning when above tolerance', () => {
    const result = validateWeeksEstimate(8, 5); // 5 points, tolerance max is 7
    expect(result.severity).toBe('warning');
    expect(result.message).toContain('too long');
    expect(result.message).toContain('3-5 weeks');
  });

  test('returns severity warning for zero weeks', () => {
    const result = validateWeeksEstimate(0, 5);
    expect(result.severity).toBe('warning');
    expect(result.message).toContain('unrealistic');
  });

  test('handles decimal weeks correctly', () => {
    const result = validateWeeksEstimate(2.5, 3); // 3 points recommends 2-3 weeks
    expect(result.severity).toBe('none');
  });

  test('validates 1-point task correctly', () => {
    const result = validateWeeksEstimate(1, 1); // 1 point recommends 1-2 weeks
    expect(result.severity).toBe('none');
  });

  test('validates 13-point task correctly', () => {
    const result = validateWeeksEstimate(10, 13); // 13 points recommends 8-12 weeks
    expect(result.severity).toBe('none');
  });

  test('warns on significant underestimate for 8-point task', () => {
    const result = validateWeeksEstimate(2, 8); // 8 points recommends 5-8, tolerance 3.5-10.4 → 3-11
    expect(result.severity).toBe('warning');
    expect(result.message).toContain('too short');
  });
});

describe('generateBreakdown with time validation', () => {
  test('includes time analysis when weeks are specified', () => {
    const estimation = {
      finalPoints: 5,
      calculatedPoints: 5,
      complexity: {
        ambiguity: 'Medium',
        artifactComplexity: 'Medium',
        stakeholderRisk: 'Low'
      },
      activities: ['User interviews', 'Wireframing'],
      activityAdjustments: {},
      weeks: 4,
      isOverridden: false,
      finalTShirtSize: 'M',
      calculatedTShirtSize: 'M',
      isTShirtOverridden: false
    };

    const breakdown = generateBreakdown(estimation);
    expect(breakdown).toContain('## Time Estimate Analysis');
    expect(breakdown).toContain('**Your Estimate:** 4 weeks');
    expect(breakdown).toContain('**Recommended Range:** 3-5 weeks');
  });

  test('shows not specified when weeks not entered', () => {
    const estimation = {
      finalPoints: 5,
      calculatedPoints: 5,
      complexity: {
        ambiguity: 'Medium',
        artifactComplexity: 'Medium',
        stakeholderRisk: 'Low'
      },
      activities: ['User interviews'],
      activityAdjustments: {},
      weeks: '',
      isOverridden: false,
      finalTShirtSize: 'M',
      calculatedTShirtSize: 'M',
      isTShirtOverridden: false
    };

    const breakdown = generateBreakdown(estimation);
    expect(breakdown).toContain('## Time Estimate Analysis');
    expect(breakdown).toContain('**Your Estimate:** Not specified');
  });

  test('includes validation warning for mismatched estimate', () => {
    const estimation = {
      finalPoints: 8,
      calculatedPoints: 8,
      complexity: {
        ambiguity: 'High',
        artifactComplexity: 'High',
        stakeholderRisk: 'High'
      },
      activities: ['Design system work', 'Journey map creation'],
      activityAdjustments: {},
      weeks: 2,
      isOverridden: false,
      finalTShirtSize: 'L',
      calculatedTShirtSize: 'L',
      isTShirtOverridden: false
    };

    const breakdown = generateBreakdown(estimation);
    expect(breakdown).toContain('⚠️');
    expect(breakdown).toContain('shorter than typical');
  });
});
