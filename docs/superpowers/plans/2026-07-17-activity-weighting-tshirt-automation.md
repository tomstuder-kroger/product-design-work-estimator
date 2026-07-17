# Product Design Work Estimator - Activity Weighting & T-Shirt Sizing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add weighted activities with user overrides, auto-calculated T-shirt sizing with override capability, and rebrand to Product Design Work Estimator

**Architecture:** Incremental enhancement - extend existing data model and calculation logic, add new UI components, maintain backwards compatibility

**Tech Stack:** React 18, Vite, Tailwind CSS, Jest/Vitest for testing

## Global Constraints

- Maintain all existing functionality - no breaking changes
- Use existing component patterns (checkboxes, override UI similar to story points)
- Keep calculation transparent and explainable in breakdown text
- All weights and calculations must be visible to users
- Maintain Kroger design system (primary colors, fonts, spacing)
- Follow existing code style and structure
- Keep bundle size reasonable (no new heavy dependencies)
- All activity names, weights, and mappings must match the design spec exactly

---

### Task 1: Transform Activities Data Model

**Files:**
- Modify: `src/utils/constants.js`
- Test: Manual verification (no test file needed for data transformation)

**Interfaces:**
- Consumes: Nothing
- Produces: `ACTIVITIES_DATA` array of objects with `{ name, defaultWeight, stage, category }`
- Produces: `getActivitiesByStage(stage)` helper function

- [ ] **Step 1: Read current constants.js**

Read the file to understand current structure:
```bash
cat src/utils/constants.js
```

- [ ] **Step 2: Back up current ACTIVITIES export**

Add a comment preserving the old structure for reference during migration:
```javascript
// OLD STRUCTURE (preserved for reference during migration):
// export const ACTIVITIES = {
//   Discovery: [...],
//   Define: [...],
//   Design: [...]
// };
```

- [ ] **Step 3: Create ACTIVITIES_DATA array with Discovery activities**

Replace ACTIVITIES object with new structure. Start with Discovery stage activities:

```javascript
export const ACTIVITIES_DATA = [
  // Discovery - Looking/Research & Strategic Synthesis
  { name: 'Research planning', defaultWeight: 1, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'Competitive analysis', defaultWeight: 1, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'Stakeholder interviews', defaultWeight: 1, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'User interviews (3-5)', defaultWeight: 1, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'User interviews (6-10)', defaultWeight: 2, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'Surveys', defaultWeight: 1, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'Usability studies', defaultWeight: 2, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'Diary study', defaultWeight: 3, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'Journey map creation', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Service blueprint creation', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Persona creation/update', defaultWeight: 2, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Opportunity mapping', defaultWeight: 2, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Research synthesis & readout', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Contextual inquiry', defaultWeight: 3, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'User & market landscape exploration', defaultWeight: 3, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'Feasibility & risk assessment', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Object Oriented Design (Data-Focused Generative Design)', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Gigamap', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Service blueprint', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Ecosystem Map', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Dependency Map', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Stakeholder Mapping', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Problem framing', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Brainstorm session', defaultWeight: 1, stage: 'Discovery', category: 'Understanding/Synthesis' },
```

- [ ] **Step 4: Add Define stage activities**

Continue the ACTIVITIES_DATA array with Define activities:

```javascript
  // Define - Strategic Planning & Framing
  { name: 'Problem statement writing', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'How Might We questions', defaultWeight: 1, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Opportunity mapping', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Assumption/risk mapping', defaultWeight: 1, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Prioritization workshop', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Story map creation', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'MVP definition', defaultWeight: 3, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Experience principles definition', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Success metrics definition', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Design brief creation', defaultWeight: 3, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'User Flow - Current State', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'User Flow - Desired State', defaultWeight: 2, stage: 'Define', category: 'Making/Prototyping' },
  { name: 'Jobs to be Done', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Painpoint Analysis', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'User Story Mapping', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Data Mapping', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Visioning workshop', defaultWeight: 3, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Stakeholder interviews/alignment', defaultWeight: 3, stage: 'Define', category: 'Executing/Relationship Management' },
  { name: 'Design Leadership Review', defaultWeight: 3, stage: 'Define', category: 'Executing/Relationship Management' },
  { name: 'Brainstorm session', defaultWeight: 1, stage: 'Define', category: 'Understanding/Synthesis' },
```

- [ ] **Step 5: Add Design stage activities**

Complete the ACTIVITIES_DATA array with Design activities:

