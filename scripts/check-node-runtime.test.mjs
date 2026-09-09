import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

test('the runtime guard rejects process, engine, package-manager, and CI drift', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'piar-runtime-guard-'));
  const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');

  try {
    mkdirSync(path.join(root, 'scripts'));
    mkdirSync(path.join(root, '.github/workflows'), { recursive: true });
    const files = {
      '.nvmrc': read('.nvmrc'),
      'package.json': read('package.json'),
      'scripts/check-node-runtime.mjs': read('scripts/check-node-runtime.mjs'),
      '.github/workflows/build.yml':
        "steps:\n  - uses: actions/setup-node@v4\n    with:\n      node-version-file: '.nvmrc'\n",
    };

    for (const [name, content] of Object.entries(files)) {
      writeFileSync(path.join(root, name), content);
    }

    const run = () =>
      spawnSync(process.execPath, [path.join(root, 'scripts/check-node-runtime.mjs')], {
        encoding: 'utf8',
      });

    assert.equal(run().status, 0);

    for (const [name, content, message] of [
      ['.nvmrc', '20.19.6\n', /Current Node\.js/],
      [
        'package.json',
        files['package.json'].replace('>=24.20.0 <25', '>=20.19.6 <21'),
        /engines\.node/,
      ],
      [
        'package.json',
        files['package.json'].replace('pnpm@10.28.0', 'pnpm@latest'),
        /packageManager/,
      ],
      [
        '.github/workflows/build.yml',
        'steps:\n  - uses: actions/setup-node@v4\n    with:\n      node-version: 20\n',
        /hardcodes node-version/,
      ],
    ]) {
      writeFileSync(path.join(root, name), content);
      const result = run();
      assert.notEqual(result.status, 0, name);
      assert.match(result.stderr, message);
      writeFileSync(path.join(root, name), files[name]);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
