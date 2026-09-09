# GitHub CI/CD Workflows

**Status**: ✅ Active  
**Created**: 2026-01-15  
**Last Updated**: 2026-09-09

## Overview

This document describes the single GitHub Actions workflow configured for continuous integration
in this repository.

## Workflows

### CI - Verify (`ci.yml`)

**Trigger**:

- Push to `main` branch
- Manual execution through `workflow_dispatch`

**Purpose**: Runs complete verification of the entire monorepo to ensure code quality and functionality.

**Steps**:

1. **Checkout code** - Checks out the repository code
2. **Setup Node.js** - Installs the exact version from `.nvmrc`
3. **Install pnpm 10.28.0** - Installs the exact pnpm version used in the project
4. **Setup pnpm cache** - Uses the cache built into `actions/setup-node`
5. **Install dependencies** - Runs `pnpm install --frozen-lockfile`
6. **Run verification** - Executes `pnpm verify` which runs:
   - Local generated artifact cleanup and check
   - Runtime and dependency compatibility preflights
   - Install dependencies in an isolated scratch copy
   - Build all packages
   - Type checking
   - Formatting check
   - Test participation policy
   - Repository tooling regression tests
   - Tests without coverage
   - Linting
   - Final generated artifact cleanup and worktree drift check

**Environment**:

- Runner: `ubuntu-latest`
- Node.js: `24.20.0`, sourced from `.nvmrc`
- pnpm: `10.28.0`

**Caching Strategy**:

- Caches pnpm store based on `pnpm-lock.yaml` hash
- Reduces installation time on subsequent runs
- Fallback to latest cache if exact match not found

Coverage remains available as the local `pnpm test:coverage` command but is not duplicated in CI.
The verification gate already runs the complete non-coverage test suite.

## Workflow Scope

`CI - Verify` is the only repository workflow. Pull requests do not create a second run; verification
runs once after changes reach `main`, and maintainers can start the same workflow manually when
needed. Dependabot version and security updates are not configured for this repository.

## Usage

### Running Locally

To run the same checks that CI runs:

```bash
pnpm clean
```

This formats tracked and unignored files, cleans generated artifacts, checks artifact hygiene, and executes the `scripts/verify-all.sh` verification flow.

### Monitoring CI

1. Go to the repository on GitHub
2. Click on the "Actions" tab
3. Select the "CI - Verify" workflow
4. View the latest runs and their status

### Pull Request Verification

Run `pnpm clean` locally before merging a pull request. GitHub runs the complete verification after
the result is pushed to `main`, avoiding duplicate runs for both the pull request and its merge.

## Configuration Files

- **Workflow**: `.github/workflows/ci.yml`
- **Verification Script**: `scripts/verify-all.sh`
- **Package Scripts**: `package.json` (root)

## Best Practices

1. **Always run `pnpm clean` locally** before pushing to ensure formatting, artifact hygiene, and CI verification pass
2. **Check CI logs** if a build fails to understand what went wrong
3. **Keep dependencies updated** to avoid security vulnerabilities
4. **Run `pnpm test:coverage` locally** when coverage evidence is required

## Troubleshooting

### CI Fails on Install

- Check if `pnpm-lock.yaml` is committed
- Ensure Node.js version exactly matches `.nvmrc` (`24.20.0`)
- Verify pnpm version matches (10.28.0)

### CI Fails on Build

- Run `pnpm build` locally to reproduce
- Check TypeScript errors
- Ensure all dependencies are properly installed

### CI Fails on Tests

- Run `pnpm test` locally
- Check test failures in the logs
- Ensure tests don't depend on local environment

### CI Fails on Lint

- Run `pnpm lint` locally
- Fix linting errors
- Consider running `pnpm lint --fix` for auto-fixable issues

## Future Enhancements

Potential improvements to consider:

1. **Deployment Workflows** - Add CD workflows only when a product profile requires deployment
2. **Performance Testing** - Add performance benchmarks
3. **Security Scanning** - Add bounded scanning only when there is an owner for its findings
4. **Matrix Testing** - Test on multiple Node.js versions only if the runtime contract expands

## Related Documentation

- [repository-configuration.md](repository-configuration.md) - Repository setup and conventions
- [testing-guide.md](testing-guide.md) - Testing standards and practices
- [eslint-configuration.md](eslint-configuration.md) - Linting configuration

## Maintenance

- Review workflow performance monthly
- Update Node.js only through `.nvmrc`, then align engines, lockfile, docs, and runtime tests
- Adjust caching strategy if build times increase
- Monitor artifact storage usage

## Last Updated

9 September 2026 - Reduced Actions to one push/manual Verify workflow and removed duplicate
coverage, PR, scheduled security, and custom-cache runs
