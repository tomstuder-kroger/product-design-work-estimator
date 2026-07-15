# Story Points Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React wizard app that guides product designers through story point estimation with calculation logic, history tracking, and detailed reporting.

**Architecture:** Single-page React app using Vite, React Router, Tailwind CSS, and Context API. Five-step wizard for estimation, localStorage for persistence, calculation engine based on complexity dimensions.

**Tech Stack:** React 18, Vite, React Router v6, Tailwind CSS, Context API, localStorage

## Global Constraints

- React version: 18.x
- Node version: >=18.x
- Use functional components with hooks (no class components)
- All form inputs must have proper validation
- Accessibility: semantic HTML, ARIA labels, keyboard navigation
- Mobile-first responsive design (breakpoints: 768px, 1024px)
- Stage badge colors: Discovery=#3B82F6, Define=#8B5CF6, Design=#10B981
- Story point scale: 1, 2, 3, 5, 8, 13 (Fibonacci)
- Max history items: 100
- Draft auto-save on every step completion
- All text must be clear and concise (no jargon without explanation)

---

## Task 1: Project Setup & Configuration

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/index.css`
- Create: `.gitignore`

**Interfaces:**
- Consumes: None (initial setup)
- Produces: Running Vite dev server on http://localhost:5173, project structure ready

---

- [ ] **Step 1: Initialize Vite React project**

```bash
cd /Users/ts73344/Desktop/claudeTest/story_points
npm create vite@latest . -- --template react
```

Expected: Vite scaffolds React project in current directory

- [ ] **Step 2: Install dependencies**

```bash
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Expected: Dependencies installed, tailwind.config.js and postcss.config.js created

- [ ] **Step 3: Configure Tailwind CSS**

Edit `tailwind.config.js`:

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
        'discovery': '#3B82F6',
        'define': '#8B5CF6',
        'design': '#10B981',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Set up Tailwind in CSS**

Edit `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply text-gray-900 bg-gray-50;
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium;
  }

  .btn-secondary {
    @apply px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium;
  }

  .btn-destructive {
    @apply px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium;
  }
}
```

- [ ] **Step 5: Create project directory structure**

```bash
mkdir -p src/components/wizard
mkdir -p src/components/history
mkdir -p src/components/common
mkdir -p src/context
mkdir -p src/utils
mkdir -p src/pages
```

Expected: Directory structure created

- [ ] **Step 6: Create basic App.jsx**

Create `src/App.jsx`:

```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Story Points Calculator</h1>
              <nav className="flex gap-4">
                <Link to="/" className="text-blue-600 hover:text-blue-800">New Estimation</Link>
                <Link to="/history" className="text-blue-600 hover:text-blue-800">History</Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<div>Wizard will go here</div>} />
            <Route path="/history" element={<div>History will go here</div>} />
            <Route path="/history/:id" element={<div>History detail will go here</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 7: Update .gitignore**

Edit `.gitignore`:

```
# Logs
logs
*.log
npm-debug.log*

# Dependencies
node_modules/

# Build
dist
dist-ssr
*.local

# Editor
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
```

- [ ] **Step 8: Test dev server**

Run: `npm run dev`

Expected: Server starts at http://localhost:5173, shows "Story Points Calculator" header

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: initialize Vite React project with Tailwind and routing

Set up project structure, install dependencies, configure Tailwind CSS.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Constants & Utility Functions

**Files:**
- Create: `src/utils/constants.js`
- Create: `src/utils/calculations.js`
- Create: `src/utils/storage.js`

**Interfaces:**
- Consumes: None
- Produces:
  - `ACTIVITIES` object with Discovery/Define/Design arrays
  - `COMPLEXITY_LEVELS` object with Low/Medium/High descriptors
  - `STORY_POINT_SCALE` array [1,2,3,5,8,13]
  - `STAGE_COLORS` object
  - `calculateStoryPoints(complexity): number`
  - `generateBreakdown(estimation): string`
  - `saveHistory(history): void`
  - `loadHistory(): array`
  - `saveDraft(wizardData, step): void`
  - `loadDraft(): object|null`
  - `clearDraft(): void`

---

- [ ] **Step 1: Create constants.js**

Create `src/utils/constants.js`:

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

export const STAGE_COLORS = {
  Discovery: '#3B82F6',
  Define: '#8B5CF6',
  Design: '#10B981'
};

export const STAGE_OPTIONS = ['Discovery', 'Define', 'Design'];

export const COMPLEXITY_DIMENSIONS = [
  {
    key: 'ambiguity',
    label: 'Problem/Solution Ambiguity',
    question: 'How well-defined is the problem or solution?',
    required: true
  },
  {
    key: 'artifactComplexity',
    label: 'Artifact/Deliverable Complexity',
    question: 'How complex are the artifacts or deliverables?',
    required: true
  },
  {
    key: 'stakeholderRisk',
    label: 'Stakeholder/Dependency Risk',
    question: 'How complex is stakeholder alignment and dependencies?',
    required: true
  },
  {
    key: 'iterationLikelihood',
    label: 'Iteration Likelihood',
    question: 'How likely is significant iteration?',
    required: false
  }
];
```

- [ ] **Step 2: Create calculations.js**

Create `src/utils/calculations.js`:

```javascript
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
```

- [ ] **Step 3: Create storage.js**

Create `src/utils/storage.js`:

```javascript
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
```

- [ ] **Step 4: Test calculations in browser console**

Run: `npm run dev`

Open browser console and test:

```javascript
import { calculateStoryPoints } from './src/utils/calculations.js';

// Test low complexity
calculateStoryPoints({ ambiguity: 'Low', artifactComplexity: 'Low', stakeholderRisk: 'Low' });
// Expected: 1

// Test medium complexity
calculateStoryPoints({ ambiguity: 'Medium', artifactComplexity: 'Medium', stakeholderRisk: 'Low' });
// Expected: 3

// Test high complexity
calculateStoryPoints({ ambiguity: 'High', artifactComplexity: 'High', stakeholderRisk: 'High', iterationLikelihood: 'High' });
// Expected: 13
```

- [ ] **Step 5: Commit**