```javascript
  // Design - Making/Prototyping & Validation
  { name: 'User flow creation', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Wireframing (low-fidelity)', defaultWeight: 1, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Wireframing (high-fidelity)', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Information architecture', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'UI mockups (existing patterns)', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'UI mockups (new patterns)', defaultWeight: 3, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Clickable prototype', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Multi-platform design (responsive)', defaultWeight: 3, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Accessibility review', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Content design', defaultWeight: 1, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Design system work', defaultWeight: 3, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Design handoff/specs', defaultWeight: 2, stage: 'Design', category: 'Executing/Relationship Management' },
  { name: 'AI Prototyping / Vibe Coding', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'New pattern design', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Design pattern evolution', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'New prototype (local interaction change)', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'New prototype with E2E flow', defaultWeight: 3, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Rough and Ready Prototyping (lo-fi make to learn research)', defaultWeight: 3, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Initial vision concepts', defaultWeight: 3, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Concept Poster', defaultWeight: 3, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Vision documentation', defaultWeight: 3, stage: 'Design', category: 'Executing/Relationship Management' },
  { name: 'Concept Testing', defaultWeight: 2, stage: 'Design', category: 'Looking/Research' },
  { name: 'Usability Testing', defaultWeight: 2, stage: 'Design', category: 'Looking/Research' },
  { name: 'A/B testing', defaultWeight: 2, stage: 'Design', category: 'Looking/Research' },
  { name: 'Champion/Challenger testing', defaultWeight: 3, stage: 'Design', category: 'Looking/Research' },
  { name: 'Documentation creation or updating', defaultWeight: 2, stage: 'Design', category: 'Executing/Relationship Management' },
  { name: 'UX review tasks for dev team', defaultWeight: 1, stage: 'Design', category: 'Executing/Relationship Management' },
  { name: 'Regular Stakeholder Updates', defaultWeight: 3, stage: 'Design', category: 'Executing/Relationship Management' },
  { name: 'Brainstorm session', defaultWeight: 1, stage: 'Design', category: 'Understanding/Synthesis' },
];
```

- [ ] **Step 6: Add helper function to get activities by stage**

After the ACTIVITIES_DATA array, add this helper:

```javascript
/**
 * Get all activities for a specific stage
 * @param {string} stage - 'Discovery', 'Define', or 'Design'
 * @returns {Array} Array of activity objects for that stage
 */
export function getActivitiesByStage(stage) {
  return ACTIVITIES_DATA.filter(activity => activity.stage === stage);
}
```

- [ ] **Step 7: Verify data structure manually**

Run dev server and check console for errors:
```bash
npm run dev
```

Open browser console, no errors should appear.

- [ ] **Step 8: Commit data model transformation**

```bash
git add src/utils/constants.js
git commit -m "feat: transform activities to rich data model with weights

- Replace string arrays with objects containing name, weight, stage, category
- Add Discovery activities (existing + Design Ops additions)
- Add Define activities (existing + Design Ops additions)
- Add Design activities (existing + Design Ops additions)
- Add getActivitiesByStage() helper function
- Weight assignments: 1=Low, 2=Medium, 3=High effort"
```

---

### Task 2: Add Calculation Logic for Weighted Activities

**Files:**
- Modify: `src/utils/calculations.js`
- Modify: `src/utils/calculations.test.js`

**Interfaces:**
- Consumes: `ACTIVITIES_DATA` from constants.js
- Produces: `calculateActivityScore(selectedActivities, adjustments)` returns number 0-4
- Produces: `calculateTShirtSize(storyPoints)` returns 'XS' | 'S' | 'M' | 'L' | 'XL'
- Updates: `calculateStoryPoints(complexity, selectedActivities, activityAdjustments, weeks)`
- Updates: `generateBreakdown(estimation)` to include activity weights and T-shirt size

- [ ] **Step 1: Write test for calculateActivityScore with no adjustments**

Add to `src/utils/calculations.test.js`:

```javascript
import { calculateActivityScore, calculateTShirtSize, calculateStoryPoints } from './calculations.js';
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test calculations.test.js
```

Expected: FAIL with "calculateActivityScore is not defined"

- [ ] **Step 3: Implement calculateActivityScore**

Add to `src/utils/calculations.js`:

```javascript
import { ACTIVITIES_DATA } from './constants.js';

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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test calculations.test.js
```

Expected: PASS for calculateActivityScore tests

- [ ] **Step 5: Write tests for calculateActivityScore with adjustments**

Add to test file:

```javascript
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
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npm test calculations.test.js
```

Expected: PASS for all calculateActivityScore tests

- [ ] **Step 7: Write tests for calculateTShirtSize**

Add to test file:

```javascript
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
```

- [ ] **Step 8: Run test to verify it fails**

```bash
npm test calculations.test.js
```

Expected: FAIL with "calculateTShirtSize is not defined"

- [ ] **Step 9: Implement calculateTShirtSize**

Add to `src/utils/calculations.js`:

```javascript
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
```

- [ ] **Step 10: Run test to verify it passes**

```bash
npm test calculations.test.js
```

Expected: PASS for calculateTShirtSize tests

- [ ] **Step 11: Update calculateStoryPoints signature**

Update the existing `calculateStoryPoints` function to accept new parameters:

```javascript
/**
 * Calculate story points based on complexity dimensions, weighted activities, and duration
 * @param {Object} complexity - {ambiguity, artifactComplexity, stakeholderRisk, iterationLikelihood?}
 * @param {Array<string>} selectedActivities - Array of selected activity names
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

  // Activity Score: Use weighted calculation
  total += calculateActivityScore(selectedActivities, activityAdjustments);

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
```

