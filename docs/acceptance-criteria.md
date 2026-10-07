# Acceptance Criteria by Phase

Guidance for the Acceptance Criteria field (a free-text field in Jira) that a product designer adds when scoping work in step 1.

## Is the field needed in every phase?

No. Acceptance Criteria (AC) is most useful where the work produces something that can be verified as done. It matters less where the work produces learning.

| Phase | AC needed? | Why |
|---|---|---|
| **Discovery** | Optional (use a lighter form) | Discovery ends in learning, not a shippable thing. Pass/fail criteria often force false precision. |
| **Define** | Light | The output is a decision or artifact, so AC confirms it exists and was agreed. |
| **Design** | **Yes** | A deliverable with testable quality conditions. |
| **Deliver** | **Yes** | Design meets engineering here, so ambiguity becomes rework. |

## Minimum a designer should write

### Discovery
Use a learning goal or exit condition instead of AC.

- The research question(s) to be answered
- Minimum evidence needed, e.g. "N participants" or "sources reviewed"
- Findings are shared with the team, with a named playback

### Define
- The problem statement or brief is written and signed off by the PM and key stakeholders
- Scope is explicit, with what's in and what's out
- Success measures or metrics are named
- Open questions are logged with an owner

### Design
- Covers all agreed flows and screens, including states (empty, error, loading) and key edge cases
- Uses design system components, and any new or custom components are flagged
- Meets accessibility basics (contrast, focus order, labels, WCAG level)
- Validated with users or stakeholders, with feedback addressed or logged
- Specs and annotations are complete enough to build from
- Design review is approved by a named reviewer

### Deliver
- Developer handoff is complete and open questions are answered
- The build matches the design, confirmed in a design QA pass
- Discrepancies are logged and triaged, with only agreed deviations left
- Responsive and accessibility behavior is verified in the build
- Designer sign-off is given before release

## Recommendation for the app

1. **Required for Design and Deliver, optional for Discovery and Define.** Show the field only when one of those phases is selected.
2. **Relabel by phase.** Use "Learning goal / exit condition" for Discovery and "Acceptance Criteria" for the others, so the prompt fits the work.
3. **Add a hint under the field** with two or three starter bullets from the lists above. A blank text box usually gets vague criteria.
4. **Keep it plain text.** Jira's field is free text, so a bulleted checklist or Given/When/Then convention is enough.

## Decision

The field appears **once per project** in step 1, not once per phase. Because one field covers every selected phase, the label and hint need to adapt to the phases chosen (see recommendations 1 and 2). Jira holds AC per ticket, so if the app later maps phases to separate tickets, revisit this.
