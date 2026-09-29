# Extending the Work Estimator: Role Research (PM, Frontend, Backend) — Draft for Team Review

This is a first-draft hypothesis, not a final spec. It's meant to give your team a concrete starting point to react to, argue with, and correct — not to be adopted as-is. Stage names, activity lists, and complexity weights below are grounded in common Scrum/Jira conventions and typical team practice, but every real org bends these differently. Treat the weights especially as placeholders calibrated by analogy to the Product Design model, not as measured data.

---

## 1. Product Manager

### 1.1 How PM work is typically decomposed

PM work doesn't map cleanly onto a single delivery pipeline the way design or engineering does, because a PM operates across multiple time horizons simultaneously (strategy, quarter, sprint, release). Most agile shops still describe it with stages resembling:

- **Discovery** — problem validation, market/customer research, opportunity sizing
- **Definition** — requirements, PRD writing, scoping, prioritization
- **Planning** — roadmap placement, sprint/release planning, alignment with stakeholders and dependent teams
- **Execution/Delivery Support** — backlog grooming, unblocking engineering, acceptance criteria review, in-flight scope calls
- **Launch & Post-Launch** — go-to-market coordination, launch readiness, success metrics review, retro

Jira shops commonly represent this as Epics owned by PM (often tagged to a quarter or OKR) containing Stories that PM writes but engineering executes; PM's own "tickets" are less standardized than engineering's — many teams don't ticket PM work at all, or track it informally in a roadmap tool (Aha!, ProductBoard, Notion) rather than Jira. This is a meaningful contrast with Product Design, which already has a clean ticketed activity model in your tool.

### 1.2 Candidate activities by stage

**Discovery**
| Activity | Weight | Rationale |
|---|---|---|
| Market/competitive analysis | 2 | Requires synthesis across multiple sources, but templated |
| Customer interviews (PM-led) | 2 | Similar effort to design research interviews |
| Opportunity sizing / TAM-SAM-SOM | 3 | Requires data gathering + judgment calls, often contested |
| Problem statement definition | 2 | Framing work, iterates with stakeholders |
| Success metrics / KPI definition | 2 | Needs alignment across teams, not just internal thinking |

**Definition**
| Activity | Weight | Rationale |
|---|---|---|
| PRD / spec writing | 2 | Core deliverable, but templated for most teams |
| Requirements gathering from stakeholders | 2 | Multiple conversations, potential conflicting asks |
| Acceptance criteria authoring | 1 | Usually derived directly from PRD |
| Scope cut / MVP definition | 3 | High-stakes tradeoff calls, frequently revisited |
| Feasibility check with Eng/Design | 1 | Short sync, low individual effort |

**Planning**
| Activity | Weight | Rationale |
|---|---|---|
| Roadmap prioritization | 3 | Cross-functional negotiation, competing priorities |
| Stakeholder alignment / buy-in | 3 | Political complexity, iterative, hard to timebox |
| Backlog grooming | 1 | Routine, recurring, low ambiguity |
| Dependency mapping across teams | 2 | Requires coordination but usually procedural |
| Release planning | 2 | Coordination-heavy but templated per cycle |

**Execution/Delivery Support**
| Activity | Weight | Rationale |
|---|---|---|
| Sprint/story clarification for engineering | 1 | Reactive, quick turnaround |
| Scope/tradeoff decisions mid-sprint | 3 | High ambiguity, real-time judgment under pressure |
| Cross-team dependency unblocking | 2 | Coordination overhead, variable difficulty |
| Stakeholder status updates/reporting | 1 | Low ambiguity, mostly communication overhead |

**Launch & Post-Launch**
| Activity | Weight | Rationale |
|---|---|---|
| Launch readiness review | 2 | Checklist-driven but cross-functional coordination |
| Go-to-market coordination (sales/marketing/support enablement) | 3 | Many stakeholders, high dependency risk |
| Post-launch metrics review | 2 | Requires data analysis and interpretation |
| Retro / lessons learned | 1 | Structured, low ambiguity |

