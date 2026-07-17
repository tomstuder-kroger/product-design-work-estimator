# Product Design Work Estimator - Enhanced Activity Weighting & T-Shirt Sizing

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance the estimation tool with weighted activities from Design Ops references, auto-calculated T-shirt sizing with override capability, and rebrand to "Product Design Work Estimator"

**Architecture:** Incremental enhancement approach - extend existing data model and calculation logic without major refactoring

**Tech Stack:** React 18, Vite, Tailwind CSS, existing context/calculation patterns

## Global Constraints

- Maintain all existing functionality - no breaking changes
- Use existing component patterns (checkboxes, override UI similar to story points)
- Keep calculation transparent and explainable in breakdown text
- All weights and calculations must be visible to users (no hidden magic)
- Maintain Kroger design system (primary colors, fonts, spacing)
- Follow existing code style and structure
- Keep bundle size reasonable (no new heavy dependencies)

---

## Overview

This enhancement adds four major capabilities to the Story Points Calculator:

1. **Enhanced Activity Library**: Merge existing activities with Design Ops activity references, removing duplicates
2. **Activity Weighting System**: Each activity has a default weight (Low/Medium/High effort) with user override capability
3. **Auto-Calculated T-Shirt Sizing**: Remove manual T-shirt input, calculate based on story points, allow override
4. **Rebranding**: Rename to "Product Design Work Estimator" to better reflect capabilities

## Part 1: Activity Data Model Enhancement

### Current State
Activities are simple string arrays in `src/utils/constants.js`:
```javascript
export const ACTIVITIES = {
  Discovery: ['Research planning', 'Competitive analysis', ...],
  Define: ['Problem statement writing', ...],
  Design: ['User flow creation', ...]
}
```

### New Structure
Each activity becomes an object with metadata:

```javascript
{
  name: "Journey Map",
  defaultWeight: 3,  // 1=Low, 2=Medium, 3=High effort
  stage: "Discovery",
  category: "Understanding/Synthesis"  // from Design Ops framework
}
```

### Activity Stage Mapping

**Discovery Stage** (Looking/Research + Strategic Synthesis):
- Keep existing: Research planning, Competitive analysis, Stakeholder interviews, User interviews (3-5), User interviews (6-10), Surveys, Usability studies, Diary study, Journey map creation, Service blueprint creation, Persona creation/update, Opportunity mapping, Research synthesis & readout
- Add from Design Ops: Contextual inquiry, User & market landscape exploration, Feasibility & risk assessment, Object Oriented Design (Data-Focused Generative Design), Gigamap, Ecosystem Map, Dependency Map, Stakeholder Mapping, Problem framing, Brainstorm session

**Define Stage** (Strategic Planning + Framing):
- Keep existing: Problem statement writing, How Might We questions, Opportunity mapping, Assumption/risk mapping, Prioritization workshop, Story map creation, MVP definition, Experience principles definition, Success metrics definition, Design brief creation
- Add from Design Ops: User Flow - Current State, User Flow - Desired State, Jobs to be Done, Painpoint Analysis, User Story Mapping, Data Mapping, Visioning workshop, Stakeholder interviews/alignment, Design Leadership Review, Brainstorm session

**Design Stage** (Making/Prototyping + Validation):
- Keep existing: User flow creation, Wireframing (low-fidelity), Wireframing (high-fidelity), Information architecture, UI mockups (existing patterns), UI mockups (new patterns), Clickable prototype, Multi-platform design (responsive), Accessibility review, Content design, Design system work, Design handoff/specs
- Add from Design Ops: AI Prototyping / Vibe Coding, New pattern design, Design pattern evolution, New prototype (local interaction change), New prototype with E2E flow, Rough and Ready Prototyping (lo-fi make to learn research), Initial vision concepts, Concept Poster, Vision documentation, Concept Testing, Usability Testing, A/B testing, Champion/Challenger testing, Documentation creation or updating, UX review tasks for dev team, Regular Stakeholder Updates, Brainstorm session

