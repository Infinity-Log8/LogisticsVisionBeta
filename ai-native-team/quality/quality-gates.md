# Quality Gates

Explicit checkpoints designed to prevent AI quality drift — the slow erosion that
happens when a team produces more volume but stops looking at each piece critically.

## Universal Rule
**No AI output ships without human review.** Not a single line of customer-facing
code, design, copy, or external communication. This is a hard rule, not a guideline.

If the team starts treating AI output as ship-ready, the bet on AI-native fails. The
whole multiplier comes from humans editing and judging output — not from volume.

## Design Quality Gate

**The Taste Check:** Every AI-generated component, asset, or layout gets reviewed
by the senior designer before it ships. The check is:
- Does this feel like our product?
- Would I be proud to have this as my work?
- Is there a generic AI tell — the slight blandness, the perfect symmetry, the
  cliché composition?

**Specific checks:**
- Component variations: senior designer signs off in Figma before promotion to library
- Brand assets: brand designer reviews — generic-looking assets get rejected, not iterated
- Marketing visuals: brand designer + strategic marketer both approve before publish
- Generative imagery: never used without disclosure if it's photorealistic of people

## Engineering Quality Gate

**Code review parity:** AI-generated code gets the same review rigor as human-written
code. In practice, it gets *more* scrutiny because:
- AI code often looks plausible but contains subtle errors
- AI tends toward over-engineering — flag it
- AI may import patterns from training data that don't fit this codebase

**Specific checks:**
- Every PR has at least one human reviewer (preferably the tech lead or a senior engineer)
- AI-generated tests need a human to verify they test behavior, not implementation
- Any AI suggestion that touches auth, payments, or data access requires two reviewers
- AI-drafted ADRs and RFCs require the tech lead's sign-off before being treated as decided

**The "if I had to debug this at 3am" test:** would a sleep-deprived on-call engineer
understand this code? If not, refactor for clarity.

## Marketing Quality Gate

**Editorial review:** Every AI-drafted content piece passes through the strategic
marketer (or a designated editor) before publication. The check is:
- Does this sound like us, or like a generic SaaS company?
- Is every claim true and citable?
- Did we cut the AI-isms? ("In today's fast-paced world...", "It's no secret that...",
  "Let's dive in...")
- Would this persuade a skeptical reader, or only a friendly one?

**Specific checks:**
- Blog posts and essays: strategic marketer approves before publish
- Product launch copy: PM + strategic marketer + designer all sign off
- Paid ad copy: strategic marketer + data marketer approve creative + targeting
- Social posts: content marketer can ship; strategic marketer reviews weekly batch

## Weekly Quality Audit

**Cadence:** Friday, 30 minutes. Part of the weekly retro.
**Format:** Pick 5 random pieces of AI-assisted output from the week (across functions).
Review them collectively.

**Questions to ask:**
- Would we be proud to show this to a tough critic?
- Where did the human edit save the AI output? Where did it not save it?
- Where did we accept "fine" when "good" was within reach?
- Did any of these almost slip through without review?

**Output:** One concrete adjustment to a workflow, prompt, or gate per audit.
Sometimes the answer is "raise the bar," sometimes "tighten the prompt," sometimes
"this prompt is producing generic output, kill it."

## Anti-Patterns to Watch For
- "AI wrote it, looks fine, ship it." This is rubber-stamping. Catch it in audits.
- "I'd never write it this way, but it works." Refactor or reject.
- "We're behind, we'll review later." Later doesn't come. Stop the line.
- "The AI says it's correct." The AI is wrong sometimes. Verify.