- [ ] **Step 12: Write integration test for calculateStoryPoints**

Add to test file:

```javascript
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
```

- [ ] **Step 13: Run tests to verify they pass**

```bash
npm test calculations.test.js
```

Expected: PASS for all tests

- [ ] **Step 14: Update generateBreakdown to show activity weights**

Update the existing `generateBreakdown` function:

```javascript
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
```

- [ ] **Step 15: Commit calculation enhancements**

```bash
git add src/utils/calculations.js src/utils/calculations.test.js
git commit -m "feat: add weighted activity and T-shirt size calculations

- Add calculateActivityScore() with adjustment support
- Add calculateTShirtSize() mapping story points to sizes
- Update calculateStoryPoints() to use weighted activities
- Update generateBreakdown() to show activity weights and T-shirt size
- Add comprehensive unit tests for all new functions
- All tests passing"
```

---

### Task 3: Extend Context for New Data Fields

**Files:**
- Modify: `src/context/EstimationContext.jsx`

**Interfaces:**
- Consumes: Nothing new
- Produces: Extended `wizardData` with `activityAdjustments`, T-shirt size fields
- Updates: `defaultWizardData` to include new fields

- [ ] **Step 1: Read current EstimationContext**

```bash
cat src/context/EstimationContext.jsx
```

- [ ] **Step 2: Update defaultWizardData with new fields**

Find the `defaultWizardData` object and add new fields:

```javascript
const defaultWizardData = {
  projectName: '',
  teamMemberName: '',
  portfolio: '',
  domainTeam: '',
  stage: '',
  tShirtSize: '', // Will be removed from Step 1 later, keep for now
  weeks: '',
  description: '',
  activities: [],
  activityAdjustments: {}, // NEW: Map of activity name to adjustment (-1, 0, +1)
  complexity: {
    ambiguity: '',
    artifactComplexity: '',
    stakeholderRisk: '',
    iterationLikelihood: ''
  }
};
```

- [ ] **Step 3: Update createEstimation to include new fields**

Find the `createEstimation` function and update it to calculate and store T-shirt size:

```javascript
import { calculateStoryPoints, calculateTShirtSize } from '../utils/calculations';

const createEstimation = () => {
  const timestamp = new Date().toISOString();

  const calculatedPoints = calculateStoryPoints(
    wizardData.complexity,
    wizardData.activities,
    wizardData.activityAdjustments,
    wizardData.weeks
  );

  const calculatedTShirtSize = calculateTShirtSize(calculatedPoints);

  const estimation = {
    id: timestamp,
    timestamp,
    projectName: wizardData.projectName,
    teamMemberName: wizardData.teamMemberName,
    portfolio: wizardData.portfolio,
    domainTeam: wizardData.domainTeam,
    stage: wizardData.stage,
    weeks: wizardData.weeks,
    description: wizardData.description,
    activities: wizardData.activities,
    activityAdjustments: wizardData.activityAdjustments, // NEW
    complexity: wizardData.complexity,
    calculatedPoints,
    finalPoints: calculatedPoints,
    calculatedTShirtSize,  // NEW
    finalTShirtSize: calculatedTShirtSize,  // NEW
    isOverridden: false,
    isPointsOverridden: false,  // NEW: explicit flag for points
    isTShirtOverridden: false,  // NEW
    overrideReason: '',
    pointsOverrideReason: '',  // NEW: explicit reason for points
    tShirtOverrideReason: ''   // NEW
  };

  return estimation;
};
```

- [ ] **Step 4: Verify context updates in browser**

```bash
npm run dev
```

Open browser console and verify no errors. Context should initialize properly.

- [ ] **Step 5: Commit context updates**

```bash
git add src/context/EstimationContext.jsx
git commit -m "feat: extend context with activity adjustments and T-shirt size fields

- Add activityAdjustments to wizardData
- Add calculatedTShirtSize, finalTShirtSize, isTShirtOverridden, tShirtOverrideReason
- Update createEstimation to calculate T-shirt size
- Separate isPointsOverridden and pointsOverrideReason for clarity"
```

---

### Task 4: Create ActivityWithWeight Component

**Files:**
- Create: `src/components/common/ActivityWithWeight.jsx`

**Interfaces:**
- Consumes: Nothing (pure component)
- Produces: `ActivityWithWeight` component
- Props: `{ activity: Object, isSelected: boolean, onToggle: Function, adjustment: number, onAdjustment: Function }`

- [ ] **Step 1: Create new component file**

Create `src/components/common/ActivityWithWeight.jsx`:

