---
name: draft-epics
description: Use when a PRD Buster run has a current approved hardened spec and needs an approved Epic grouping.
disable-model-invocation: false
user-invocable: true
argument-hint: "[run directory]"
---

<objective>
Group the approved specification into coherent user-facing capabilities. Keep this stage entirely local, even when the Jira project is already known.
</objective>

<quick_start>
Read the [shared workflow contract](../../references/workflow.md) first. Resolve `$ARGUMENTS` to an existing run. Check research freshness first; missing/stale/unverifiable research routes to `prd-buster:research` and stops drafting. Verify the current spec's hash and explicit approval. If absent or stale, stop drafting and hand off to `prd-buster:harden-spec`; if the run/source is unknown, ask for it and stop. Direct invocation never waives prerequisites.
</quick_start>

<process>
1. Read only the current approved spec as the requirements authority. Use code evidence to clarify implementation boundaries, not add unapproved scope. A newly discovered architecture/scope decision reopens spec approval.
2. Draft `epics.md` with stable local IDs E1, E2, etc. Each Epic contains title, user outcome in one or two sentences, scope/out of scope, mapped spec requirements, risks carried in by finding ID and disposition, and dependencies with a reason for each edge.
3. Each Epic delivers a coherent capability, not a technical layer such as "database work." If an Epic needs another first, state the prerequisite and the independently verifiable outcome it adds once that prerequisite is met.
4. Account for every in-scope feature and every BLOCKER/MAJOR disposition. Preserve accepted-risk owner, rationale, and review trigger by reference to the approved ledger. List cut features separately; do not smuggle them back in.
5. Reject missing dependency IDs, self-dependencies, or cycles; show the concrete cycle and resolve it before approval. Avoid dependencies based only on team preference or scheduling.
6. Save the draft, its revision/hash, and the upstream spec hash per the contract. Do not create Jira Epics, tickets, or links. A confirmed project key does not authorize publication.
</process>

<gate>
Present the numbered Epics and dependencies. Ask: "Do you approve this Epic grouping, or should any Epic be merged, split, or cut?" Wait and iterate. After explicit approval of the current revision, record the approval and invoke `prd-buster:draft-tickets` with the run directory. Publication is deferred until the publish stage after ticket approval.
</gate>

<success_criteria>
The current Epic grouping is approved against the current approved spec; coverage and risk dispositions are complete, dependencies are acyclic, and no external records have been created.
</success_criteria>