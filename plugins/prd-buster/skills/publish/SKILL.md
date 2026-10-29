---
name: publish
description: Use when a PRD Buster run has approved current tickets ready for confirmed local or Jira publication, or needs publication reconciliation.
disable-model-invocation: false
user-invocable: true
argument-hint: "[run directory]"
---

<objective>
Publish only approved artifacts to a confirmed destination, recover partial progress without blind retries, and offer optional estimation afterward.
</objective>

<quick_start>
Read the [shared workflow contract](../../references/workflow.md) first. Resolve `$ARGUMENTS` to an existing run. Check research freshness first; missing/stale/unverifiable research routes to `prd-buster:research` and stops publication. Revalidate spec, Epic, and ticket approvals and hashes. Route stale/missing approvals to `prd-buster:harden-spec`, `prd-buster:draft-epics`, or `prd-buster:draft-tickets`, respectively, and stop publication. Ask for an unknown run; never fabricate keys.
</quick_start>

<preflight>
1. Validate requirement/risk coverage, parent IDs, missing blockers, Epic-to-ticket prerequisite coverage, and the full dependency graph. Report any cycle or unmapped prerequisite, including its edges, and stop before creating anything. Changed graph or payload requires renewed ticket approval.
2. Ask for local or Jira target unless already recorded. For Jira, ask the user to select the site and project unless already explicitly confirmed for this run; never assume a destination or suggest a company-specific default. Inspect available tools, create metadata, Epic/child issue types, required fields, parent relationship, labels, and native Blocks link direction. Require read/search/create/update/link capability; if unavailable, stop and offer local output without switching automatically. Never request secrets in chat.
3. Diff the approved graph against previously verified managed links (links created by this run with recorded IDs/endpoints). Show current approved revisions, target, and exact planned creates/updates/link additions and removals. Obtain separate publication authorization, explicitly including any removals, and persist it with all approved hashes; set publication status `in-progress`. Use `blocked` for a failed preflight and `partial` for unresolved writes. A resumed run with unchanged valid authorization may reconcile unfinished operations; any new target or payload requires new confirmation.
</preflight>

<process>
1. Use one writer. Before each mutation, recheck source hashes and persist intent in `state.records[local_id]`: target, unique marker `prd-buster:<run_id>:<local_id>`, approved payload hash, key/path if known, and status (`planned`, `creating`, `unknown`, `created`, `verified`). Track links and updates separately. A failed state write stops further external writes.
2. Create Epics first in dependency order, then tickets in blocker-first order. Jira records include the stable marker in their description. Set the real parent Epic and exactly the applicable `afk` or `hitl` mode label on tickets, preserving unrelated existing labels. Create native Blocks links for approved Epic and ticket dependency edges, blocker to dependent, never duplicate links. Confirm the tool's inward/outward semantics rather than guessing.
	Record IDs/endpoints for links this run creates; do not claim ownership of pre-existing links. Remove obsolete managed links only with explicit removal authorization and verified delete capability, then verify absence by reading both endpoints. Preserve unrelated links. Unsupported or uncertain removals leave publication partial pending human reconciliation, never complete. Local approved dependency changes update only mapped workflow files after confirmation.
3. For local output write each Epic under `epics/<E-ID>-<slug>.md`, and tickets under `issues/<NN>-<slug>.md`, initially numbered from 01 in dependency order. Include stable ID, run marker, full approved content, and dependencies in every file; include parent Epic and AFK/HITL mode in tickets only. Persist path mappings; never renumber on resume, overwrite unrelated files, or delete retired items without explicit authorization.
4. Persist each returned key/path immediately. On timeout, disconnect, or uncertain response, record `unknown`; on resume treat unresolved `creating` as unknown. Do not retry create blindly. Search/reconcile by stable marker and read back matching records. One verified match recovers its key; multiple matches or uncertain absence require human reconciliation. An empty search after a timeout is not proof of failure because indexing may lag. Only recreate with authoritative evidence of non-creation, such as a definite pre-mutation rejection or provider request trace; if unavailable, remain blocked. Pause dependent work and report partial progress.
5. Before updating an existing record, compare its approved fields against the last verified snapshot. Unexpected edits require review; do not overwrite them. After every create/update/link, read back and compare the approved content, parent, mode label, dependency direction, and marker; for local files also verify references resolve. Reconcile already-applied approved estimates rather than resetting them.
6. Write `publication.md` with verified keys/paths, unresolved operations, and frontier: tickets with no open blockers, split AFK/HITL. In Jira inspect actual blocker status, including parent-Epic blockers and extra existing blocking links; unknown status is not done. Locally treat ticket and Epic prerequisites as open unless completion evidence is supplied. Unknown writes, incomplete links, or obsolete managed links still present prevent marking publication complete.
</process>

<optional_handoff>
Only after all publication checks pass, mark `state.publication.status` complete. If estimation is not yet offered, persist estimation status `awaiting-response` and ask: "Would you like to estimate story points for these published tickets?" Wait; an interrupted `awaiting-response` resumes that question, not estimation. Decline records `declined` and ends the run without points (not zero). Acceptance records `in-progress` and invokes `prd-buster:estimate` with the run directory. Resume an opted-in incomplete estimation; do not repeatedly offer a declined/completed stage unless the user requests it. No estimation or point updates are implied by publication approval.
</optional_handoff>

<success_criteria>
Every approved record and edge exists and is verified in the confirmed target, with no unknown operations. The frontier is reported and optional estimation is explicitly offered, declined, or handed off; never claim partial publication is complete.
</success_criteria>