### 1.3 Epic/Story/Spike/Bug/Task mapping nuances

- PM Epics often map 1:1 to OKRs, initiatives, or roadmap themes rather than to a single deliverable — this is a structural difference from Design/Eng epics, which usually map to a feature or project.
- PMs rarely author "Spikes" themselves; spikes are typically requested by PM but executed and ticketed by engineering.
- PM work is frequently *not* ticketed at all in Jira — it lives in roadmap docs, PRDs, or planning tools, with only the "downstream" engineering/design work turned into tickets. This means the tool may need to decide whether it's estimating PM's own labor or PM's *ticketed* labor, which could be a much smaller subset.
- "Bugs" essentially don't apply to PM in the traditional sense — the closest analog is a "misaligned requirement" or "scope gap" discovered post-launch, which most teams don't ticket as a bug.
- Tasks for PM tend to be catch-all admin/coordination items (updating a roadmap slide, scheduling an exec review) that don't fit the Story model well.

---

## 2. Frontend Developer

### 2.1 How FE work is typically decomposed

Frontend work maps more naturally onto a standard engineering pipeline, commonly expressed in Jira/Scrum shops as:

- **Design/Spec Review** — translating design handoff into technical requirements
- **Technical Design/Spike** — architecture decisions, unknowns resolution (state management approach, library choice, feasibility spikes)
- **Build/Implementation** — component development, integration with APIs
- **Test & QA** — unit/integration/visual/cross-browser/accessibility testing
- **Review & Polish** — code review, performance tuning, responsive/edge-case fixes
- **Deploy/Release** — feature flagging, staged rollout, monitoring
- **Maintain** — bug fixes, tech debt, dependency upgrades

### 2.2 Candidate activities by stage

**Design/Spec Review**
| Activity | Weight | Rationale |
|---|---|---|
| Design handoff review (Figma inspection) | 1 | Usually straightforward if design is well-specified |
| API contract review with backend | 2 | Requires negotiation if contract isn't finalized |
| Technical feasibility assessment | 2 | May surface unknowns requiring escalation |

**Technical Design/Spike**
| Activity | Weight | Rationale |
|---|---|---|
| Component architecture design | 2 | Structural decisions with downstream impact |
| State management design | 3 | High ambiguity, affects whole feature area |
| Spike: new library/pattern evaluation | 3 | Explicitly time-boxed unknown-unknowns work |
| Data-fetching/caching strategy | 2 | Usually has established patterns to follow |

**Build/Implementation**
| Activity | Weight | Rationale |
|---|---|---|
| Static UI component build | 1 | Templated, low ambiguity |
| Interactive component build (forms, modals, complex widgets) | 2 | More edge cases and state to manage |
| API integration | 2 | Dependent on backend readiness/contract stability |
| Animation/micro-interaction implementation | 2 | Fiddly, cross-browser variance |
| Responsive layout implementation | 2 | Multiple breakpoints, device variance |

**Test & QA**
| Activity | Weight | Rationale |
|---|---|---|
| Unit test authoring | 1 | Templated once component is built |
| Cross-browser testing | 2 | Variable effort depending on browser support matrix |
| Accessibility audit (a11y) | 2 | Requires specialized knowledge, iterative fixes |
| Visual regression testing | 1 | Often automated/tooled |
| E2E/integration testing | 2 | Coordination with QA/backend, flaky test risk |

**Review & Polish**
| Activity | Weight | Rationale |
|---|---|---|
| Code review (own PR through review cycle) | 1 | Routine but can loop several times |
| Performance optimization (bundle size, rendering) | 3 | Deep investigation, hard to bound scope |
| Edge case / error state handling | 2 | Often discovered late, scope creep risk |

**Deploy/Release**
| Activity | Weight | Rationale |
|---|---|---|
| Feature flag setup/rollout | 2 | Coordination with product/backend on rollout plan |
| Staged rollout monitoring | 1 | Mostly observation, low active effort |
| Release notes/documentation | 1 | Low ambiguity |

