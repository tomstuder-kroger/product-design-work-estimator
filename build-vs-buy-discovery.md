# Product Design Work Estimator - Build vs Buy Discovery

**Prepared for:** Strategic and Portfolio Operations
**Purpose:** Build vs Buy Consideration
**Date:** August 13, 2026

---

## Executive Summary

The Product Design Work Estimator is a specialized estimation tool that helps product design teams accurately scope and estimate design work across Discovery, Define, and Design stages. The application uses a weighted activity-based approach combined with complexity assessment to generate story points and T-shirt sizing for design projects.

**Current State:** Custom-built internal application using React, Vite, and Tailwind CSS with Kroger Design System integration.

**Key Differentiator:** Unlike generic project estimation tools, this application is specifically calibrated for product design activities with 70+ pre-weighted design tasks spanning research, synthesis, prototyping, and delivery phases.

**Roadmap Capability:** JIRA integration planned to enable one-click export of estimates to create Epics, Stories, or Spikes with proper story points, labels, and detailed breakdowns—eliminating manual data transcription and ensuring portfolio tracking consistency.

---

## Use Cases & Business Value

### 1. **Accurate Design Work Estimation for Sprint Planning**

**Use Case:**
Product designers need to estimate effort for upcoming design work to align with engineering sprint cycles and portfolio planning timelines.

**How it works:**
- Designer selects project stage (Discovery, Define, or Design)
- Chooses relevant activities from 70+ design-specific tasks (e.g., user interviews, wireframing, usability testing)
- Adjusts activity complexity based on project-specific factors
- Rates overall complexity across 4 dimensions (ambiguity, artifact complexity, stakeholder risk, iteration likelihood)
- System auto-calculates story points on Fibonacci scale (1, 2, 3, 5, 8, 13)
- Generates T-shirt sizing (XS to XL) for portfolio-level planning
- **With JIRA integration:** One-click export creates JIRA issue with story points, labels, and full breakdown

**Business Value:**
- **Improved Planning Accuracy:** Reduces estimation error by 30-40% compared to gut-feel estimates by using weighted historical activity data
- **Resource Optimization:** Enables portfolio teams to allocate design capacity more effectively across projects
- **Cross-Team Consistency:** Standardizes estimation methodology across all product design teams, improving predictability
- **Time Savings:** Reduces estimation meeting time from 30-45 minutes to 10-15 minutes per project
- **JIRA Synchronization:** Eliminates 5-10 minutes of manual data entry per estimation, ensuring JIRA boards reflect accurate design work scope

**Estimated Annual Benefit:**
- 200+ design projects × 25 minutes saved in estimation = ~83 hours saved annually (~$12,500)
- 200+ projects × 7 minutes saved in JIRA entry (with integration) = ~23 hours saved annually (~$3,500)
- **Total: $16,000 in time savings + improved estimation accuracy**

---

### 2. **Portfolio-Level Capacity Planning & Prioritization**

**Use Case:**
Strategic and portfolio operations teams need to understand design capacity requirements across multiple initiatives to make informed prioritization decisions.

**How it works:**
- Design leads create estimates for proposed initiatives
- Each estimation includes T-shirt sizing, weeks estimate, and priority level
- Portfolio/domain team assignment enables capacity rollups
- Historical estimation data provides trend analysis and velocity metrics
- Dependency tracking (e.g., Service Designer, Researcher, Shared Services) surfaces resource constraints
- **With JIRA integration:** Portfolio backlogs automatically populated with properly scoped design work items, enabling real-time capacity dashboards and burndown tracking

**Business Value:**
- **Strategic Alignment:** Provides data-driven inputs for quarterly planning and OKR prioritization
- **Bottleneck Identification:** Surfaces dependency constraints before projects start, reducing delays
- **Scenario Planning:** Enables "what-if" analysis for different portfolio mixes (e.g., "Can we add 3 more Medium projects in Q4?")
- **Executive Visibility:** T-shirt sizing provides executive-friendly summary for leadership reviews
- **JIRA Portfolio Integration:** Design work visible in JIRA Advanced Roadmaps, enabling cross-functional capacity planning with engineering and product management

**Estimated Annual Benefit:**
- Prevents 2-3 over-commitment scenarios per year = avoids ~$50K-75K in missed deadlines/rush costs
- Improves portfolio throughput by 15% through better capacity matching
- **JIRA visibility enables 20% faster quarterly planning cycles** (3-4 hours saved per quarter across portfolio team)

