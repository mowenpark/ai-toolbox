# PRD Buster Implementation Plan

Goal: Package the approved PRD workflow as one Claude Code plugin with owned research before hardening, no external skill dependencies, and optional post-publication story-point estimation.

Architecture: A manual start skill and six callable stage skills share a bundled artifact and approval contract. Research offers standard/deep modes and automatically hands off to hardening. All drafting stays local; publish creates records and optional estimate updates confirmed point values afterward. No hooks, custom agents, or bundled MCP server.

## Execution

1. Establish baseline behavior against the original skill; create package checks and observe their initial failure.
2. Add the manifest, shared workflow contract, and start skill. Run the manifest and start checks.
3. Add each stage in order. Run its package check and a read-only pressure simulation before the next stage.
4. Document local loading and verification. Run all package checks and Claude's native plugin validator.
5. Add optional post-publication estimation: three choices per ticket, human base-point selection, recommended 10-20% buffer, custom/no-buffer support, explicit rounding confirmation, and verified point-only updates.
6. Add research before hardening: user-selected depth, bounded primary-source investigation, cited report, source fingerprints, automatic handoff, direct-stage guards, and legacy-run migration. Simulate stale sources, unavailable tools, source injection, and persistent dated-snapshot choices. Publish versioned plugin updates only after checks pass.

Use `node --test tests/package.test.mjs` from the plugin directory. For one stage use `node --test --test-name-pattern='skill STAGE' tests/package.test.mjs`.

Behavioral checks must cover research readiness/freshness, stale approval, missing prerequisites, accepted blocker traceability, early publication, cycles, unknown create outcomes, and unavailable Jira tooling. Structural checks do not prove model compliance or live Jira behavior.

Keep the plugin self-contained under `plugins/prd-buster`. Do not publish Jira records during development or modify another installed copy. This personal repository does not require Jira-prefixed branches or commits; preserve the configured Git author and keep reviewed changes small. Test public-marketplace installations in an isolated configuration directory.