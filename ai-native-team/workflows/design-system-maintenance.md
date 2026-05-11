# Design System Maintenance

How the design system stays useful instead of becoming a museum. Four ongoing
practices, each with a clear owner and cadence.

## 1. Component Creation
**Owner:** Senior Product Designer (with engineer pairing)
**Trigger:** A pattern appears three times across the product without a shared
component. Two ad-hoc copies is a coincidence; three is a primitive.

**AI does:**
- Generate 5-10 variations of the component (props, sizes, states)
- Draft the API surface and usage examples
- Generate accessibility checklist for the component type
- Draft the documentation entry

**Human does:**
- Pick the variations that actually earn their complexity
- Decide the API — what's a prop, what's a slot, what's a separate component
- Verify accessibility in real assistive tech (not just AI assertion)
- Approve before it ships to the system

## 2. Accessibility Audits
**Owner:** Senior Product Designer
**Cadence:** Monthly across the system, on-demand for new components

**AI does:**
- Run automated WCAG 2.2 AA scans across every component and key flow
- Flag color contrast issues, missing alt text, keyboard trap risks, focus order issues
- Draft remediation suggestions

**Human does:**
- Verify findings on real screen readers (VoiceOver, NVDA, JAWS)
- Test with keyboard-only, no mouse
- Decide what's a real issue vs. an AI false positive (they happen)
- Prioritize remediation against the rest of the design backlog

## 3. Documentation
**Owner:** Senior Product Designer (drafts AI, designer approves)
**Cadence:** Every component change updates docs in the same PR

**AI does:**
- Generate component description, props table, and usage examples from the code
- Draft "when to use" and "when not to use" guidance
- Suggest related components and cross-links

**Human does:**
- Edit the description so it reads like a designer wrote it
- Verify examples are accurate (AI will hallucinate plausible-looking props)
- Add the why — the design rationale that AI doesn't know

**Rule:** A component doesn't ship without docs. No exceptions, no "I'll do it later."

## 4. Cross-Functional Review
**Owner:** Senior Product Designer
**Cadence:** When a system change affects marketing or engineering

**Trigger examples:**
- Color system update → marketing needs to update brand assets
- New typography scale → marketing landing pages need to migrate
- Component API change → engineering needs to update usages

**Process:**
- Designer drafts a change brief (AI-assisted)
- Posts in a shared review thread with a 48-hour comment window
- Affected functions respond async with concerns or "looks good"
- If concerns, 30-minute sync to resolve. Otherwise, merge.

## What Not to Build
Resist the urge to systematize too early. Three rules:
- No component without three real usages
- No token without two real usages
- No documentation page nobody reads twice

A small, sharp system beats a comprehensive, ignored one.
