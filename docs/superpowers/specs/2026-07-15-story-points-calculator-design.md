# Story Points Calculator for Product Designers - Design Specification

**Date:** July 15, 2026
**Status:** Approved
**Version:** 1.0

## Overview

A React-based web application that guides product designers through estimating story points for design work across Discovery, Define, and Design phases. The app acts as an intelligent estimation assistant, asking targeted questions about work complexity and generating detailed reports with point calculations and rationale.

## Problem Statement

Product designers need a systematic way to estimate the complexity of design work using story points for capacity planning. Without structured guidance, estimations are inconsistent and fail to account for key complexity drivers like ambiguity, stakeholder alignment, and artifact creation. This tool translates the comprehensive story points reference into an interactive, step-by-step estimation process.

## Goals

**Primary Goals:**
- Guide designers through accurate story point estimation using a wizard interface
- Generate detailed reports explaining how points were calculated
- Build historical reference of past estimations for calibration and consistency
- Keep the MVP focused on single-item estimation with full detail capture

**Non-Goals (for MVP):**
- Team capacity planning or velocity tracking
- Multi-item batch estimation
- Integration with project management tools
- Time-to-points conversion or hour estimation
- Performance measurement or designer comparison

## User Flow

1. User lands on home page, clicks "New Estimation"
2. Steps through 5-step wizard:
   - Step 1: Enter project info (name, stage, weeks, description)
   - Step 2: Select activities/artifacts from stage-specific list
   - Step 3: Assess complexity across 3-4 dimensions
   - Step 4: Review inputs and calculated points, optionally override
   - Step 5: View report, copy to clipboard, save to history
3. Can navigate back/forward through wizard to refine inputs
4. Can view history of past estimations with full details
5. Can clone past estimations as starting point for new work

## Architecture

### Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Storage:** Browser localStorage
- **Testing:** Vitest + React Testing Library (for future)

### Project Structure

```
story_points/
├── public/
├── src/
│   ├── components/
│   │   ├── wizard/
│   │   │   ├── WizardStepper.jsx           # Progress indicator
│   │   │   ├── WizardNavigation.jsx        # Back/Next/Submit buttons
│   │   │   ├── StepProjectInfo.jsx         # Step 1: Project details
│   │   │   ├── StepActivities.jsx          # Step 2: Activity selection
│   │   │   ├── StepComplexity.jsx          # Step 3: Complexity assessment
│   │   │   ├── StepReview.jsx              # Step 4: Review & override
│   │   │   └── StepReport.jsx              # Step 5: Final report
│   │   ├── history/
│   │   │   ├── HistoryList.jsx             # List view of estimations
│   │   │   └── HistoryDetail.jsx           # Full report detail view
│   │   └── common/
│   │       ├── Layout.jsx                  # App shell with nav
│   │       ├── ActivityCheckboxGrid.jsx    # 3-column checkbox layout
│   │       └── ComplexitySelector.jsx      # Low/Medium/High button group
│   ├── context/
│   │   └── EstimationContext.jsx           # Global state for wizard + history
│   ├── utils/
│   │   ├── calculations.js                 # Point calculation logic
│   │   ├── storage.js                      # localStorage helpers
│   │   └── constants.js                    # Activities, stages, reference data
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-07-15-story-points-calculator-design.md
├── references/
│   └── story-points-reference.md
├── package.json
├── vite.config.js
└── README.md
```

### Routing Structure

```
/                    → Home/New Estimation (Wizard)
/history             → History List
/history/:id         → History Detail View
```

### State Management

**EstimationContext provides:**
- `wizardData` - Current wizard form state
- `currentStep` - Active step (1-5)
- `history` - Array of saved estimations
- `setWizardData()` - Update form fields
- `goToStep()` - Navigate wizard
- `calculatePoints()` - Generate story points from inputs
- `saveEstimation()` - Persist to history
- `loadEstimation()` - Clone from history into wizard
- `deleteEstimation()` - Remove from history
- `saveDraft()` - Auto-save in-progress work
- `loadDraft()` - Resume unfinished estimation

