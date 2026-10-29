import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const stages = ['start', 'research', 'harden-spec', 'draft-epics', 'draft-tickets', 'publish', 'estimate'];
const read = (path) => readFileSync(resolve(root, path), 'utf8');

const parseFrontmatter = (text) => {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  assert.ok(match, 'Missing YAML frontmatter delimiters');
  const result = spawnSync('ruby', ['-ryaml', '-rjson', '-e', 'puts JSON.generate(YAML.safe_load(STDIN.read))'], {
    input: match[1],
    encoding: 'utf8',
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, `Invalid YAML frontmatter: ${result.stderr}`);
  const metadata = JSON.parse(result.stdout);
  assert.ok(metadata && typeof metadata === 'object' && !Array.isArray(metadata), 'Frontmatter must be a mapping');
  return metadata;
};

test('manifest identifies a skills-only plugin', () => {
  assert.ok(existsSync(resolve(root, '.claude-plugin/plugin.json')), 'Plugin manifest is missing');
  const manifest = JSON.parse(read('.claude-plugin/plugin.json'));
  assert.equal(manifest.name, 'prd-buster');
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.deepEqual(Object.keys(manifest).sort(), ['author', 'description', 'homepage', 'license', 'name', 'repository', 'version']);
  assert.equal(manifest.author.name, 'mowenpark');
  assert.equal(manifest.license, 'MIT');
  assert.equal(manifest.repository, 'https://github.com/mowenpark/ai-toolbox');
});

test('frontmatter parser rejects missing delimiters and malformed YAML', () => {
  assert.throws(() => parseFrontmatter('---\nname: broken\n'), /Missing YAML frontmatter delimiters/);
  assert.throws(() => parseFrontmatter('---\nname: [broken\n---\n'), /Invalid YAML frontmatter/);
});

for (const stage of stages) {
  test(`skill ${stage} has metadata, contract, and only bundled handoffs`, () => {
    const path = resolve(root, 'skills', stage, 'SKILL.md');
    assert.ok(existsSync(path), `${stage} skill is missing`);
    const text = readFileSync(path, 'utf8');
    const metadata = parseFrontmatter(text);
    assert.equal(metadata.name, stage);
    assert.match(metadata.description, /^Use when /);
    assert.equal(metadata['user-invocable'], true);
    assert.equal(metadata['disable-model-invocation'], stage === 'start');
    assert.equal(typeof metadata['argument-hint'], 'string');
    assert.ok(text.split('\n').length < 500);
    for (const tag of ['objective', 'quick_start', 'success_criteria']) {
      assert.ok(text.includes(`<${tag}>`) && text.includes(`</${tag}>`), `Missing ${tag}`);
    }
    assert.ok(text.includes('../../references/workflow.md'), 'Shared contract is required');
    for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
      assert.ok(existsSync(resolve(dirname(path), match[1])), `Missing resource: ${match[1]}`);
    }
    for (const match of text.matchAll(/prd-buster:([a-z-]+)/g)) {
      assert.ok(stages.includes(match[1]), `Unknown handoff: ${match[1]}`);
    }
    assert.doesNotMatch(text, /superpowers:|mattpocock[^\s]*:|\bgrilling\b|domain-modeling|to-tickets/);
  });
}

test('bundle contains exactly seven skills and documents safe publication', () => {
  assert.deepEqual(readdirSync(resolve(root, 'skills')).sort(), [...stages].sort());
  const contract = read('references/workflow.md');
  for (const term of ['SHA-256', 'approval', 'untrusted', 'invalidate', 'single writer']) {
    assert.ok(contract.includes(term), `Missing contract term: ${term}`);
  }
  const publishing = read('skills/publish/SKILL.md');
  for (const term of ['unknown', 'reconcile', 'cycle', 'read back', 'Blocks']) {
    assert.ok(publishing.includes(term), `Missing publication safeguard: ${term}`);
  }
});

test('research precedes hardening and offers bounded depth without a new approval gate', () => {
  const researching = read('skills/research/SKILL.md');
  for (const term of ['standard', 'deep', 'primary sources', 'research.md', 'contradictions', 'budget', 'prd-buster:harden-spec']) {
    assert.ok(researching.includes(term), `Missing research requirement: ${term}`);
  }
  assert.ok(researching.includes('not a human approval gate'));
  const starting = read('skills/start/SKILL.md');
  assert.match(starting, /prd-buster:research/);
  assert.ok(starting.indexOf('prd-buster:research') < starting.indexOf('prd-buster:harden-spec'));
  assert.match(read('skills/harden-spec/SKILL.md'), /prd-buster:research/);
  const contract = read('references/workflow.md');
  for (const term of ['research.md', 'source_fingerprints', 'research_hash', 'schema_version', 'Legacy runs']) {
    assert.ok(contract.includes(term), `Missing research provenance requirement: ${term}`);
  }
});

test('every downstream stage checks research freshness before resuming', () => {
  for (const stage of ['harden-spec', 'draft-epics', 'draft-tickets', 'publish', 'estimate']) {
    const text = read(`skills/${stage}/SKILL.md`);
    assert.ok(text.includes('research freshness'), `${stage} must check research freshness`);
    assert.ok(text.includes('prd-buster:research'), `${stage} must route stale research back`);
  }
});

test('research snapshot consent persists without requiring live availability', () => {
  const contract = read('references/workflow.md');
  for (const term of ['as-of-snapshot', 'snapshot_confirmation', 'snapshot path/hash', 'as-of retrieval date', 'without requiring live availability']) {
    assert.ok(contract.includes(term), `Missing snapshot safeguard: ${term}`);
  }
});

test('Jira publication asks the user without a company-specific default', () => {
  const publishing = read('skills/publish/SKILL.md');
  assert.ok(publishing.includes('ask the user to select the site and project'));
  assert.doesNotMatch(publishing, /suggest [A-Z][A-Z0-9]+, never assume/);
});

test('estimation follows publication and requires human buffer decisions', () => {
  assert.ok(existsSync(resolve(root, 'skills/estimate/SKILL.md')), 'Estimation skill is missing');
  const estimating = read('skills/estimate/SKILL.md');
  for (const term of ['three', '10%', '20%', 'no buffer', 'custom percentage', 'rounding', 'relative']) {
    assert.ok(estimating.includes(term), `Missing estimation requirement: ${term}`);
  }
  assert.ok(read('skills/publish/SKILL.md').includes('prd-buster:estimate'));
});

test('dependency reconciliation covers Epic prerequisites and removed links', () => {
  assert.ok(read('skills/draft-tickets/SKILL.md').includes('Epic prerequisites'));
  const publishing = read('skills/publish/SKILL.md');
  for (const term of ['parent-Epic blockers', 'managed links', 'removals', 'verify absence']) {
    assert.ok(publishing.includes(term), `Missing dependency safeguard: ${term}`);
  }
});