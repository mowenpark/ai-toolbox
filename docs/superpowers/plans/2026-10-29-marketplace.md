# Personal Marketplace Implementation Plan

**Goal:** Publish the MIT-licensed `mowenpark/ai-toolbox` repository and distribute PRD Buster through its own marketplace.

**Architecture:** The root catalog is named `mowenpark-ai-toolbox` and points to `./plugins/prd-buster`. Plugin resources remain self-contained. Separate `skills/` and `tools/` directories are reserved for future additions; the existing local PRD Buster installation is not replaced.

**Tech Stack:** Claude Code plugin manifests, Markdown skills, Node.js built-in tests, Git, GitHub CLI, and GitHub Actions.

## Repository Foundation

- Add `.claude-plugin/marketplace.json`, initially with an empty `plugins` array, plus MIT licensing, `.gitignore`, repository documentation, and CI.
- Add `tests/marketplace.test.mjs` before the catalog; confirm it fails for missing configuration, then passes after the catalog and license are present.
- Validate with `node --test` and `claude plugin validate .` before the bootstrap commit.

## Plugin Import

- Copy only the existing PRD Buster package into `plugins/prd-buster`; do not copy the wider Claude configuration or third-party skills.
- Remove the copied plugin's nested marketplace; the root catalog is the sole distribution catalog.
- Add MIT licensing and public author/repository metadata. Bump the copied plugin to `0.2.1` for the portable distribution changes.
- Replace the company-specific Jira project suggestion with explicit user selection. Preserve all approval, research, publication, and estimation behavior.
- Update the copied tests for public metadata and add a regression check for explicit Jira selection.
- Use this catalog entry once the runtime is complete:

```json
{
  "name": "prd-buster",
  "source": "./plugins/prd-buster",
  "description": "Research and harden PRDs, publish approved tickets, and optionally estimate story points."
}
```

## Review and Publication

- Review the complete copy for secrets, private paths, company-specific defaults, broken resource links, and accidental dependencies on the original installation.
- Split the import into a runtime PR and a documentation/test PR, each below approximately 400 changed lines. Review and verify each before integration.
- Use the configured Git author. This personal project is explicitly exempt from Jira-key requirements.
- Create the public repository, push the bootstrap and reviewed changes, and retain the PR history.

## Verification

```sh
node --test
claude plugin validate .
claude plugin validate ./plugins/prd-buster
```

Parse skill frontmatter with Ruby YAML. Test installation from the public GitHub marketplace in an isolated Claude configuration directory, compare the installed package with the repository, and verify the pre-existing local plugin is unchanged. Register the new marketplace without installing a duplicate plugin into the normal configuration. Do not run live Jira writes.