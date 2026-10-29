import assert from 'node:assert/strict';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));

test('marketplace identifies the personal public catalog', () => {
  const marketplace = readJson('.claude-plugin/marketplace.json');
  assert.equal(marketplace.name, 'mowenpark-ai-toolbox');
  assert.equal(marketplace.owner.name, 'mowenpark');
  assert.ok(marketplace.description.trim());
  assert.ok(Array.isArray(marketplace.plugins));
  assert.equal(new Set(marketplace.plugins.map((plugin) => plugin.name)).size, marketplace.plugins.length);
  assert.ok(readFileSync(resolve(root, 'LICENSE'), 'utf8').startsWith('MIT License\n'));
});

test('catalog entries resolve to self-contained licensed plugins', () => {
  const marketplace = readJson('.claude-plugin/marketplace.json');
  for (const entry of marketplace.plugins) {
    assert.match(entry.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(entry.source, `./plugins/${entry.name}`);
    const pluginRoot = realpathSync(resolve(root, entry.source));
    assert.ok(pluginRoot.startsWith(`${realpathSync(root)}${sep}plugins${sep}`));
    const manifest = JSON.parse(readFileSync(resolve(pluginRoot, '.claude-plugin/plugin.json'), 'utf8'));
    assert.equal(manifest.name, entry.name);
    assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
    assert.equal(manifest.license, 'MIT');
    assert.equal(manifest.repository, 'https://github.com/mowenpark/ai-toolbox');
    assert.equal(manifest.author.name, 'mowenpark');
    assert.ok(existsSync(resolve(pluginRoot, 'LICENSE')));
    assert.ok(!existsSync(resolve(pluginRoot, '.claude-plugin/marketplace.json')));
  }
});