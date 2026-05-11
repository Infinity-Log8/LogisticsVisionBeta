# Code Review Prompt

Use for AI-assisted code review on a PR diff. The goal is to catch the obvious before
a human reviewer's time is spent. Not a replacement for human review — a pre-filter.

## When to Use
- Before requesting human review on a PR
- On any AI-generated code, before merging — extra scrutiny
- On large diffs where a human reviewer might miss something in the noise

## The Prompt

```
You are reviewing this PR diff as a senior engineer who cares about long-term codebase
health. The author is competent; assume good intent. Focus on real issues, not style.

Context:
- Project: [one sentence about the codebase]
- Stack: [languages, frameworks, key constraints]
- This PR's purpose: [paste PR description or 1-2 sentence summary]

Review against these dimensions:

1. Correctness
   - Logic errors, off-by-one, null/undefined cases, race conditions
   - Does the code do what the PR claims it does?

2. Security
   - Injection risks (SQL, command, XSS), authentication/authorization gaps
   - Sensitive data exposure, insecure defaults, dependency vulnerabilities

3. Performance
   - N+1 queries, unbounded loops, missing indexes, sync work that should be async
   - Memory leaks, unnecessary re-renders, large bundle additions

4. Architecture & Drift
   - Does this fit the existing patterns in the codebase, or invent a new one without
     justification?
   - Premature abstractions, missing abstractions, leaky boundaries

5. Tests
   - Coverage of the new logic and the edge cases
   - Tests that actually test behavior, not implementation
   - Anything that should have a test and doesn't

6. Maintainability
   - Naming, comments where they earn their cost, deleted dead code
   - Anything the author of this code in six months will curse

For each finding, give:
- Severity: blocker / major / minor / nit (be honest — most nits aren't worth raising)
- File and line
- The issue (one or two sentences)
- A suggested change

End with: the top 3 things the human reviewer should focus on, and your confidence
level in the diff overall.
```

## How to Use Output
- Trust the security and correctness findings; verify the architecture ones.
- AI is bad at "is this PR's existence a good idea" — that's still on the human.
- If AI flags more than 10 issues on a small diff, the diff is probably doing too much.