### Weight Assignments

Based on activity-time.pdf sizing guide:

**Weight 1 (Low Effort)** - Activities typically in "Small" (1-2 weeks) tier:
- Research planning
- Competitive analysis
- Stakeholder interviews
- User interviews (3-5)
- Surveys
- How Might We questions
- Assumption/risk mapping
- Wireframing (low-fidelity)
- User flow creation
- Content design
- Brainstorm session
- UX review tasks for dev team
- Documentation creation or updating

**Weight 2 (Medium Effort)** - Activities typically in "Medium" (3-4 weeks) tier:
- User interviews (6-10)
- Usability studies
- Persona creation/update
- Opportunity mapping
- Problem statement writing
- Prioritization workshop
- Story map creation
- Experience principles definition
- Success metrics definition
- Wireframing (high-fidelity)
- Information architecture
- UI mockups (existing patterns)
- Accessibility review
- User Flow - Current State
- User Flow - Desired State
- Jobs to be Done
- Painpoint Analysis
- User Story Mapping
- Data Mapping
- New pattern design
- Design pattern evolution
- New prototype (local interaction change)
- Clickable prototype
- AI Prototyping / Vibe Coding
- Concept Testing
- Usability Testing
- A/B testing
- Design handoff/specs

**Weight 3 (High Effort)** - Activities typically in "Large/Extra Large" (5+ weeks) tier:
- Diary study
- Journey map creation
- Service blueprint creation
- Research synthesis & readout
- Design brief creation
- MVP definition
- UI mockups (new patterns)
- Multi-platform design (responsive)
- Design system work
- Contextual inquiry
- User & market landscape exploration
- Feasibility & risk assessment
- Object Oriented Design (Data-Focused Generative Design)
- Gigamap
- Ecosystem Map
- Dependency Map
- Stakeholder Mapping
- Problem framing
- Visioning workshop
- Stakeholder interviews/alignment
- Design Leadership Review
- New prototype with E2E flow
- Rough and Ready Prototyping (lo-fi make to learn research)
- Initial vision concepts
- Concept Poster
- Vision documentation
- Champion/Challenger testing
- Regular Stakeholder Updates

### Data Structure Changes

**File:** `src/utils/constants.js`

Replace `ACTIVITIES` object with:
```javascript
export const ACTIVITIES_DATA = [
  {
    name: "Research planning",
    defaultWeight: 1,
    stage: "Discovery",
    category: "Looking/Research"
  },
  // ... all activities
];

// Helper to get activities by stage
export const getActivitiesByStage = (stage) => {
  return ACTIVITIES_DATA.filter(a => a.stage === stage);
};
```

**File:** `src/context/EstimationContext.jsx`

Extend `wizardData` to store activity adjustments:
```javascript
{
  activities: ['Journey Map', 'User interviews (3-5)'],
  activityAdjustments: {
    'Journey Map': 0,           // 0 = Typical, -1 = Less Complex, +1 = More Complex
    'User interviews (3-5)': -1  // Adjusted to less complex
  }
}
```

## Part 2: Activity Override UI

### Location
Step 2: Activities & Artifacts (`src/components/wizard/StepActivities.jsx`)

### UI Pattern
When an activity is selected, show inline complexity adjustment:

```
☑ Journey Map                          [−] Typical [+]
☑ User interviews (3-5)                [−] Less Complex [+]
☑ Persona creation/update              [−] More Complex [+]
```

### Component Structure

**New Component:** `src/components/common/ActivityWithWeight.jsx`
- Props: `{ activity, isSelected, onToggle, adjustment, onAdjustment }`
- Renders checkbox + activity name + adjustment control
- Adjustment control only visible when `isSelected === true`
- Color coding:
  - Less Complex: green text/border
  - Typical: gray (default)
  - More Complex: amber text/border

### Behavior
- Default state: All activities at "Typical" (adjustment = 0)
- Click `[−]`: Set adjustment to -1 (minimum)
- Click `[+]`: Set adjustment to +1 (maximum)
- Adjustment range: [-1, 0, +1]
- Adjustment resets to 0 if activity is deselected