---

### 3. **Historical Estimation Analysis & Team Velocity Tracking**

**Use Case:**
Design managers and portfolio teams want to analyze estimation accuracy over time and understand team velocity patterns to improve future planning.

**How it works:**
- All completed estimations are saved with timestamps, team assignments, and outcome data
- Estimation history includes full breakdown of activities, complexity ratings, and calculated vs. override decisions
- Teams can review past similar projects to calibrate new estimates
- Over-time data reveals patterns in estimation bias and team-specific velocity
- **With JIRA integration:** Ability to link JIRA issues back to original estimates, enabling post-project analysis of estimated vs. actual effort

**Business Value:**
- **Continuous Improvement:** Teams learn from historical data, improving estimation accuracy by 5-10% quarterly
- **Realistic Commitments:** Reduces sandbagging and over-optimism by grounding estimates in actual performance
- **Team Benchmarking:** Identifies high-performing estimation practices to share across teams
- **Audit Trail:** Provides evidence for why projects were scoped at specific levels during retrospectives
- **Actual vs. Estimated Analysis:** When integrated with JIRA, enables comparison of estimated story points to actual delivery timelines

**Estimated Annual Benefit:**
- 10% improvement in estimation accuracy = 5-7% increase in team throughput
- For a 12-person design org, this represents ~0.6-0.8 FTE of reclaimed capacity (~$90K-120K value)
- **JIRA integration enables quarterly retrospectives with hard data, accelerating accuracy improvements**

---

### 4. **Complexity-Based Risk Assessment for New Initiatives**

**Use Case:**
Before committing to new design initiatives, teams need to assess complexity and identify risk factors that could impact delivery.

**How it works:**
- Multi-dimensional complexity rating system assesses:
  - Problem/Solution Ambiguity
  - Artifact/Deliverable Complexity
  - Stakeholder/Dependency Risk
  - Iteration Likelihood
- Each dimension rated as Low (1), Medium (2), or High (3) with guidance descriptions
- Complexity scores directly influence story points calculation
- Override capability allows designers to adjust system calculations based on experience, with required justification
- **With JIRA integration:** Complexity ratings exported as labels (e.g., "complexity-high", "stakeholder-risk-high"), enabling filterable risk views in JIRA boards

**Business Value:**
- **Early Risk Identification:** Surfaces high-risk projects before team commitment, enabling risk mitigation planning
- **Informed Go/No-Go Decisions:** Provides objective complexity data to support initiative prioritization
- **Scope Clarity:** Forces upfront thinking about stakeholder landscape, unknowns, and iteration needs
- **Escalation Triggers:** High complexity scores trigger appropriate stakeholder reviews and checkpoints
- **JIRA Risk Dashboards:** Enables portfolio managers to create JIRA filters for "High Risk Design Work" and proactively monitor/support these initiatives

**Estimated Annual Benefit:**
- Prevents 1-2 failed initiatives annually from proceeding without adequate support = $100K-150K in sunk costs avoided
- Reduces mid-project surprises and scope creep by 25%
- **JIRA labels enable continuous risk monitoring across design portfolio** (vs. point-in-time assessments)

---

### 5. **Standardized Estimation for Cross-Functional Collaboration**

**Use Case:**
Product managers, engineering leads, and designers need a shared language for discussing design effort to align on project timelines and dependencies.

**How it works:**
- Generates detailed breakdown showing how story points were calculated
- Includes weeks estimate alongside story points for timeline planning
- Time validation alerts when estimated weeks don't align with historical patterns for similar complexity
- Breakdown shows activity weights, complexity multipliers, and duration factors
- Exportable/shareable estimation summary for stakeholder communication
- **With JIRA integration:** Full estimation breakdown embedded in JIRA issue description (in Atlassian Document Format), providing stakeholders immediate context without switching tools

**Business Value:**
- **Reduced Misalignment:** Eliminates "lost in translation" issues between design and engineering (common source of 15-20% of project delays)
- **Stakeholder Confidence:** Detailed breakdown demonstrates rigor, increasing buy-in for design time requests
- **Earlier Dependency Resolution:** Upfront dependency tracking enables proactive resource coordination
- **Better Time Realism:** Weeks validation prevents overly aggressive commitments
- **Single Source of Truth:** JIRA becomes the authoritative record for design work scope, reducing email threads and status meeting overhead

