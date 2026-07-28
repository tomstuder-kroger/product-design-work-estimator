# Time Validation Feature Design

**Date:** 2026-07-27
**Status:** Approved
**Author:** Design Team

## Overview

Add time estimate validation to help users identify when their entered timeframe (weeks) doesn't align with the calculated complexity score. This addresses the problem where users might select multiple artifacts and activities across Discovery, Define, and Design stages and under or over-estimate the required duration.

## Problem Statement

Users currently enter an optional duration (weeks) in Step 1, but receive no feedback about whether this aligns with the complexity of work they've selected. This can lead to:
- Underestimation when selecting many high-complexity activities
- Overestimation for straightforward work
- Missed opportunities to calibrate estimation skills
- Inconsistent time estimates across similar-complexity projects

## Solution

Provide validation that compares the user's entered weeks against a recommended range based on their complexity score. Show this validation in two places:
1. **Review step (Step 4)**: Where users can navigate back to adjust if needed
2. **Final report (Step 5)**: For documentation and reference

## Goals

- Help users catch significant under/over-estimation before finalizing
- Educate users about typical timeframes for different complexity levels
- Maintain optional nature of weeks input (not required)
- Avoid alert fatigue with tolerance-based validation

## Non-Goals

- Making weeks a required field
- Blocking users from saving "mismatched" estimates
- Providing highly sophisticated ML-based time prediction
- Replacing the complexity score as the primary estimation output

## Architecture & Components

### New Utility Functions

Location: `src/utils/calculations.js`

#### `calculateRecommendedWeeks(storyPoints)`

Maps complexity score to recommended week ranges:

| Complexity Score | Recommended Weeks |
|-----------------|-------------------|
| 1-2 points      | 1-2 weeks        |
| 3 points        | 2-3 weeks        |
| 5 points        | 3-5 weeks        |
| 8 points        | 5-8 weeks        |
| 13 points       | 8-12 weeks       |

**Input:** `storyPoints` (number: 1, 2, 3, 5, 8, or 13)
**Output:** `{min: number, max: number}`

#### `validateWeeksEstimate(enteredWeeks, storyPoints)`

Compares entered weeks against recommended range with ±30% tolerance.

**Input:**
- `enteredWeeks` (number or empty string)
- `storyPoints` (number: 1, 2, 3, 5, 8, or 13)

**Output:**
```javascript
{
  isValid: boolean,
  severity: 'none' | 'info' | 'warning',
  recommendation: {min: number, max: number},
  message: string
}
```

**Tolerance Logic:**
```
recommendedMin = calculated min weeks
recommendedMax = calculated max weeks
toleranceMin = recommendedMin * 0.7 (rounded down)
toleranceMax = recommendedMax * 1.3 (rounded up)

severity = 'none'     → No weeks entered OR within recommended range
severity = 'info'     → Outside recommended but within tolerance
severity = 'warning'  → Outside tolerance range (significant mismatch)
```

**Example** (5-point task):
- Recommended: 3-5 weeks
- Tolerance: 2-7 weeks (calculated as 2.1-6.5, rounded)
- 1 week → WARNING (underestimate)
- 2 weeks → INFO (low end)
- 3-5 weeks → NONE (good match)
- 6 weeks → INFO (high end)
- 8 weeks → WARNING (overestimate)

### Modified Components

#### `StepReview.jsx`

Add validation banner between summary cards and override controls.

**Three banner states:**

1. **None** (severity: 'none'): No banner shown
2. **Info** (severity: 'info'):
   - Style: `bg-blue-50 border border-blue-200`
   - Icon: ℹ️
   - Message: "Your {X} week estimate is on the [low/high] end. Recommended range: {min}-{max} weeks for a {points}-point task."
3. **Warning** (severity: 'warning'):
   - Style: `bg-amber-50 border border-amber-300` (matches existing 13-point warning)
   - Icon: ⚠️
   - Message: "Your {X} week estimate may be [too short/too long] for this complexity. Recommended: {min}-{max} weeks for a {points}-point task. Consider adjusting your duration in Step 1 before finalizing."

**When validation runs:** On component mount and when `wizardData.finalPoints` changes.

#### `StepReport.jsx`

Add "Time Estimate Analysis" section after "Selected Activities" section.

**Content:**
```
## Time Estimate Analysis

**Your Estimate:** {weeks} weeks [or "Not specified"]
**Recommended Range:** {min}-{max} weeks (based on {points}-point complexity)

[If severity is 'info' or 'warning':]
⚠️ Your estimate is [shorter/longer] than typical for this complexity level.
Consider whether additional factors justify this timeline.
```

#### `generateBreakdown()` in `calculations.js`

Add time analysis section to the markdown output (for clipboard copy).

Insert after the "Analysis" section and before override reasons.

### No Changes Required

- Data model (wizardData structure remains unchanged)
- `StepProjectInfo.jsx` (weeks input unchanged)
- Complexity score calculation logic
- Storage or migration (backward compatible)

## Data Flow

1. User enters weeks in Step 1 (optional)
2. User completes complexity assessment and activities selection
3. System calculates `finalPoints`
4. **Review Step (Step 4):**
   - Call `validateWeeksEstimate(wizardData.weeks, wizardData.finalPoints)`
   - Display banner based on severity
   - User can navigate back to Step 1 to adjust weeks if desired
5. **Report Step (Step 5):**
   - Call `validateWeeksEstimate()` again for display
   - Include time analysis in report text
   - Include in `generateBreakdown()` for clipboard copy

## Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| No weeks entered (`''` or `null`) | severity: 'none', no banner, report shows "Not specified" |
| Zero weeks (`0`) | severity: 'warning', "0 weeks seems unrealistic" |
| Decimal weeks (`2.5`) | Accepted, validation handles decimals naturally |
| Very large numbers (`52+`) | Validation flags as overestimate, no hard cap |
| Negative numbers | Prevented by HTML `min="0"` attribute |
| 13-point tasks | Both epic warning AND time validation shown (if applicable) |
| Historical data without weeks | Backward compatible, no migration needed |

## UI/UX Specifications

### Visual Hierarchy

1. Summary cards (existing)
2. **[NEW] Time validation banner** (if applicable)
3. Override controls (existing)
4. Explanatory text (existing)

### Design Consistency

- Warning banner styling matches existing 13-point epic warning pattern
- Info banner uses standard info color scheme (blue-50)
- Icons: ℹ️ for info, ⚠️ for warning
- Rounded corners and padding consistent with existing cards

### Messaging Tone

- **Info level:** Gentle, informational, non-alarming
- **Warning level:** Clear but not blocking, suggest action but don't prevent
- **Report:** Factual, documentary, helpful for stakeholder review

## Testing Strategy

### Unit Tests

Add to `src/utils/calculations.test.js`:

**`calculateRecommendedWeeks()`:**
- [ ] 1 point → {1, 2}
- [ ] 2 points → {1, 2}
- [ ] 3 points → {2, 3}
- [ ] 5 points → {3, 5}
- [ ] 8 points → {5, 8}
- [ ] 13 points → {8, 12}

**`validateWeeksEstimate()`:**
- [ ] Within recommended range → severity: 'none'
- [ ] Within tolerance but outside recommended → severity: 'info'
- [ ] Below tolerance → severity: 'warning', underestimate message
- [ ] Above tolerance → severity: 'warning', overestimate message
- [ ] No weeks entered → severity: 'none'
- [ ] Zero weeks → severity: 'warning'
- [ ] Decimal weeks → handled correctly
- [ ] Each complexity level (1, 2, 3, 5, 8, 13) tested

**`generateBreakdown()`:**
- [ ] Time analysis section present when weeks entered
- [ ] Time analysis absent/minimal when weeks not entered
- [ ] Validation warnings appear in breakdown text

### Manual Testing

- [ ] Review step: no banner when weeks not entered
- [ ] Review step: info banner for slight mismatch
- [ ] Review step: warning banner for significant mismatch
- [ ] Report: time analysis section displays correctly
- [ ] Copy to clipboard includes time analysis
- [ ] Saved estimations show time analysis in history
- [ ] Visual consistency with existing warnings
- [ ] Navigation: can go back to Step 1 and adjust weeks
- [ ] Edge cases: 0 weeks, decimals, very large numbers
- [ ] 13-point tasks show both warnings appropriately

## Implementation Notes

### Rationale for Approach

**Why map from complexity score instead of recalculating from activities?**
- Complexity score already synthesizes all inputs (complexity dimensions, activities, duration)
- Avoids double-counting activity weight
- Creates clear mental model for users
- Simpler logic, easier to maintain

**Why ±30% tolerance?**
- Prevents excessive warnings for minor variations
- Accounts for team-specific factors (part-time work, parallel projects)
- Can be tuned based on user feedback

**Why display-only in review step (no inline editing)?**
- Maintains linear wizard pattern
- Keeps weeks input in single source of truth (Step 1)
- Simple for MVP, can add inline editing later if needed

### Future Enhancements (Out of Scope for MVP)

- Machine learning based on historical estimation accuracy
- Team-specific calibration (different teams have different velocities)
- Inline editing of weeks in review step
- Activity-specific time multipliers
- Integration with calendar/sprint planning tools
- Detailed time breakdown by activity type

## Success Metrics

Post-launch evaluation criteria:

1. **Adoption:** % of estimations where weeks are entered (track before/after)
2. **Adjustment rate:** % of users who adjust weeks after seeing validation
3. **Accuracy improvement:** Compare estimated vs actual time (if tracked)
4. **Warning distribution:** How many info vs warning banners shown
5. **User feedback:** Qualitative feedback on helpfulness

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Users ignore warnings | Start with clear messaging; can make more prominent if needed |
| Recommended ranges are inaccurate | Conservative tolerance (±30%); can tune based on data |
| Alert fatigue if too many warnings | Tolerance range filters minor mismatches |
| Confusion with complexity score | Clear messaging that both metrics serve different purposes |

## Appendix: Example Scenarios

### Scenario 1: Underestimation Caught

- User enters 1 week for project
- Selects 6 high-complexity activities
- Final score: 8 points
- Recommended: 5-8 weeks
- Tolerance: 4-10 weeks
- Result: **WARNING** "Your 1 week estimate may be too short"

### Scenario 2: Slight Overestimation

- User enters 6 weeks
- Moderate complexity, few activities
- Final score: 3 points
- Recommended: 2-3 weeks
- Tolerance: 1-4 weeks
- Result: **INFO** "Your 6 week estimate is on the high end"

### Scenario 3: Good Match

- User enters 4 weeks
- Mixed complexity
- Final score: 5 points
- Recommended: 3-5 weeks
- Result: **No banner** (within recommended range)

### Scenario 4: No Weeks Entered

- User skips weeks field
- Final score: 5 points
- Result: **No banner** in review, report shows "Not specified" with recommended range
