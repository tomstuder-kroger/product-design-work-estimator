# Kroger Design System Token Integration - Story Points App

## Overview

Integrate Kroger design system tokens into the Story Points Calculator app to align with Kroger branding standards while maintaining the current component architecture.

## Goal

Add Kroger design tokens and branding to the Story Points app with minimal disruption to existing functionality.

## Scope

**In Scope:**
- Install mx-web-components package for design tokens
- Map mx-web-components tokens to Tailwind color system
- Update color classes throughout the app to use Kroger brand colors
- Add Kroger fonts (DM Sans, Nunito)
- Add Kroger logo to header
- Update header to use Kroger brand blue

**Out of Scope:**
- Migrating to shadcn/ui components
- Upgrading Tailwind v3 to v4
- Changing component structure or logic
- Adding mx-web-components UI components
- Changes to Capacity Planning app

## Architecture

### Design Token Flow

```
mx-web-components/dist/light.css
  ↓ (provides CSS variables)
--brand-lessProminent-rgb, --neutral-*, --positive-*, etc.
  ↓ (mapped in Tailwind config)
Tailwind theme colors (primary, gray.*, success, etc.)
  ↓ (used in components)
className="bg-primary text-white"
```

### Technology Stack

- **Existing:** React 18, Vite, Tailwind CSS v3, React Router
- **New:** mx-web-components v5.1.0 (tokens only)
- **Fonts:** DM Sans (body), Nunito (headings)

## Design Token Mapping

### Color System

Map mx-web-components semantic tokens to Tailwind theme:

**Primary/Brand Colors:**
- `primary`: `rgb(var(--brand-lessProminent-rgb))` - Main Kroger blue
- `primary-dark`: `rgb(var(--brand-mostProminent-rgb))` - Hover states
- `primary-light`: `rgb(var(--brand-mostSubtle-rgb))` - Light backgrounds

**Stage Colors:**
- `discovery`: `rgb(var(--brand-lessProminent-rgb))` - Blue
- `define`: `rgb(var(--special-lessProminent-rgb))` - Purple
- `design`: `rgb(var(--positive-lessProminent-rgb))` - Green

**Semantic Colors:**
- `success`: `rgb(var(--positive-lessProminent-rgb))`
- `warning`: `rgb(var(--callout-lessProminent-rgb))`
- `error`: `rgb(var(--negative-lessProminent-rgb))`

**Neutral Scale:**
- `gray.50`: `rgb(var(--neutral-mostSubtle-rgb))`
- `gray.100`: `rgb(var(--neutral-moreSubtle-rgb))`
- `gray.200`: `rgb(var(--neutral-lessSubtle-rgb))`
- `gray.300`: `rgb(var(--neutral-leastSubtle-rgb))`
- `gray.400`: `rgb(var(--neutral-leastProminent-rgb))`
- `gray.500`: `rgb(var(--neutral-lessProminent-rgb))`
- `gray.600`: `rgb(var(--neutral-moreProminent-rgb))`
- `gray.700`: `rgb(var(--neutral-mostProminent-rgb))`
- `gray.900`: `rgb(var(--system-text-rgb))`

### Typography

**Fonts:**
- Body text: DM Sans (400, 500, 600, 700 weights)
- Headings: Nunito (600, 700, 800 weights)

**Tailwind Config:**
```javascript
fontFamily: {
  sans: ['DM Sans', 'sans-serif'],
  heading: ['Nunito', 'sans-serif'],
}
```

**CSS:**
```css
body {
  font-family: 'DM Sans', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Nunito', sans-serif;
}
```

## Component Updates

### Layout.jsx (Header)

**Current:**
- White background with shadow
- Gray/blue text
- Simple navigation links

**Updated:**
- Background: `bg-primary` (Kroger blue)
- Add Kroger logo (left side, 60px × 33px)
- App title: "Story Points Calculator" in white
- Text color: `text-white`
- Active link: `text-white font-bold`
- Inactive link: `text-white/80 hover:text-white`

**Layout:**
```
[Kroger Logo] Story Points Calculator          New Estimation | History
```

### Wizard Stepper (WizardPage.jsx)

**Color Updates:**
- Active step circle: `bg-primary` (was `bg-blue-600`)
- Completed step circle: `bg-primary`
- Active step text: `text-primary`
- Connector line: `bg-primary`
- Inactive elements: Keep gray

### Buttons

**Primary Buttons:**
- Background: `bg-primary hover:bg-primary-dark` (was `bg-blue-600 hover:bg-blue-700`)
- Text: `text-white` (no change)
- Focus ring: `focus:ring-primary`

**Secondary Buttons:**
- Keep gray-based colors (no change)

**Links:**
- Color: `text-primary hover:text-primary-dark` (was `text-blue-600 hover:text-blue-800`)

### Stage Badges

Used in StepProjectInfo, StepReview, StepReport, HistoryDetail:

**Discovery:**
- Class: `bg-discovery text-white`
- Previously: `bg-blue-500`

**Define:**
- Class: `bg-define text-white`
- Previously: `bg-purple-600`

**Design:**
- Class: `bg-design text-white`
- Previously: `bg-green-600`

