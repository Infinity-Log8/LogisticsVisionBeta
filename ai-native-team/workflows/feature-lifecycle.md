# Feature Lifecycle

How a feature moves from idea to launch. Seven stages, each with explicit
human and AI roles. No stage is skippable, but most are days, not weeks.

## 1. Discovery
**Who:** PM + Senior Product Designer + Strategic Marketer
**Duration:** 1-3 days
**Goal:** Define the problem worth solving.

- AI synthesizes customer feedback, support tickets, sales call notes, and
  competitive signal into a 1-page problem brief
- PM/Designer/Marketer read it and add what's missing
- Output: a one-page problem statement with a clear "who, what, why now"

## 2. Spec
**Who:** PM (drives), Designer (flows), Engineer (scope)
**Duration:** 2-5 days
**Goal:** Make the bet concrete enough to build.

- PM uses AI to draft the spec from the problem brief; rewrites for clarity
- Designer creates user flows and key states (using AI for layout variations)
- Engineer reads the spec and scopes — flags anything that turns 1 week into 3
- Output: spec + flows + scope estimate. Reviewed by all three functions.

## 3. Build
**Who:** Engineering (drives), Design (reviews in-progress)
**Duration:** Depends on scope, usually 1-3 weeks
**Goal:** Working software that matches the spec.

- Engineers pair with AI for code, tests, refactoring
- Daily WIP demo in shared channel — designers and PM can comment async
- Designer reviews at 50% and 90% — catches drift before it's expensive to fix
- All AI-generated code reviewed by a human engineer before merge

## 4. QA
**Who:** Engineering (drives), Designer (visual QA), PM (acceptance)
**Duration:** 1-3 days
**Goal:** It actually works, including the edge cases.

- AI runs the automated test suite and flags coverage gaps
- AI generates an edge-case checklist from the spec
- Humans do exploratory testing — break it on purpose
- Designer reviews on real devices, not just Figma

## 5. Launch Prep
**Who:** Marketing (drives), Designer (assets), PM (positioning)
**Duration:** 2-5 days, runs in parallel with QA
**Goal:** A launch the world actually notices.

- Content marketer uses AI to draft launch post, email, social copy, and FAQ
- Strategic marketer reviews against positioning and brand voice
- Designer produces launch assets (often AI-generated, human-curated)
- PM writes internal launch brief (what we're saying, where, when, why)

## 6. Ship
**Who:** Engineering (releases), Marketing (publishes), PM (orchestrates)
**Duration:** Same day
**Goal:** Coordinated release with monitoring.

- Feature rolls out behind flag, ramps gradually
- DevOps monitors error rates, latency, and key product metrics
- Marketing publishes on the schedule — not before the flag is at 100%
- Anyone can halt the rollout. No blame for halting.

## 7. Learn
**Who:** Whole team
**Duration:** 1 week post-launch + ongoing
**Goal:** Did it work? What did we learn?

- AI aggregates first-week metrics, support tickets, social mentions
- Team reviews at the next Monday sync — 10 minute slot
- Insights logged in `/memory/DECISION-LOG.md` if they change how we work
- Failures get a written post-mortem; successes get a short note on what to repeat