## Data Model

### Estimation Object

```javascript
{
  // Identification
  id: "uuid-v4",
  timestamp: "2026-07-15T14:30:00.000Z",

  // Project Information (Step 1)
  projectName: "Create journey map for onboarding",
  stage: "Discovery", // "Discovery" | "Define" | "Design"
  weeks: 2,
  description: "Map end-to-end new user onboarding experience",

  // Activities (Step 2)
  activities: [
    "User interviews (3-5)",
    "Journey map creation",
    "Persona creation"
  ],

  // Complexity Assessment (Step 3)
  complexity: {
    ambiguity: "Medium",              // "Low" | "Medium" | "High"
    artifactComplexity: "Medium",     // "Low" | "Medium" | "High"
    stakeholderRisk: "Low",           // "Low" | "Medium" | "High"
    iterationLikelihood: "Medium"     // "Low" | "Medium" | "High" (optional)
  },

  // Calculation Results (Step 4)
  calculatedPoints: 5,
  finalPoints: 5,
  isOverridden: false,
  overrideReason: "",

  // Explanation (Step 5)
  calculationBreakdown: "Based on your inputs:\n- Problem/Solution Ambiguity: Medium...",
}
```

### LocalStorage Keys

```javascript
// Persistent history (max 100 items)
localStorage.setItem('storypoint_history', JSON.stringify([...]));

// Draft auto-save
localStorage.setItem('storypoint_draft', JSON.stringify({
  currentStep: 3,
  formData: { ... },
  lastSaved: "ISO timestamp"
}));
```

## Wizard Steps - Detailed Specifications

### Step 1: Project Information

**Purpose:** Capture basic project context

**Fields:**
1. **Project/Task Name**
   - Type: Text input
   - Required: Yes
   - Validation: Min 3 characters
   - Placeholder: "e.g., Create onboarding journey map"

2. **Stage**
   - Type: Radio buttons (single select)
   - Options: Discovery | Define | Design
   - Required: Yes
   - Visual: Cards or large radio buttons with icons

3. **Duration (Weeks)**
   - Type: Number input
   - Required: No
   - Validation: If provided, must be > 0
   - Placeholder: "e.g., 2"
   - Help text: "How many weeks allocated? (optional)"

4. **Description**
   - Type: Textarea
   - Required: No
   - Placeholder: "Add any additional context..."
   - Max length: 500 characters

**Navigation:**
- Next button enabled only when required fields valid

---

### Step 2: Activities & Artifacts

**Purpose:** Select specific work items based on stage

**Layout:**
- 3-column checkbox grid on desktop (>1024px)
- 2-column on tablet (768-1024px)
- 1-column on mobile (<768px)
- Checkboxes with clear labels

**Activity Lists by Stage:**

**Discovery Activities:**
- Research planning
- Competitive analysis
- Stakeholder interviews
- User interviews (3-5)
- User interviews (6-10)
- Surveys
- Usability studies
- Diary study
- Journey map creation
- Service blueprint creation
- Persona creation/update
- Opportunity mapping
- Research synthesis & readout

**Define Activities:**
- Problem statement writing
- How Might We questions
- Opportunity mapping
- Assumption/risk mapping
- Prioritization workshop
- Story map creation
- MVP definition
- Experience principles definition
- Success metrics definition
- Design brief creation

**Design Activities:**
- User flow creation
- Wireframing (low-fidelity)
- Wireframing (high-fidelity)
- Information architecture
- UI mockups (existing patterns)
- UI mockups (new patterns)
- Clickable prototype
- Multi-platform design (responsive)
- Accessibility review
- Content design
- Design system work
- Design handoff/specs

**Validation:**
- At least 1 activity must be selected
- No maximum limit

**Navigation:**
- Next enabled when validation passes

---

