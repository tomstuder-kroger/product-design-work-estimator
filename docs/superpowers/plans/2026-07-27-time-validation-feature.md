# Time Validation Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add time estimate validation that compares user-entered weeks against recommended ranges based on complexity score, displaying warnings in review step and final report.

**Architecture:** Create two new utility functions (`calculateRecommendedWeeks` and `validateWeeksEstimate`) in calculations.js. Update StepReview.jsx to show validation banner between summary cards and override controls. Update StepReport.jsx to display time analysis section. Extend generateBreakdown() to include time validation in clipboard output.

**Tech Stack:** React 18, JavaScript (no TypeScript), Vite, Tailwind CSS

## Global Constraints

- Use existing Tailwind color classes (bg-amber-50, border-amber-300, bg-blue-50, border-blue-200)
- Match existing warning banner pattern from 13-point epic warning
- Weeks field remains optional (empty string if not entered)
- No data model changes (wizardData structure unchanged)
- All tests use existing Jest setup (calculations.test.js)
- Maintain backward compatibility with saved estimations without weeks

---

### Task 1: Add `calculateRecommendedWeeks` Utility Function

**Files:**
- Modify: `src/utils/calculations.js` (append after `calculateTShirtSize`)
- Test: `src/utils/calculations.test.js` (append new describe block)

**Interfaces:**
- Consumes: None (pure function)
- Produces: `calculateRecommendedWeeks(storyPoints: number) => {min: number, max: number}`

- [ ] **Step 1: Write failing test for calculateRecommendedWeeks**

```javascript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- calculations.test.js`
Expected: FAIL with "calculateRecommendedWeeks is not a function"

- [ ] **Step 3: Implement calculateRecommendedWeeks function**

Add to `src/utils/calculations.js` after the `calculateTShirtSize` function:

```javascript
/**
 * Calculate recommended week range based on complexity score
 * @param {number} storyPoints - Complexity score (1, 2, 3, 5, 8, or 13)
 * @returns {{min: number, max: number}} Recommended week range
 */
export function calculateRecommendedWeeks(storyPoints) {
  if (storyPoints <= 2) return { min: 1, max: 2 };
  if (storyPoints === 3) return { min: 2, max: 3 };
  if (storyPoints === 5) return { min: 3, max: 5 };
  if (storyPoints === 8) return { min: 5, max: 8 };
  return { min: 8, max: 12 }; // 13 points
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- calculations.test.js`
Expected: All calculateRecommendedWeeks tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/calculations.js src/utils/calculations.test.js
git commit -m "feat: add calculateRecommendedWeeks utility function

Maps complexity score to recommended week ranges for time validation.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Add `validateWeeksEstimate` Utility Function

**Files:**
- Modify: `src/utils/calculations.js` (append after `calculateRecommendedWeeks`)
- Test: `src/utils/calculations.test.js` (append new describe block)

**Interfaces:**
- Consumes: `calculateRecommendedWeeks(storyPoints: number) => {min: number, max: number}`
- Produces: `validateWeeksEstimate(enteredWeeks: number|string, storyPoints: number) => {isValid: boolean, severity: 'none'|'info'|'warning', recommendation: {min: number, max: number}, message: string}`

- [ ] **Step 1: Write failing tests for validateWeeksEstimate**

```javascript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- calculations.test.js`
Expected: FAIL with "validateWeeksEstimate is not a function"

- [ ] **Step 3: Implement validateWeeksEstimate function**

Add to `src/utils/calculations.js` after the `calculateRecommendedWeeks` function:

