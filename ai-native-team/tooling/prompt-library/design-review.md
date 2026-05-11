# Design Review Prompt

Use when you want an AI-assisted critique of a design before sharing it for human review.
The goal is to surface obvious issues so the human reviewer can spend their time on
judgment, not nit-picking.

## When to Use
- Before scheduling a designer-to-designer crit
- Before showing a design to engineering for scoping
- Before a customer-facing demo
- Self-review on any solo work before merging to a shared Figma file

## The Prompt

```
You are reviewing a design [link or attached image] as an experienced senior product
designer. Your job is to surface issues a thoughtful reviewer would notice.

Context:
- Product: [one sentence on what the product does]
- This screen's job: [what the user is trying to accomplish here]
- Audience: [primary user, e.g. "logistics dispatchers managing 50-200 trucks/day"]
- Constraints: [tech, brand, accessibility — anything that limits the design space]

Review against these dimensions, in order:
1. Job-to-be-done: Does this screen let the user accomplish their job efficiently?
   What friction did you spot?
2. Information hierarchy: What does the eye go to first? Is it the right thing?
3. States: What happens when there's no data, partial data, an error, or loading?
   Are these states designed or assumed?
4. Accessibility: Color contrast, focus order, target size, screen reader sensibility
5. Consistency: Does this match the design system? Any new patterns introduced
   that should be questioned?
6. Edge cases: Long content, short content, internationalization, mobile, dark mode

For each issue, give:
- Severity: blocker / major / minor / nit
- Specific location ("the primary CTA in the header")
- Why it's an issue (one sentence)
- A concrete suggested fix

End with: the three most important things to fix before this design ships.
Be direct. Don't soften.
```

## How to Use Output
- The AI will produce a list. Read it skeptically.
- AI is reliable on accessibility, consistency, and state coverage.
- AI is less reliable on judgment calls (hierarchy, "does this feel right").
- Cross-check any "major" findings against a human designer before acting.