**Maintain**
| Activity | Weight | Rationale |
|---|---|---|
| Dependency/library upgrades | 2 | Can cascade into breaking changes |
| Bug triage & fix | 2 | Variable — could be trivial or a deep investigation |
| Tech debt refactor | 3 | Open-ended scope, hard to bound |

### 2.3 Epic/Story/Spike/Bug/Task mapping nuances

- Spikes are a first-class, common ticket type for FE — used explicitly for time-boxed technical unknowns (e.g., "evaluate state management library") before a Story is written. This is much more common than in Design or PM work.
- Stories for FE are frequently split along technical seams (component-level) rather than user-journey seams, which can make them narrower and more numerous than a comparable Design or PM story.
- Bugs are a large, ongoing category for FE in a way that barely exists for PM and exists differently for Design (Design "bugs" are usually visual QA/desk-check findings, not runtime defects).
- Tasks often capture non-feature work: tooling setup, CI/CD changes, dependency bumps — these may need their own bucket in the estimator rather than being folded into "Activities."
- Epics for FE are usually feature-scoped and shared with backend/PM under one umbrella epic, rather than owned independently — worth deciding whether the estimator is scoping FE work per-epic or per-shared-feature-epic.

---

## 3. Backend Developer

### 3.1 How BE work is typically decomposed

Backend work follows a similar engineering pipeline to Frontend, but with more emphasis on data/systems design and operational concerns:

- **Design/Spec** — API contract design, data modeling, system design
- **Spike** — technical unknowns (new integration, performance approach, scaling question)
- **Build/Implementation** — service/endpoint development, business logic, data layer
- **Test** — unit, integration, load/performance testing
- **Review & Hardening** — code review, security review, error handling
- **Deploy/Release** — migrations, feature flags, staged rollout
- **Operate/Maintain** — monitoring, incident response, on-call, tech debt

### 3.2 Candidate activities by stage

**Design/Spec**
| Activity | Weight | Rationale |
|---|---|---|
| API contract design | 2 | Needs FE alignment, but usually follows team conventions |
| Database schema design | 3 | High downstream impact, hard to change later |
| System/service architecture design | 3 | Cross-cutting decisions, significant ambiguity |
| Data modeling for new feature | 2 | Scoped to feature, moderate complexity |

**Spike**
| Activity | Weight | Rationale |
|---|---|---|
| Third-party integration feasibility spike | 3 | Genuine unknown-unknowns, vendor dependency risk |
| Performance/scaling approach spike | 3 | Requires experimentation, uncertain outcome |
| New technology/framework evaluation | 2 | Bounded scope if time-boxed properly |

**Build/Implementation**
| Activity | Weight | Rationale |
|---|---|---|
| CRUD endpoint implementation | 1 | Templated, low ambiguity |
| Business logic implementation (non-trivial rules) | 2 | Domain complexity varies |
| Database migration authoring | 2 | Risk of data loss/downtime if mishandled |
| Third-party service integration | 2 | Dependent on external API reliability/docs quality |
| Event/queue/async workflow implementation | 3 | Concurrency and failure-mode complexity |
| Authentication/authorization implementation | 3 | High security stakes, easy to get subtly wrong |

**Test**
| Activity | Weight | Rationale |
|---|---|---|
| Unit test authoring | 1 | Templated once logic is built |
| Integration testing | 2 | Cross-service coordination |
| Load/performance testing | 3 | Requires environment setup, interpretation of results |
| Security testing / vulnerability scanning | 2 | Often tool-assisted but requires triage |

**Review & Hardening**
| Activity | Weight | Rationale |
|---|---|---|
| Code review | 1 | Routine but can loop |
| Security review | 2 | Specialized, higher stakes than typical review |
| Error handling / resilience (retries, circuit breakers) | 2 | Requires thinking through failure modes |

**Deploy/Release**
| Activity | Weight | Rationale |
|---|---|---|
| Database migration execution/rollout | 3 | High risk if production data involved |
| Feature flag rollout | 2 | Coordination with FE/product on staged rollout |
| Deployment pipeline changes | 2 | Can affect whole team if misconfigured |