```javascript
export default function ActivityWithWeight({
  activity,
  isSelected,
  onToggle,
  adjustment = 0,
  onAdjustment
}) {
  const getAdjustmentLabel = () => {
    if (adjustment === -1) return 'Less Complex';
    if (adjustment === 1) return 'More Complex';
    return 'Typical';
  };

  const getAdjustmentStyle = () => {
    if (adjustment === -1) return 'text-success border-success';
    if (adjustment === 1) return 'text-warning border-warning';
    return 'text-gray-600 border-gray-300';
  };

  const handleDecrease = () => {
    if (adjustment > -1) {
      onAdjustment(activity.name, adjustment - 1);
    }
  };

  const handleIncrease = () => {
    if (adjustment < 1) {
      onAdjustment(activity.name, adjustment + 1);
    }
  };

  return (
    <div className="flex flex-col p-3 border rounded-lg hover:bg-gray-50 transition-colors">
      <label className="flex items-start cursor-pointer">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(activity.name)}
          className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <span className="ml-3 text-sm text-gray-900 flex-1">{activity.name}</span>
      </label>

      {isSelected && (
        <div className="mt-2 ml-7 flex items-center gap-2">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={adjustment === -1}
            className="w-6 h-6 flex items-center justify-center border rounded bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold"
            aria-label="Less complex"
          >
            −
          </button>

          <span className={`text-xs font-medium px-2 py-1 border rounded ${getAdjustmentStyle()}`}>
            {getAdjustmentLabel()}
          </span>

          <button
            type="button"
            onClick={handleIncrease}
            disabled={adjustment === 1}
            className="w-6 h-6 flex items-center justify-center border rounded bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold"
            aria-label="More complex"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify component renders without errors**

This component will be tested when integrated in Task 5. No standalone test needed.

- [ ] **Step 3: Commit new component**

```bash
git add src/components/common/ActivityWithWeight.jsx
git commit -m "feat: create ActivityWithWeight component

- Checkbox for activity selection
- Inline adjustment controls (Less/Typical/More)
- Color-coded complexity indicators
- Disabled state for min/max adjustments
- Only shows adjustment controls when selected"
```

---

### Task 5: Update StepActivities to Use Weighted Activities

**Files:**
- Modify: `src/components/wizard/StepActivities.jsx`

**Interfaces:**
- Consumes: `ActivityWithWeight` component, `getActivitiesByStage()` from constants
- Consumes: `wizardData.activityAdjustments` from context
- Updates: `wizardData.activities` and `wizardData.activityAdjustments`

- [ ] **Step 1: Update imports in StepActivities**

```javascript
import { useEstimation } from '../../context/EstimationContext';
import ActivityWithWeight from '../common/ActivityWithWeight';
import { getActivitiesByStage } from '../../utils/constants';
```

- [ ] **Step 2: Replace ActivityCheckboxGrid with ActivityWithWeight mapping**

Replace the entire component implementation:

```javascript
export default function StepActivities() {
  const { wizardData, setWizardData } = useEstimation();

  const stageActivities = getActivitiesByStage(wizardData.stage);

  const handleToggle = (activityName) => {
    if (wizardData.activities.includes(activityName)) {
      // Remove activity and its adjustment
      setWizardData(prev => ({
        ...prev,
        activities: prev.activities.filter(a => a !== activityName),
        activityAdjustments: {
          ...prev.activityAdjustments,
          [activityName]: undefined
        }
      }));
    } else {
      // Add activity with default adjustment of 0
      setWizardData(prev => ({
        ...prev,
        activities: [...prev.activities, activityName],
        activityAdjustments: {
          ...prev.activityAdjustments,
          [activityName]: 0
        }
      }));
    }
  };

  const handleAdjustment = (activityName, adjustment) => {
    setWizardData(prev => ({
      ...prev,
      activityAdjustments: {
        ...prev.activityAdjustments,
        [activityName]: adjustment
      }
    }));
  };

  const adjustedCount = Object.values(wizardData.activityAdjustments).filter(
    adj => adj !== 0 && adj !== undefined
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Activities & Artifacts</h2>
        <p className="text-gray-600 mt-1">
          Select the activities and artifacts for this {wizardData.stage} work
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {wizardData.activities.length} activit{wizardData.activities.length === 1 ? 'y' : 'ies'} selected
          {adjustedCount > 0 && ` (${adjustedCount} adjusted)`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {stageActivities.map((activity) => (
          <ActivityWithWeight
            key={activity.name}
            activity={activity}
            isSelected={wizardData.activities.includes(activity.name)}
            onToggle={handleToggle}
            adjustment={wizardData.activityAdjustments[activity.name] || 0}
            onAdjustment={handleAdjustment}
          />
        ))}
      </div>

      {wizardData.activities.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            Please select at least one activity to continue
          </p>
        </div>
      )}
    </div>
  );
}

export { isStepValid as isStep2Valid };

function isStepValid(wizardData) {
  return wizardData.activities.length > 0;
}
```

- [ ] **Step 3: Test activity selection with adjustments**

```bash
npm run dev
```

Manual test:
1. Navigate to Step 2 (Activities)
2. Select an activity - verify adjustment controls appear
3. Click + button - verify "More Complex" shows
4. Click − button twice - verify "Less Complex" shows
5. Deselect activity - verify adjustment resets
6. Select multiple activities and adjust some - verify count shows "(X adjusted)"

- [ ] **Step 4: Commit StepActivities update**

```bash
git add src/components/wizard/StepActivities.jsx
git commit -m "feat: update StepActivities to use weighted activities

