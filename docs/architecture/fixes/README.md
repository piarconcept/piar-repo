# Architecture Fix Notes

This directory is the registry for resolved architecture bugs and structural lessons.

Use it to preserve learning that should become part of the repository's long-term memory instead of staying in chat threads, commits, or PR comments.

## What Counts As An Architecture Bug

Create an entry here when the real root cause was related to:

- package boundaries or ownership,
- BFF or client responsibilities,
- domain or infrastructure layering,
- contracts, schemas, DTO flow, or cross-service coupling,
- monorepo wiring, build orchestration, or dependency structure,
- persistence or migration design,
- repeated structural decisions that can reintroduce the same class of failure.

## Rules

- Keep entries in English.
- Create one file per architecture root cause.
- Use the filename format `YYYY-MM-DD-short-slug.md`.
- Start new entries from `TEMPLATE.md`.
- Add the newest entry to the top of the index below.
- If the fix also produced reusable operational lessons, cross-link a supporting note in `docs/learning-log/` instead of duplicating the same narrative.
- If the fix changes a stable workflow or architecture rule, also update the relevant document in `docs/features/`, `docs/waves/`, `docs/AI-context.md`, or `README.md`.

## Index

- `2026-09-09-framework-dependency-alignment.md` - Established one compatible Next, React, Nest integration, and pnpm override contract.
- `2026-09-09-single-owner-dependency-builds.md` - Made Turbo the sole owner of scheduled shared builds while preserving direct app preparation.
- `2026-06-07-backoffice-feature-boundaries.md` - Moved backoffice accounts and search implementation from app-local folders into feature API packages.
- `2026-05-08-bounded-list-contract.md` - Removed whole-table `getAll` contracts and moved list/search behavior to bounded repository queries.
- `2026-05-07-template-wave-clean-baseline.md` - Added wave execution docs, cleanup verification, generated artifact hygiene, and app dependency preparation.

## Last Updated

9 September 2026 - Added framework alignment and single-owner dependency-build fixes
