# Kroger Design System Token Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Kroger design system tokens into Story Points Calculator for brand alignment.

**Architecture:** Lightweight token mapping approach - install mx-web-components for design tokens, map tokens to Tailwind theme, update component color classes to use Kroger brand colors, add Kroger branding (logo, fonts).

**Tech Stack:** React 18, Vite, Tailwind CSS v3, mx-web-components v5.1.0 (tokens only), Google Fonts (DM Sans, Nunito)

## Global Constraints

- Do not modify Capacity Planning app
- Keep existing component structure (no shadcn migration)
- Keep Tailwind v3 (no upgrade to v4)
- Maintain all existing functionality
- No breaking changes
- Use mx-web-components v5.1.0 for design tokens only (no UI components)
- Fonts: DM Sans (body), Nunito (headings)
- Kroger logo dimensions: 60px × 33px

---

### Task 1: Install Dependencies and Create Logo Asset

**Files:**
- Modify: `package.json:10-13`
- Create: `public/kroger-logo.svg`

**Interfaces:**
- Consumes: None
- Produces: mx-web-components package available, kroger-logo.svg asset

- [ ] **Step 1: Add mx-web-components to package.json**

Add to dependencies section:

```json
"mx-web-components": "^5.1.0"
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: mx-web-components installed successfully, no errors

- [ ] **Step 3: Create Kroger logo SVG**

Create `public/kroger-logo.svg` with simple Kroger branding:

```svg
<svg width="60" height="33" viewBox="0 0 60 33" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="60" height="33" rx="4" fill="#0074C1"/>
  <text x="30" y="20" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">Kroger</text>
</svg>
```

- [ ] **Step 4: Verify logo renders**

Run: `npm run dev`
Open browser and check `http://localhost:5175/kroger-logo.svg` loads
Expected: Blue rectangle with "Kroger" text visible

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json public/kroger-logo.svg
git commit -m "feat: add mx-web-components and Kroger logo asset

Install mx-web-components v5.1.0 for design tokens.
Add Kroger logo SVG for header branding.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Configure Tailwind with Kroger Design Tokens

**Files:**
- Modify: `tailwind.config.js:1-23`

**Interfaces:**
- Consumes: mx-web-components package (from Task 1)
- Produces: Tailwind theme with `primary`, `primary-dark`, `primary-light`, `discovery`, `define`, `design`, `success`, `warning`, `error`, `gray.*` colors mapped to mx-web-components tokens

- [ ] **Step 1: Update Tailwind config with token mappings**

