# How Story Points & T-Shirt Sizes Are Calculated

This document explains the exact formula the Work Estimator tool uses to turn your inputs into a Story Point score and a T-shirt size. It's meant to be shared with operations/planning teams so estimates can be understood and trusted, not treated as a black box.

The score is built from three inputs you provide, combined into one number, which is then mapped onto a standard Fibonacci scale and a T-shirt size.

---

## Step 1: Complexity Assessment (Base Score)

You rate the work across up to four dimensions. Each rating is Low (1 point), Medium (2 points), or High (3 points).

| Dimension | Required? | What it measures |
|---|---|---|
| Problem/Solution Ambiguity | Yes | How well-defined the problem or solution is |
| Artifact/Deliverable Complexity | Yes | How complex the outputs/artifacts are |
| Stakeholder/Dependency Risk | Yes | How many people/teams need to align, and dependency risk |
| Iteration Likelihood | Optional | How likely significant rework/iteration is |

**Base Score = sum of the ratings you select** (e.g., Medium + High + Medium + Low = 2+3+2+1 = 8).

---

## Step 2: Activity Score

You select the specific activities involved in the work (e.g., "User interviews," "Wireframing," "Design system work"). Each activity has a **default weight from 1–3**, which can be nudged up or down by ±1 per activity (still capped between 1 and 3) if it's unusually simple or complex for this project.

The weights of all selected activities are summed into a **Total Weight**, which is then converted into an **Activity Score contribution**:

| Total Weight | Activity Score |
|---|---|
| 0–3 | +0 |
| 4–8 | +1 |
| 9–15 | +2 |
| 16–24 | +3 |
| 25+ | +4 |

More activities, or heavier/more complex activities, push this contribution higher.

---

## Step 3: Duration Factor

The number of weeks you estimate the work will take also feeds into the score, since longer timelines tend to correlate with more unknowns:

| Weeks Entered | Duration Factor |
|---|---|
| 0–2 weeks | +0 |
| 3–5 weeks | +1 |
| 6–10 weeks | +2 |
| 11+ weeks | +3 |

---

## Step 4: Total Score → Fibonacci Story Points

**Total = Base Score (Step 1) + Activity Score (Step 2) + Duration Factor (Step 3)**

The Total is then mapped onto a standard Fibonacci-style scale:

| Total Score | Story Points |
|---|---|
| ≤ 4 | 1 |
| 5–6 | 2 |
| 7–8 | 3 |
| 9–11 | 5 |
| 12–15 | 8 |
| 16+ | 13 |

> ⚠️ **A score of 13 is a signal, not just a number.** The tool flags this as likely too large and recommends splitting the work into smaller Discovery, Define, or Design items.

---

## Step 5: Story Points → T-Shirt Size

| Story Points | T-Shirt Size |
|---|---|
| 1–2 | XS |
| 3 | S |
| 5 | M |
| 8 | L |
| 13 | XL |

---

## Step 6: Recommended Duration (Sanity Check)

Based on the final Story Point score, the tool also suggests a realistic week range and flags your entered duration if it's significantly off:

| Story Points | Recommended Weeks |
|---|---|
| 1–2 | 1–2 weeks |
| 3 | 2–3 weeks |
| 5 | 3–5 weeks |
| 8 | 5–8 weeks |
| 13 | 8–12 weeks |

The tool allows roughly **±30% tolerance** around this range before warning that an estimate looks too short or too long for the calculated complexity.

---

## Overrides

Both the Story Point score and the T-shirt size can be manually overridden in the tool, but doing so requires entering a reason — this is captured in the final output so reviewers can see what was calculated vs. what was adjusted and why.

---

## Worked Example

- Ambiguity: Medium (2), Artifact Complexity: High (3), Stakeholder Risk: Medium (2), Iteration: not rated → **Base Score = 7**
- Activities selected: "User interviews" (weight 2), "Journey map creation" (weight 3), "Wireframing" (weight 2) → Total Weight = 7 → **Activity Score = +1**
- Duration entered: 4 weeks → **Duration Factor = +1**
- **Total = 7 + 1 + 1 = 9 → Story Points = 5 → T-Shirt Size = M**
- Recommended duration for a 5-point item: 3–5 weeks (the 4-week estimate fits, no warning shown)

---

*Source of truth: `src/utils/calculations.js` and `src/utils/constants.js` in the Work Estimator codebase. If those files change, this document should be updated to match.*