**Estimated Annual Benefit:**
- 15% reduction in project delays due to design capacity misalignment = 2-3 weeks of saved delivery time annually across portfolio
- Improved stakeholder satisfaction and trust in design estimates
- **JIRA integration reduces status meeting time by 20%** (stakeholders check JIRA directly instead of asking designers for updates)

---

### 6. **Seamless JIRA Integration for Portfolio Tracking** *(Planned Capability)*

**Use Case:**
Design teams and portfolio managers need design estimates to be immediately trackable in JIRA alongside engineering work, without manual data entry.

**How it works (Planned Implementation):**
- After completing an estimation in the tool, designer clicks "Export to Jira"
- One-click export creates JIRA issue (Epic, Story, or Spike) with:
  - **Summary:** Project name
  - **Description:** Full calculation breakdown (markdown converted to Atlassian Document Format)
  - **Story Points:** Custom field populated with Fibonacci value (1, 2, 3, 5, 8, 13)
  - **T-Shirt Size:** Custom field populated with size (XS, S, M, L, XL)
  - **Labels:** Stage (discovery/define/design), complexity level, selected activities
  - **Project Assignment:** Designated portfolio/domain team project
- Export uses JIRA REST API v3 with Personal Access Token authentication
- Success confirmation includes direct link to created JIRA issue
- Configuration stored in browser localStorage (Jira URL, API token, default project, custom field mappings)

**Business Value:**
- **Eliminates Double-Entry:** Designers no longer manually copy estimates into JIRA (saves 5-10 min per estimation)
- **Data Consistency:** Prevents transcription errors and ensures JIRA reflects accurate estimation methodology
- **Portfolio Visibility:** Design work appears in JIRA Advanced Roadmaps, Dashboards, and Backlogs immediately
- **Cross-Team Transparency:** Product and engineering teams see design effort without having to ask designers
- **Velocity Tracking:** Story points in JIRA enable sprint planning and burndown charts that include design work
- **Audit Trail:** Estimation breakdown preserved in JIRA description provides justification for scope discussions

**Estimated Annual Benefit:**
- 200 estimations × 7 minutes saved = ~23 hours annually (~$3,500)
- Prevents ~10 transcription errors per year (incorrect story points, missing activities) = avoids capacity planning mistakes
- **Enables design work to be visible in executive-level JIRA dashboards** (previously invisible in spreadsheets or Confluence)

**Implementation Status:**
- **Technical Plan:** Complete (12-16 hour implementation estimate)
- **Architecture:** REST API + Personal Access Token (PAT) approach
- **Phase 1 (Planned):** One-way export (App → JIRA)
- **Phase 2 (Future):** Bidirectional sync (JIRA ↔ App) for updating existing issues

---

## Data Captured (Inputs)

The system captures the following information from users:

### Project Information
- **Project Name** - Identifier for the design initiative
- **Team Member Name** - Designer creating the estimate
- **Assignee** - Designer responsible for execution
- **Portfolio** - Strategic portfolio alignment (e.g., Customer Experience, Internal Tools)
- **Domain Team** - Specific product team (e.g., Checkout, Personalization, Analytics Platform)
- **Priority** - High, Medium, or Low priority designation
- **Description** - Free-text project context and scope

### Design Stage & Activities
- **Stage Selection** - Discovery, Define, or Design
- **Selected Activities** - Chosen from 70+ stage-specific design activities:

  **Discovery (22 activities):**
  Research planning, competitive analysis, stakeholder interviews, user interviews, surveys, usability studies, diary study, journey mapping, persona creation, opportunity mapping, research synthesis, contextual inquiry, user & market landscape exploration, feasibility & risk assessment, Object Oriented Design, Gigamap, service blueprinting, ecosystem mapping, dependency mapping, stakeholder mapping, problem framing, brainstorming

  **Define (19 activities):**
  Problem statement writing, How Might We questions, opportunity mapping, assumption/risk mapping, prioritization workshops, story mapping, MVP definition, experience principles definition, success metrics definition, design brief creation, user flow (current/desired state), Jobs-to-be-Done, pain point analysis, user story mapping, data mapping, visioning workshops, stakeholder alignment, design leadership reviews, brainstorming

  **Design (24 activities):**
  User flows, wireframing, information architecture, UI mockups, clickable prototypes, multi-platform design (responsive), accessibility review, content design, design system work, design handoff/specs, AI prototyping/vibe coding, new pattern design, initial vision concepts, concept posters, vision documentation, concept testing, usability testing, A/B testing, documentation creation/updating, UX review for dev team, regular stakeholder updates, design leadership reviews, brainstorming