```bash
git add src/utils/
git commit -m "feat: add constants and utility functions

Add calculation logic, storage helpers, and reference constants.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Estimation Context

**Files:**
- Create: `src/context/EstimationContext.jsx`

**Interfaces:**
- Consumes:
  - `calculateStoryPoints(complexity)` from calculations.js
  - `generateBreakdown(estimation)` from calculations.js
  - `saveHistory(history), loadHistory()` from storage.js
  - `saveDraft(), loadDraft(), clearDraft()` from storage.js
- Produces:
  - `EstimationProvider` component
  - Context value: `{ wizardData, setWizardData, currentStep, goToStep, history, calculatePoints, saveEstimation, loadEstimation, deleteEstimation, resetWizard }`

---

- [ ] **Step 1: Create EstimationContext.jsx**

Create `src/context/EstimationContext.jsx`:

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { calculateStoryPoints, generateBreakdown } from '../utils/calculations';
import { saveHistory as saveHistoryToStorage, loadHistory, saveDraft, clearDraft } from '../utils/storage';

const EstimationContext = createContext(null);

const initialWizardData = {
  projectName: '',
  stage: '',
  weeks: '',
  description: '',
  activities: [],
  complexity: {
    ambiguity: '',
    artifactComplexity: '',
    stakeholderRisk: '',
    iterationLikelihood: ''
  },
  calculatedPoints: 0,
  finalPoints: 0,
  isOverridden: false,
  overrideReason: ''
};

export function EstimationProvider({ children }) {
  const [wizardData, setWizardData] = useState(initialWizardData);
  const [currentStep, setCurrentStep] = useState(1);
  const [history, setHistory] = useState([]);
  const [visitedSteps, setVisitedSteps] = useState([1]);

  // Load history on mount
  useEffect(() => {
    const loadedHistory = loadHistory();
    setHistory(loadedHistory);
  }, []);

  // Auto-save draft when wizard data changes
  useEffect(() => {
    if (currentStep > 1) {
      saveDraft(wizardData, currentStep);
    }
  }, [wizardData, currentStep]);

  const goToStep = (step) => {
    setCurrentStep(step);
    if (!visitedSteps.includes(step)) {
      setVisitedSteps([...visitedSteps, step]);
    }
  };

  const calculatePoints = () => {
    const points = calculateStoryPoints(wizardData.complexity);
    setWizardData(prev => ({
      ...prev,
      calculatedPoints: points,
      finalPoints: prev.isOverridden ? prev.finalPoints : points
    }));
    return points;
  };

  const saveEstimation = () => {
    const estimation = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...wizardData,
      calculationBreakdown: generateBreakdown(wizardData)
    };

    const newHistory = [estimation, ...history];
    setHistory(newHistory);
    saveHistoryToStorage(newHistory);
    clearDraft();

    return estimation.id;
  };

  const loadEstimation = (id) => {
    const estimation = history.find(e => e.id === id);
    if (!estimation) return;

    // Clone estimation with new ID and timestamp
    setWizardData({
      ...estimation,
      id: undefined, // Will get new ID on save
      timestamp: undefined
    });
    setCurrentStep(1);
    setVisitedSteps([1]);
  };

  const deleteEstimation = (id) => {
    const newHistory = history.filter(e => e.id !== id);
    setHistory(newHistory);
    saveHistoryToStorage(newHistory);
  };

  const resetWizard = () => {
    setWizardData(initialWizardData);
    setCurrentStep(1);
    setVisitedSteps([1]);
    clearDraft();
  };

  const value = {
    wizardData,
    setWizardData,
    currentStep,
    goToStep,
    visitedSteps,
    history,
    calculatePoints,
    saveEstimation,
    loadEstimation,
    deleteEstimation,
    resetWizard
  };

  return (
    <EstimationContext.Provider value={value}>
      {children}
    </EstimationContext.Provider>
  );
}

export function useEstimation() {
  const context = useContext(EstimationContext);
  if (!context) {
    throw new Error('useEstimation must be used within EstimationProvider');
  }
  return context;
}
```

- [ ] **Step 2: Wrap App with EstimationProvider**

Edit `src/main.jsx`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { EstimationProvider } from './context/EstimationContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EstimationProvider>
      <App />
    </EstimationProvider>
  </React.StrictMode>
);
```

- [ ] **Step 3: Test context in browser console**

Run: `npm run dev`

Open React DevTools, check EstimationContext provider is wrapping app

Expected: Context provider visible in component tree

- [ ] **Step 4: Commit**

```bash
git add src/context/ src/main.jsx
git commit -m "feat: add estimation context for state management

Provide wizard state, history management, and all data operations.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Common Components

**Files:**
- Create: `src/components/common/Layout.jsx`
- Create: `src/components/common/ActivityCheckboxGrid.jsx`
- Create: `src/components/common/ComplexitySelector.jsx`

**Interfaces:**
- Consumes: None (presentational components)
- Produces:
  - `<Layout>` component with header/nav
  - `<ActivityCheckboxGrid activities={[]} selected={[]} onChange={fn} columns={3} />`
  - `<ComplexitySelector dimension={obj} value={str} onChange={fn} />`

---

- [ ] **Step 1: Create Layout.jsx**

Create `src/components/common/Layout.jsx`:

```jsx
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/history' && location.pathname.startsWith('/history')) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Story Points Calculator
            </h1>
            <nav className="flex gap-6">
              <Link
                to="/"
                className={`font-medium transition-colors ${
                  isActive('/')
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                New Estimation
              </Link>
              <Link
                to="/history"
                className={`font-medium transition-colors ${
                  isActive('/history')
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                History
              </Link>
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

- [ ] **Step 2: Create ActivityCheckboxGrid.jsx**

Create `src/components/common/ActivityCheckboxGrid.jsx`:

```jsx
export default function ActivityCheckboxGrid({ activities, selected, onChange }) {
  const handleToggle = (activity) => {
    if (selected.includes(activity)) {
      onChange(selected.filter(a => a !== activity));
    } else {
      onChange([...selected, activity]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {activities.map((activity) => (
        <label
          key={activity}
          className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <input
            type="checkbox"
            checked={selected.includes(activity)}
            onChange={() => handleToggle(activity)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-3 text-sm text-gray-900">{activity}</span>
        </label>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create ComplexitySelector.jsx**

Create `src/components/common/ComplexitySelector.jsx`:

```jsx
import { COMPLEXITY_LEVELS } from '../../utils/constants';

export default function ComplexitySelector({ dimension, value, onChange }) {
  const levels = ['Low', 'Medium', 'High'];

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          {dimension.label}
          {dimension.required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{dimension.question}</p>
      </div>

      <div className="flex gap-2">
        {levels.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
              value === level
                ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            <div className="font-medium">{level}</div>
            <div className="text-xs mt-1">
              {COMPLEXITY_LEVELS[level][dimension.key]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update App.jsx to use Layout**

Edit `src/App.jsx`:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<div className="text-center py-12">Wizard will go here</div>} />
          <Route path="/history" element={<div className="text-center py-12">History will go here</div>} />
          <Route path="/history/:id" element={<div className="text-center py-12">History detail will go here</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 5: Test common components**

Run: `npm run dev`

Expected: Header with navigation visible, links change color when active

- [ ] **Step 6: Commit**

```bash
git add src/components/common/ src/App.jsx
git commit -m "feat: add common reusable components

Add Layout, ActivityCheckboxGrid, and ComplexitySelector.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

I'll continue with the remaining tasks in the next response to avoid hitting token limits. The plan structure is established. Should I continue with Tasks 5-13?
## Task 5: Wizard Step 1 - Project Info

**Files:**
- Create: `src/components/wizard/StepProjectInfo.jsx`

**Interfaces:**
- Consumes: `useEstimation()` from context
- Produces: Step 1 component with project name, stage, weeks, description inputs

---

- [ ] **Step 1: Create StepProjectInfo.jsx**

Create `src/components/wizard/StepProjectInfo.jsx`:

```jsx
import { useEstimation } from '../../context/EstimationContext';
import { STAGE_OPTIONS } from '../../utils/constants';

export default function StepProjectInfo() {
  const { wizardData, setWizardData } = useEstimation();

  const updateField = (field, value) => {
    setWizardData(prev => ({ ...prev, [field]: value }));
  };

  const isValid = () => {
    return (
      wizardData.projectName.length >= 3 &&
      wizardData.stage !== '' &&
      (wizardData.weeks === '' || Number(wizardData.weeks) > 0)
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Project Information</h2>
        <p className="text-gray-600 mt-1">Tell us about the work you're estimating</p>
      </div>

      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
          Project/Task Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="projectName"
          value={wizardData.projectName}
          onChange={(e) => updateField('projectName', e.target.value)}
          placeholder="e.g., Create onboarding journey map"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {wizardData.projectName.length > 0 && wizardData.projectName.length < 3 && (
          <p className="text-red-500 text-sm mt-1">Minimum 3 characters required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stage <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {STAGE_OPTIONS.map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => updateField('stage', stage)}
              className={`p-4 border-2 rounded-lg transition-all ${
                wizardData.stage === stage
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="font-medium">{stage}</div>
            </button>
          ))}
        </div>
      </div>

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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">How many weeks allocated?</p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-gray-500 text-sm">(optional)</span>
        </label>
        <textarea
          id="description"
          rows="3"
          maxLength="500"
          value={wizardData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Add any additional context..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          {wizardData.description.length}/500 characters
        </p>
      </div>

      <div className="pt-4">
        <p className="text-sm text-gray-600">
          <span className="text-red-500">*</span> Required fields
        </p>
      </div>
    </div>
  );
}

export { isStepValid as isStep1Valid };

function isStepValid(wizardData) {
  return (
    wizardData.projectName.length >= 3 &&
    wizardData.stage !== '' &&
    (wizardData.weeks === '' || Number(wizardData.weeks) > 0)
  );
}
```

- [ ] **Step 2: Test Step 1 in browser**

Temporarily add to App.jsx to test:

```jsx
import StepProjectInfo from './components/wizard/StepProjectInfo';
// ... in route
<Route path="/" element={<StepProjectInfo />} />
```

Run: `npm run dev`

Expected: Form renders, can type in fields, stage buttons work

- [ ] **Step 3: Commit**

```bash
git add src/components/wizard/StepProjectInfo.jsx
git commit -m "feat: add wizard step 1 - project info

Add project name, stage selection, weeks, and description.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Wizard Step 2 - Activities

**Files:**
- Create: `src/components/wizard/StepActivities.jsx`

**Interfaces:**
- Consumes: `useEstimation()`, `ActivityCheckboxGrid`, `ACTIVITIES`
- Produces: Step 2 component with stage-filtered activity selection

---

- [ ] **Step 1: Create StepActivities.jsx**

Create `src/components/wizard/StepActivities.jsx`:

```jsx
import { useEstimation } from '../../context/EstimationContext';
import ActivityCheckboxGrid from '../common/ActivityCheckboxGrid';
import { ACTIVITIES } from '../../utils/constants';

export default function StepActivities() {
  const { wizardData, setWizardData } = useEstimation();

  const updateActivities = (activities) => {
    setWizardData(prev => ({ ...prev, activities }));
  };

  const stageActivities = ACTIVITIES[wizardData.stage] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Activities & Artifacts</h2>
        <p className="text-gray-600 mt-1">
          Select the activities and artifacts for this {wizardData.stage} work
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {wizardData.activities.length} activit{wizardData.activities.length === 1 ? 'y' : 'ies'} selected
        </p>
      </div>

      <ActivityCheckboxGrid
        activities={stageActivities}
        selected={wizardData.activities}
        onChange={updateActivities}
      />

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

- [ ] **Step 2: Test Step 2 in browser**

Update App.jsx route temporarily:

```jsx
<Route path="/" element={<StepActivities />} />
```

Run: `npm run dev`

Expected: Activities grid renders, can select checkboxes, count updates

- [ ] **Step 3: Commit**

```bash
git add src/components/wizard/StepActivities.jsx
git commit -m "feat: add wizard step 2 - activities selection

Add stage-filtered activity checkbox grid with validation.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Wizard Step 3 - Complexity

**Files:**
- Create: `src/components/wizard/StepComplexity.jsx`

**Interfaces:**
- Consumes: `useEstimation()`, `ComplexitySelector`, `COMPLEXITY_DIMENSIONS`
- Produces: Step 3 component with complexity dimension selectors

---

- [ ] **Step 1: Create StepComplexity.jsx**

Create `src/components/wizard/StepComplexity.jsx`:

```jsx
import { useEstimation } from '../../context/EstimationContext';
import ComplexitySelector from '../common/ComplexitySelector';
import { COMPLEXITY_DIMENSIONS } from '../../utils/constants';

export default function StepComplexity() {
  const { wizardData, setWizardData } = useEstimation();

  const updateComplexity = (key, value) => {
    setWizardData(prev => ({
      ...prev,
      complexity: {
        ...prev.complexity,
        [key]: value
      }
    }));
  };

  const requiredCount = COMPLEXITY_DIMENSIONS.filter(d => d.required).length;
  const completedRequired = COMPLEXITY_DIMENSIONS
    .filter(d => d.required)
    .filter(d => wizardData.complexity[d.key] !== '').length;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Complexity Assessment</h2>
        <p className="text-gray-600 mt-1">
          Rate the complexity across key dimensions
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {completedRequired} of {requiredCount} required dimensions assessed
        </p>
      </div>

      <div className="space-y-6">
        {COMPLEXITY_DIMENSIONS.map((dimension) => (
          <ComplexitySelector
            key={dimension.key}
            dimension={dimension}
            value={wizardData.complexity[dimension.key]}
            onChange={(value) => updateComplexity(dimension.key, value)}
          />
        ))}
      </div>

      {completedRequired < requiredCount && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            Please complete all required complexity dimensions to continue
          </p>
        </div>
      )}
    </div>
  );
}

export { isStepValid as isStep3Valid };

function isStepValid(wizardData) {
  const required = COMPLEXITY_DIMENSIONS.filter(d => d.required);
  return required.every(d => wizardData.complexity[d.key] !== '');
}
```

- [ ] **Step 2: Test Step 3 in browser**

Update App.jsx route temporarily:

```jsx
<Route path="/" element={<StepComplexity />} />
```

Run: `npm run dev`

Expected: Complexity selectors render, can select Low/Medium/High, counter updates

- [ ] **Step 3: Commit**

```bash
git add src/components/wizard/StepComplexity.jsx
git commit -m "feat: add wizard step 3 - complexity assessment

Add complexity dimension selectors with validation.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Wizard Step 4 - Review

**Files:**
- Create: `src/components/wizard/StepReview.jsx`

**Interfaces:**
- Consumes: `useEstimation()`, `STORY_POINT_SCALE`
- Produces: Step 4 component with review, calculated points, override option

---

- [ ] **Step 1: Create StepReview.jsx**

Create `src/components/wizard/StepReview.jsx`:

```jsx
import { useEffect } from 'react';
import { useEstimation } from '../../context/EstimationContext';
import { STORY_POINT_SCALE } from '../../utils/constants';

export default function StepReview() {
  const { wizardData, setWizardData, calculatePoints, goToStep } = useEstimation();

  useEffect(() => {
    calculatePoints();
  }, []);

  const updateOverride = (field, value) => {
    setWizardData(prev => ({ ...prev, [field]: value }));
  };

  const handleOverrideToggle = (checked) => {
    updateOverride('isOverridden', checked);
    if (!checked) {
      updateOverride('finalPoints', wizardData.calculatedPoints);
      updateOverride('overrideReason', '');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review & Adjust</h2>
        <p className="text-gray-600 mt-1">
          Review your inputs and calculated story points
        </p>
      </div>

      {/* Project Summary */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">Project Summary</h3>
            <p className="text-lg mt-2">{wizardData.projectName}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {wizardData.stage}
              </span>
              {wizardData.weeks && <span>{wizardData.weeks} weeks</span>}
            </div>
            {wizardData.description && (
              <p className="text-sm text-gray-600 mt-2">{wizardData.description}</p>
            )}
          </div>
          <button
            onClick={() => goToStep(1)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Activities */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Selected Activities</h3>
            <p className="text-sm text-gray-500 mt-1">
              {wizardData.activities.length} activities selected
            </p>
            <ul className="mt-3 space-y-1">
              {wizardData.activities.map((activity) => (
                <li key={activity} className="text-sm text-gray-700">• {activity}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => goToStep(2)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Complexity */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Complexity Assessment</h3>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Problem/Solution Ambiguity:</span>
                <span className="font-medium">{wizardData.complexity.ambiguity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Artifact/Deliverable Complexity:</span>
                <span className="font-medium">{wizardData.complexity.artifactComplexity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Stakeholder/Dependency Risk:</span>
                <span className="font-medium">{wizardData.complexity.stakeholderRisk}</span>
              </div>
              {wizardData.complexity.iterationLikelihood && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Iteration Likelihood:</span>
                  <span className="font-medium">{wizardData.complexity.iterationLikelihood}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => goToStep(3)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Calculated Points */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">Calculated Story Points</h3>
        <div className="text-6xl font-bold text-blue-600 mb-4">
          {wizardData.calculatedPoints}
        </div>
        <p className="text-sm text-gray-700">
          Based on your complexity assessment, this work is estimated at{' '}
          <strong>{wizardData.calculatedPoints} story points</strong>.
        </p>
      </div>

      {/* Override Option */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={wizardData.isOverridden}
            onChange={(e) => handleOverrideToggle(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div>
            <span className="font-medium text-gray-900">Manually adjust story points</span>
            <p className="text-sm text-gray-600 mt-1">
              Override the calculated value if needed
            </p>
          </div>
        </label>

        {wizardData.isOverridden && (
          <div className="space-y-4 pl-7">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Story Points
              </label>
              <div className="flex gap-2">
                {STORY_POINT_SCALE.map((points) => (
                  <button
                    key={points}
                    onClick={() => updateOverride('finalPoints', points)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      wizardData.finalPoints === points
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {points}
                  </button>
                ))}
              </div>
            </div>

            {wizardData.finalPoints === 13 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  ⚠️ Consider breaking this into smaller items
                </p>
              </div>
            )}

            <div>
              <label htmlFor="overrideReason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for adjustment (optional)
              </label>
              <textarea
                id="overrideReason"
                rows="2"
                value={wizardData.overrideReason}
                onChange={(e) => updateOverride('overrideReason', e.target.value)}
                placeholder="Why are you adjusting the points?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Test Step 4 in browser**

Update App.jsx route temporarily (need to set wizardData first in console):

```jsx
<Route path="/" element={<StepReview />} />
```

Run: `npm run dev`

Expected: Review shows all data, can toggle override, edit buttons work

- [ ] **Step 3: Commit**

```bash
git add src/components/wizard/StepReview.jsx
git commit -m "feat: add wizard step 4 - review and adjust

Add review summary with override option and edit navigation.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Wizard Step 5 - Report

**Files:**
- Create: `src/components/wizard/StepReport.jsx`

**Interfaces:**
- Consumes: `useEstimation()`, `generateBreakdown()`
- Produces: Step 5 component with final report, copy/save actions

---

- [ ] **Step 1: Create StepReport.jsx**

Create `src/components/wizard/StepReport.jsx`:

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEstimation } from '../../context/EstimationContext';
import { generateBreakdown } from '../../utils/calculations';

export default function StepReport() {
  const { wizardData, saveEstimation, resetWizard } = useEstimation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const breakdown = generateBreakdown(wizardData);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(breakdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSave = () => {
    const id = saveEstimation();
    navigate('/history');
  };

  const handleNewEstimation = () => {
    resetWizard();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Estimation Report</h2>
        <p className="text-gray-600 mt-1">
          Your story point estimation is complete
        </p>
      </div>

      {/* Story Points Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-8 text-center">
        <div className="text-7xl font-bold mb-2">
          {wizardData.finalPoints}
        </div>
        <div className="text-xl">Story Points</div>
        {wizardData.isOverridden && wizardData.calculatedPoints !== wizardData.finalPoints && (
          <div className="text-sm mt-2 opacity-90">
            Calculated: {wizardData.calculatedPoints} → Adjusted to: {wizardData.finalPoints}
          </div>
        )}
      </div>

      {/* Report Content */}
      <div className="bg-white border rounded-lg p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
          <dl className="space-y-2">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Name:</dt>
              <dd className="font-medium">{wizardData.projectName}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Stage:</dt>
              <dd>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  {wizardData.stage}
                </span>
              </dd>
            </div>
            {wizardData.weeks && (
              <div className="flex justify-between text-sm">
                <dt className="text-gray-600">Duration:</dt>
                <dd className="font-medium">{wizardData.weeks} weeks</dd>
              </div>
            )}
            {wizardData.description && (
              <div className="text-sm">
                <dt className="text-gray-600 mb-1">Description:</dt>
                <dd className="text-gray-900">{wizardData.description}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-2">Complexity Assessment</h3>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Problem/Solution Ambiguity:</dt>
              <dd className="font-medium">{wizardData.complexity.ambiguity}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Artifact/Deliverable Complexity:</dt>
              <dd className="font-medium">{wizardData.complexity.artifactComplexity}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Stakeholder/Dependency Risk:</dt>
              <dd className="font-medium">{wizardData.complexity.stakeholderRisk}</dd>
            </div>
            {wizardData.complexity.iterationLikelihood && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Iteration Likelihood:</dt>
                <dd className="font-medium">{wizardData.complexity.iterationLikelihood}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-2">Selected Activities</h3>
          <ul className="space-y-1">
            {wizardData.activities.map((activity) => (
              <li key={activity} className="text-sm text-gray-700">• {activity}</li>
            ))}
          </ul>
        </div>

        {wizardData.finalPoints === 13 && (
          <div className="border-t pt-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-900 font-medium">⚠️ Recommendation</p>
              <p className="text-amber-800 text-sm mt-1">
                This work may be too large. Consider breaking into smaller Discovery, Define, or Design items.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 btn-secondary"
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        <button
          onClick={handleSave}
          className="flex-1 btn-primary"
        >
          Save to History
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={handleNewEstimation}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Start New Estimation
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Test Step 5 in browser**

Update App.jsx route temporarily:

```jsx
<Route path="/" element={<StepReport />} />
```

Run: `npm run dev`

Expected: Report displays all data, copy button works, save navigates to history

- [ ] **Step 3: Commit**

```bash
git add src/components/wizard/StepReport.jsx
git commit -m "feat: add wizard step 5 - final report

Add report display with copy and save functionality.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

Continuing in next message...

## Task 10: Wizard Navigation & Stepper

**Files:**
- Create: `src/components/wizard/WizardStepper.jsx`
- Create: `src/components/wizard/WizardNavigation.jsx`
- Create: `src/pages/WizardPage.jsx`

**Interfaces:**
- Consumes: All step components, `useEstimation()`
- Produces: Complete wizard with navigation and progress indicator

---

- [ ] **Step 1: Create WizardStepper.jsx**

Create `src/components/wizard/WizardStepper.jsx`:

```jsx
import { useEstimation } from '../../context/EstimationContext';

const STEPS = [
  { number: 1, label: 'Project Info' },
  { number: 2, label: 'Activities' },
  { number: 3, label: 'Complexity' },
  { number: 4, label: 'Review' },
  { number: 5, label: 'Report' }
];

export default function WizardStepper() {
  const { currentStep, visitedSteps, goToStep } = useEstimation();

  const canNavigateTo = (stepNumber) => {
    return visitedSteps.includes(stepNumber);
  };

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-between max-w-3xl mx-auto">
        {STEPS.map((step, index) => (
          <li key={step.number} className="relative flex-1">
            {/* Connector Line */}
            {index < STEPS.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-0.5 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-hidden="true"
              />
            )}

            {/* Step Button */}
            <button
              onClick={() => canNavigateTo(step.number) && goToStep(step.number)}
              disabled={!canNavigateTo(step.number)}
              className={`relative flex flex-col items-center group ${
                canNavigateTo(step.number) ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
            >
              <span
                className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  currentStep === step.number
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : currentStep > step.number
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 bg-white text-gray-500'
                } ${canNavigateTo(step.number) && currentStep !== step.number ? 'group-hover:border-blue-400' : ''}`}
              >
                {currentStep > step.number ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span>{step.number}</span>
                )}
              </span>
              <span
                className={`mt-2 text-xs font-medium ${
                  currentStep === step.number
                    ? 'text-blue-600'
                    : currentStep > step.number
                    ? 'text-gray-700'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 2: Create WizardNavigation.jsx**

Create `src/components/wizard/WizardNavigation.jsx`:

```jsx
import { useEstimation } from '../../context/EstimationContext';
import {isStep1Valid} from './StepProjectInfo';
import {isStep2Valid} from './StepActivities';
import {isStep3Valid} from './StepComplexity';

export default function WizardNavigation() {
  const { wizardData, currentStep, goToStep } = useEstimation();

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return isStep1Valid(wizardData);
      case 2:
        return isStep2Valid(wizardData);
      case 3:
        return isStep3Valid(wizardData);
      case 4:
        return true;
      case 5:
        return false; // No next on final step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canGoNext()) {
      goToStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const getNextButtonText = () => {
    if (currentStep === 4) return 'View Report';
    return 'Next';
  };

  return (
    <div className="flex justify-between items-center pt-6 border-t">
      <div>
        {currentStep > 1 && (
          <button onClick={handleBack} className="btn-secondary">
            Back
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!canGoNext() && currentStep < 5 && (
          <span className="text-sm text-gray-500">
            Complete required fields to continue
          </span>
        )}
        {currentStep < 5 && (
          <button
            onClick={handleNext}
            disabled={!canGoNext()}
            className={`btn-primary ${!canGoNext() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {getNextButtonText()}
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create WizardPage.jsx**

Create `src/pages/WizardPage.jsx`:

```jsx
import { useEstimation } from '../context/EstimationContext';
import WizardStepper from '../components/wizard/WizardStepper';
import WizardNavigation from '../components/wizard/WizardNavigation';
import StepProjectInfo from '../components/wizard/StepProjectInfo';
import StepActivities from '../components/wizard/StepActivities';
import StepComplexity from '../components/wizard/StepComplexity';
import StepReview from '../components/wizard/StepReview';
import StepReport from '../components/wizard/StepReport';

export default function WizardPage() {
  const { currentStep } = useEstimation();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepProjectInfo />;
      case 2:
        return <StepActivities />;
      case 3:
        return <StepComplexity />;
      case 4:
        return <StepReview />;
      case 5:
        return <StepReport />;
      default:
        return <StepProjectInfo />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <WizardStepper />

      <div className="bg-white rounded-lg shadow-sm border p-8 min-h-[500px]">
        {renderStep()}
      </div>

      {currentStep < 5 && <WizardNavigation />}
    </div>
  );
}
```

- [ ] **Step 4: Update App.jsx to use WizardPage**

Edit `src/App.jsx`:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import WizardPage from './pages/WizardPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<WizardPage />} />
          <Route path="/history" element={<div className="text-center py-12">History will go here</div>} />
          <Route path="/history/:id" element={<div className="text-center py-12">History detail will go here</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 5: Test complete wizard flow**

Run: `npm run dev`

Test sequence:
1. Fill out Step 1, click Next
2. Select activities in Step 2, click Next
3. Select complexity in Step 3, click Next
4. Review in Step 4, click View Report
5. See final report in Step 5
6. Test Back button navigation
7. Test clicking on stepper to jump to visited steps

Expected: Full wizard flow works, navigation enables/disables correctly

- [ ] **Step 6: Commit**

```bash
git add src/components/wizard/WizardStepper.jsx src/components/wizard/WizardNavigation.jsx src/pages/WizardPage.jsx src/App.jsx
git commit -m "feat: add wizard navigation and stepper

Wire up complete wizard flow with progress indicator and navigation.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 11: History List

**Files:**
- Create: `src/components/history/HistoryList.jsx`
- Create: `src/pages/HistoryPage.jsx`

**Interfaces:**
- Consumes: `useEstimation()`, history data
- Produces: History list with filters, search, clone/delete actions

---

- [ ] **Step 1: Create HistoryList.jsx**

Create `src/components/history/HistoryList.jsx`:

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEstimation } from '../../context/EstimationContext';
import { STAGE_OPTIONS } from '../../utils/constants';

export default function HistoryList() {
  const { history, loadEstimation, deleteEstimation } = useEstimation();
  const navigate = useNavigate();

  const [stageFilter, setStageFilter] = useState('All');
  const [pointsFilter, setPointsFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  const filteredHistory = history.filter((est) => {
    // Stage filter
    if (stageFilter !== 'All' && est.stage !== stageFilter) return false;

    // Points filter
    if (pointsFilter !== 'All') {
      if (pointsFilter === '1-3' && (est.finalPoints < 1 || est.finalPoints > 3)) return false;
      if (pointsFilter === '5' && est.finalPoints !== 5) return false;
      if (pointsFilter === '8' && est.finalPoints !== 8) return false;
      if (pointsFilter === '13' && est.finalPoints !== 13) return false;
    }

    // Search filter
    if (searchQuery && !est.projectName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.timestamp) - new Date(a.timestamp);
    if (sortBy === 'date-asc') return new Date(a.timestamp) - new Date(b.timestamp);
    if (sortBy === 'points-high') return b.finalPoints - a.finalPoints;
    if (sortBy === 'points-low') return a.finalPoints - b.finalPoints;
    return 0;
  });

  const handleClone = (id) => {
    loadEstimation(id);
    navigate('/');
  };

  const handleDelete = (id, name) => {
    if (confirm(`Delete estimation "${name}"?`)) {
      deleteEstimation(id);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getPointsColor = (points) => {
    if (points <= 3) return 'text-green-600 bg-green-50';
    if (points === 5) return 'text-yellow-600 bg-yellow-50';
    if (points === 8) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No estimations yet</h2>
        <p className="text-gray-600 mb-6">Create your first story point estimation to get started</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Create First Estimation
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Estimation History</h1>
        <p className="text-gray-600 mt-1">{history.length} total estimations</p>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Stages</option>
              {STAGE_OPTIONS.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
            <select
              value={pointsFilter}
              onChange={(e) => setPointsFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Points</option>
              <option value="1-3">1-3 points</option>
              <option value="5">5 points</option>
              <option value="8">8 points</option>
              <option value="13">13 points</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="points-high">Points (High to Low)</option>
              <option value="points-low">Points (Low to High)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredHistory.length} of {history.length} estimations
        </div>
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHistory.map((estimation) => (
          <div
            key={estimation.id}
            className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                estimation.stage === 'Discovery' ? 'bg-discovery text-white' :
                estimation.stage === 'Define' ? 'bg-define text-white' :
                'bg-design text-white'
              }`}>
                {estimation.stage}
              </span>
              <div className={`text-3xl font-bold ${getPointsColor(estimation.finalPoints)}`}>
                {estimation.finalPoints}
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {estimation.projectName}
            </h3>

            <div className="text-sm text-gray-600 mb-4">
              {estimation.activities.length} activities
              {estimation.weeks && ` · ${estimation.weeks} weeks`}
            </div>

            <div className="text-xs text-gray-500 mb-4">
              {formatDate(estimation.timestamp)}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/history/${estimation.id}`)}
                className="flex-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
              >
                View
              </button>
              <button
                onClick={() => handleClone(estimation.id)}
                className="flex-1 px-3 py-1.5 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
              >
                Clone
              </button>
              <button
                onClick={() => handleDelete(estimation.id, estimation.projectName)}
                className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create HistoryPage.jsx**

Create `src/pages/HistoryPage.jsx`:

```jsx
import HistoryList from '../components/history/HistoryList';

export default function HistoryPage() {
  return <HistoryList />;
}
```

- [ ] **Step 3: Update App.jsx to use HistoryPage**

Edit `src/App.jsx`:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import WizardPage from './pages/WizardPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<WizardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<div className="text-center py-12">History detail will go here</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 4: Test history list**

Run: `npm run dev`

1. Create a few estimations through wizard
2. Navigate to /history
3. Test filters (stage, points, search)
4. Test sort options
5. Test clone button (should navigate to wizard with data)
6. Test delete button (should show confirm, then remove)
7. Test view button

Expected: History list shows all estimations, filters work, actions work

- [ ] **Step 5: Commit**

```bash
git add src/components/history/HistoryList.jsx src/pages/HistoryPage.jsx src/App.jsx
git commit -m "feat: add history list with filters and actions

Add estimation history with search, filter, sort, clone, and delete.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 12: History Detail

**Files:**
- Create: `src/components/history/HistoryDetail.jsx`
- Create: `src/pages/HistoryDetailPage.jsx`

**Interfaces:**
- Consumes: `useEstimation()`, `useParams()` from react-router
- Produces: History detail page with full report and actions

---

- [ ] **Step 1: Create HistoryDetail.jsx**

Create `src/components/history/HistoryDetail.jsx`:

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEstimation } from '../../context/EstimationContext';

export default function HistoryDetail({ estimation }) {
  const { loadEstimation, deleteEstimation } = useEstimation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(estimation.calculationBreakdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleClone = () => {
    loadEstimation(estimation.id);
    navigate('/');
  };

  const handleDelete = () => {
    if (confirm(`Delete estimation "${estimation.projectName}"?`)) {
      deleteEstimation(estimation.id);
      navigate('/history');
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getPointsColor = (points) => {
    if (points <= 3) return 'text-green-600 bg-green-50';
    if (points === 5) return 'text-yellow-600 bg-yellow-50';
    if (points === 8) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => navigate('/history')}
          className="text-blue-600 hover:text-blue-800"
        >
          History
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium truncate">{estimation.projectName}</span>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/history')}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to History
        </button>

        <div className="flex gap-2">
          <button onClick={handleCopy} className="btn-secondary text-sm">
            {copied ? 'Copied!' : 'Copy Report'}
          </button>
          <button onClick={handleClone} className="btn-secondary text-sm">
            Clone
          </button>
          <button onClick={handleDelete} className="btn-destructive text-sm">
            Delete
          </button>
        </div>
      </div>

      {/* Story Points Header */}
      <div className={`rounded-lg p-8 text-center ${getPointsColor(estimation.finalPoints)}`}>
        <div className="text-7xl font-bold mb-2">
          {estimation.finalPoints}
        </div>
        <div className="text-xl font-medium">Story Points</div>
        {estimation.isOverridden && estimation.calculatedPoints !== estimation.finalPoints && (
          <div className="text-sm mt-2 opacity-75">
            Calculated: {estimation.calculatedPoints} → Adjusted to: {estimation.finalPoints}
          </div>
        )}
        <div className="text-xs mt-3 opacity-75">
          Created {formatDate(estimation.timestamp)}
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white border rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-600 mb-1">Project Name</dt>
              <dd className="text-gray-900 font-medium">{estimation.projectName}</dd>
            </div>
            <div className="flex gap-8">
              <div>
                <dt className="text-sm text-gray-600 mb-1">Stage</dt>
                <dd>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    estimation.stage === 'Discovery' ? 'bg-discovery text-white' :
                    estimation.stage === 'Define' ? 'bg-define text-white' :
                    'bg-design text-white'
                  }`}>
                    {estimation.stage}
                  </span>
                </dd>
              </div>
              {estimation.weeks && (
                <div>
                  <dt className="text-sm text-gray-600 mb-1">Duration</dt>
                  <dd className="text-gray-900 font-medium">{estimation.weeks} weeks</dd>
                </div>
              )}
            </div>
            {estimation.description && (
              <div>
                <dt className="text-sm text-gray-600 mb-1">Description</dt>
                <dd className="text-gray-900">{estimation.description}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Complexity Assessment</h3>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Problem/Solution Ambiguity:</dt>
              <dd className="text-sm font-medium">{estimation.complexity.ambiguity}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Artifact/Deliverable Complexity:</dt>
              <dd className="text-sm font-medium">{estimation.complexity.artifactComplexity}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Stakeholder/Dependency Risk:</dt>
              <dd className="text-sm font-medium">{estimation.complexity.stakeholderRisk}</dd>
            </div>
            {estimation.complexity.iterationLikelihood && (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Iteration Likelihood:</dt>
                <dd className="text-sm font-medium">{estimation.complexity.iterationLikelihood}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Selected Activities ({estimation.activities.length})
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {estimation.activities.map((activity) => (
              <li key={activity} className="text-sm text-gray-700">• {activity}</li>
            ))}
          </ul>
        </div>

        {estimation.overrideReason && (
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Adjustment Reason</h3>
            <p className="text-sm text-gray-700">{estimation.overrideReason}</p>
          </div>
        )}

        {estimation.finalPoints === 13 && (
          <div className="border-t pt-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-900 font-medium">⚠️ Recommendation</p>
              <p className="text-amber-800 text-sm mt-1">
                This work may be too large. Consider breaking into smaller Discovery, Define, or Design items.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create HistoryDetailPage.jsx**

Create `src/pages/HistoryDetailPage.jsx`:

```jsx
import { useParams, Navigate } from 'react-router-dom';
import { useEstimation } from '../context/EstimationContext';
import HistoryDetail from '../components/history/HistoryDetail';

export default function HistoryDetailPage() {
  const { id } = useParams();
  const { history } = useEstimation();

  const estimation = history.find(e => e.id === id);

  if (!estimation) {
    return <Navigate to="/history" replace />;
  }

  return <HistoryDetail estimation={estimation} />;
}
```

- [ ] **Step 3: Update App.jsx to use HistoryDetailPage**

Edit `src/App.jsx`:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import WizardPage from './pages/WizardPage';
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<WizardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<HistoryDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 4: Test history detail**

Run: `npm run dev`

1. Create an estimation
2. Go to history
3. Click "View" on an estimation
4. Verify breadcrumb shows
5. Test copy button
6. Test clone button (navigates to wizard)
7. Test delete button (navigates to history)
8. Test back button

Expected: Detail view shows full report, all actions work

- [ ] **Step 5: Commit**

```bash
git add src/components/history/HistoryDetail.jsx src/pages/HistoryDetailPage.jsx src/App.jsx
git commit -m "feat: add history detail view

Add full report view with breadcrumb navigation and actions.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 13: Draft Recovery & Final Polish

**Files:**
- Create: `src/components/common/DraftRecoveryModal.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `loadDraft()`, `clearDraft()` from storage
- Produces: Complete MVP with draft recovery on app load

---

- [ ] **Step 1: Create DraftRecoveryModal.jsx**

Create `src/components/common/DraftRecoveryModal.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEstimation } from '../../context/EstimationContext';
import { loadDraft, clearDraft } from '../../utils/storage';

export default function DraftRecoveryModal() {
  const [draft, setDraft] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { setWizardData, goToStep } = useEstimation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedDraft = loadDraft();
    if (savedDraft) {
      setDraft(savedDraft);
      setShowModal(true);
    }
  }, []);

  const handleResume = () => {
    if (draft) {
      setWizardData(draft.wizardData);
      goToStep(draft.currentStep);
      setShowModal(false);
      navigate('/');
    }
  };

  const handleStartFresh = () => {
    clearDraft();
    setShowModal(false);
  };

  if (!showModal || !draft) return null;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'a few minutes ago';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Unsaved Estimation Found</h2>
        <p className="text-gray-600">
          You have an unsaved estimation from {formatDate(draft.lastSaved)}.
          Would you like to resume where you left off?
        </p>

        {draft.wizardData.projectName && (
          <div className="bg-gray-50 rounded p-3">
            <p className="text-sm text-gray-600">Project:</p>
            <p className="font-medium text-gray-900">{draft.wizardData.projectName}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleStartFresh}
            className="flex-1 btn-secondary"
          >
            Start Fresh
          </button>
          <button
            onClick={handleResume}
            className="flex-1 btn-primary"
          >
            Resume
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add DraftRecoveryModal to App**

Edit `src/App.jsx`:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import DraftRecoveryModal from './components/common/DraftRecoveryModal';
import WizardPage from './pages/WizardPage';
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';

function App() {
  return (
    <BrowserRouter>
      <DraftRecoveryModal />
      <Layout>
        <Routes>
          <Route path="/" element={<WizardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<HistoryDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 3: Test draft recovery**

Run: `npm run dev`

1. Start filling out wizard (complete step 1, go to step 2)
2. Close browser tab
3. Reopen app
4. Modal should appear with option to resume
5. Click Resume - should return to step 2 with data
6. Repeat test but click Start Fresh - should clear and go to step 1

Expected: Draft recovery modal works, data persists

- [ ] **Step 4: Add README.md**

Create `README.md`:

```markdown
# Story Points Calculator

A React web application that guides product designers through estimating story points for design work across Discovery, Define, and Design phases.

## Features

- **5-Step Wizard**: Guided estimation process
- **Complexity-Based Calculation**: Assess work across multiple dimensions
- **Estimation History**: Save and review past estimations
- **Draft Auto-Save**: Resume incomplete estimations
- **Export Reports**: Copy estimation reports to clipboard

## Tech Stack

- React 18
- Vite
- React Router v6
- Tailwind CSS
- localStorage for persistence

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173

### Build for Production

```bash
npm run build
```

## Usage

1. Click "New Estimation" to start
2. Fill out project information
3. Select activities for your work
4. Assess complexity across dimensions
5. Review and optionally adjust story points
6. Save to history or copy report

## Documentation

See `docs/superpowers/specs/` for design specification and `references/` for story points reference guide.

## License

Proprietary
```

- [ ] **Step 5: Final testing checklist**

Run full application test:

- [ ] Create new estimation through all 5 steps
- [ ] Save to history
- [ ] View history list
- [ ] Filter and search history
- [ ] View history detail
- [ ] Clone estimation
- [ ] Delete estimation
- [ ] Test draft recovery
- [ ] Test back/forward navigation in wizard
- [ ] Test stepper navigation
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test copy to clipboard
- [ ] Test form validation
- [ ] Test override functionality

Expected: All features work as specified

- [ ] **Step 6: Commit**

```bash
git add src/components/common/DraftRecoveryModal.jsx src/App.jsx README.md
git commit -m "feat: add draft recovery and final polish

Add draft recovery modal, README, complete MVP.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Implementation Complete

The Story Points Calculator MVP is now fully implemented with:

✅ Project setup with Vite, React, Tailwind
✅ Constants and utility functions for calculations
✅ Estimation context for state management
✅ Common reusable components
✅ 5-step wizard flow with validation
✅ Wizard navigation and progress stepper
✅ History list with filters and search
✅ History detail view
✅ Draft auto-save and recovery
✅ Copy to clipboard functionality
✅ Complete responsive design

All features from the specification have been implemented. The app is ready for use.
