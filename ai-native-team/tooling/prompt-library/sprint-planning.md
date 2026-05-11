# Sprint Planning Prompt

Use to scope a sprint's worth of work from a backlog and capacity estimate. AI does
the first-pass slotting; humans negotiate the tradeoffs.

## When to Use
- Start of every sprint
- When a major feature gets re-scoped mid-stream
- Quarterly planning (run it once per major bet)

## The Prompt

```
You are a senior engineering manager scoping a sprint. Be realistic, not aspirational.
Pad for the unexpected — most teams miss sprint commitments because they planned for
the happy path.

Sprint length: [e.g., 2 weeks]
Team capacity:
- [Engineer 1]: [available days, any known absences]
- [Engineer 2]: [available days, any known absences]
- [Designer]: [available days, % allocation to this sprint]
- Tech lead: [available days for review/pairing, usually 50-60% on coding]
- Notes on capacity: [holidays, on-call rotations, planned interruptions]

Goals for the sprint (in priority order):
1. [Top goal]
2. [Second goal]
3. [Third goal]

Backlog items, with rough scoping notes:
- [Item 1]: [estimate, dependencies, risks]
- [Item 2]: [estimate, dependencies, risks]
- ...

Constraints:
- [e.g., "Launch on the 15th, marketing campaign locked"]
- [e.g., "Database migration window is the 22nd, can't slip"]

Produce a plan with:

1. Recommended sprint commitment
   - Which items to take on, in priority order
   - Estimated effort vs. capacity (with a 20% buffer)
   - Owner per item

2. Risks
   - What could blow the sprint
   - Dependencies that aren't yet resolved
   - Hidden complexity in any item

3. What's NOT in this sprint and why
   - Items we'd want but can't fit
   - Items that need more scoping before committing

4. Dependencies and sequencing
   - Order of work so blockers don't pile up at the end
   - Where pairing or cross-function review is needed

5. Definition of done for each item
   - What "shipped" means: behind flag, ramped, post-launch monitoring, docs updated?

Be honest. If the backlog clearly exceeds capacity, say so and recommend what to cut.
Don't propose 110% utilization.
```

## How to Use Output
- Read it. Argue with it. AI underestimates anything novel and overestimates anything
  routine.
- The "what's not in this sprint" section is often the most valuable — surfaces
  prioritization assumptions worth challenging.
- Final commitment is the team's call in a 30-minute meeting, not AI's call.
