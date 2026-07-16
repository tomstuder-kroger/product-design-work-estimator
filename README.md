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
5. Review and optionally adjust the calculated story points
6. Save to history or copy the report

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── wizard/          # Wizard step components
│   └── history/         # History list and detail components
├── context/             # React Context for state management
├── pages/               # Page-level components
├── utils/               # Utility functions and constants
└── App.jsx              # Main app component
```

## Story Point Scale

The calculator uses the Fibonacci sequence for story points: 1, 2, 3, 5, 8, 13

## Calculation Logic

Story points are calculated based on complexity assessment across four dimensions:
- Problem/Solution Ambiguity (required)
- Artifact/Deliverable Complexity (required)
- Stakeholder/Dependency Risk (required)
- Iteration Likelihood (optional)

Each dimension is rated as Low (1), Medium (2), or High (3). The total score maps to the Fibonacci scale.

## License

This project is for internal use only.