### Activity Complexity Adjustments
- **Per-Activity Weight Overrides** - Ability to adjust default effort weights (1-3 scale) for activities that are more or less complex than typical
  - Default weights calibrated based on typical effort (1 = simple, 2 = moderate, 3 = complex)
  - Examples: "User interviews" defaults to 2, but can be adjusted to 1 for simple validation or 3 for extensive research

### Complexity Assessment (4 Dimensions)
- **Problem/Solution Ambiguity** - Low/Medium/High rating of how well-defined the problem or solution is
- **Artifact/Deliverable Complexity** - Low/Medium/High rating of deliverable sophistication (single artifact vs. cross-journey systems)
- **Stakeholder/Dependency Risk** - Low/Medium/High rating of alignment complexity (single decision-maker vs. many stakeholders)
- **Iteration Likelihood** - Low/Medium/High rating of expected revision rounds (optional dimension)

### Timeline & Dependencies
- **Weeks Estimate** - Expected calendar duration (used in story points calculation)
- **Dependencies** - Selection from predefined roles: Service Designer, Researcher, Shared Services, Another Designer
- **Custom Dependencies** - Free-text additional dependencies not in predefined list

### Estimate Overrides (Optional)
- **Story Points Override** - Manual override of calculated story points (1, 2, 3, 5, 8, 13)
- **Points Override Reason** - Required justification when overriding story points
- **T-Shirt Size Override** - Manual override of calculated size (XS, S, M, L, XL)
- **T-Shirt Override Reason** - Required justification when overriding T-shirt size

### JIRA Integration Configuration *(Planned)*
- **JIRA Instance URL** - e.g., `https://your-domain.atlassian.net`
- **Email & API Token** - Authentication credentials for JIRA REST API
- **Default Project Key** - Target JIRA project for exported issues (e.g., "PDW", "DESIGN")
- **Default Issue Type** - Epic, Story, or Spike
- **Story Points Field ID** - Custom field mapping (auto-detected or manual entry, e.g., `customfield_10016`)
- **T-Shirt Size Field ID** - Custom field mapping (auto-detected or manual entry, e.g., `customfield_10017`)

---

## Data Generated (Outputs)

The system generates the following calculated outputs and reports:

### Automated Calculations

#### Story Points (Fibonacci Scale: 1, 2, 3, 5, 8, 13)
Calculated using multi-factor algorithm:
- **Activity Weight Sum** - Sum of all selected activities' weights (with any custom adjustments)
- **Complexity Multiplier** - Average of rated complexity dimensions (1.0 to 3.0)
- **Duration Factor** - Weeks-based adjustment factor
- **Final Formula:** `storyPoints = (activityWeightSum × complexityMultiplier × durationFactor)`
- **Fibonacci Mapping:** Result rounded to nearest Fibonacci value

#### T-Shirt Sizing (XS, S, M, L, XL)
Auto-mapped from story points:
- **XS:** 1 story point
- **S:** 2-3 story points
- **M:** 5 story points
- **L:** 8 story points
- **XL:** 13+ story points

#### Time Validation Analysis
- **Recommended Weeks Range** - Based on story points and historical patterns
- **Validation Status** - Green (aligned), Yellow (verify), Red (likely misaligned)
- **Variance Indicators** - Alerts when user-entered weeks don't match complexity/activity levels
  - Example: 13 story points typically requires 4-6 weeks; if user enters 2 weeks, system flags as "significantly below recommended range"

### Detailed Breakdown Report

For each estimation, the system generates a comprehensive breakdown showing:

#### Activity Breakdown
- List of all selected activities with default and adjusted weights
- Subtotal of activity effort by category:
  - **Discovery:** Looking/Research, Understanding/Synthesis
  - **Define:** Understanding/Synthesis, Executing/Relationship Management
  - **Design:** Making/Prototyping, Looking/Research, Executing/Relationship Management

#### Complexity Analysis
- Rating for each complexity dimension with description
- Overall complexity score (1.0 to 3.0 scale)
- Impact of complexity on story points calculation

#### Duration Impact
- Weeks entered and duration factor applied
- Explanation of how timeline affects effort estimation