### Step 3: Complexity Assessment

**Purpose:** Assess work complexity across key dimensions

**Complexity Dimensions:**

1. **Problem/Solution Ambiguity**
   - Question: "How well-defined is the problem or solution?"
   - Low: Problem is well understood
   - Medium: Some unknowns remain
   - High: Significant uncertainty or poorly understood

2. **Artifact/Deliverable Complexity**
   - Question: "How complex are the artifacts or deliverables?"
   - Low: Simple update or single artifact
   - Medium: Multiple artifacts or synthesis required
   - High: Cross-journey, system-level, or highly detailed artifacts

3. **Stakeholder/Dependency Risk**
   - Question: "How complex is stakeholder alignment and dependencies?"
   - Low: Single decision-maker, clear ownership
   - Medium: Multiple reviewers or teams
   - High: Many stakeholders, org dependencies, or unclear ownership

4. **Iteration Likelihood** (Optional for MVP)
   - Question: "How likely is significant iteration?"
   - Low: Clear requirements, low revision risk
   - Medium: Moderate iteration expected
   - High: Multiple rounds likely, evolving requirements

**UI Pattern:**
- Each dimension shows as a card/section
- Low | Medium | High button group (radio-style)
- Selected state clearly indicated
- Helper text below buttons explains each level

**Validation:**
- First 3 dimensions required
- 4th dimension optional

**Navigation:**
- Next enabled when required dimensions selected

---

### Step 4: Review & Adjust

**Purpose:** Show calculated points and allow override

**Display Sections:**

1. **Project Summary**
   - Name, stage, weeks (if provided)
   - Description (if provided)
   - Edit button → returns to Step 1

2. **Selected Activities**
   - Bulleted list
   - Count: "5 activities selected"
   - Edit button → returns to Step 2

3. **Complexity Assessment**
   - Table or card showing each dimension and selected level
   - Edit button → returns to Step 3

4. **Calculated Story Points**
   - Large, prominent display: "5 Points"
   - Calculation explanation (see Calculation Logic section)
   - Shows mapping: complexity scores → final points

5. **Override Option**
   - Checkbox: "Manually adjust story points"
   - When checked, shows point selector (1/2/3/5/8/13)
   - Optional reason textarea: "Why are you adjusting?"
   - Warning if 13 selected: "Consider breaking this into smaller items"

**Navigation:**
- Back returns to Step 3
- Next proceeds to Report (Step 5)

---

### Step 5: Report

**Purpose:** Display final report and provide actions

**Report Sections:**

1. **Header**
   - Story Points: [Large number display]
   - If overridden: "Calculated: X → Adjusted to: Y"

2. **Project Details**
   - Name
   - Stage (with badge/icon)
   - Duration: X weeks
   - Description

3. **Activities**
   - Bulleted list of selected activities

4. **Complexity Assessment**
   - Problem/Solution Ambiguity: [Level]
   - Artifact Complexity: [Level]
   - Stakeholder Risk: [Level]
   - Iteration Likelihood: [Level] (if provided)

5. **Calculation Breakdown**
   - Narrative explanation of how points were derived
   - Example: "Based on your inputs, this work scores as 5 points. The medium ambiguity and artifact complexity suggest meaningful research effort, while low stakeholder risk keeps it manageable. The selected activities (user interviews, journey map, persona) align with this moderate scope."

**Actions:**
- **Copy to Clipboard** - Formats report as markdown, copies, shows success toast
- **Save to History** - Persists estimation, navigates to history page
- **Start New Estimation** - Clears wizard, returns to Step 1

**Navigation:**
- Back returns to Step 4
- No Next button (terminal step)

## Calculation Logic

### Scoring Algorithm

**Step 1: Score each complexity dimension**
```
Low = 1 point
Medium = 2 points
High = 3 points
```

**Step 2: Sum dimension scores**
```
Total Score = ambiguity + artifactComplexity + stakeholderRisk + iterationLikelihood
```
(If iteration likelihood not provided, omit from sum)