### User Feedback
- Show count in step header: "6 activities selected (2 adjusted)"
- In review step, show adjusted activities: "Journey Map (more complex than typical)"

## Part 3: Enhanced Calculation Logic

### Current Calculation
Located in `src/utils/calculations.js`:
- Complexity Score (3-12 points)
- Activity Count Factor (+0 to +3)
- Duration Factor (+0 to +3)
- Total mapped to Fibonacci (1, 2, 3, 5, 8, 13)

### New Calculation

**Step 1: Calculate Weighted Activity Score**
```javascript
function calculateActivityScore(selectedActivities, adjustments) {
  let totalWeight = 0;

  selectedActivities.forEach(activityName => {
    const activity = ACTIVITIES_DATA.find(a => a.name === activityName);
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

**Step 2: Complexity Score (unchanged)**
```javascript
function calculateComplexityScore(complexity) {
  let total = 0;
  if (complexity.ambiguity) total += COMPLEXITY_LEVELS[complexity.ambiguity].value;
  if (complexity.artifactComplexity) total += COMPLEXITY_LEVELS[complexity.artifactComplexity].value;
  if (complexity.stakeholderRisk) total += COMPLEXITY_LEVELS[complexity.stakeholderRisk].value;
  if (complexity.iterationLikelihood) total += COMPLEXITY_LEVELS[complexity.iterationLikelihood].value;
  return total;
}
```

**Step 3: Duration Score (unchanged)**
```javascript
function calculateDurationScore(weeks) {
  const weeksNum = Number(weeks) || 0;
  if (weeksNum >= 11) return 3;
  if (weeksNum >= 6) return 2;
  if (weeksNum >= 3) return 1;
  return 0;
}
```

**Step 4: Story Points (updated to use new activity score)**
```javascript
export function calculateStoryPoints(complexity, selectedActivities, activityAdjustments, weeks) {
  const complexityScore = calculateComplexityScore(complexity);
  const activityScore = calculateActivityScore(selectedActivities, activityAdjustments);
  const durationScore = calculateDurationScore(weeks);

  const total = complexityScore + activityScore + durationScore;

  // Map to Fibonacci scale
  if (total <= 4) return 1;
  if (total <= 6) return 2;
  if (total <= 8) return 3;
  if (total <= 11) return 5;
  if (total <= 15) return 8;
  return 13;
}
```

**Step 5: T-Shirt Size (new)**
```javascript
export function calculateTShirtSize(storyPoints) {
  if (storyPoints <= 2) return 'XS';
  if (storyPoints === 3) return 'S';
  if (storyPoints === 5) return 'M';
  if (storyPoints === 8) return 'L';
  return 'XL';
}
```

### Calculation Transparency

Update `generateBreakdown` to show:
- Activity weights: "6 activities selected (total weight: 14, contribution: +2 points)"
- List adjusted activities: "Journey Map (more complex), User interviews (less complex)"
- T-shirt size calculation: "T-Shirt Size: M (based on 5 story points)"

## Part 4: T-Shirt Size UI Changes

### Step 1 (Project Info) Changes

**File:** `src/components/wizard/StepProjectInfo.jsx`

**Remove:**
- T-shirt size dropdown field (lines 119-140 in current version)
- T-shirt size from `isStepValid` validation function
- T-shirt size from `wizardData.tShirtSize` state

**Result:** Step 1 no longer requires T-shirt size input

### Step 4 (Review) Changes

**File:** `src/components/wizard/StepReview.jsx`

**Add T-Shirt Size Display:**
```javascript
const calculatedTShirtSize = calculateTShirtSize(calculatedPoints);
const [tShirtOverride, setTShirtOverride] = useState(false);
const [customTShirtSize, setCustomTShirtSize] = useState('');
const [tShirtReason, setTShirtReason] = useState('');

