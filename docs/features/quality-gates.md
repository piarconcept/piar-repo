# Quality Gates

## Purpose

Define formatting, commit rules, and local hooks that keep the template consistent.

## Formatting

- **Tool**: Prettier
- **Config**: `prettier.config.cjs`
- **Ignore**: `.prettierignore`
- **EditorConfig**: `.editorconfig` keeps editors consistent

Commands:

```bash
pnpm format        # auto-format tracked and unignored files
pnpm format:check  # verify formatting for tracked and unignored files
pnpm clean         # format, clean generated artifacts, and finish with verify
```

`pnpm format` and `pnpm format:check` operate on `git ls-files --cached --others --exclude-standard` so ignored generated files are not formatted accidentally. The formatting helper filters out paths that no longer exist in the visible worktree, so pending tracked-file deletions do not make Prettier fail before the deletion is committed.

When the command runs in a scratch copy without `.git`, it falls back to `prettier .`; generated directories are still excluded through `.prettierignore`.

## Generated Artifact Hygiene

Generated artifacts must not be committed.

Commands:

```bash
pnpm artifacts:clean  # remove generated artifacts
pnpm artifacts:check  # fail if generated artifacts are present
```

The artifact checker covers generated directories such as `build`, `coverage`, `.runtime`, `cdk.out`, `dist`, `.next`, `out`, and `.serverless`. It also detects untracked `.js`, `.js.map`, `.d.ts`, and `.d.ts.map` files emitted next to TypeScript sources under `src/`.

## Commit Rules

- **Tool**: commitlint
- **Config**: `commitlint.config.cjs`
- **Standard**: Conventional Commits

Example:

```
feat(ui): add button variants
fix(api): handle missing auth token
```

## Git Hooks

- **Tool**: husky
- **Hooks**:
  - `pre-commit`: validates Node.js alignment, then runs `pnpm lint-staged`
  - `commit-msg`: validates Node.js alignment, then runs commitlint

## lint-staged

Only formats staged files to keep commits fast.

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx,md,json,yml,yaml,css,scss}": [
    "prettier --write"
  ]
}
```

## CI Alignment

`pnpm verify` includes:

- exact Node.js, pnpm, workflow, and dependency alignment preflights
- an active repository-local dev/watch process check based on a completed process snapshot
- local generated artifact cleanup
- generated artifact check
- reproducible install in an isolated scratch copy
- build
- typecheck
- format check
- test participation policy
- repository tooling regression tests
- tests without coverage
- lint
- final local generated artifact cleanup
- final generated artifact check
- visible worktree drift check after artifact hygiene

`pnpm verify` is the CI parity command. Use `pnpm clean` before final handoff when files were edited locally because it also formats before running `verify`.

The process preflight captures `ps` output before running its `awk` classifier. This prevents the
classifier process from seeing its own pattern text and falsely reporting itself as an active
development server on Linux CI runners.

## Last Updated

9 September 2026 - Made the development-process preflight snapshot-based to avoid CI self-matches
