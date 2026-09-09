#!/usr/bin/env node

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
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

function readText(relativePath) {
  return readFileSync(path.join(repositoryRoot, relativePath), 'utf8');
}

function parseExactNodeVersion(value, source) {
  const version = value.trim();
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);

  if (!match) {
    throw new Error(`${source} must contain exactly one full major.minor.patch semantic version.`);
  }

  return {
    version,
    major: Number.parseInt(match[1], 10),
  };
}

function findPackageManifests(directory) {
  const manifests = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      manifests.push(...findPackageManifests(absolutePath));
    } else if (entry.isFile() && entry.name === 'package.json') {
      manifests.push(absolutePath);
    }
  }

  return manifests;
}

const expectedNode = parseExactNodeVersion(readText('.nvmrc'), '.nvmrc');
const expectedEngine = `>=${expectedNode.version} <${expectedNode.major + 1}`;
const currentNodeVersion = process.versions.node;
const errors = [];
let engineDeclarationCount = 0;
let setupNodeStepCount = 0;

if (currentNodeVersion !== expectedNode.version) {
  errors.push(
    `Current Node.js is ${currentNodeVersion}, but .nvmrc requires exactly ${expectedNode.version}. Run 'nvm install ${expectedNode.version}' and 'nvm use ${expectedNode.version}'.`,
  );
}

for (const manifestPath of findPackageManifests(repositoryRoot)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const declaredEngine = manifest.engines?.node;

  if (declaredEngine === undefined) {
    continue;
  }

  engineDeclarationCount += 1;

  if (declaredEngine !== expectedEngine) {
    errors.push(
      `${path.relative(repositoryRoot, manifestPath)} declares engines.node=${JSON.stringify(declaredEngine)}; expected ${JSON.stringify(expectedEngine)} from .nvmrc.`,
    );
  }
}

const rootManifest = JSON.parse(readText('package.json'));

if (rootManifest.engines?.node === undefined) {
  errors.push('package.json must declare engines.node.');
}

if (!/^pnpm@\d+\.\d+\.\d+$/.test(rootManifest.packageManager ?? '')) {
  errors.push('package.json must pin packageManager to one exact pnpm semantic version.');
}

const workflowsDirectory = path.join(repositoryRoot, '.github', 'workflows');

for (const entry of readdirSync(workflowsDirectory, { withFileTypes: true })) {
  if (!entry.isFile() || !/\.ya?ml$/.test(entry.name)) {
    continue;
  }

  const relativePath = path.join('.github', 'workflows', entry.name);
  const workflow = readText(relativePath);
  const setupCount = (workflow.match(/uses:\s*actions\/setup-node@/g) ?? []).length;

  if (setupCount === 0) {
    continue;
  }

  setupNodeStepCount += setupCount;

  if (/^\s*node-version:\s*/m.test(workflow)) {
    errors.push(`${relativePath} hardcodes node-version; use node-version-file: '.nvmrc'.`);
  }

  const nvmReferenceCount = (workflow.match(/node-version-file:\s*['"]?\.nvmrc['"]?/g) ?? [])
    .length;

  if (nvmReferenceCount !== setupCount) {
    errors.push(
      `${relativePath} has ${setupCount} setup-node step(s) but ${nvmReferenceCount} .nvmrc reference(s).`,
    );
  }
}

if (errors.length > 0) {
  console.error('Node.js runtime alignment failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Node.js runtime aligned with .nvmrc: expected ${expectedNode.version}, actual ${currentNodeVersion}, ${engineDeclarationCount} engine declaration(s), ${setupNodeStepCount} setup-node step(s).`,
);