**Step 3: Map to Fibonacci scale**
```
Total 3-4   → 1 story point
Total 5-6   → 2 story points
Total 7-8   → 3 story points
Total 9-10  → 5 story points
Total 11-12 → 8 story points
Total 13+   → 13 story points
```

**Step 4: Generate explanation text**
- Summarize complexity levels
- Reference selected activities as supporting evidence
- Note any mismatches (e.g., many activities but low complexity)
- Include duration for context
- If 13 points, add recommendation to split work

### Calculation Breakdown Template

```
Story Points: {finalPoints}

Based on your inputs:
- Problem/Solution Ambiguity: {level} ({description})
- Artifact/Deliverable Complexity: {level} ({description})
- Stakeholder/Dependency Risk: {level} ({description})
{if iterationLikelihood provided:}
- Iteration Likelihood: {level} ({description})

Selected Activities: {comma-separated list}

{narrative explanation based on scores}

{if weeks provided:}
Estimated Duration: {weeks} weeks

{if isOverridden:}
Note: Points manually adjusted from {calculatedPoints} to {finalPoints}.
Reason: {overrideReason}

{if finalPoints === 13:}
⚠️ Recommendation: This work may be too large. Consider breaking into smaller Discovery, Define, or Design items.
```

### Activities Context

Activities inform but don't rigidly calculate points. They:
- Validate complexity assessment (many activities + low complexity = potential mismatch)
- Provide context in explanation ("journey map and personas support medium artifact complexity")
- Help users think through scope when selecting complexity levels

## History Features

### History List Page

**Layout:**
- Grid of estimation cards (2-3 columns on desktop, 1 on mobile)
- Each card shows:
  - Project name (truncated at 50 chars)
  - Stage badge (color-coded)
  - Story points (large, prominent)
  - Date (relative: "2 days ago")
  - Quick stats: "5 activities · 2 weeks"
  - Actions: View | Clone | Delete

**Filters:**
- Stage filter: All | Discovery | Define | Design
- Points filter: All | 1-3 | 5 | 8 | 13
- Search: Filter by project name (case-insensitive)
- Sort: Date (newest/oldest) | Points (high/low)

**Empty State:**
- Message: "No estimations yet"
- CTA button: "Create your first estimation"
- Icon/illustration

**Actions:**
- **View**: Navigate to detail page
- **Clone**: Load estimation into wizard (new ID, current timestamp)
- **Delete**: Confirm modal → remove from history

### History Detail Page

**Layout:**
- Full report display (same as Step 5 Report)
- Breadcrumb: History > {Project Name}
- Actions at top:
  - Copy to Clipboard
  - Clone to New Estimation
  - Delete
  - Back to History

**Delete Confirmation:**
- Modal: "Delete this estimation?"
- Body: Shows project name and date
- Actions: Cancel | Delete (red/destructive)

### Storage Limits

- Maximum 100 estimations in history
- If limit reached, oldest estimation auto-deleted when new one saved
- Show warning when approaching limit (at 95+)

### Draft Recovery

**Auto-save behavior:**
- Save wizard state to localStorage after each step completion
- Save includes: current step, all form data, timestamp

**Recovery prompt:**
- On app load, check for draft
- If draft exists and is less than 7 days old:
  - Show modal: "You have an unsaved estimation from {date}. Resume or start fresh?"
  - Actions: Resume (load draft) | Start Fresh (clear draft)
- If draft older than 7 days, auto-clear

## Validation & Error Handling

### Field Validation

**Step 1:**
- Project name: Required, min 3 chars
- Stage: Required
- Weeks: Optional, but if provided must be positive number
- Description: Optional

**Step 2:**
- At least 1 activity selected
- Show count: "X activities selected"

**Step 3:**
- First 3 dimensions required
- 4th dimension optional
- Show completion indicator: "3 of 3 required dimensions assessed"