Replace entire `tailwind.config.js` content:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary/Brand colors (Kroger blue)
        primary: 'rgb(var(--brand-lessProminent-rgb))',
        'primary-dark': 'rgb(var(--brand-mostProminent-rgb))',
        'primary-light': 'rgb(var(--brand-mostSubtle-rgb))',

        // Stage colors
        discovery: 'rgb(var(--brand-lessProminent-rgb))',
        define: 'rgb(var(--special-lessProminent-rgb))',
        design: 'rgb(var(--positive-lessProminent-rgb))',

        // Semantic colors
        success: 'rgb(var(--positive-lessProminent-rgb))',
        warning: 'rgb(var(--callout-lessProminent-rgb))',
        error: 'rgb(var(--negative-lessProminent-rgb))',

        // Neutral colors (grays)
        gray: {
          50: 'rgb(var(--neutral-mostSubtle-rgb))',
          100: 'rgb(var(--neutral-moreSubtle-rgb))',
          200: 'rgb(var(--neutral-lessSubtle-rgb))',
          300: 'rgb(var(--neutral-leastSubtle-rgb))',
          400: 'rgb(var(--neutral-leastProminent-rgb))',
          500: 'rgb(var(--neutral-lessProminent-rgb))',
          600: 'rgb(var(--neutral-moreProminent-rgb))',
          700: 'rgb(var(--neutral-mostProminent-rgb))',
          900: 'rgb(var(--system-text-rgb))',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        heading: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Verify build with new config**

Run: `npm run build`
Expected: Build completes successfully with no errors

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.js
git commit -m "feat: map Kroger design tokens to Tailwind theme

Add mx-web-components token mappings for colors and fonts.
Map brand, stage, semantic, and neutral colors.
Configure DM Sans and Nunito font families.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Import Design Tokens and Fonts

**Files:**
- Modify: `src/index.css:1-20`

**Interfaces:**
- Consumes: mx-web-components package (from Task 1), Tailwind config (from Task 2)
- Produces: CSS variables from mx-web-components available, Google Fonts loaded

- [ ] **Step 1: Update index.css with imports and font rules**

Replace entire `src/index.css` content:

```css
@import 'mx-web-components/dist/light.css';
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Nunito:wght@600;700;800&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Nunito', sans-serif;
}
```

- [ ] **Step 2: Verify fonts and tokens load**

Run: `npm run dev`
Open browser DevTools → Elements → Computed styles
Check `:root` has `--brand-lessProminent-rgb` variable defined
Check body font-family is "DM Sans"
Expected: mx-web-components CSS variables present, fonts loaded

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: import Kroger design tokens and fonts

Import mx-web-components light.css for design tokens.
Add Google Fonts for DM Sans and Nunito.
Set font families on body and headings.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Update Layout Header with Kroger Branding

**Files:**
- Modify: `src/components/common/Layout.jsx:1-50`

**Interfaces:**
- Consumes: kroger-logo.svg (from Task 1), Tailwind `primary` color (from Task 2)
- Produces: Header with Kroger logo, primary blue background, white text

- [ ] **Step 1: Update Layout.jsx with Kroger branding**

Replace entire `src/components/common/Layout.jsx` content:

```jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useEstimation } from '../../context/EstimationContext';

const krogerLogo = '/kroger-logo.svg';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetWizard } = useEstimation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/history' && location.pathname.startsWith('/history')) return true;
    return false;
  };

  const handleNewEstimation = () => {
    resetWizard();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={krogerLogo} alt="Kroger" className="h-[33px] w-[60px] object-contain" />
              <h1 className="text-xl font-bold text-white">
                Story Points Calculator
              </h1>
            </div>
            <nav className="flex gap-6">
              <button
                onClick={handleNewEstimation}
                className={`font-medium transition-colors ${
                  isActive('/')
                    ? 'text-white font-bold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                New Estimation
              </button>
              <a
                href="/history"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/history');
                }}
                className={`font-medium transition-colors ${
                  isActive('/history')
                    ? 'text-white font-bold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                History
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verify header renders correctly**

Run: `npm run dev`
Visual check:
- Header background is Kroger blue
- Kroger logo visible on left
- "Story Points Calculator" title in white
- Navigation links in white
- Active link is bold
Expected: All visual elements correct

- [ ] **Step 3: Test navigation functionality**

Click "New Estimation" → should go to step 1 with reset data
Click "History" → should navigate to history page
Expected: Navigation works as before

- [ ] **Step 4: Commit**

```bash
git add src/components/common/Layout.jsx
git commit -m "feat: update header with Kroger branding

Add Kroger logo to header.
Change header background to primary blue.
Update text colors to white.
Update navigation link active/hover states.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Update Wizard Stepper Colors

**Files:**
- Modify: `src/pages/WizardPage.jsx:50-100`

**Interfaces:**
- Consumes: Tailwind `primary` color (from Task 2)
- Produces: Stepper with Kroger primary blue for active/completed states

- [ ] **Step 1: Read current WizardPage.jsx**

Run: `cat src/pages/WizardPage.jsx | grep -A 5 -B 5 "bg-blue"`
Note all instances of blue colors in stepper

- [ ] **Step 2: Update stepper colors to use primary**

In `src/pages/WizardPage.jsx`, find and replace:
- `bg-blue-600` → `bg-primary`
- `text-blue-600` → `text-primary`
- `border-blue-600` → `border-primary`

Updated stepper circle classNames (around line 65):
```jsx
<div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
  currentStep === step.id
    ? 'bg-primary text-white'
    : currentStep > step.id
    ? 'bg-primary text-white'
    : 'bg-gray-200 text-gray-600'
}`}>
```

Updated stepper connector line (around line 75):
```jsx
<div className={`h-0.5 flex-1 ${
  currentStep > step.id ? 'bg-primary' : 'bg-gray-200'
}`} />
```

Updated step label (around line 80):
```jsx
<span className={`text-sm font-medium ${
  currentStep === step.id ? 'text-primary' : 'text-gray-500'
}`}>
```

- [ ] **Step 3: Verify stepper visual appearance**

Run: `npm run dev`
Navigate through wizard steps
Visual check:
- Active step circle is Kroger blue
- Completed step circles are Kroger blue
- Connector lines to completed steps are Kroger blue
- Active step label is Kroger blue
Expected: All blue elements now use Kroger primary blue

- [ ] **Step 4: Test stepper navigation**

Click through all 5 wizard steps
Click "Edit" buttons to go back to previous steps
Expected: Stepper updates correctly, navigation works

- [ ] **Step 5: Commit**

```bash
git add src/pages/WizardPage.jsx
git commit -m "feat: update wizard stepper to use Kroger primary blue

