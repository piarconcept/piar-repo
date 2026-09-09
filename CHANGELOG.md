# Changelog

All notable changes to this template will be documented in this file.

This project follows Conventional Commits and keeps a single "Unreleased" section until a tagged release is created.

## Unreleased

- Reduced GitHub Actions to one push/manual verification workflow and fixed the Linux process
  preflight self-match that made valid CI runs fail.
- Migrated local development, CI, hooks, engines, and the frozen dependency graph to Node.js
  24.20.0.
- Added executable runtime and dependency-alignment guards plus Node 24 Tailwind/jsdom regressions.
- Aligned Next.js 15, React 19.1, Node typings, and NestJS 11 integration packages.
- Made Turbo the single owner of scheduled shared dependency builds.
- Added the Catalonia OS selective-backport audit and required Terraform retention question for
  template personalization.
- Added execution waves docs and templates for feature work and multi-agent planning.
- Added `pnpm clean` for formatting, artifact hygiene, and final verification.
- Hardened generated artifact detection and verify cleanup.
- Added architecture fix memory for structural repository learnings.
- Added app prepare scripts so local app builds/dev commands build workspace dependencies first.
- Initial template baseline.
- Added a context engineering protocol and learning-log template for documenting important errors and resolutions.