**Step 4:**
- If override checkbox checked, point value required
- Reason field optional

### Error States

**Inline validation:**
- Show error message below field when invalid
- Red border on invalid fields
- Error message in red text, clear and actionable

**Navigation blocking:**
- Next button disabled when step invalid
- Tooltip on disabled Next button explains what's needed
- Example: "Please enter a project name to continue"

**Form submission:**
- If user tries to navigate forward with invalid step, show error summary at top

### User Feedback

**Success states:**
- Copy to clipboard: Toast notification "Copied to clipboard!"
- Save to history: Toast "Estimation saved" → navigate to history
- Delete estimation: Toast "Estimation deleted"

**Loading states:**
- Save operation: Button shows spinner "Saving..."
- History load: Skeleton cards while loading

## UI/UX Specifications

### Responsive Breakpoints

```css
Mobile:   < 768px
Tablet:   768px - 1023px
Desktop:  ≥ 1024px
```

### Layout Patterns

**Wizard Container:**
- Max width: 900px on desktop
- Centered with padding
- Stepper at top (sticky)
- Content area
- Navigation at bottom (sticky)

**Activity Grid:**
- Desktop: 3 columns, gap 1rem
- Tablet: 2 columns, gap 1rem
- Mobile: 1 column, gap 0.75rem

**History Grid:**
- Desktop: 3 cards per row
- Tablet: 2 cards per row
- Mobile: 1 card per row

### Color Coding