Replace blue-600 colors with primary token.
Update active, completed, and connector states.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 6: Update Wizard Step Components (ProjectInfo, Activities, Complexity)

**Files:**
- Modify: `src/components/wizard/StepProjectInfo.jsx:100-115`
- Modify: `src/components/wizard/StepActivities.jsx:40-60`
- Modify: `src/components/wizard/StepComplexity.jsx:30-50`

**Interfaces:**
- Consumes: Tailwind `primary`, `discovery`, `define`, `design` colors (from Task 2)
- Produces: Stage buttons, checkboxes, radio buttons with Kroger colors

- [ ] **Step 1: Update StepProjectInfo stage buttons**

In `src/components/wizard/StepProjectInfo.jsx`, find the stage button className (around line 107):

Replace:
```jsx
className={`p-4 border-2 rounded-lg transition-all ${
  wizardData.stage === stage
    ? 'border-blue-600 bg-blue-50 text-blue-900'
    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
}`}
```

With:
```jsx
className={`p-4 border-2 rounded-lg transition-all ${
  wizardData.stage === stage
    ? 'border-primary bg-primary/10 text-primary'
    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
}`}
```

- [ ] **Step 2: Update StepActivities checkbox colors**

In `src/components/wizard/StepActivities.jsx`, find checkbox className (around line 50):

Replace:
```jsx
className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
```

With:
```jsx
className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
```

- [ ] **Step 3: Update StepComplexity radio button colors**

In `src/components/wizard/StepComplexity.jsx`, find radio input className (around line 40):

Replace:
```jsx
className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
```

With:
```jsx
className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
```

- [ ] **Step 4: Verify form controls render correctly**

Run: `npm run dev`
Test each step:
- Step 1: Click stage buttons (Discovery, Define, Design) → active state is Kroger blue
- Step 2: Check/uncheck activities → checkboxes use Kroger blue
- Step 3: Select complexity options → radio buttons use Kroger blue
Expected: All interactive elements use Kroger primary blue

- [ ] **Step 5: Test form functionality**

Complete full wizard flow:
- Fill out all fields in Step 1
- Select activities in Step 2
- Answer complexity questions in Step 3
- Review in Step 4
- View report in Step 5
Expected: All form functionality works, data persists

- [ ] **Step 6: Commit**

```bash
git add src/components/wizard/StepProjectInfo.jsx src/components/wizard/StepActivities.jsx src/components/wizard/StepComplexity.jsx
git commit -m "feat: update wizard form controls to use Kroger colors

Update stage buttons to use primary color.
Update checkboxes and radio buttons to use primary.
Replace blue-600 with primary token throughout.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 7: Update Wizard Review and Report Components

**Files:**
- Modify: `src/components/wizard/StepReview.jsx:58-120`
- Modify: `src/components/wizard/StepReport.jsx:45-90`

**Interfaces:**
- Consumes: Tailwind `primary`, `discovery`, `define`, `design` colors (from Task 2)
- Produces: Review/report with Kroger colors for links, buttons, and stage badges

- [ ] **Step 1: Update StepReview edit links and stage badges**

In `src/components/wizard/StepReview.jsx`:

Find edit button className (around line 58):
Replace:
```jsx
className="text-sm text-blue-600 hover:text-blue-800"
```
With:
```jsx
className="text-sm text-primary hover:text-primary-dark"
```

Find stage badge className (around line 45):
Replace:
```jsx
<span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
  {wizardData.stage}
</span>
```
With:
```jsx
<span className={`px-2 py-1 text-white rounded ${
  wizardData.stage === 'Discovery' ? 'bg-discovery' :
  wizardData.stage === 'Define' ? 'bg-define' :
  'bg-design'
}`}>
  {wizardData.stage}