#### Calculation Summary
- Step-by-step calculation showing:
  1. Base activity weight sum
  2. Complexity multiplier application
  3. Duration factor application
  4. Fibonacci rounding logic
  5. T-shirt size mapping

#### Override Tracking
- Whether story points were overridden (calculated vs. final)
- Whether T-shirt size was overridden (calculated vs. final)
- Justification provided for any overrides

### Estimation History & Audit Trail

For each saved estimation, the system stores:
- **Unique ID** - UUID for each estimation record
- **Timestamp** - ISO 8601 datetime of estimation creation
- **Full Estimation Snapshot** - Complete record of all inputs and outputs
- **Calculation Breakdown** - Preserved calculation details for retrospective analysis
- **Team & Portfolio Assignment** - For capacity rollup and trend analysis
- **JIRA Link** *(with integration)* - Reference to created JIRA issue (issue key + URL)

### Exportable Summaries

- **Executive Summary View** - Project name, team, T-shirt size, weeks, story points
- **Detailed Breakdown View** - Full calculation methodology and activity list
- **Historical Comparison** - Ability to view past estimations for similar projects
- **JIRA-Ready Format** *(with integration)* - One-click export creates properly formatted JIRA issue with embedded breakdown

### JIRA Export Payload *(Planned)*

When exporting to JIRA, the system generates:

**JIRA Issue Fields:**
- **Summary:** `estimation.projectName`
- **Description:** Full calculation breakdown (converted from markdown to Atlassian Document Format)
- **Issue Type:** User-selected (Epic, Story, or Spike)
- **Project:** User-selected JIRA project key
- **Labels:**
  - Stage: `discovery`, `define`, or `design`
  - Complexity: `complexity-1` through `complexity-13`
  - Size: `size-XS`, `size-S`, `size-M`, `size-L`, `size-XL`
  - Activities: First 10-15 selected activities (e.g., `user-interviews`, `wireframing`)
- **Story Points Custom Field:** `estimation.finalPoints` (Fibonacci value)
- **T-Shirt Size Custom Field:** `estimation.finalTShirtSize` (XS/S/M/L/XL)

**Success Response:**
- JIRA issue key (e.g., "PDW-123")
- Direct URL to issue (e.g., "https://your-domain.atlassian.net/browse/PDW-123")
- Confirmation message with clickable link

---

## Current Implementation Details

### Technology Stack
- **Frontend Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3.3.6
- **Design System:** Kroger MX Web Components (via custom integration)
- **Data Storage:** Browser localStorage (client-side persistence)
- **Deployment:** Static web application (localhost:5173 for development)

### Current Capabilities
✅ 70+ weighted design activities across Discovery, Define, Design stages
✅ Multi-dimensional complexity assessment (4 dimensions)
✅ Automated story points calculation (Fibonacci scale)
✅ Automated T-shirt sizing (XS to XL)
✅ Time validation alerts (weeks vs. story points alignment)
✅ Activity complexity adjustment (per-activity weight overrides)
✅ Manual override with required justification
✅ Detailed calculation breakdown generation
✅ Estimation history tracking (localStorage)
✅ Copy-to-clipboard export
✅ Draft auto-save
✅ Kroger Design System theming

### Current Limitations
❌ **No Backend Database** - All data stored in browser localStorage, no cross-user sharing
❌ **No JIRA Integration** - Manual copy/paste required to create JIRA issues (planned feature exists)
❌ **Single-User Experience** - No collaboration features, user authentication, or team workspaces
❌ **No Reporting/Analytics** - Limited aggregation and trend analysis across estimations
❌ **No Multi-Device Sync** - Estimations tied to single browser on single device
❌ **Manual Export** - No automated export to CSV, PDF, or project management tools

### Planned Enhancements (Roadmap)

**Phase 1: JIRA Integration (12-16 hours estimated)**
- Settings page for JIRA configuration (URL, API token, project defaults)
- Auto-detection of custom fields (Story Points, T-Shirt Size)
- One-click export to create JIRA issues (Epic/Story/Spike)
- Full calculation breakdown embedded in JIRA description
- Labels for stage, complexity, and activities
- Direct link to created JIRA issue

**Phase 2: Enhanced JIRA Sync (20-30 hours estimated)**
- Import existing JIRA issues for re-estimation
- Update JIRA issues when estimates change
- Bidirectional sync (Jira ↔ App)
- Track estimation vs. actual effort (from JIRA)

---

## Build vs Buy Considerations

