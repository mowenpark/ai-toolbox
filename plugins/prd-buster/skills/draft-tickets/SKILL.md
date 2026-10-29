---
name: draft-tickets
description: Use when a PRD Buster run has approved current Epics and needs reviewable vertical-slice tickets, dependencies, and AFK or HITL classifications.
disable-model-invocation: false
user-invocable: true
argument-hint: "[run directory]"
---

<objective>
Turn approved Epics into independently verifiable tracer-bullet tickets. Preserve risk traceability and get ticket approval before publishing.
</objective>

<quick_start>
Read the [shared workflow contract](../../references/workflow.md) first. Resolve `$ARGUMENTS` to an existing run. Check research freshness first; missing/stale/unverifiable research routes to `prd-buster:research` and stops drafting. Validate the spec and Epic approvals, hashes, and upstream provenance. Missing/stale spec approval routes to `prd-buster:harden-spec`; missing/stale Epic approval routes to `prd-buster:draft-epics`. Ask for an unknown run and stop. Direct invocation is not approval.
</quick_start>

<process>
1. Draft `tickets.md` using stable T1, T2 IDs. Each ticket has title, parent E ID, outcome, blocked-by T IDs (or None), reason for each edge, and mode AFK or HITL with rationale.
2. Slice a narrow complete path through schema, API, UI, and tests. List each layer explicitly; use n/a with a reason when genuinely untouched. Include relevant code locations, prerequisites, checkable acceptance criteria, and a concrete verification command or manual demonstration with expected results. Do not invent executable commands when the codebase is unavailable.
3. Keep each ticket one independently demoable/verifiable outcome with bounded code and context needs. Split tickets requiring unrelated decisions or extensive cross-system context. Do not create horizontal layer-only tickets merely to make them smaller.
4. Prefactor only for a demonstrated prerequisite. For wide changes, use expand-contract: add a compatible path, migrate a narrow consumer and verify, then remove the old path only after all consumers migrate. Each slice must remain verifiable and preserve compatibility until its explicit removal gate.
5. AFK means clear criteria, available environment and permissions, and no unresolved human judgment or new secrets/production access. Otherwise use HITL and state the human action needed. If uncertain, choose HITL; do not ask for credentials in chat.
6. Add a coverage table mapping every in-scope requirement and every BLOCKER/MAJOR finding to ticket IDs and criteria, or an explicitly accepted-risk record referenced by affected tickets. Preserve severity and acceptance metadata. Feature-cut findings retain their closure reason; nothing disappears.
7. Map Epic prerequisites to concrete prerequisite ticket IDs and the dependent tickets they gate; document this coverage rather than assuming Jira inherits Epic links. Check parent IDs, missing blockers, self-links, and cycles across ALL Epics and tickets. Show genuine blocker-to-dependent edges and a topological order; a cycle or unmapped Epic prerequisite cannot pass this gate. A dependency change invalidates ticket approval. Architecture or grouping changes reopen the appropriate upstream gate.
8. Save revision/hash and approved upstream hashes. Keep drafting local; do not create Jira records or estimate points here. Optional human-guided estimation happens after verified publication.
</process>

<gate>
Present tickets grouped by Epic, coverage table, blocking graph, and AFK/HITL rationale. Ask: "Do you approve the ticket granularity, dependencies, acceptance criteria, and AFK/HITL tags?" Wait. Only after explicit approval of the current revision, record it and invoke `prd-buster:publish` with the run directory. Ticket approval alone does not authorize external writes.
</gate>

<success_criteria>
The current ticket set is approved against the current spec and Epics; all required findings are accounted for, IDs resolve, the graph is acyclic, and each ticket has a concrete verification path.
</success_criteria>