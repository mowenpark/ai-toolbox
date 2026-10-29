---
name: harden-spec
description: Use when a PRD needs adversarial scope, architecture, security, and failure-mode review within an explicitly requested PRD Buster run.
disable-model-invocation: false
user-invocable: true
argument-hint: "[PRD path | Jira key | URL | run directory]"
---

<objective>
Challenge the specification with evidence and produce an approved hardened spec. Be adversarial toward assumptions, not the user. Prefer simpler solutions when their trade-offs fit the requirements.
</objective>

<quick_start>
Read the [shared workflow contract](../../references/workflow.md) first. Use `$ARGUMENTS` as the run directory or PRD source. For direct invocation without a run, identify the project and source, then initialize the contract's state. Ask for missing inputs and stop. Example: `/prd-buster:harden-spec docs/requirements.md`.

Before challenging the spec, check research freshness per the contract. Missing, stale, or unverifiable research stops hardening and routes to `prd-buster:research`; direct invocation cannot skip depth selection or evidence gathering.
</quick_start>

<process>
1. Read the current `research.md`, its cited evidence and handoff brief, the full available PRD/comments, and relevant code/glossary/ADRs. List goal, named users, and every feature. Carry material research gaps, contradictions, and candidate risks into the open-decision list and findings ledger with R/S references; do not silently drop them or promote recommendations to requirements. Cite observed code locations; mark hypotheses and inaccessible evidence explicitly.
2. Maintain an open-decision list and findings ledger in `hardened-spec.md`. Review each feature: who needs it, what concrete scenario requires it, and what breaks if cut from v1? Recommend cutting unsupported features, but record the user's decision.
3. Every new service, queue, cache, flag, or abstraction must name a simpler alternative and justify rejecting it. Do not prescribe complexity merely because it is conventional.
4. Ask one focused question at a time, highest-impact prerequisites first. Include the concrete failure scenario, severity, recommended answer, rationale, and trade-off. Wait for the user's answer, record it, and update the decision list before asking the next question. Resolve questions from code when possible; never invent business decisions.
5. Cover each relevant failure class; record an explicit reason for n/a: races (retries, double submits, ordering, TOCTOU); edges (empty/null, duplicates, huge input, Unicode, DST, rollback); authorization (tenant isolation, IDOR, privilege escalation, expired tokens, admin/service paths); integrity (idempotency, live migration, dependency outage); observability (actionable detection, owner, response proportional to impact).
6. Preserve finding IDs and severity. For every accepted BLOCKER or MAJOR, obtain the user's reason, accountable owner, and review date or trigger before treating it as accepted. Keep mitigations, feature cuts, and accepted risks distinct. Proposed glossary/ADR changes stay in this document, not the application's files.
7. After five questions offer a checkpoint: continue, narrow scope with explicit decisions, or pause and save. Completion requires every in-scope feature and relevant failure class reviewed and all material questions resolved or explicitly accepted under the contract. Do not claim exhaustive safety or invent new branches just to prolong the interview.
8. Fold decisions into the hardened spec: goal/users, in/out of scope, requirements, constraints, failure handling, verification expectations, domain decisions, evidence gaps, findings ledger, and remaining minor deferrals. Remove cut features from requirements but retain the decision history. Record the current `research_hash` on the spec artifact. New evidence or changed requirement inputs must refresh research before this spec can be approved; do not silently rebind an old approval.
</process>

<gate>
Present the current spec and ledger. Ask: "Do you approve this revision of the hardened spec and its recorded risk dispositions?" Wait. Only after explicit approval, record the spec hash and approval per the contract and invoke `prd-buster:draft-epics` with the run directory. Rejected or incomplete drafts stay here; never create Jira records.
</gate>

<success_criteria>
The current hardened spec is explicitly approved. No open or merely deferred BLOCKER remains; every material risk has a recorded disposition, and accepted risks include owner, rationale, and review trigger. The next skill receives that exact approved artifact.
</success_criteria>