import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { prepareWorkspace } from './prepare-workspace.mjs';

const root = path.resolve(import.meta.dirname, '..');
const manifest = (file) => JSON.parse(readFileSync(path.join(root, file), 'utf8'));

test('scheduled consumers never start a second build of shared output', () => {
  assert.equal(
    prepareWorkspace({
      env: { TURBO_HASH: 'scheduled-task-hash' },
      run() {
        assert.fail('must not start a nested compiler');
      },
    }),
    0,
  );
});

test('direct package commands prepare only dependencies and propagate failures', () => {
  const cwd = path.join(root, 'apps/client/backoffice');
  let invocation;

  assert.equal(
    prepareWorkspace({
      cwd,
      env: {},
      run(...args) {
        invocation = args;
        return { status: 0 };
      },
    }),
    0,
  );

  assert.deepEqual(invocation.slice(0, 2), [
    'pnpm',
    ['exec', 'turbo', 'build', '--filter=@piar/backoffice^...'],
  ]);
  assert.equal(invocation[2].cwd, root);
  assert.equal(prepareWorkspace({ cwd, env: {}, run: () => ({ status: 7 }) }), 7);
  assert.equal(
    prepareWorkspace({ cwd, env: {}, run: () => ({ status: null, signal: 'SIGTERM' }) }),
    1,
  );
  assert.throws(
    () => prepareWorkspace({ cwd, env: {}, run: () => ({ error: new Error('spawn failed') }) }),
    /spawn failed/,
  );
  assert.throws(() => prepareWorkspace({ cwd: root, env: {} }), /named @piar application/);
});

test('all preparing applications use one coordinator and Turbo owns dependency ordering', () => {
  const config = manifest('turbo.json');
  for (const task of ['build', 'typecheck', 'test', 'test:coverage', 'dev', 'test:watch']) {
    assert.ok(
      config.tasks[task].dependsOn.includes('^build'),
      `${task} must finish dependency builds first`,
    );
  }

  assert.ok(config.globalDependencies.includes('.nvmrc'));
  assert.ok(config.globalDependencies.includes('scripts/prepare-workspace.mjs'));

  let consumers = 0;
  for (const area of ['api', 'client']) {
    for (const entry of readdirSync(path.join(root, 'apps', area), { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;

      const directory = path.join('apps', area, entry.name);
      const { scripts = {} } = manifest(path.join(directory, 'package.json'));
      const preparation = scripts['workspace:prepare'] ?? scripts['build:prepare'];
      if (!preparation) continue;

      consumers += 1;
      assert.equal(preparation, 'node ../../../scripts/prepare-workspace.mjs', directory);
      assert.ok(
        !JSON.stringify(scripts).includes('^... build'),
        'no nested pnpm dependency builds',
      );
      assert.ok(
        !readdirSync(path.join(root, directory)).includes('turbo.json'),
        'review per-app Turbo overrides before bypassing the shared dependency gate',
      );
    }
  }

  assert.equal(consumers, 4);
});
