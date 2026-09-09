import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { checkDependencyAlignment } from './check-dependency-alignment.mjs';

const repositoryRoot = path.resolve(import.meta.dirname, '..');

function copyManifestTree(source, destination) {
  cpSync(source, destination, {
    recursive: true,
    filter: (entry) => {
      if (['.turbo', 'dist', 'node_modules'].includes(path.basename(entry))) return false;
      return statSync(entry).isDirectory() || path.basename(entry) === 'package.json';
    },
  });
}

test('the dependency guard rejects framework, type, and obsolete test-library drift', () => {
  const fixtureRoot = mkdtempSync(path.join(tmpdir(), 'piar-dependency-alignment-'));

  try {
    for (const file of ['package.json', 'pnpm-workspace.yaml']) {
      cpSync(path.join(repositoryRoot, file), path.join(fixtureRoot, file));
    }
    copyManifestTree(path.join(repositoryRoot, 'apps'), path.join(fixtureRoot, 'apps'));
    copyManifestTree(path.join(repositoryRoot, 'packages'), path.join(fixtureRoot, 'packages'));

    assert.deepEqual(checkDependencyAlignment(fixtureRoot), []);

    const cases = [
      ['packages/ui/layout/package.json', '>=15.5.25 <16', '^16.0.0', /peerDependencies\.next/],
      ['apps/client/web/package.json', '15.5.25', '16.0.0', /dependencies\.next/],
      ['apps/api/web-bff/package.json', '^4.0.4', '^3.3.0', /@nestjs\/config/],
      ['packages/features/auth/api/package.json', '^11.4.7', '^8.0.7', /@nestjs\/swagger/],
      ['packages/domain/dynamic-form/package.json', '^24.13.3', '^20.0.0', /@types\/node/],
    ];

    for (const [file, current, stale, expectedError] of cases) {
      const absolutePath = path.join(fixtureRoot, file);
      const original = readFileSync(absolutePath, 'utf8');
      writeFileSync(absolutePath, original.replace(current, stale));
      assert.match(checkDependencyAlignment(fixtureRoot).join('\n'), expectedError);
      writeFileSync(absolutePath, original);
    }

    const healthManifestPath = path.join(
      fixtureRoot,
      'packages/features/health/client/package.json',
    );
    const healthManifest = JSON.parse(readFileSync(healthManifestPath, 'utf8'));
    healthManifest.devDependencies['@testing-library/react-hooks'] = '^8.0.1';
    writeFileSync(healthManifestPath, `${JSON.stringify(healthManifest, null, 2)}\n`);
    assert.match(checkDependencyAlignment(fixtureRoot).join('\n'), /obsolete React hooks/);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});
