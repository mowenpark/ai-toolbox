# AI Toolbox

Personal Claude Code plugins, reusable skills, and AI tooling by [mowenpark](https://github.com/mowenpark).

## Marketplace

Register this repository as a Claude Code marketplace:

```sh
claude plugin marketplace add mowenpark/ai-toolbox
```

The catalog name is `mowenpark-ai-toolbox`. It is independent of each plugin's slash-command namespace.

## PRD Buster

[PRD Buster](plugins/prd-buster/) researches and hardens PRDs, drafts approved tickets, and optionally estimates story points after publication.

```sh
claude plugin install prd-buster@mowenpark-ai-toolbox --scope user
```

Run `/reload-plugins` or restart Claude Code, then use `/prd-buster:start` in your target project. Jira destinations are selected by each user.

## Repository Layout

| Directory | Purpose |
| --- | --- |
| [plugins/](plugins/) | Self-contained plugins listed in the marketplace |
| [skills/](skills/) | Future standalone skills |
| [tools/](tools/) | Future AI development utilities |

Only entries in the marketplace are installed by Claude Code. Standalone skills and tools are not automatically installed.

## Development

Node.js 22+ runs the structural checks; Ruby's standard YAML parser validates skill frontmatter. No npm or gem packages are required.

```sh
node --test
claude plugin validate .
```

Keep each plugin's resources inside its own directory. Add a catalog entry only when the complete plugin can be installed. Increment its version when releasing changes. Do not commit credentials, private source documents, or generated workflow runs.

This personal repository does not require Jira-prefixed branches or commits. Keep changes and PRs small, run the relevant checks, and use the configured Git author without overriding their identity.

## License

[MIT](LICENSE).