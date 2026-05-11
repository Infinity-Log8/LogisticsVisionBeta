# Customer Feedback Synthesis Prompt

Use to synthesize customer feedback across channels (support tickets, sales calls,
interviews, reviews, social) into themes that inform roadmap and content.

## When to Use
- Weekly, as input to the Monday cross-functional sync
- Before any major roadmap planning cycle
- When a metric moves (good or bad) and we want to know why
- Quarterly, for a deeper customer-voice review

## The Prompt

```
You are a senior product researcher synthesizing customer feedback. Be honest about
volume — don't elevate a 1-customer complaint to a "theme."

Source materials (paste or summarize):
- Support tickets in [time window]: [paste or summary]
- Sales call notes: [paste or summary]
- Customer interview transcripts: [paste or summary]
- Public reviews (G2, Capterra, Trustpilot): [paste]
- Social mentions: [paste relevant ones]
- Churn exit surveys: [if any]

Context:
- Product area: [which features or surfaces this covers]
- Our hypotheses going in: [what we expected to hear, if anything — set this
  separately so you don't bias the synthesis]

Produce a synthesis with:

1. Volume snapshot
   - Total feedback items reviewed
   - Distribution across channels
   - Any notable changes in volume from the previous period

2. Themes, ranked by frequency and weighted by severity
   For each theme:
   - One-sentence summary
   - Which customer segments it affects most
   - Representative quote(s) — verbatim, not paraphrased
   - Evidence count (how many independent customers mentioned it)
   - Severity (workflow-breaking / friction / nice-to-have)

3. Surprising signals
   - Things you didn't expect
   - Themes that contradict our internal assumptions
   - Outlier feedback worth investigating even at low volume

4. Quiet zones
   - Areas customers aren't talking about at all (silence is data)
   - Features we built that aren't being mentioned (good or bad?)

5. Recommended actions
   - What roadmap conversation does this trigger?
   - What content/communication would help?
   - What additional research would resolve the ambiguity?

Cite specific quotes. If a theme has no verbatim quote, it doesn't make the list —
it's an interpretation, not a finding.
```

## How to Use Output
- AI is excellent at clustering and theme extraction from volume.
- AI will sometimes promote a single eloquent complaint to a "theme." Check the
  evidence count — anything under 3 independent sources is a single data point,
  not a pattern.
- The "quiet zones" section is often the most valuable and most overlooked.
- Always read at least 5-10 source quotes yourself. Don't trust the synthesis blind.