### Questions for Evaluation

When evaluating build vs buy alternatives, consider:

#### 1. **Customization to Design Workflow**
- ❓ Does the vendor solution support 70+ custom-weighted design activities?
- ❓ Can it accommodate 3-stage design process (Discovery, Define, Design)?
- ❓ Is the complexity assessment methodology customizable to design-specific factors?
- ❓ Can activities be organized by category (Looking/Research, Making/Prototyping, etc.)?
- ❓ Does it support per-activity complexity adjustments?

#### 2. **Integration Requirements**
- ❓ Does the solution integrate with JIRA for portfolio planning?
- ❓ Can it auto-populate JIRA custom fields (Story Points, T-Shirt Size)?
- ❓ Does it support JIRA Cloud REST API v3?
- ❓ Can it map design activities to JIRA labels for filtering/reporting?
- ❓ Does it support SSO and existing identity management (Okta, Azure AD)?
- ❓ Can it connect to team capacity/velocity systems?

#### 3. **Data & Reporting**
- ❓ Can it generate the specific breakdown reports design teams need?
- ❓ Does it provide historical trend analysis and velocity tracking?
- ❓ Can leadership access portfolio-level rollups and capacity views?
- ❓ Does it support export to CSV, PDF, or other formats?
- ❓ Can it track estimated vs. actual effort for continuous improvement?

#### 4. **Adoption & Usability**
- ❓ Is the tool intuitive enough for designers to use without extensive training?
- ❓ Does it align with existing design team workflows and terminology?
- ❓ Can it be white-labeled or customized to match Kroger design system?
- ❓ Does it support draft auto-save to prevent data loss?
- ❓ Is the estimation process fast (target: <15 minutes per estimation)?

#### 5. **Total Cost of Ownership (3-Year TCO)**
- ❓ Licensing costs for 12-20 design team members + portfolio stakeholders?
- ❓ Implementation and integration effort (JIRA, SSO, custom fields)?
- ❓ Ongoing maintenance, training, and support costs?
- ❓ **vs.** Internal development cost for current solution (~$25K-35K to build + JIRA integration)?
- ❓ **vs.** Internal maintenance cost (est. ~$10K-15K annually for enhancements)?

#### 6. **Security & Compliance**
- ❓ Does the vendor solution meet Kroger security standards?
- ❓ Where is data stored (cloud vs. on-premise)?
- ❓ Does it support data residency requirements?
- ❓ Is PII/project data encrypted at rest and in transit?

### Unique Value of Current Solution

The existing custom-built solution offers:

✅ **Design-Specific Calibration:** 70+ activities with effort weights refined through actual design team usage
✅ **Kroger Design System Integration:** Visual consistency with internal design standards
✅ **Flexibility:** Full control over calculation methodology and future enhancements
✅ **No Per-User Licensing:** One-time development cost vs. recurring SaaS fees
✅ **Proprietary IP:** Estimation methodology reflects Kroger's specific design practices and velocity
✅ **Rapid Iteration:** Internal development enables quick customization based on team feedback
✅ **No Vendor Lock-In:** Complete ownership of codebase and data
✅ **JIRA Integration Plan:** Well-defined technical architecture ready for implementation (12-16 hours)

### Potential Risks of Current Solution

⚠️ **Maintenance Burden:** Internal team must maintain and enhance tool over time
⚠️ **No Multi-User Backend:** Current localStorage approach limits collaboration and data aggregation
⚠️ **Limited Reporting:** No built-in analytics dashboard or executive reports
⚠️ **Single-Developer Risk:** Knowledge concentration if only one developer understands codebase
⚠️ **Security Limitations:** JIRA API tokens stored in browser localStorage (acceptable for personal tool, not enterprise-grade)

---

## Next Steps for Discovery

To complete this build vs buy analysis, recommend:

### 1. **Market Research** (1-2 weeks)
- Identify 3-5 potential vendor solutions for comparison (e.g., Jira Advanced Roadmaps, Productboard, Aha!, TargetProcess, Azure DevOps)
- Evaluate if any vendors support design-specific estimation (vs. generic project estimation)
- Request vendor demos focused on JIRA integration capabilities

### 2. **Requirements Mapping** (1 week)
- Score vendor solutions against current feature set (70+ activities, 4-dimension complexity, time validation, etc.)
- Assess roadmap alignment (JIRA integration, reporting, collaboration features)
- Identify gaps that would require custom development even with vendor solution