**Operate/Maintain**
| Activity | Weight | Rationale |
|---|---|---|
| Monitoring/alerting setup | 2 | Requires judgment on thresholds, ongoing tuning |
| Incident response / on-call fix | 3 | High pressure, unpredictable scope |
| Tech debt / refactor | 3 | Open-ended, easy to underscope |
| Dependency/library upgrades | 2 | Can cascade into breaking changes |

### 3.3 Epic/Story/Spike/Bug/Task mapping nuances

- Spikes are very common and often formalized (many teams have an explicit "Spike" issue type in Jira with its own workflow and a hard timebox) — more so than in FE, because backend unknowns (data volume, integration reliability, scaling behavior) are harder to assess by inspection alone.
- Backend epics are frequently platform/infrastructure-scoped rather than feature-scoped (e.g., "Migrate to new payment provider") distinct from the feature epics shared with FE/PM — teams often run two parallel epic tracks (feature epics + platform/infra epics), which Design and PM don't typically have an equivalent of.
- Bugs for BE skew toward production incidents and data integrity issues, which can carry much higher severity/urgency weighting than a typical FE or Design bug — some teams score BE bugs on a completely separate severity scale (SEV1-5) rather than story points.
- Tasks often include invisible operational work (monitoring setup, on-call rotation prep, infra maintenance) that doesn't map to a "feature" at all — if the estimator is meant to size a specific feature/project, it may need to exclude or separately flag this category since it doesn't scale with feature complexity the way most activities do.
- Stories for BE are sometimes split by "layer" (API layer, data layer, service layer) rather than by user-facing capability — this cross-cutting decomposition may not fit the estimator's existing per-activity checklist model as cleanly as Design's more linear Discovery→Delivery flow.

---

## 4. Open Questions for the Team to Validate

These are the places where real-world practice varies the most by org, team maturity, and tooling — and where this research should not be trusted as ground truth:

1. **Is PM work ticketed at all in your org?** Many teams track PM work in roadmap tools (ProductBoard, Aha!, Notion) rather than Jira, in which case the "activities checklist" model may not map to how PMs actually track their own time.
2. **Do FE and BE share a combined "Engineering" epic per feature, or separate epics?** This affects whether the estimator should produce one combined score or two role-specific scores per feature.
3. **How formalized are Spikes in your team's workflow?** Some teams use a dedicated "Spike" issue type with strict timeboxing; others just fold exploratory work into a Story's first day. This changes whether "Spike" activities need their own weighting logic distinct from build activities.
4. **Does your org have a separate incident/on-call ticketing system?** If so, BE's "Operate/Maintain" activities (which don't scale with feature complexity) might need to be excluded from this estimator entirely rather than force-fit into the complexity model.
5. **How much variance is there between BE work "layers" (API/data/service) at your company** — does a single engineer typically own a feature end-to-end, or are these split across specialists? This affects whether the activity list should be presented as one flat checklist or grouped by layer.
6. **Severity/urgency scoring for bugs** — should BE/FE bugs use the same story-point-based complexity model as new feature work, or a separate severity scale, given how differently bug triage typically works from planned feature work?
7. **Does PM's "activity" list even belong in the same tool?** Given how much PM work is coordination/communication rather than a bounded deliverable, it's worth validating with actual PMs whether a checklist-of-activities model captures their effort meaningfully, or whether it needs a fundamentally different estimation approach (e.g., stakeholder-count-based rather than activity-based).
8. **Terminology drift across teams** — "Discovery," "Spike," and "Definition" mean different things at different companies (and even different teams within the same company). Before finalizing stage names, confirm they match the vocabulary already used in your Jira workflows, since mismatched terminology will undermine adoption more than any weighting inaccuracy.

Recommend validating all of the above directly with 1-2 PMs, 1-2 FE engineers, and 1-2 BE engineers on your team before locking in stage names, activity lists, or default weights.
