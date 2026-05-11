# The First Sprint

A two-week sprint designed for the team's first time working together. The goal
is not to ship a major feature — it's to build cross-functional trust, exercise
every AI-augmented workflow, and surface friction early.

## Pre-Sprint Setup (Week 0)

- Everyone reads `CLAUDE.md`, `/team/`, `/workflows/`, and `/quality/quality-gates.md`
  in their first two days
- Tooling provisioning: every team member has Claude, Figma, Linear (or Notion),
  GitHub, Slack — all working — by their start date
- Each person sets up a personal prompt notebook and seeds it from `/tooling/prompt-library/`
- Kick-off conversation: 60 minutes, full team. Topic: "What does great look like
  in this sprint?" No status, no plans. Just alignment on standards.

## Sprint Goal

Ship one small but real customer-facing improvement, end-to-end through the full
feature lifecycle, using every quality gate and every workflow. The work should:
- Be small enough to ship in two weeks with buffer
- Be real enough that customers will notice
- Touch all three functions (design, eng, marketing)
- Have measurable impact (a metric we can check post-launch)

**Example sprint goals** (pick one or adapt):
- Redesigned onboarding flow with launch announcement
- New pricing page with positioning refresh
- Improved error states across the top 3 customer flows
- A new content series launched alongside a small product change

## Two-Week Sprint Shape

### Week 1
- **Monday:** Cross-functional kickoff. PM presents the discovery brief (AI-drafted,
  human-finalized). Whole team debates and agrees on scope.
- **Tuesday:** Spec written (PM + designer + tech lead pair). Engineering scopes.
  Designer starts flows.
- **Wednesday:** Designer reviews flows with team. Engineers start building. Marketer
  starts the positioning brief and outline for the launch piece.
- **Thursday:** Mid-week function reviews. WIP demos in shared channel. Async feedback.
- **Friday:** End-of-week check-in. AI-generated week digest reviewed in retro.
  Agree on one adjustment for week 2.

### Week 2
- **Monday:** Re-plan based on what's left. Tighten scope if needed.
- **Tuesday-Wednesday:** Build continues. QA in parallel. Launch assets drafted.
- **Thursday:** Code complete. Internal demo. Visual QA, content review, final
  spec verification.
- **Friday:** Ship. Coordinated release. Launch content goes live.

## What Each Function Practices

**Engineering:**
- Pairing with AI on code
- Running the code-review prompt before requesting human review
- Writing tests AI helped generate, verifying they test behavior
- One person does the deployment, in front of the team, narrating

**Design:**
- Using AI for layout exploration; designer picks the keeper
- Running the design-review prompt before sharing with engineering
- Adding one component to the design system v0
- Visual QA against real implementation

**Marketing:**
- Using the content-brief prompt to convert spec → brief
- Drafting the launch post with AI, editing for voice
- Strategic marketer reviews against positioning before publish
- Running the customer-feedback-synthesis prompt against any feedback we have

**PM (or whoever covers PM):**
- Running discovery using the customer-feedback synthesis
- Drafting the spec with AI, then sharpening
- Orchestrating cross-functional review windows
- Writing the internal launch brief

## Quality Gates In Effect

Every gate from `/quality/quality-gates.md` runs in this sprint. Specifically:
- Every PR has a human reviewer
- Every design decision passes the taste check
- Every published piece passes editorial review
- Friday of week 2: first quality audit, even with this small body of work

## Retro (End of Week 2)

90 minutes. Whole team. Reviewed material:
- Cycle time from idea to ship
- Output volume per function
- Quality findings from the audit
- Anonymous survey results (the four ROI satisfaction questions)

Three questions:
1. What surprised us about working this way?
2. Where did AI actually save us time? Where did it cost us time?
3. What's the one workflow change for sprint 2?

Document everything in `/memory/SESSION-LOG.md` and `/memory/DECISION-LOG.md`.

## What Success Looks Like

Not "we shipped a perfect feature." Success looks like:
- Every workflow got exercised at least once
- The team can articulate where AI helped and where it didn't
- Quality gates caught something — even one thing
- The team is excited to do sprint 2, with clearer ideas about how