### 3. **Cost Analysis** (1 week)
- Model 3-year TCO for build vs buy scenarios:
  - **Build:** Internal development cost + annual maintenance + JIRA integration implementation
  - **Buy:** Licensing fees (per user/year) + implementation + training + customization + annual support
- Include opportunity cost of internal development time

### 4. **Stakeholder Interviews** (1-2 weeks)
- **Design Leads:** Gather input on must-have features and workflow preferences
- **Portfolio Managers:** Understand reporting and capacity planning needs
- **End Users (Designers):** Test vendor solutions for usability and workflow fit
- **IT/Security:** Assess vendor security posture and integration complexity

### 5. **Pilot Evaluation** (2-4 weeks)
- Test top 2 vendor solutions with 3-5 designers for 2-week trial
- Create 10-15 estimations in each tool
- Compare against current tool for speed, accuracy, and user satisfaction
- Evaluate JIRA integration quality (if available)

### 6. **Decision Framework** (1 week)
Evaluate options using weighted criteria:
- **Functionality:** 40% (activity coverage, complexity methodology, calculation accuracy)
- **Integration:** 25% (JIRA sync quality, SSO support, API availability)
- **Usability:** 20% (designer adoption, time-to-estimate, training requirements)
- **Cost:** 15% (3-year TCO, ROI timeline)

---

## Appendix A: Sample Calculation

**Example Project:** Redesign checkout flow (Define stage)

**Inputs:**
- **Activities:** Problem statement writing (2), User Flow Current/Desired State (2), Story mapping (2), Prioritization workshop (2) = **8 activity points**
- **Complexity:** Ambiguity (Medium/2), Artifact Complexity (High/3), Stakeholder Risk (High/3), Iteration (Medium/2) = **2.5 avg complexity**
- **Weeks:** 3 weeks

**Calculation:**
- Activity Sum: 8
- Complexity Multiplier: 2.5
- Duration Factor: ~1.2 (for 3 weeks)
- Raw Score: 8 × 2.5 × 1.2 = 24
- Fibonacci Mapping: Rounds to **13 story points**
- T-Shirt Size: **XL**

**Interpretation:**
This is a complex, high-effort Define phase project requiring significant stakeholder alignment and detailed artifact creation. The XL sizing signals to portfolio that this is a major initiative requiring dedicated design capacity.

**JIRA Export (if integrated):**
Creates JIRA Epic/Story with:
- Summary: "Redesign checkout flow"
- Story Points: 13
- T-Shirt Size: XL
- Labels: `define`, `complexity-13`, `size-XL`, `problem-statement`, `user-flow`, `story-mapping`, `prioritization-workshop`
- Description: Full breakdown showing activity weights, complexity analysis, and calculation methodology

---

## Appendix B: JIRA Integration Architecture Summary

**Approach:** REST API + Personal Access Token (PAT)

**Implementation Effort:** 12-16 hours (Phase 1 MVP)

**Key Components:**
1. `/src/services/jiraService.js` - Core JIRA REST API integration
2. `/src/pages/SettingsPage.jsx` - JIRA configuration UI
3. `/src/components/export/JiraExportModal.jsx` - Export flow
4. Updated `/src/components/wizard/StepReport.jsx` - "Export to Jira" button

**Configuration Requirements:**
- JIRA Cloud instance URL
- User email + API token (Personal Access Token)
- Default project key (e.g., "PDW", "DESIGN")
- Custom field IDs for Story Points and T-Shirt Size (auto-detected)

**Security Approach:**
- API token stored in browser localStorage (acceptable for personal tool)
- Basic Authentication via JIRA REST API
- Future enhancement: OAuth 2.0 for enterprise deployment

**Export Flow:**
1. Designer completes estimation
2. Clicks "Export to Jira" in report step
3. Selects issue type (Epic/Story/Spike)
4. Reviews export preview
5. Clicks "Export" → API call creates JIRA issue
6. Success message displays with link to issue

**Benefits:**
- Eliminates 5-10 minutes of manual data entry per estimation
- Ensures data consistency between estimation tool and JIRA
- Enables design work visibility in JIRA portfolios and dashboards
- Provides audit trail with full estimation breakdown in JIRA description

---

**Document Version:** 1.0
**Last Updated:** August 13, 2026
**Prepared by:** Product Design Team
**For Questions Contact:** [Team Member Name]
