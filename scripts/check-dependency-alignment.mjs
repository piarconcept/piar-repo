#!/usr/bin/env node

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirectories = new Set([
  '.git',
  '.next',
  '.pnpm-store',
  '.serverless',
  '.turbo',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'out',
]);

const expected = {
  next: '15.5.25',
  nextPeer: '>=15.5.25 <16',
  react: '19.1.0',
  reactDom: '19.1.0',
  nodeTypes: '^24.13.3',
  nestConfig: '^4.0.4',
  nestSwagger: '^11.4.7',
};

function findPackageManifests(directory) {
  const manifests = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;

    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      manifests.push(...findPackageManifests(absolutePath));
    } else if (entry.isFile() && entry.name === 'package.json') {
      manifests.push(absolutePath);
    }
  }

  return manifests;
}

function readWorkspaceOverrides(repositoryRoot) {
  const workspace = readFileSync(path.join(repositoryRoot, 'pnpm-workspace.yaml'), 'utf8');
  const overrides = new Map();
  let inOverrides = false;

  for (const line of workspace.split(/\r?\n/)) {
    if (line === 'overrides:') {
      inOverrides = true;
      continue;
    }

    if (inOverrides && /^\S/.test(line)) break;
    const match = inOverrides ? line.match(/^  ([^:]+):\s*(.+)$/) : null;
    if (match) overrides.set(match[1], match[2].replace(/^['"]|['"]$/g, ''));
  }

  return overrides;
}

export function checkDependencyAlignment(repositoryRoot = scriptRoot) {
  const errors = [];
  const overrides = readWorkspaceOverrides(repositoryRoot);
  const requiredOverrides = {
    next: expected.next,
    react: expected.react,
    'react-dom': expected.reactDom,
  };

  for (const [name, version] of Object.entries(requiredOverrides)) {
    if (overrides.get(name) !== version) {
      errors.push(`pnpm-workspace.yaml must override ${name} to ${version}.`);
    }
  }

  for (const manifestPath of findPackageManifests(repositoryRoot)) {
    const relativePath = path.relative(repositoryRoot, manifestPath);
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

    for (const section of [
      'dependencies',
      'devDependencies',
      'optionalDependencies',
      'peerDependencies',
    ]) {
      const dependencies = manifest[section] ?? {};

      if ('@testing-library/react-hooks' in dependencies) {
        errors.push(`${relativePath} uses the obsolete React hooks testing package.`);
      }

      if (dependencies['@types/node'] && dependencies['@types/node'] !== expected.nodeTypes) {
        errors.push(`${relativePath} must declare @types/node=${expected.nodeTypes}.`);
      }

      if (dependencies.next) {
        const expectedNext = section === 'peerDependencies' ? expected.nextPeer : expected.next;
        if (dependencies.next !== expectedNext) {
          errors.push(`${relativePath} ${section}.next must be ${expectedNext}.`);
        }
      }

      if (
        dependencies['@nestjs/config'] &&
        dependencies['@nestjs/config'] !== expected.nestConfig
      ) {
        errors.push(`${relativePath} must declare @nestjs/config=${expected.nestConfig}.`);
      }

      if (
        dependencies['@nestjs/swagger'] &&
        dependencies['@nestjs/swagger'] !== expected.nestSwagger
      ) {
        errors.push(`${relativePath} must declare @nestjs/swagger=${expected.nestSwagger}.`);
      }
    }

    if (relativePath === 'package.json') {
      if (manifest.devDependencies?.react !== expected.react) {
        errors.push(`package.json must pin react=${expected.react}.`);
      }
      if (manifest.devDependencies?.['react-dom'] !== expected.reactDom) {
        errors.push(`package.json must pin react-dom=${expected.reactDom}.`);
      }
    }

    if (
      ['apps/client/web/package.json', 'apps/client/backoffice/package.json'].includes(relativePath)
    ) {
      if (manifest.dependencies?.next !== manifest.devDependencies?.['eslint-config-next']) {
        errors.push(`${relativePath} must keep next and eslint-config-next on the same version.`);
      }
    }
  }

  return errors;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const errors = checkDependencyAlignment();

  if (errors.length > 0) {
    console.error('Dependency alignment failed:');
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(
    `Dependency stack aligned: Node types ${expected.nodeTypes}, Next ${expected.next}, React ${expected.react}, Nest config ${expected.nestConfig}, Nest Swagger ${expected.nestSwagger}.`,
  );
}
