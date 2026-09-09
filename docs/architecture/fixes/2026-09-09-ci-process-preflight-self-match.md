# CI Process Preflight Self-Match

## Summary

The verification process guard reported its own `awk` classifier as an active development process
on GitHub's Linux runner. This made otherwise valid verification runs fail before build and test
execution.

## Date

2026-09-09

## Status

- [x] Resolved
- [ ] Follow-up needed

## Architecture Scope

- Apps or packages: repository verification tooling and GitHub Actions
- Layers or boundaries involved: host-process inspection, local artifact hygiene, and CI execution
- Contracts, schemas, persistence, or build concerns: `pnpm verify` must reject real local watch
  processes without rejecting its own classifier

## Symptoms

- `CI - Verify` stopped immediately after the runtime and dependency checks.
- The reported offending process was the `awk` command inside `find_active_dev_processes`.
- The classifier's command line contained its own `next dev`, Nest watch, TypeScript watch, and
  Turbo dev patterns, so it satisfied the rules it was evaluating.

## Impact

Every push and pull-request verification after the process preflight was introduced appeared red,
even though the Node.js 24 migration passed the same build, typecheck, test, and lint gates locally.
Repeated pull-request and merge triggers amplified the false signal.

## Why This Was Architectural

The failure crossed the boundary between the verification orchestrator and the host process table.
The classifier was participating in the live process set it was trying to classify, so changing an
individual regular expression would not make the inspection model reliable.

## Root Cause

`ps` and `awk` ran concurrently in one pipeline. Linux `ps` therefore captured the active `awk`
process, including the full classifier source in its command-line arguments. Those arguments
contained the watched-process patterns and the repository path.

## Resolution

- Capture a completed `ps` snapshot before starting `awk`.
- Run the existing bounded repository and process-pattern classifier against that immutable
  snapshot.
- Keep one GitHub workflow triggered on pushes to `main` or manual dispatch.
- Remove the duplicate pull-request run, separate coverage rerun, scheduled security workflow, and
  custom cache plumbing.

## Verification

- Tests added or updated: existing runtime and tooling guards exercise the resulting workflow
  contract.
- Commands run: exact-runtime tooling tests, formatting, artifact check, and `CI=true pnpm verify`.
- Manual verification: inspected the failed GitHub run and confirmed the only reported process was
  the classifier itself.

## Guardrails

- Process discovery must finish before any pattern classifier starts.
- `CI - Verify` remains the only workflow and `pnpm verify` remains its only quality command.
- The workflow runs once after a push to `main` and can be dispatched manually.

## Cross-References

- Related feature docs: `docs/features/github-workflows.md`, `docs/features/quality-gates.md`
- Related wave docs: `docs/waves/2026-09-09/2026-09-09_wave_1/implementation-report.md`
- Related learning-log entries: `docs/learning-log/2026-09-09-node24-runtime-compatibility.md`
- Relevant files: `.github/workflows/ci.yml`, `scripts/verify-all.sh`

## Last Updated

9 September 2026 - Captured and fixed the Linux CI process-classifier self-match.