const finalTShirtSize = tShirtOverride ? customTShirtSize : calculatedTShirtSize;
```

**UI Layout (after story points section):**
```jsx
<div className="mt-6 p-4 bg-gray-50 rounded-lg">
  <h3 className="font-semibold text-gray-900">Recommended T-Shirt Size</h3>
  <p className="text-2xl font-bold text-primary mt-2">{calculatedTShirtSize}</p>
  <p className="text-sm text-gray-600 mt-1">
    Based on {calculatedPoints} story points
  </p>

  <label className="flex items-center mt-4">
    <input
      type="checkbox"
      checked={tShirtOverride}
      onChange={(e) => setTShirtOverride(e.target.checked)}
      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
    />
    <span className="ml-2 text-sm text-gray-700">Override recommended size</span>
  </label>

  {tShirtOverride && (
    <div className="mt-4 space-y-3">
      <select
        value={customTShirtSize}
        onChange={(e) => setCustomTShirtSize(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
      >
        <option value="">Select size...</option>
        <option value="XS">XS - Extra Small</option>
        <option value="S">S - Small</option>
        <option value="M">M - Medium</option>
        <option value="L">L - Large</option>
        <option value="XL">XL - Extra Large</option>
      </select>

      <input
        type="text"
        placeholder="Reason for override (optional)"
        value={tShirtReason}
        onChange={(e) => setTShirtReason(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
      />
    </div>
  )}
</div>
```

### Step 5 (Report) Changes

**File:** `src/components/wizard/StepReport.jsx`

**Add T-Shirt Size to Report:**
- Show final T-shirt size in summary section
- Include in breakdown text
- Show override reason if applicable
- Include in saved estimation data

### Context Updates

**File:** `src/context/EstimationContext.jsx`

**Update estimation data structure:**
```javascript
{
  projectName: "...",
  stage: "Discovery",
  activities: ["Journey Map", "User interviews (3-5)"],
  activityAdjustments: { "Journey Map": 1, "User interviews (3-5)": -1 },
  complexity: { ... },
  weeks: 4,
  calculatedPoints: 5,
  calculatedTShirtSize: "M",
  finalPoints: 5,
  finalTShirtSize: "M",
  isPointsOverridden: false,
  isTShirtOverridden: false,
  pointsOverrideReason: "",
  tShirtOverrideReason: "",
  // ... other fields
}
```

## Part 5: Rebranding to "Product Design Work Estimator"

### Changes Required

**Package & Config Files:**
- `package.json`: Update `name` field to `product-design-work-estimator`
- `index.html`: Update `<title>` tag
- `README.md`: Update title and description

**User-Facing Copy:**

**File:** `src/components/common/Layout.jsx`
- Header title: "Product Design Work Estimator"

**File:** `src/components/wizard/StepProjectInfo.jsx`
- Heading: "Tell us about the work you're estimating"

**File:** `src/components/wizard/StepReview.jsx`
- Page heading: "Review Your Estimation"

**File:** `src/components/wizard/StepReport.jsx`
- Report heading: "Estimation Summary"
- Generated by text: "Generated by Product Design Work Estimator"

**File:** `src/pages/WizardPage.jsx`
- Browser tab title update if dynamic

**File:** `src/pages/HistoryPage.jsx`
- Page title: "Estimation History"

### What Stays the Same
- Story points remain the primary estimation unit (1, 2, 3, 5, 8, 13)
- Fibonacci scale unchanged
- "Story Points" terminology in reports and breakdowns
- URL paths can remain unchanged (optional to update)

## Testing Strategy

### Unit Tests

**File:** `src/utils/calculations.test.js`

Add tests for:
- `calculateActivityScore` with various weight combinations
- `calculateActivityScore` with adjustments (-1, 0, +1)
- `calculateTShirtSize` for all story point values (1, 2, 3, 5, 8, 13)
- End-to-end calculation with weighted activities

Example test cases:
```javascript
test('calculateActivityScore with typical weights', () => {
  const activities = ['Journey Map', 'User interviews (3-5)'];
  const adjustments = {};
  const score = calculateActivityScore(activities, adjustments);
  expect(score).toBe(/* expected based on weights */);
});

test('calculateActivityScore with adjustments', () => {
  const activities = ['Journey Map'];
  const adjustments = { 'Journey Map': 1 }; // More complex
  const score = calculateActivityScore(activities, adjustments);
  expect(score).toBeGreaterThan(calculateActivityScore(activities, {}));
});

test('calculateTShirtSize maps correctly', () => {
  expect(calculateTShirtSize(1)).toBe('XS');
  expect(calculateTShirtSize(2)).toBe('XS');
  expect(calculateTShirtSize(3)).toBe('S');
  expect(calculateTShirtSize(5)).toBe('M');
  expect(calculateTShirtSize(8)).toBe('L');
  expect(calculateTShirtSize(13)).toBe('XL');
});
```

### Manual Testing Checklist

**Activity Weighting:**
- [ ] Select activities, verify default weights apply
- [ ] Adjust activity complexity, verify calculation updates
- [ ] Deselect adjusted activity, verify adjustment resets
- [ ] Verify adjusted activities show in review step
- [ ] Verify breakdown text includes activity weight info

**T-Shirt Sizing:**
- [ ] Complete estimation, verify T-shirt size auto-calculated
- [ ] Try different story point values, verify size mapping
- [ ] Override T-shirt size, verify override persists
- [ ] Add override reason, verify it appears in report
- [ ] Save estimation, verify T-shirt data persists

**Rebranding:**
- [ ] Check all page titles show "Product Design Work Estimator"
- [ ] Verify browser tab title updated
- [ ] Check report generation includes new name
- [ ] Verify no references to old "Story Points Calculator" remain

**Backwards Compatibility:**
- [ ] Load saved estimations from before upgrade
- [ ] Verify old estimations display correctly
- [ ] Verify old estimations can be edited
- [ ] Verify old estimations show "T-Shirt Size: (not calculated)" gracefully

## Migration Strategy

### Handling Existing Data

Saved estimations in localStorage may not have:
- `activityAdjustments` object
- `calculatedTShirtSize` / `finalTShirtSize` / `isTShirtOverridden`

**Migration approach:**
```javascript
function migrateEstimation(savedEstimation) {
  return {
    ...savedEstimation,
    activityAdjustments: savedEstimation.activityAdjustments || {},
    calculatedTShirtSize: savedEstimation.calculatedTShirtSize || calculateTShirtSize(savedEstimation.finalPoints),
    finalTShirtSize: savedEstimation.finalTShirtSize || savedEstimation.tShirtSize || calculateTShirtSize(savedEstimation.finalPoints),
    isTShirtOverridden: savedEstimation.isTShirtOverridden || false,
    tShirtOverrideReason: savedEstimation.tShirtOverrideReason || ""
  };
}
```

Apply migration when loading from localStorage in `src/utils/storage.js`.

## Success Metrics

**Quantitative:**
- All unit tests pass
- No console errors or warnings
- Bundle size increase < 5KB
- All existing estimations load successfully

**Qualitative:**
- Activity override UI is intuitive (user testing)
- T-shirt size auto-calculation reduces friction
- Calculation breakdown is clear and explainable
- Rebranding feels cohesive across all touchpoints

## Future Enhancements (Out of Scope)

- Time estimation in hours/days (separate feature)
- Activity recommendations based on stage
- Bulk activity adjustment (e.g., "All activities +1")
- Activity filtering by category (Looking/Understanding/Making/Executing)
- Export to CSV with activity weights
- Team velocity tracking over time

## Summary

This design enhances the Product Design Work Estimator with:
1. Rich activity metadata including default weights mapped from Design Ops references
2. User override capability for activity complexity
3. Auto-calculated T-shirt sizing based on story points with override option
4. Cohesive rebranding to reflect true capabilities

The incremental enhancement approach minimizes risk, maintains existing functionality, and delivers all features together as one coherent update.
