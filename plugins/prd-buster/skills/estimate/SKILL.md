---
name: estimate
description: Use when a human opts into story-point estimation for a published PRD Buster run, or resumes its ticket-by-ticket point and buffer decisions.
disable-model-invocation: false
user-invocable: true
argument-hint: "[published run directory]"
---

<objective>
Optionally guide the human through each published ticket with three point choices, a recommendation, and an explicitly approved contingency buffer. Story points measure relative effort, complexity, and uncertainty, not elapsed time or a promised delivery date.
</objective>

<quick_start>
Read the [shared workflow contract](../../references/workflow.md) first. Resolve `$ARGUMENTS` to a run. Check research freshness first; missing/stale/unverifiable research routes to `prd-buster:research` and stops estimation. Revalidate current draft approvals, publication status, mapped records, and their approved content. If publication is incomplete or unverifiable, stop estimation and hand off to `prd-buster:publish`. Missing/stale upstream approval follows that skill's routing. Direct invocation counts as opting in, not as approval of any point value or write.
</quick_start>

<setup>
1. Confirm the team's point scale and at least one reference ticket if available. Suggest Fibonacci `1, 2, 3, 5, 8, 13` only as a default; use the team's actual scale and definition of done. If fewer than three usable values exist, ask how to supply three choices rather than fabricate a scale. Never invent historical velocity or convert points to hours.
2. Read tickets in dependency order, including criteria, tests, risks, and HITL prerequisites. Confirm the queue; estimate child tickets, not Epics or subtasks again. Existing points require a deliberate keep/re-estimate choice, never automatic overwrite. A skipped ticket remains unestimated or keeps its existing value, never becomes zero.
3. For Jira, discover the actual editable story-point field for the target project and issue type from metadata or ask the user to identify it, then verify editability. Do not guess a field ID, use time-tracking fields, or create a field. If tools/field are unavailable, offer a local decision-only record; no Jira write or applied-estimate claim. The publication destination stays unchanged.
</setup>

<ticket_loop>
For each ticket, pause at every human decision; do not answer on their behalf or apply a blanket buffer to the queue.

1. Summarize the ticket's outcome, acceptance criteria, tests, dependencies, and sizing assumptions. Offer exactly three distinct plausible values from the agreed scale, each with a concrete rationale or assumption. Mark one recommendation and explain why it fits the work; do not manufacture three choices when scope is too unclear. Clarify or propose a split instead.
2. Ask the human to choose the base points (or supply their own, clarify, skip, or pause). Wait and record their choice. A custom base outside the scale requires explicit agreement on the scale exception before proceeding. Missing scope decisions reopen the appropriate planning gate; estimates must not silently change approved scope.
3. Recommend a buffer between 10% and 20% for residual difficulty/uncertainty: typically 10% low, 15% moderate, 20% substantial but bounded. Explain ticket-specific remaining risks, what the base already covers, and why this percentage fits without double-counting. If there is no evidence for additional contingency, say so and make clear that no buffer is valid. Unbounded uncertainty calls for clarification or splitting, not an arbitrary 20% allowance.
4. Ask: "Use the recommended buffer, a custom percentage, or no buffer?" Wait. Accept any explicit finite nonnegative custom percentage, including outside 10-20%; explain its effect without replacing it. No buffer means 0%. Reject negative/non-numeric/non-finite inputs and clarify ambiguous values. Persist the human's buffer decision and rationale.
5. Calculate `buffered_points = base_points * (1 + buffer_percent / 100)` using arithmetic, not a time conversion. Show base, percentage, added points, and exact buffered result. This is a calculation, not precision inherent in story points. If off-scale, explain rounding choices and their effective increase over the base; recommend a scale value, but never round silently. With base 5 and 15%, the result is 5.75; rounding to 8 increases the base by 60%, not 15%. Buffer acceptance alone does not authorize 8. If no scale value fits, discuss splitting or an explicit scale exception.
6. Ask for the final points and write confirmation together: "Apply [final points] to [ticket key/path], in [verified field]?" Include current value, target, and any rounding impact. Wait even if no rounding was needed. Record base, buffer, calculated value, final confirmed value, explanation, approval quote/time, and source ticket hash in `estimates.md` and state. Compute that source hash over a stable structured scope snapshot (title, requirements/criteria, parent, dependencies), excluding point values and estimation metadata so an authorized point update does not invalidate itself. Track the observed point value separately for conflict detection. No buffer leaves the chosen base unchanged. Do not rewrite approved `tickets.md`.
7. Before a confirmed write, read the current ticket again; changed scope, criteria, or field values invalidate the pending decision and require review. Persist update intent before updating only that ticket's point field (or the Story points field in its mapped local issue file). Never overwrite unrelated content, parent, labels, or links. Read back the value; only then mark the estimate verified and update the record's expected snapshot, preserving history.
8. A timeout leaves the update `unknown`. Reconcile by reading the known record; if the intended value is present, verify it without replaying. If unchanged and no conflicting update exists, retry only the same authorized assignment; if conflicting/uncertain, stop and ask. Unsupported fields, persistence failures, or unverified writes leave estimation partial; successful publication remains complete. Save progress and resume at the earliest unfinished human decision, never reapply a confirmed buffer.
</ticket_loop>

<success_criteria>
Report base points, buffer percentage/rationale, calculated result, confirmed final points, and applied/pending/skipped status per ticket. Mark estimation complete only when every selected ticket has a final human-confirmed value verified in the target; list skipped tickets explicitly. Decision-only records are not applied estimates. End the workflow without requiring another skill or suggesting points guarantee elapsed time.
</success_criteria>