- Replace ActivityCheckboxGrid with ActivityWithWeight
- Handle activity selection and adjustment state
- Show adjusted count in header
- Reset adjustment when activity deselected
- Use getActivitiesByStage() helper"
```

---

### Task 6: Remove T-Shirt Size from StepProjectInfo

**Files:**
- Modify: `src/components/wizard/StepProjectInfo.jsx`

**Interfaces:**
- Consumes: Nothing new
- Updates: Remove `tShirtSize` field from form and validation

- [ ] **Step 1: Remove T-shirt size dropdown from JSX**

Delete lines 119-140 (the entire T-shirt size field):

```javascript
// DELETE THIS ENTIRE BLOCK:
<div>
  <label htmlFor="tShirtSize" className="block text-sm font-medium text-gray-700 mb-1">
    T-Shirt Size <span className="text-red-500">*</span>
  </label>
  <select
    id="tShirtSize"
    value={wizardData.tShirtSize}
    onChange={(e) => updateField('tShirtSize', e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
  >
    <option value="">Select size...</option>
    <option value="XS">XS - Extra Small</option>
    <option value="S">S - Small</option>
    <option value="M">M - Medium</option>
    <option value="L">L - Large</option>
    <option value="XL">XL - Extra Large</option>
  </select>
  {wizardData.tShirtSize.length === 0 && (
    <p className="text-gray-500 text-sm mt-1">Required field</p>
  )}
</div>
```

- [ ] **Step 2: Update grid layout for duration field**

Change the grid wrapper from `grid-cols-2` to single column:

```javascript
<div>
  <label htmlFor="weeks" className="block text-sm font-medium text-gray-700 mb-1">
    Duration (Weeks) <span className="text-gray-500 text-sm">(optional)</span>
  </label>
  <input
    type="number"
    id="weeks"
    min="0"
    step="1"
    value={wizardData.weeks}
    onChange={(e) => updateField('weeks', e.target.value)}
    placeholder="e.g., 2"
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
  />
  <p className="text-sm text-gray-500 mt-1">How many weeks allocated?</p>
</div>
```

- [ ] **Step 3: Remove tShirtSize from validation**

Update the `isStepValid` function:

```javascript
function isStepValid(wizardData) {
  return (
    wizardData.projectName.length >= 3 &&
    wizardData.teamMemberName.length > 0 &&
    wizardData.portfolio.length > 0 &&
    wizardData.domainTeam.length > 0 &&
    wizardData.stage !== '' &&
    // REMOVED: wizardData.tShirtSize !== '' &&
    (wizardData.weeks === '' || Number(wizardData.weeks) > 0)
  );
}
```

Also update the inline `isValid()` function at the top of the component (same change).

- [ ] **Step 4: Test Step 1 form validation**

```bash
npm run dev
```

Manual test:
1. Navigate to Step 1
2. Fill out all fields except weeks - verify Next button enables
3. Verify T-shirt size field is completely removed
4. Verify validation still works for other required fields

- [ ] **Step 5: Commit StepProjectInfo update**

```bash
git add src/components/wizard/StepProjectInfo.jsx
git commit -m "feat: remove T-shirt size from project info form

- Remove T-shirt size dropdown field
- Update validation to not require T-shirt size
- Simplify duration field layout
- T-shirt size will be auto-calculated in review step"
```

---

### Task 7: Add T-Shirt Size Auto-Calc and Override to StepReview

**Files:**
- Modify: `src/components/wizard/StepReview.jsx`

**Interfaces:**
- Consumes: `calculateStoryPoints()`, `calculateTShirtSize()` from calculations
- Consumes: `wizardData` from context
- Updates: Estimation object with T-shirt size fields before navigation to report

- [ ] **Step 1: Add imports to StepReview**

```javascript
import { calculateStoryPoints, calculateTShirtSize } from '../../utils/calculations';
```

- [ ] **Step 2: Add state for T-shirt size override**

Add after existing state declarations:

```javascript
const [tShirtOverride, setTShirtOverride] = useState(false);
const [customTShirtSize, setCustomTShirtSize] = useState('');
const [tShirtReason, setTShirtReason] = useState('');
```

- [ ] **Step 3: Calculate T-shirt size from story points**

Add after `calculatedPoints` calculation:

```javascript
const calculatedPoints = calculateStoryPoints(
  wizardData.complexity,
  wizardData.activities,
  wizardData.activityAdjustments,
  wizardData.weeks
);

const calculatedTShirtSize = calculateTShirtSize(override ? customPoints : calculatedPoints);
const finalTShirtSize = tShirtOverride ? customTShirtSize : calculatedTShirtSize;
```

- [ ] **Step 4: Add T-shirt size display UI**

Add this section after the story points override section:

```javascript
<div className="mt-6 p-4 bg-gray-50 rounded-lg">
  <h3 className="font-semibold text-gray-900">Recommended T-Shirt Size</h3>
  <p className="text-2xl font-bold text-primary mt-2">{calculatedTShirtSize}</p>
  <p className="text-sm text-gray-600 mt-1">
    Based on {override ? customPoints : calculatedPoints} story point{(override ? customPoints : calculatedPoints) === 1 ? '' : 's'}
  </p>

  <label className="flex items-center mt-4">
    <input
      type="checkbox"
      checked={tShirtOverride}
      onChange={(e) => {
        setTShirtOverride(e.target.checked);
        if (!e.target.checked) {
          setCustomTShirtSize('');
          setTShirtReason('');
        }
      }}
      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
    />
    <span className="ml-2 text-sm text-gray-700">Override recommended size</span>
  </label>

  {tShirtOverride && (
    <div className="mt-4 space-y-3">
      <div>
        <label htmlFor="customTShirtSize" className="block text-sm font-medium text-gray-700 mb-1">
          Custom T-Shirt Size
        </label>
        <select
          id="customTShirtSize"
          value={customTShirtSize}
          onChange={(e) => setCustomTShirtSize(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">Select size...</option>
          <option value="XS">XS - Extra Small</option>
          <option value="S">S - Small</option>
          <option value="M">M - Medium</option>
          <option value="L">L - Large</option>
          <option value="XL">XL - Extra Large</option>
        </select>
      </div>

      <div>
        <label htmlFor="tShirtReason" className="block text-sm font-medium text-gray-700 mb-1">
          Reason for Override <span className="text-gray-500 text-sm">(optional)</span>
        </label>
        <input
          type="text"
          id="tShirtReason"
          placeholder="e.g., More stakeholder coordination than typical"
          value={tShirtReason}
          onChange={(e) => setTShirtReason(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>
    </div>
  )}
</div>
```

- [ ] **Step 5: Update handleComplete to save T-shirt size data**

Find the `handleComplete` function and update the estimation object:

```javascript
const handleComplete = () => {
  const estimation = {
    id: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    projectName: wizardData.projectName,
    teamMemberName: wizardData.teamMemberName,
    portfolio: wizardData.portfolio,
    domainTeam: wizardData.domainTeam,
    stage: wizardData.stage,
    weeks: wizardData.weeks,
    description: wizardData.description,
    activities: wizardData.activities,
    activityAdjustments: wizardData.activityAdjustments,
    complexity: wizardData.complexity,
    calculatedPoints,
    finalPoints: override ? customPoints : calculatedPoints,
    calculatedTShirtSize,
    finalTShirtSize,
    isOverridden: override,
    isPointsOverridden: override,
    isTShirtOverridden: tShirtOverride,
    overrideReason: reason,
    pointsOverrideReason: reason,
    tShirtOverrideReason: tShirtReason
  };

  saveEstimation(estimation);
  navigate('/wizard/report');
};
```

- [ ] **Step 6: Test T-shirt size display and override**

```bash
npm run dev
```

Manual test:
1. Complete wizard to Step 4 (Review)
2. Verify T-shirt size displays correctly based on story points
3. Check "Override recommended size" - verify dropdown and reason field appear
4. Select different size and add reason
5. Uncheck override - verify fields clear
6. Click Complete - verify data saves
7. Check Step 5 (Report) - verify T-shirt size shows (tested in next task)

- [ ] **Step 7: Commit StepReview update**

```bash
git add src/components/wizard/StepReview.jsx
git commit -m "feat: add T-shirt size auto-calculation with override to review step

- Calculate T-shirt size based on story points
- Display recommended size with explanation
- Override checkbox with custom size selector
- Optional reason field for override
- Save T-shirt data to estimation object
- Update calculation when points change"
```

---

### Task 8: Update StepReport to Show T-Shirt Size

**Files:**
- Modify: `src/components/wizard/StepReport.jsx`

**Interfaces:**
- Consumes: `currentEstimation` from context (includes T-shirt size fields)
- Displays: T-shirt size in summary and breakdown

- [ ] **Step 1: Read current StepReport implementation**

```bash
cat src/components/wizard/StepReport.jsx
```

- [ ] **Step 2: Add T-shirt size to summary section**

Find where story points are displayed and add T-shirt size after it:

```javascript
<div className="grid grid-cols-2 gap-6 mb-6">
  <div className="bg-primary/10 p-4 rounded-lg">
    <p className="text-sm text-gray-600">Story Points</p>
    <p className="text-3xl font-bold text-primary">{currentEstimation.finalPoints}</p>
    {currentEstimation.isPointsOverridden && (
      <p className="text-xs text-gray-500 mt-1">
        (calculated: {currentEstimation.calculatedPoints})
      </p>
    )}
  </div>

  <div className="bg-primary/10 p-4 rounded-lg">
    <p className="text-sm text-gray-600">T-Shirt Size</p>
    <p className="text-3xl font-bold text-primary">{currentEstimation.finalTShirtSize}</p>
    {currentEstimation.isTShirtOverridden && (
      <p className="text-xs text-gray-500 mt-1">
        (calculated: {currentEstimation.calculatedTShirtSize})
      </p>
    )}
  </div>
</div>
```

- [ ] **Step 3: Verify breakdown includes T-shirt size**

The `generateBreakdown()` function already includes T-shirt size (from Task 2), so the breakdown display should work automatically. Verify the breakdown section renders properly.

- [ ] **Step 4: Test report display**

```bash
npm run dev
```

Manual test:
1. Complete full estimation with T-shirt override
2. Navigate to Step 5 (Report)
3. Verify T-shirt size shows in summary grid
4. Verify override indicator shows if applicable
5. Verify breakdown text includes T-shirt size section
6. Test "Save & Start New" - verify new estimation starts fresh

- [ ] **Step 5: Commit StepReport update**

```bash
git add src/components/wizard/StepReport.jsx
git commit -m "feat: display T-shirt size in estimation report

- Add T-shirt size card to summary grid
- Show override indicator if applicable
- Display calculated vs final size
- Breakdown text automatically includes T-shirt section"
```

---

### Task 9: Add Migration for Existing Saved Data

**Files:**
- Modify: `src/utils/storage.js`

**Interfaces:**
- Consumes: Saved estimation objects from localStorage
- Produces: Migrated estimation objects with new fields

- [ ] **Step 1: Read current storage implementation**

```bash
cat src/utils/storage.js
```

- [ ] **Step 2: Add migration function**

Add this function before the `getEstimations` export:

```javascript
import { calculateTShirtSize } from './calculations.js';

/**
 * Migrate old estimation format to new format with activity adjustments and T-shirt size
 * @param {Object} estimation - Saved estimation object
 * @returns {Object} Migrated estimation object
 */
function migrateEstimation(estimation) {
  // Already migrated if it has these fields
  if (estimation.activityAdjustments !== undefined && estimation.calculatedTShirtSize !== undefined) {
    return estimation;
  }

  const migrated = {
    ...estimation,
    // Add activity adjustments (default to empty/typical)
    activityAdjustments: estimation.activityAdjustments || {},
    // Calculate T-shirt size from existing points
    calculatedTShirtSize: estimation.calculatedTShirtSize || calculateTShirtSize(estimation.calculatedPoints || estimation.finalPoints),
    finalTShirtSize: estimation.finalTShirtSize || estimation.tShirtSize || calculateTShirtSize(estimation.finalPoints),
    isTShirtOverridden: estimation.isTShirtOverridden || false,
    tShirtOverrideReason: estimation.tShirtOverrideReason || '',
    // Separate points override fields for clarity
    isPointsOverridden: estimation.isPointsOverridden !== undefined ? estimation.isPointsOverridden : estimation.isOverridden,
    pointsOverrideReason: estimation.pointsOverrideReason || estimation.overrideReason || ''
  };

  return migrated;
}
```

- [ ] **Step 3: Apply migration in getEstimations**

Update the `getEstimations` function to migrate on load:

```javascript
export function getEstimations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const estimations = JSON.parse(saved);
    // Migrate each estimation to new format
    return estimations.map(migrateEstimation);
  } catch (error) {
    console.error('Error loading estimations:', error);
    return [];
  }
}
```

- [ ] **Step 4: Test migration with mock old data**

Create a test by manually adding old-format data to localStorage:

```bash
npm run dev
```

Open browser console and run:
```javascript
// Save old-format estimation
const oldEstimation = {
  id: '2026-01-01T00:00:00.000Z',
  projectName: 'Old Test Project',
  stage: 'Discovery',
  activities: ['Research planning', 'User interviews (3-5)'],
  complexity: { ambiguity: 'Low', artifactComplexity: 'Low', stakeholderRisk: 'Low' },
  calculatedPoints: 2,
  finalPoints: 2,
  tShirtSize: 'XS', // Old field
  isOverridden: false,
  overrideReason: ''
};
localStorage.setItem('design-estimations', JSON.stringify([oldEstimation]));

// Reload page and check history
window.location.reload();
```

Verify:
1. Old estimation loads without errors
2. History page shows estimation
3. Opening old estimation shows T-shirt size
4. No missing field errors in console

- [ ] **Step 5: Commit migration implementation**

```bash
git add src/utils/storage.js
git commit -m "feat: add migration for existing saved estimations

- Add migrateEstimation() function
- Handle missing activityAdjustments (default to empty)
- Calculate T-shirt size from existing points
- Map old tShirtSize field to finalTShirtSize
- Preserve backwards compatibility
- Apply migration on load"
```

---

### Task 10: Rebrand to Product Design Work Estimator

**Files:**
- Modify: `package.json`
- Modify: `index.html`
- Modify: `README.md`
- Modify: `src/components/common/Layout.jsx`

**Interfaces:**
- Consumes: Nothing
- Updates: All user-facing copy and metadata

- [ ] **Step 1: Update package.json**

```javascript
{
  "name": "product-design-work-estimator",
  "version": "1.0.0",
  "description": "Estimate product design work using story points and T-shirt sizing",
  // ... rest unchanged
}
```

- [ ] **Step 2: Update index.html title**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Product Design Work Estimator</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Update README.md**

```markdown
# Product Design Work Estimator

Estimate product design work using story points and T-shirt sizing based on complexity, weighted activities, and duration.

## Features

- **Weighted Activities**: Select from Discovery, Define, and Design stage activities with default effort weights
- **Activity Complexity Adjustment**: Override default weights for activities that are more or less complex than typical
- **Complexity Assessment**: Rate work across multiple dimensions (ambiguity, artifact complexity, stakeholder risk, iteration likelihood)
- **Auto-Calculated Story Points**: Fibonacci scale (1, 2, 3, 5, 8, 13) based on complexity + weighted activities + duration
- **Auto-Calculated T-Shirt Sizing**: XS to XL sizing based on story points with override capability
- **Estimation History**: Save and review past estimations
- **Detailed Breakdowns**: See exactly how your estimate was calculated

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- MX Web Components (Kroger Design System)

## Getting Started

```bash
npm install
npm run dev
```

## Usage

1. Enter project information and select stage (Discovery, Define, or Design)
2. Select relevant activities and adjust complexity if needed
3. Rate complexity across multiple dimensions
4. Review auto-calculated story points and T-shirt size
5. Override estimates if your experience suggests different values
6. Generate detailed breakdown and save estimation

## License

Proprietary - Kroger/84.51°
```

- [ ] **Step 4: Update Layout header title**

```javascript
// In src/components/common/Layout.jsx
<header className="bg-primary sticky top-0 z-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img src={krogerLogo} alt="Kroger" className="h-[33px] w-[60px] object-contain" />
        <h1 className="text-xl font-bold text-white">
          Product Design Work Estimator
        </h1>
      </div>
      <nav className="flex gap-6">
        <Link
          to="/"
          className={`text-sm font-medium transition-colors ${
            location.pathname === '/' ? 'text-white' : 'text-white/70 hover:text-white'
          }`}
        >
          New Estimation
        </Link>
        <Link
          to="/history"
          className={`text-sm font-medium transition-colors ${
            location.pathname.startsWith('/history') ? 'text-white' : 'text-white/70 hover:text-white'
          }`}
        >
          History
        </Link>
      </nav>
    </div>
  </div>
</header>
```

- [ ] **Step 5: Verify all rebranding changes**

```bash
npm run dev
```

Manual verification:
1. Browser tab title shows "Product Design Work Estimator"
2. Header shows "Product Design Work Estimator"
3. No references to "Story Points Calculator" visible in UI
4. package.json shows new name
5. README shows new name and updated description

- [ ] **Step 6: Search for any remaining "Story Points Calculator" references**

```bash
grep -r "Story Points Calculator" src/
```

If any found, update them to "Product Design Work Estimator".

- [ ] **Step 7: Final verification test**

Run through complete wizard flow:
1. Start new estimation
2. Verify all steps work
3. Verify branding consistent throughout
4. Save estimation
5. Check history page
6. View saved estimation

- [ ] **Step 8: Commit rebranding changes**

```bash
git add package.json index.html README.md src/components/common/Layout.jsx
git commit -m "feat: rebrand to Product Design Work Estimator

- Update package.json name and description
- Update browser title in index.html
- Update README with new name and features
- Update header title in Layout component
- Remove all references to Story Points Calculator
- Maintain story points as estimation output unit"
```

- [ ] **Step 9: Run final test suite**

```bash
npm test
```

Expected: All tests pass

- [ ] **Step 10: Create summary commit if needed**

If there were any small fixes during testing, create a final verification commit:

```bash
git add .
git commit -m "chore: final verification and cleanup

- All unit tests passing
- Manual testing complete
- Backwards compatibility verified
- Rebranding complete"
```

---

## Implementation Complete

All 10 tasks completed:

1. ✅ Transform activities data model with weights and metadata
2. ✅ Add calculation logic for weighted activities and T-shirt sizing
3. ✅ Extend context with new data fields
4. ✅ Create ActivityWithWeight component
5. ✅ Update StepActivities to use weighted activities
6. ✅ Remove T-shirt size from StepProjectInfo
7. ✅ Add T-shirt size auto-calculation with override to StepReview
8. ✅ Update StepReport to show T-shirt size
9. ✅ Add migration for existing saved data
10. ✅ Rebrand to Product Design Work Estimator

**Testing Checklist:**
- [ ] All unit tests pass
- [ ] Activity selection and adjustment works
- [ ] Story points calculation includes weighted activities
- [ ] T-shirt size auto-calculates correctly
- [ ] T-shirt size override persists
- [ ] Old estimations load and migrate properly
- [ ] Breakdown text shows activity weights and T-shirt size
- [ ] No console errors or warnings
- [ ] Branding consistent throughout app

**Success Criteria:**
- Activities have rich metadata (name, weight, stage, category)
- Users can adjust activity complexity (+/- 1)
- Story points calculation uses weighted activities
- T-shirt size auto-calculated from story points
- Users can override T-shirt size with reason
- Old saved estimations work after migration
- App rebranded to "Product Design Work Estimator"
- All existing functionality preserved
