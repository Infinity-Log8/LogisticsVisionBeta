# Incident Response Prompt

Use during a live production incident to triage faster. AI accelerates log analysis
and hypothesis generation; humans make every action call.

## When to Use
- An active production incident
- Post-incident, to draft the timeline and post-mortem first pass
- Recurring alert that needs root-cause investigation

## The Prompt (Live Incident)

```
You are an on-call engineer helping me triage a production incident. Speed matters.
Be terse. Don't speculate beyond the evidence.

Symptoms:
- [What's broken, observable to users or in monitoring]
- When it started: [time]
- Affected users/regions/percentage: [scope]

Recent changes (deploys, config, infra):
- [List anything that changed in the last 4 hours]

Relevant logs/metrics (paste):
- [Error logs, traces, metric snapshots]

Help me with:

1. Hypotheses ranked by likelihood
   - For each: the evidence supporting it and the cheapest test to confirm/deny

2. Immediate mitigation options
   - Rollback: is it safe? what would it cost?
   - Feature flag: which flag, what does flipping it do?
   - Traffic shedding: where, at what cost?

3. Communication
   - Status page update draft (factual, no speculation)
   - Internal channel update draft

4. What I should NOT do right now
   - Common mistakes given these symptoms
   - Actions that would make recovery slower or destroy debug evidence

Don't run any commands. Don't suggest "let's investigate X" — name the specific log
query, metric, or check.
```

## The Prompt (Post-Mortem Draft)

```
You are drafting a post-mortem for the incident below. Be factual, blameless, and
specific about what changes prevent recurrence.

Incident summary: [what happened, when, scope]
Timeline (raw notes):
[paste the Slack thread, status page updates, and any timestamps from the incident]

Root cause (as understood): [what we think actually caused it]
Fix applied: [what we did to mitigate]

Produce a post-mortem with:
1. Summary (3 sentences — what, when, impact)
2. Timeline (timestamped events, plain prose, no jargon)
3. Root cause (one paragraph, technical but readable)
4. Why our monitoring/process didn't catch it earlier
5. Action items (each with an owner and a date, system change preferred over
   "we'll be more careful")
6. What went well in the response

No blame. No "human error" as a root cause — that's a symptom, not a cause.
```

## How to Use Output
- During incidents: the AI's hypotheses are inputs; the on-call engineer decides.
- For post-mortems: the AI drafts the timeline well; the human writes the root cause
  and action items.
- Never let AI propose action items like "be more careful" or "more training." Those
  are anti-patterns and indicate the AI didn't find the real cause.
