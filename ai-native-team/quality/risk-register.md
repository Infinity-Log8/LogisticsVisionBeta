# Risk Register

The three structural risks of an AI-native team. Each is real, each has happened
at real teams. The mitigations are what separate teams that get the AI multiplier
from teams that get an AI mess.

## Risk 1: Quality Drift

**What it is:** The team starts rubber-stamping AI output instead of critically
reviewing it. Output volume goes up, output quality goes down, and nobody notices
until customers do.

**Why it happens:**
- AI output looks competent on first read
- Reviewing carefully is slower than approving
- Time pressure makes "looks fine" feel acceptable
- Team starts trusting AI's confidence rather than verifying its claims

**Early warning signs:**
- PR review comments getting shorter and less substantive over time
- Designer crit becoming "looks good" without specifics
- Content getting published without anyone able to recall reading the draft
- Customer-facing artifacts that nobody on the team is proud of

**Mitigations:**
- Quality gates in `/quality/quality-gates.md` — explicit human review required
- Weekly quality audit — randomized sample, pulled from the actual week's output
- Culture norm: "I'd reject this if a human wrote it" is the bar for AI output too
- Tech lead and strategic marketer specifically empowered to halt the line
- Track review-comment density as a soft metric — declining trend triggers a retro

**Severity:** High. This is the #1 way the AI-native bet fails.

---

## Risk 2: Homogenization

**What it is:** Everything the team produces starts to look and sound like everything
every other AI-native team produces. The brand becomes generic. The product feels
familiar. The content reads like every Substack newsletter.

**Why it happens:**
- AI models converge on common patterns from their training data
- Designers use similar Figma plugins and Midjourney prompts as everyone else
- Marketers use the same content frameworks fed into the same models
- Engineers default to the same architectural patterns AI suggests

**Early warning signs:**
- A customer or hire says "this reminds me of [competitor]" about a piece of work
- Designers can't articulate what's distinctive about the brand
- A marketer's piece could be republished under a competitor's byline without rewriting
- The product looks like it was generated, not designed

**Mitigations:**
- Hire for diverse backgrounds (industry, geography, prior employers)
- Cross-industry inspiration sources — read trade press in adjacent verticals, study
  brands outside SaaS
- Deliberate creative friction — sometimes throw out the AI draft and start blank
- Brand designer has explicit veto power on "looks generic"
- Quarterly "anti-pattern audit": review three pieces of recent work next to three
  competitors' work; if they're indistinguishable, fix it

**Severity:** Medium-High. Less catastrophic than quality drift but kills the brand
over 12-18 months.

---

## Risk 3: Over-Reliance on AI Judgment

**What it is:** The team starts deferring hard decisions to AI instead of using AI
to inform human decisions. Specifically, AI generates options and the team picks
without arguing.

**Why it happens:**
- AI sounds confident, even when it's wrong
- Disagreeing with AI feels like work; agreeing is fast
- AI output has implied authority — "the model said..."
- Skipping debate feels like efficiency

**Early warning signs:**
- Roadmap decisions cite "the AI's recommendation" as supporting evidence
- Design decisions made by picking the first AI variation that looks ok
- Architecture decisions made by accepting AI's default pattern without trade-off discussion
- Hiring decisions based on AI screening with light human verification

**Mitigations:**
- Clear decision ownership: every significant decision has a named human accountable
- AI generates options; humans pick. The pick is documented with rationale.
- Decision Log (`/memory/DECISION-LOG.md`) requires an "alternatives considered"
  column — forces the question "did we actually consider alternatives?"
- Cultural norm: "what does the AI say" is fine as input, not as an argument
- Tech lead and PM specifically trained to push back on AI-as-authority framing

**Severity:** Medium. Slower-moving but compounds — teams become unable to make
hard calls without AI cover.

---

## Review Cadence
This register gets reviewed quarterly. New risks added as they're identified.
Mitigations adjusted based on what's working and what isn't.

A risk that's been "monitored" for three quarters without incident may not be a
real risk for our team — consider archiving it.
A new failure mode that recurs three times moves up the severity ladder.
