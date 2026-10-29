# PRD Buster

Stress-test the spec. Ship the right tickets.

A self-contained Claude Code plugin for primary-source research, adversarial PRD review, approved Epics, vertical-slice tickets, and local or Jira publication. An optional final stage walks the human through story-point choices and contingency buffers for published tickets. All seven skills ship together; no external skills, hooks, custom agents, or MCP servers are bundled or required for local workflows.

## Install

Register the public AI Toolbox marketplace and install the plugin:

```sh
claude plugin marketplace add mowenpark/ai-toolbox
claude plugin install prd-buster@mowenpark-ai-toolbox --scope user
```

In an existing Claude Code session, run `/reload-plugins` or restart the session after installation. The installed plugin is named `prd-buster@mowenpark-ai-toolbox`; slash commands retain the `prd-buster` namespace. Claude manages its installed copy separately from the repository. Avoid enabling another copy of PRD Buster from a different marketplace in the same session.

To receive a new version:

```sh
claude plugin marketplace update mowenpark-ai-toolbox
claude plugin update prd-buster@mowenpark-ai-toolbox --scope user
```

## Try Source Changes

From the project containing your PRD, start Claude Code with the plugin directory in your AI Toolbox checkout:

```sh
claude --plugin-dir /path/to/ai-toolbox/plugins/prd-buster
```

Then enter:

```text
/prd-buster:start docs/requirements.md
```

Adjust the plugin path if relocated. The development flag loads source changes for that session without reinstalling. The plugin targets Claude Code; other hosts have not been verified.

| Command | Purpose |
| --- | --- |
| `/prd-buster:start` | Start from a PRD/file/Jira key/URL, or resume a run |
| `/prd-buster:research` | Choose standard/deep research and gather cited evidence before hardening |
| `/prd-buster:harden-spec` | Challenge requirements and obtain spec approval |
| `/prd-buster:draft-epics` | Group capabilities and obtain Epic approval |
| `/prd-buster:draft-tickets` | Draft verifiable slices and obtain ticket approval |
| `/prd-buster:publish` | Confirm a target and publish/reconcile records |
| `/prd-buster:estimate` | Optionally estimate published tickets with the human |

Stage commands take a run directory such as `.scratch/account-export/`; research and harden-spec also accept a PRD source. Research additionally accepts an explicit `standard` or `deep` choice. Direct invocation still checks prerequisites. Start is manual-only; companion skills allow model invocation so ready/approved handoffs can continue in the same conversation. A denied/missing Skill tool stops the handoff and supplies a manual command.

## Research Before Hardening

The flow is `start -> research -> harden-spec -> draft-epics -> draft-tickets -> publish -> optional estimate`.

Each new run asks for standard or deep research. Standard investigates up to three priority questions in one pass; deep investigates up to six in two passes, including alternatives and counterevidence. Both use bounded searches and primary-source reads, write a cited `research.md`, expose gaps and contradictions, and automatically hand off to hardening without a separate research approval gate. Hardening retains human control over requirements, risk acceptance, and spec approval.

```text
/prd-buster:research docs/requirements.md
/prd-buster:research .scratch/account-export/ deep
```

The primary-source approach is inspired by Matt Pocock's research skill. These research and deep-mode instructions are owned by this plugin; they never invoke his plugin or another third-party skill. Built-in read-only delegation is optional, with sequential fallback. Missing web tools produce explicit evidence gaps, not claims of online verification; private source content is not sent to public search without permission.

Source fingerprints bind research to its inputs and the spec to its report. Changed or unverifiable evidence blocks downstream work until addressed; an explicitly chosen dated snapshot can be used without pretending it is live evidence. Version 1 runs retain history and published record mappings, but require research and renewed approvals before new work. No existing records are recreated merely because the workflow was upgraded.

## Approvals and Recovery

Draft artifacts and approval hashes live under `.scratch/<feature-slug>/` in your target project, never the plugin installation. Each gate waits for explicit approval; stale content invalidates downstream approvals. Jira writes start only after ticket approval and separate destination/payload confirmation. No application code is changed.

Jira requires your existing authenticated tools for metadata, search, reads, creates, updates, and links. The plugin asks you to select the Jira site and project for each run; no company-specific destination or credentials are bundled. Missing capabilities stop Jira publication; switching to local output requires confirmation. Unknown create outcomes are reconciled, not blindly retried. These are prompt-based safeguards, not transactional or code-enforced guarantees.

Estimation is offered **after publication**. For each ticket, choose among three justified point values, then accept the recommended 10-20% buffer, choose any finite nonnegative percentage, or choose no buffer. Final points and any rounding need separate confirmation before a point-only update. For example, 5 plus 15% is 5.75; 8 is a 60% increase over 5 and is never applied silently. Points are relative sizing, not hours. Skipped tickets remain unchanged; absent estimates are not zero.

## Development Checks

From this plugin directory:

```sh
node --test tests/package.test.mjs
claude plugin validate .
```

Node 22+ and Ruby's standard YAML parser are used only for development checks, not skill execution. No npm or gem packages are required. [Pressure scenarios](tests/scenarios.md) cover research handoffs/freshness, approvals, publication recovery, and buffers. Structural checks and read-only agent simulations do not prove live Jira behavior. Distribution through AI Toolbox is separate from submission to Anthropic's public directory.

## License

[MIT](LICENSE).