**Stage Badges:**
- Discovery: Blue (#3B82F6)
- Define: Purple (#8B5CF6)
- Design: Green (#10B981)

**Story Points Display:**
- 1-3: Green (low complexity)
- 5: Yellow/Orange (medium complexity)
- 8: Orange (high complexity)
- 13: Red (needs splitting)

### Typography

- Headings: Bold, clear hierarchy
- Body: 16px base, 1.5 line-height for readability
- Code/numbers: Monospace for story points display

### Interactive Elements

**Buttons:**
- Primary: Solid background, high contrast
- Secondary: Outlined
- Destructive: Red for delete actions

**Checkboxes:**
- Large touch targets (min 44x44px)
- Clear checked state
- Hover effects on desktop

**Radio/Button Groups:**
- Segment control style for Low/Medium/High
- Clear selected state
- Keyboard accessible

### Navigation

**Header:**
- App logo/name
- Navigation links: New Estimation | History
- Active state indication

**Wizard Navigation:**
- Back: Secondary button, always visible except Step 1
- Next: Primary button
- Submit/Save: Primary button, Step 5 only

**Stepper:**
- Shows all 5 steps
- Current step highlighted
- Completed steps show checkmark
- Future steps grayed out
- Clickable only for visited steps

## Accessibility

- Semantic HTML (form elements, buttons, headings)
- ARIA labels for icon buttons
- Keyboard navigation (Tab, Enter, Space)
- Focus indicators on all interactive elements
- Form validation announced to screen readers
- Color not sole indicator (use icons + text)
- Alt text for any images/icons

## Performance Considerations

- Lazy load history detail pages
- Debounce search/filter inputs (300ms)
- Optimize re-renders with React.memo for expensive components
- Use keys properly in lists
- LocalStorage size monitoring (warn if approaching limits)

## Testing Strategy (Future)

**Unit Tests:**
- `calculations.js` - all scoring logic
- `storage.js` - localStorage helpers
- Form validation functions

**Component Tests:**
- Each wizard step renders correctly
- Validation works as expected
- Navigation enabled/disabled appropriately

**Integration Tests:**
- Complete wizard flow
- Save to history
- Load from history
- Clone estimation

**E2E Tests (Future):**
- Full user journey
- Edge cases (override, 13 points, etc.)

## Out of Scope for MVP

The following features are explicitly deferred:

1. **Team/Multi-user features**
   - Shared estimations
   - Team velocity tracking
   - Collaborative estimation

2. **Advanced Analytics**
   - Velocity charts
   - Trends over time
   - Accuracy tracking

3. **Integrations**
   - Export to Jira/Linear/etc
   - Import from project tools
   - Calendar integration

4. **Batch Operations**
   - Estimate multiple items at once
   - Bulk edit/delete
   - Templates

5. **Account/Sync**
   - User accounts
   - Cloud sync
   - Cross-device access

6. **Advanced Calculation**
   - Custom point scales
   - Weighted dimensions
   - Machine learning suggestions

## Success Metrics (Post-Launch)

- Number of estimations created per week
- Completion rate (Step 1 → Step 5)
- Override rate (how often users adjust calculated points)
- History usage (views, clones)
- Average session duration

## Future Enhancements

1. **Export/Import** - JSON backup/restore
2. **Templates** - Save common estimation patterns
3. **Comparison View** - Compare current estimation to similar past work
4. **Notes/Comments** - Add post-estimation notes
5. **Tags** - Categorize estimations by project, team, initiative
6. **Sharing** - Generate shareable links to reports
7. **Print View** - Formatted for printing
8. **Dark Mode** - Theme toggle

## Open Questions

None - all decisions made during brainstorming phase.

## Appendix: Reference Data

### Activities by Stage (from reference doc)

Stored in `src/utils/constants.js`:

```javascript
export const ACTIVITIES = {
  Discovery: [
    'Research planning',
    'Competitive analysis',
    'Stakeholder interviews',
    'User interviews (3-5)',
    'User interviews (6-10)',
    'Surveys',
    'Usability studies',
    'Diary study',
    'Journey map creation',
    'Service blueprint creation',
    'Persona creation/update',
    'Opportunity mapping',
    'Research synthesis & readout'
  ],
  Define: [
    'Problem statement writing',
    'How Might We questions',
    'Opportunity mapping',
    'Assumption/risk mapping',
    'Prioritization workshop',
    'Story map creation',
    'MVP definition',
    'Experience principles definition',
    'Success metrics definition',
    'Design brief creation'
  ],
  Design: [
    'User flow creation',
    'Wireframing (low-fidelity)',
    'Wireframing (high-fidelity)',
    'Information architecture',
    'UI mockups (existing patterns)',
    'UI mockups (new patterns)',
    'Clickable prototype',
    'Multi-platform design (responsive)',
    'Accessibility review',
    'Content design',
    'Design system work',
    'Design handoff/specs'
  ]
};

export const COMPLEXITY_LEVELS = {
  Low: {
    value: 1,
    label: 'Low',
    ambiguity: 'Problem/solution is well understood',
    artifactComplexity: 'Simple update or single artifact',
    stakeholderRisk: 'Single decision-maker, clear ownership',
    iterationLikelihood: 'Clear requirements, low revision risk'
  },
  Medium: {
    value: 2,
    label: 'Medium',
    ambiguity: 'Some unknowns remain',
    artifactComplexity: 'Multiple artifacts or synthesis required',
    stakeholderRisk: 'Multiple reviewers or teams',
    iterationLikelihood: 'Moderate iteration expected'
  },
  High: {
    value: 3,
    label: 'High',
    ambiguity: 'Significant uncertainty or poorly understood',
    artifactComplexity: 'Cross-journey, system-level, or highly detailed',
    stakeholderRisk: 'Many stakeholders, org dependencies',
    iterationLikelihood: 'Multiple rounds likely, evolving requirements'
  }
};

export const STORY_POINT_SCALE = [1, 2, 3, 5, 8, 13];
```

## Conclusion

This design provides a clear, opinionated path for building the Story Points Calculator MVP. The wizard-based approach ensures systematic estimation while the calculation logic translates the comprehensive reference material into actionable scoring. History features support learning and calibration over time.

The architecture is intentionally simple - single-page React app with localStorage - to enable rapid development while maintaining quality. Future enhancements can build on this foundation without requiring significant refactoring.
