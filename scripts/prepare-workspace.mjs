#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function prepareWorkspace({ cwd = process.cwd(), env = process.env, run = spawnSync } = {}) {
  if (env.TURBO_HASH) return 0;

  const manifest = JSON.parse(readFileSync(path.join(cwd, 'package.json'), 'utf8'));
  if (!/^@piar\/[a-z0-9-]+$/.test(manifest.name ?? '')) {
    throw new Error('Workspace preparation must run from a named @piar application package.');
  }

  const result = run('pnpm', ['exec', 'turbo', 'build', `--filter=${manifest.name}^...`], {
    cwd: path.resolve(import.meta.dirname, '..'),
    env,
    stdio: 'inherit',
  });

  if (result.error) throw result.error;
  return result.status ?? 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = prepareWorkspace();
}