```javascript
/**
 * Validate entered weeks against recommended range with tolerance
 * @param {number|string} enteredWeeks - User's entered weeks (can be empty string)
 * @param {number} storyPoints - Complexity score (1, 2, 3, 5, 8, or 13)
 * @returns {{isValid: boolean, severity: 'none'|'info'|'warning', recommendation: {min: number, max: number}, message: string}}
 */
export function validateWeeksEstimate(enteredWeeks, storyPoints) {
  const recommendation = calculateRecommendedWeeks(storyPoints);

  // No weeks entered - no validation needed
  if (enteredWeeks === '' || enteredWeeks === null || enteredWeeks === undefined) {
    return {
      isValid: true,
      severity: 'none',
      recommendation,
      message: ''
    };
  }

  const weeks = Number(enteredWeeks);

  // Zero weeks is unrealistic
  if (weeks === 0) {
    return {
      isValid: false,
      severity: 'warning',
      recommendation,
      message: '0 weeks seems unrealistic for this work. Consider entering a realistic timeframe.'
    };
  }

  // Calculate tolerance (±30%)
  const toleranceMin = Math.floor(recommendation.min * 0.7);
  const toleranceMax = Math.ceil(recommendation.max * 1.3);

  // Within recommended range - all good
  if (weeks >= recommendation.min && weeks <= recommendation.max) {
    return {
      isValid: true,
      severity: 'none',
      recommendation,
      message: ''
    };
  }

  // Below tolerance - significant underestimate
  if (weeks < toleranceMin) {
    return {
      isValid: false,
      severity: 'warning',
      recommendation,
      message: `Your ${weeks} week estimate may be too short for this complexity. Recommended: ${recommendation.min}-${recommendation.max} weeks for a ${storyPoints}-point task. Consider adjusting your duration in Step 1 before finalizing.`
    };
  }

  // Above tolerance - significant overestimate
  if (weeks > toleranceMax) {
    return {
      isValid: false,
      severity: 'warning',
      recommendation,
      message: `Your ${weeks} week estimate may be too long for this complexity. Recommended: ${recommendation.min}-${recommendation.max} weeks for a ${storyPoints}-point task. Consider adjusting your duration in Step 1 before finalizing.`
    };
  }

  // Within tolerance but outside recommended - gentle notice
  const direction = weeks < recommendation.min ? 'low' : 'high';
  return {
    isValid: true,
    severity: 'info',
    recommendation,
    message: `Your ${weeks} week estimate is on the ${direction} end. Recommended range: ${recommendation.min}-${recommendation.max} weeks for a ${storyPoints}-point task.`
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- calculations.test.js`
Expected: All validateWeeksEstimate tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/calculations.js src/utils/calculations.test.js
git commit -m "feat: add validateWeeksEstimate utility function

Validates entered weeks against recommended range with ±30% tolerance.
Returns severity level (none/info/warning) and user-friendly message.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Add Time Validation Banner to Review Step

**Files:**
- Modify: `src/components/wizard/StepReview.jsx:50-149` (insert banner after line 90, before Activities section)

**Interfaces:**
- Consumes: `validateWeeksEstimate(enteredWeeks: number|string, storyPoints: number) => {isValid: boolean, severity: 'none'|'info'|'warning', recommendation: {min: number, max: number}, message: string}`
- Produces: React component rendering validation banner

- [ ] **Step 1: Import validateWeeksEstimate in StepReview.jsx**

Add to imports at the top of `src/components/wizard/StepReview.jsx` (line 4):

```javascript
import { calculateTShirtSize, validateWeeksEstimate } from '../../utils/calculations';
```

- [ ] **Step 2: Add validation logic to StepReview component**

Add after the existing useEffect hooks (around line 25):

```javascript
// Calculate time validation
const timeValidation = validateWeeksEstimate(wizardData.weeks, wizardData.finalPoints);
```

- [ ] **Step 3: Add validation banner JSX**

Insert after the Project Summary section (after line 90, before the Activities section at line 92):

```jsx
      {/* Time Validation Banner */}
      {timeValidation.severity === 'info' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 flex items-start gap-2">
            <span className="text-lg">ℹ️</span>
            <span>{timeValidation.message}</span>
          </p>
        </div>
      )}

      {timeValidation.severity === 'warning' && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
          <p className="text-sm text-amber-900 flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <span>{timeValidation.message}</span>
          </p>
        </div>
      )}
```

- [ ] **Step 4: Test in browser**

Run: `npm run dev`
Manual test:
1. Navigate to step 1, enter 1 week
2. Complete wizard with high complexity/many activities (should calculate 8+ points)
3. On review step, verify WARNING banner appears
4. Go back to step 1, enter 6 weeks with same complexity
5. Verify INFO or no banner appears
6. Test with no weeks entered - verify no banner

Expected: Banners display with correct styling and messages based on validation severity

- [ ] **Step 5: Commit**

