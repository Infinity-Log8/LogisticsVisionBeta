# AI Tooling Stack

Three tiers. Most teams over-invest in tier 2 (function-specific tools) and
under-invest in tier 3 (connective tissue). The connective layer is where the
real productivity multiplier lives.

## Tier 1 — Foundation Layer (Shared by Everyone)

**Claude** — primary writing, analysis, brainstorming, code, and research model
across all three functions. One tool reduces context-switching cost. Standard
on every team member's machine; integrated into IDEs, browsers, and Slack.
- Budget: ~$200-300/person/month for Pro + API usage
- Quality bar: every team member has a personal prompt library and uses it

**Shared prompt library** — `/tooling/prompt-library/` in this repo. Every reusable
prompt lives there as a version-controlled markdown file. Anyone can propose
changes via PR. Prompts get edited like code.

**Team knowledge base** — AI-searchable repository of decisions, specs, docs,
post-mortems, and customer feedback. Recommend Notion AI or similar with strong
search. Single source of truth for "what did we decide and why."
- Budget: ~$15-25/person/month

## Tier 2 — Function-Specific Layer

### Engineering
- **AI code completion in IDE** (Cursor, GitHub Copilot, or Claude Code) — pairing
  for code, tests, refactoring
- **Automated testing** with AI-generated test cases and coverage analysis
- **Monitoring & alerting** (Datadog, Sentry, or similar) with AI summarization
  layer on top
- **CI/CD** (GitHub Actions, CircleCI) with AI-assisted failure triage
- Budget: ~$150-250/engineer/month

### Design
- **Figma** with AI plugins for layout exploration and accessibility scanning
- **Generative tools** (Midjourney, Firefly, Runway) for visual exploration
- **Prototyping** in-browser or in Figma — AI accelerates state coverage
- **Asset management** with AI tagging and search
- Budget: ~$100-200/designer/month

### Marketing
- **SEO and content analytics** (Ahrefs, Clearscope, or similar)
- **Campaign analytics** with AI summarization
- **Social and email** with AI-assisted scheduling and copy variation testing
- **Competitive monitoring** (Crayon, Klue, or AI-assisted manual)
- Budget: ~$200-400/marketer/month

## Tier 3 — Connective Layer (The Multiplier)

This is what most teams miss. The connective layer turns three functions into one team.

**Project management with AI** — Linear or Notion (pick one, don't run both).
- AI auto-summarizes project status, surfaces blockers, drafts issue descriptions
- Engineering velocity automatically informs marketing launch timelines
- Customer feedback automatically becomes design priorities
- Design specs automatically become engineering tickets

**Automated context flow** — explicit cross-function pipelines:
- Engineering ships → AI drafts a marketing brief from the PR description
- Customer support ticket spike → AI alerts design and PM with theme summary
- Design system change → AI flags affected marketing assets and code usages
- Marketing campaign launches → AI annotates the product analytics with the launch event

**Shared dashboards that AI keeps updated**:
- Product metrics dashboard (auto-narrated weekly)
- Marketing performance dashboard (auto-narrated weekly)
- Team output dashboard (commits, designs, content — auto-rolled up)
- Customer feedback dashboard (auto-themed by AI, refreshed daily)

**Total tooling budget per person:** ~$500-900/month all-in. For a 10-person team,
roughly $60-100K annually. That's the cheap part of the AI-native bet.

## Tooling Principles
- One foundation model across the team. Avoid tool sprawl.
- Buy the tier 1 + tier 3 stack first. Tier 2 is replaceable; tier 3 is leverage.
- If a tool requires a 1-hour training session to use, it's the wrong tool.
- Audit the stack every 6 months. Cut anything not actively used.
