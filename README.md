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