```bash
git add src/components/wizard/StepReview.jsx
git commit -m "feat: add time validation banner to review step

Displays info or warning banner when entered weeks don't align with
complexity score. Banner appears between project summary and activities.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Add Time Analysis Section to Report Step

**Files:**
- Modify: `src/components/wizard/StepReport.jsx:1-216` (import validation function, add time analysis section)

**Interfaces:**
- Consumes: `validateWeeksEstimate(enteredWeeks: number|string, storyPoints: number) => {isValid: boolean, severity: 'none'|'info'|'warning', recommendation: {min: number, max: number}, message: string}`
- Produces: React component rendering time analysis section in report

- [ ] **Step 1: Import validateWeeksEstimate in StepReport.jsx**

Add to imports at the top of `src/components/wizard/StepReport.jsx` (line 4):

```javascript
import { generateBreakdown, validateWeeksEstimate } from '../../utils/calculations';
```

- [ ] **Step 2: Add validation calculation in component**

Add after `const breakdown = generateBreakdown(wizardData);` (around line 11):

```javascript
const timeValidation = validateWeeksEstimate(wizardData.weeks, wizardData.finalPoints);
```

- [ ] **Step 3: Add Time Analysis section to JSX**

Insert after the Selected Activities section (after line 152, before the 13-point epic warning at line 154):

```jsx
        {/* Time Estimate Analysis */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-2">Time Estimate Analysis</h3>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Your Estimate:</dt>
              <dd className="font-medium">
                {wizardData.weeks ? `${wizardData.weeks} week${wizardData.weeks > 1 ? 's' : ''}` : 'Not specified'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Recommended Range:</dt>
              <dd className="font-medium">
                {timeValidation.recommendation.min}-{timeValidation.recommendation.max} weeks
                <span className="text-gray-500 font-normal ml-1">
                  (based on {wizardData.finalPoints}-point complexity)
                </span>
              </dd>
            </div>
          </dl>
          {(timeValidation.severity === 'info' || timeValidation.severity === 'warning') && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded p-3">
              <p className="text-sm text-amber-900">
                ⚠️ Your estimate is {wizardData.weeks < timeValidation.recommendation.min ? 'shorter' : 'longer'} than typical for this complexity level.
                Consider whether additional factors justify this timeline.
              </p>
            </div>
          )}
        </div>
```

- [ ] **Step 4: Test in browser**

Run: `npm run dev`
Manual test:
1. Complete an estimation with weeks entered
2. Verify Time Estimate Analysis section appears in report
3. Check that recommended range displays correctly
4. Test with mismatched weeks - verify warning appears
5. Test with no weeks entered - verify "Not specified" displays
6. Test with matched weeks - verify no warning

Expected: Time analysis section displays correctly with proper formatting and conditional warning

- [ ] **Step 5: Commit**

```bash
git add src/components/wizard/StepReport.jsx
git commit -m "feat: add time analysis section to report step

Shows entered weeks, recommended range, and validation warning if
estimate doesn't align with complexity score.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Add Time Validation to generateBreakdown Output

**Files:**
- Modify: `src/utils/calculations.js:107-199` (update `generateBreakdown` function)

**Interfaces:**
- Consumes: `validateWeeksEstimate(enteredWeeks: number|string, storyPoints: number) => {isValid: boolean, severity: 'none'|'info'|'warning', recommendation: {min: number, max: number}, message: string}`
- Produces: Updated `generateBreakdown(estimation: Object) => string` that includes time validation

- [ ] **Step 1: Write test for time validation in breakdown**

Add to `src/utils/calculations.test.js`:

```javascript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- calculations.test.js`
Expected: FAIL - time analysis section not present in breakdown

- [ ] **Step 3: Update generateBreakdown function**

Modify `src/utils/calculations.js`, insert after the "Analysis" section (around line 180, before the duration display):

```javascript
  breakdown += `\n## Time Estimate Analysis\n\n`;

  const timeValidation = validateWeeksEstimate(weeks, finalPoints);

  if (weeks) {
    breakdown += `**Your Estimate:** ${weeks} week${weeks > 1 ? 's' : ''}\n`;
  } else {
    breakdown += `**Your Estimate:** Not specified\n`;
  }

  breakdown += `**Recommended Range:** ${timeValidation.recommendation.min}-${timeValidation.recommendation.max} weeks (based on ${finalPoints}-point complexity)\n`;

  if (timeValidation.severity === 'info' || timeValidation.severity === 'warning') {
    const comparison = weeks < timeValidation.recommendation.min ? 'shorter' : 'longer';
    breakdown += `\n⚠️ Your estimate is ${comparison} than typical for this complexity level. Consider whether additional factors justify this timeline.\n`;
  }
```

Remove or update the existing duration section (around line 182-184) to avoid duplication:

```javascript
  // Remove these lines:
  // if (weeks) {
  //   breakdown += `\n\n**Estimated Duration:** ${weeks} week${weeks > 1 ? 's' : ''}\n`;
  // }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- calculations.test.js`
Expected: All generateBreakdown time validation tests PASS

- [ ] **Step 5: Test clipboard copy**

Run: `npm run dev`
Manual test:
1. Complete an estimation with weeks specified
2. Click "Copy to Clipboard" on report
3. Paste into text editor
4. Verify Time Estimate Analysis section appears with correct formatting
5. Test with mismatched weeks - verify warning in clipboard text

Expected: Clipboard content includes time analysis with proper markdown formatting

- [ ] **Step 6: Commit**

```bash
git add src/utils/calculations.js src/utils/calculations.test.js
git commit -m "feat: add time validation to breakdown output

Include time estimate analysis in generateBreakdown for clipboard copy.
Shows entered vs recommended weeks with validation warnings.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 6: Manual Testing & Documentation

**Files:**
- No code changes
- Manual testing only

**Interfaces:**
- Consumes: All previous tasks
- Produces: Validated, tested feature

- [ ] **Step 1: Test no weeks entered scenario**

Manual test:
1. Start new estimation
2. Skip weeks field (leave empty)
3. Complete wizard
4. Verify no validation banner in review step
5. Verify report shows "Not specified" with recommended range
6. Verify clipboard text includes time analysis with "Not specified"

Expected: Feature works gracefully when weeks not entered

- [ ] **Step 2: Test within recommended range**

Manual test:
1. Start new estimation
2. Enter 4 weeks
3. Complete with moderate complexity (target 5 points)
4. Verify no validation banner in review step
5. Verify report shows entered weeks without warning

Expected: No warnings when estimate is appropriate

- [ ] **Step 3: Test info-level validation (tolerance edge)**

Manual test:
1. Start new estimation with 2 weeks
2. Complete with 3-point complexity (recommends 2-3 weeks)
3. Verify no banner (within recommended)
4. Repeat with 4 weeks for 3-point task
5. Verify INFO banner appears (tolerance is 1.4-3.9 → 1-4 weeks)

Expected: Info banner for slight mismatches within tolerance

- [ ] **Step 4: Test warning-level validation (significant mismatch)**

Manual test:
1. Start estimation with 1 week
2. Complete with high complexity (target 8 points: recommends 5-8 weeks)
3. Verify WARNING banner in review step
4. Verify amber warning in report
5. Test opposite: 15 weeks for 3-point task
6. Verify WARNING banner for overestimate

Expected: Warning banners for significant mismatches

- [ ] **Step 5: Test edge cases**

Manual test:
1. Test 0 weeks - verify warning
2. Test decimal weeks (2.5) - verify works correctly
3. Test very large number (52 weeks) - verify validation works
4. Test 13-point task with various week values
5. Verify both epic warning AND time validation appear when applicable

Expected: All edge cases handled gracefully

- [ ] **Step 6: Test visual consistency**

Manual test:
1. Compare warning banner styling to existing 13-point epic warning
2. Verify info banner uses blue-50 background
3. Verify warning banner uses amber-50 background
4. Check text sizing, padding, and icon placement
5. Verify responsive behavior (resize browser)

Expected: Visual consistency with existing patterns

- [ ] **Step 7: Test saved estimations (backward compatibility)**

Manual test:
1. Complete and save an estimation with weeks
2. View in history - verify time analysis shows
3. Test with existing saved estimation (if any) without weeks field
4. Verify no errors, shows "Not specified"

Expected: Backward compatible with existing data

- [ ] **Step 8: Document testing completion**

No commit needed - this is validation only. If all tests pass, proceed to final commit with test results summary.

---

### Task 7: Final Integration Test & Completion

**Files:**
- No code changes

**Interfaces:**
- Consumes: All previous tasks
- Produces: Feature complete message

- [ ] **Step 1: Run full test suite**

Run: `npm test`
Expected: All tests PASS

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build completes without errors

- [ ] **Step 3: Final end-to-end test**

Manual test:
1. Start fresh estimation
2. Enter weeks in step 1
3. Select activities in step 2
4. Rate complexity in step 3
5. View validation banner in review step (step 4)
6. View time analysis in report (step 5)
7. Copy to clipboard and verify markdown includes time analysis
8. Save estimation
9. View in history and verify time analysis preserved

Expected: Complete flow works end-to-end

- [ ] **Step 4: Verify feature completeness against spec**

Check against `docs/superpowers/specs/2026-07-27-time-validation-design.md`:
- [ ] calculateRecommendedWeeks maps all complexity scores correctly
- [ ] validateWeeksEstimate returns correct severity levels
- [ ] Review step shows validation banner with correct styling
- [ ] Report step shows time analysis section
- [ ] generateBreakdown includes time validation
- [ ] No weeks entered handled gracefully
- [ ] Zero weeks shows warning
- [ ] Decimal weeks accepted
- [ ] 13-point tasks show both warnings
- [ ] Backward compatible

Expected: All spec requirements met

- [ ] **Step 5: Create summary commit (if needed)**

If all manual tests pass and feature is complete, create a summary note:

```bash
# No actual commit needed - just verification that feature is complete
echo "Time validation feature implementation complete and tested"
```

Expected: Feature ready for use