### Story Point Color Indicators

**Keep existing semantic colors:**
- 1-3 points: Green (`bg-green-50 text-green-600`)
- 5 points: Yellow (`bg-yellow-50 text-yellow-600`)
- 8 points: Orange (`bg-orange-50 text-orange-600`)
- 13 points: Red (`bg-red-50 text-red-600`)

These use Tailwind's default semantic colors, not Kroger tokens.

### T-Shirt Size Badges

**Keep existing purple:**
- Class: `bg-purple-100 text-purple-800`

Uses Tailwind's default purple, not mapped to Kroger special color.

## Files to Modify

### Package Dependencies

**package.json:**
- Add: `"mx-web-components": "^5.1.0"`

### Configuration Files

**tailwind.config.js:**
- Add mx-web-components token mappings to `theme.extend.colors`
- Add font family configuration
- Keep all existing configuration

**src/index.css:**
- Import `mx-web-components/dist/light.css` at top
- Import Google Fonts (DM Sans, Nunito)
- Add font-family rules for body and headings

### Assets

**public/kroger-logo.svg:**
- Copy from Capacity Planning app or create simple SVG
- Dimensions: 60px × 33px

### Components

**src/components/common/Layout.jsx:**
- Import Kroger logo
- Update header className to `bg-primary`
- Update text colors to white
- Add logo display
- Update navigation link colors

**src/pages/WizardPage.jsx:**
- Update stepper colors: `bg-blue-600` → `bg-primary`
- Update stepper text colors: `text-blue-600` → `text-primary`

**src/components/wizard/StepProjectInfo.jsx:**
- Update stage button active state: `bg-blue-50 text-blue-900 border-blue-600` → `bg-primary/10 text-primary border-primary`
- Update stage button colors to use `bg-discovery`, `bg-define`, `bg-design`

**src/components/wizard/StepActivities.jsx:**
- Update checkbox active state: `border-blue-500` → `border-primary`

**src/components/wizard/StepComplexity.jsx:**
- Update radio button active state: `border-blue-500` → `border-primary`

**src/components/wizard/StepReview.jsx:**
- Update edit link colors: `text-blue-600 hover:text-blue-800` → `text-primary hover:text-primary-dark`
- Update stage badge colors to semantic classes

**src/components/wizard/StepReport.jsx:**
- Update button colors: `bg-blue-600` → `bg-primary`
- Update link colors: `text-blue-600` → `text-primary`
- Update stage badge colors to semantic classes

**src/components/history/HistoryList.jsx:**
- Update "View Details" link: `text-blue-600` → `text-primary`

**src/components/history/HistoryDetail.jsx:**
- Update breadcrumb link: `text-blue-600 hover:text-blue-800` → `text-primary hover:text-primary-dark`
- Update "Back to History" link color
- Update stage badge colors to semantic classes

**src/index.css:**
- Update button styles if any hardcoded blues exist

## Non-Functional Requirements

### Performance
- No performance impact expected (CSS imports only)
- Font loading from Google Fonts CDN

### Browser Support
- Same as current app (modern browsers)
- CSS variable support required (all modern browsers)

### Accessibility
- Maintain existing WCAG compliance
- Kroger brand blue has sufficient contrast (4.5:1 minimum)
- No changes to focus indicators or keyboard navigation

### Maintainability
- Design tokens centralized in mx-web-components
- Easy to update when Kroger design system changes
- Clear mapping in Tailwind config

## Testing Strategy

### Visual Testing
- Test all pages in the wizard flow
- Verify History list and detail pages
- Check all button states (hover, active, disabled)
- Verify stage badges in all contexts
- Test navigation active/inactive states

### Functional Testing
- All existing functionality must work unchanged
- Navigation between pages
- Form validation
- Data persistence (localStorage)
- Draft recovery
- Clone/delete operations

### Cross-Browser Testing
- Chrome, Firefox, Safari (latest versions)
- Verify font loading
- Check CSS variable support

## Migration Notes

### Breaking Changes
None - this is purely visual/branding changes

### Rollback Plan
If issues arise:
1. Uninstall mx-web-components package
2. Revert tailwind.config.js changes
3. Revert index.css imports
4. Revert component className changes
5. Remove Kroger logo

### Deployment Considerations
- Assets: Ensure kroger-logo.svg is included in build
- Fonts: External dependency on Google Fonts CDN
- CSS: mx-web-components CSS files bundled in build

## Success Criteria

1. ✅ Story Points app uses Kroger brand colors throughout
2. ✅ Header displays Kroger logo and brand blue background
3. ✅ All text uses DM Sans (body) and Nunito (headings)
4. ✅ No functional regressions
5. ✅ All existing features work identically
6. ✅ Visual consistency with Kroger design standards
7. ✅ Build completes successfully with no errors
8. ✅ App loads and functions in all supported browsers

## Future Enhancements

Potential improvements outside current scope:
- Migrate to shadcn/ui components (match Capacity Planning)
- Upgrade to Tailwind v4
- Add dark mode support using mx-web-components dark.css
- Full mx-web-components component integration
- Responsive design improvements
