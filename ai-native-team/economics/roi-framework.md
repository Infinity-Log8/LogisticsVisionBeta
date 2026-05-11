# ROI Framework

How to know whether the AI-native bet is actually working — not just whether it
feels efficient. Four dimensions, each with concrete metrics.

## 1. Output per Person

The volume measure. Per quarter, per person:

| Function | Metric | Target (AI-native) | Traditional baseline |
|----------|--------|--------------------|--------------------|
| Engineering | Features shipped to prod | 4-6 per engineer | 2-3 per engineer |
| Engineering | PR throughput | 15-25 per engineer | 8-12 per engineer |
| Design | Major flows designed | 2-3 per designer | 1-2 per designer |
| Design | Component contributions | 8-12 per designer | 4-6 per designer |
| Marketing | Long-form pieces published | 25-40 per marketer | 10-15 per marketer |
| Marketing | Campaigns run | 3-5 per marketer | 1-2 per marketer |

**Warning:** Output volume is the easiest metric to game. Always pair with quality.

## 2. Cycle Time

The speed measure. How long does it take to move through the value chain?

- **Idea → spec:** target ≤ 5 days (traditional: 2-3 weeks)
- **Spec → first working version:** target ≤ 10 days for a typical feature
  (traditional: 3-5 weeks)
- **Code-complete → production:** target same-day for low-risk, ≤ 2 days for high-risk
  (traditional: 1-2 weeks)
- **Production → launch announcement:** target same-day to 3 days
  (traditional: 1-3 weeks)
- **Customer feedback → roadmap input:** target ≤ 1 week (traditional: 1-2 months
  or never)

**Track the slowest step.** It's almost always the bottleneck. Fix the slowest step,
re-measure, repeat.

## 3. Quality Metrics

The "are we shipping junk?" measure. Volume without quality is a regression.

**Engineering quality:**
- Production incidents per quarter (target: declining trend)
- Mean time to detection (MTTD) and mean time to recovery (MTTR)
- Rollback rate per deployment (target: < 5%)
- Bug reports per shipped feature in first 30 days (target: declining over time)

**Design quality:**
- Accessibility scan pass rate (target: 100% of components meet WCAG 2.2 AA)
- Component reuse rate (target: > 80% of UI built from system components)
- Designer-rated taste check pass rate (sampled, target: > 85% pass without rework)

**Marketing quality:**
- Brand voice consistency score (sampled review, target: > 90%)
- Content engagement vs. benchmark (read-through, time on page, shares)
- Factual error rate (target: zero published)
- Editor edit volume on AI drafts (target: declining as prompts improve, plateauing
  at ~30-40% — if it goes much lower, the editor isn't editing enough)

## 4. Team Satisfaction

The "is this sustainable?" measure. AI-native teams should energize people who
like working at the edge. If it doesn't, the model is failing.

Quarterly anonymous pulse:
- "I am doing higher-leverage work here than I would on a traditional team." (1-5)
- "I trust the quality of what we ship to customers." (1-5)
- "I am developing skills that compound, not just producing volume." (1-5)
- "I have time for deep work on a typical week." (1-5)
- "Our AI tooling helps me. It doesn't replace my judgment." (1-5)

**Targets:** 4.0+ average on every question. Trend matters more than absolute number.

**Red flags:**
- "I feel like I'm just editing AI output all day." → role drift, restructure scope
- "I don't know what other functions are working on." → connective layer is failing
- "Quality is slipping and I can't get heard." → quality gate is failing, escalate

## Composite Score

Don't try to roll these into a single number. The four dimensions trade off against
each other, and the trade-offs are the conversations worth having:
- Higher output but stable quality → working
- Higher output but quality dropping → drift, slow down
- Quality high but cycle time stuck → the model isn't multiplying yet
- Everything good but team satisfaction dropping → check what's invisible

Review the dashboard at the end of every quarter. Adjust one workflow per review.
Don't try to fix everything at once.