</span>
```

- [ ] **Step 2: Update StepReport buttons and stage badges**

In `src/components/wizard/StepReport.jsx`:

Find primary button className (around line 183):
Replace:
```jsx
className="flex-1 btn-primary"
```
Ensure btn-primary uses `bg-primary`:
```jsx
className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium"
```

Find stage badge className (around line 78):
Replace:
```jsx
<span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
  {wizardData.stage}
</span>
```
With:
```jsx
<span className={`px-2 py-1 text-white rounded text-xs font-medium ${
  wizardData.stage === 'Discovery' ? 'bg-discovery' :
  wizardData.stage === 'Define' ? 'bg-define' :
  'bg-design'
}`}>
  {wizardData.stage}
</span>
```

Find "Start New Estimation" link (around line 193):
Replace:
```jsx
className="text-blue-600 hover:text-blue-800 text-sm font-medium"
```
With:
```jsx
className="text-primary hover:text-primary-dark text-sm font-medium"
```

- [ ] **Step 3: Verify review and report pages**

Run: `npm run dev`
Complete wizard to Step 4 (Review):
- Edit links are Kroger blue
- Stage badge shows correct color (Discovery=blue, Define=purple, Design=green)
Continue to Step 5 (Report):
- "Save to History" button is Kroger blue
- Stage badge shows correct color
- "Start New Estimation" link is Kroger blue
Expected: All colors use Kroger tokens

- [ ] **Step 4: Test button functionality**

On Report page:
- Click "Copy to Clipboard" → shows "Copied!" feedback
- Click "Save to History" → navigates to history, estimation saved
- Click "Start New Estimation" → resets wizard, goes to Step 1
Expected: All buttons work correctly

- [ ] **Step 5: Commit**

```bash
git add src/components/wizard/StepReview.jsx src/components/wizard/StepReport.jsx
git commit -m "feat: update review and report to use Kroger colors

Update edit links to primary color.
Update stage badges to use discovery/define/design colors.
Update buttons and links to primary.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 8: Update History Components

**Files:**
- Modify: `src/components/history/HistoryList.jsx:40-60`
- Modify: `src/components/history/HistoryDetail.jsx:48-130`

**Interfaces:**
- Consumes: Tailwind `primary`, `discovery`, `define`, `design` colors (from Task 2)
- Produces: History pages with Kroger colors for links and badges

- [ ] **Step 1: Update HistoryList link colors**

In `src/components/history/HistoryList.jsx`:

Find "View Details" link className (around line 55):
Replace:
```jsx
className="text-blue-600 hover:text-blue-800 text-sm font-medium"
```
With:
```jsx
className="text-primary hover:text-primary-dark text-sm font-medium"
```

- [ ] **Step 2: Update HistoryDetail breadcrumb and links**

In `src/components/history/HistoryDetail.jsx`:

Find breadcrumb link (around line 48):
Replace:
```jsx
className="text-blue-600 hover:text-blue-800"
```
With:
```jsx
className="text-primary hover:text-primary-dark"
```

Find stage badge className (around line 123):
Replace:
```jsx
<span className={`px-2 py-1 text-xs font-medium rounded ${
  estimation.stage === 'Discovery' ? 'bg-discovery text-white' :
  estimation.stage === 'Define' ? 'bg-define text-white' :
  'bg-design text-white'
}`}>
  {estimation.stage}
</span>
```

Ensure this exact code is present (likely already correct from previous work).

- [ ] **Step 3: Verify history list page**

Run: `npm run dev`
Navigate to History page:
- "View Details" links are Kroger blue
- Links change to darker blue on hover
Expected: All links use Kroger primary blue

- [ ] **Step 4: Verify history detail page**

Click on an estimation to view details:
- Breadcrumb "History" link is Kroger blue
- Stage badge shows correct color
- "Back to History" link (if visible) is Kroger blue
- "Clone" and action buttons use appropriate colors
Expected: All interactive elements use Kroger colors

- [ ] **Step 5: Test history functionality**

From history list:
- Click "View Details" → shows estimation detail
From history detail:
- Click breadcrumb "History" → returns to list
- Click "Clone" → loads estimation into wizard
- Click "Delete" → removes estimation (with confirmation)
Expected: All history features work correctly

- [ ] **Step 6: Commit**

```bash
git add src/components/history/HistoryList.jsx src/components/history/HistoryDetail.jsx
git commit -m "feat: update history components to use Kroger colors

Update links to use primary color.
Ensure stage badges use semantic colors.
Apply Kroger blue to all interactive elements.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 9: Visual Verification and Final Testing

**Files:**
- Test: All pages and components

**Interfaces:**
- Consumes: All previous tasks
- Produces: Verified, fully functional app with Kroger branding

- [ ] **Step 1: Build production bundle**

Run: `npm run build`
Expected: Build completes successfully with no errors or warnings

- [ ] **Step 2: Visual regression test - Full wizard flow**

Run: `npm run dev`

Test complete wizard flow:
1. Start at home → Kroger logo visible, header is blue
2. Fill Step 1 (Project Info) → stage buttons use Kroger blue when selected
3. Select activities in Step 2 → checkboxes use Kroger blue
4. Answer complexity in Step 3 → radio buttons use Kroger blue
5. Review in Step 4 → edit links and stage badge use Kroger colors
6. View report in Step 5 → buttons and stage badge use Kroger colors

Expected: All pages use Kroger colors consistently

- [ ] **Step 3: Visual regression test - History flow**

From report page:
1. Click "Save to History" → navigates to history
2. Verify list shows saved estimation with correct colors
3. Click "View Details" → detail page uses Kroger colors
4. Click breadcrumb to return
5. Click "Clone" on an estimation → loads into wizard with data

Expected: History flow works correctly with Kroger colors

- [ ] **Step 4: Font verification**

In browser DevTools → Elements:
- Inspect body element → font-family should be "DM Sans"
- Inspect any h1/h2/h3 → font-family should be "Nunito"

Expected: Fonts load correctly from Google Fonts

- [ ] **Step 5: Cross-browser smoke test**

Test in at least 2 browsers (Chrome, Firefox, or Safari):
- App loads without errors
- Kroger logo displays
- Colors render correctly
- Fonts load properly
- All navigation works

Expected: Consistent appearance across browsers

- [ ] **Step 6: Accessibility check**

Use browser DevTools → Lighthouse:
Run accessibility audit
Expected: No new accessibility issues introduced

- [ ] **Step 7: Final commit (if any fixes needed)**

If any issues found and fixed in previous steps:
```bash
git add <files>
git commit -m "fix: address visual verification issues

<describe what was fixed>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

Otherwise, no commit needed - testing complete.

---

## Testing Checklist

**Functional Tests:**
- [ ] Complete wizard flow (all 5 steps)
- [ ] Save estimation to history
- [ ] View estimation detail
- [ ] Clone estimation from history
- [ ] Delete estimation from history
- [ ] "New Estimation" button resets wizard
- [ ] Draft recovery (if applicable)
- [ ] Form validation still works
- [ ] All buttons and links functional

**Visual Tests:**
- [ ] Kroger logo displays in header
- [ ] Header background is Kroger blue
- [ ] All text in header is white
- [ ] Active navigation link is bold
- [ ] Stage buttons use correct colors (Discovery=blue, Define=purple, Design=green)
- [ ] Wizard stepper uses Kroger blue for active/completed states
- [ ] Primary buttons use Kroger blue
- [ ] Links use Kroger blue with darker hover state
- [ ] Story point indicators still use semantic colors (green/yellow/orange/red)
- [ ] T-shirt size badges still purple
- [ ] Fonts: body=DM Sans, headings=Nunito

**Technical Tests:**
- [ ] Build completes without errors
- [ ] No console errors in browser
- [ ] CSS variables from mx-web-components load
- [ ] Google Fonts load successfully
- [ ] No broken images (Kroger logo)

## Success Criteria

1. ✅ mx-web-components installed and design tokens imported
2. ✅ Tailwind config maps Kroger tokens to theme colors
3. ✅ Kroger logo displays in header
4. ✅ Header uses Kroger brand blue background
5. ✅ All components use Kroger design tokens for colors
6. ✅ DM Sans font used for body text
7. ✅ Nunito font used for headings
8. ✅ All existing functionality works without regression
9. ✅ Build completes successfully
10. ✅ Visual consistency with Kroger brand standards
