#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
scratch_dir=""
status_before_file=""
status_after_file=""

assert_package_manager() {
  local required_pnpm_version
  local current_pnpm_version

  required_pnpm_version="$(node -p "require('./package.json').packageManager.split('@').at(-1)")"
  current_pnpm_version="$(pnpm --version 2>/dev/null || true)"

  if [[ "${current_pnpm_version}" != "${required_pnpm_version}" ]]; then
    echo "verify requires pnpm ${required_pnpm_version}; current version is ${current_pnpm_version:-unavailable}." >&2
    echo "Run 'corepack enable' and 'corepack prepare pnpm@${required_pnpm_version} --activate', then retry." >&2
    exit 1
  fi
}

find_active_dev_processes() {
  local process_snapshot

  process_snapshot="$(ps -Ao pid=,ppid=,command= 2>/dev/null)" || return 1

  awk \
    -v repo_root="${repo_root}" \
    -v verify_pid="$$" '
      {
        pid = $1
        parent_pid = $2
        command_line = $0

        if (pid == verify_pid) next
        if (parent_pid == verify_pid) next
        if (index(command_line, repo_root) == 0) next

        is_dev_process = 0
        if (command_line ~ /next dev([[:space:]]|$)/) is_dev_process = 1
        if (command_line ~ /nest start.*--watch/) is_dev_process = 1
        if (command_line ~ /\/tsc .*--watch/) is_dev_process = 1
        if (command_line ~ /\/turbo .*dev([[:space:]]|$)/) is_dev_process = 1

        if (is_dev_process) print
      }
    ' <<<"${process_snapshot}"
}

cleanup() {
  if [[ -n "${scratch_dir}" && -d "${scratch_dir}" ]]; then
    rm -rf "${scratch_dir}"
  fi

  if [[ -n "${status_before_file}" && -f "${status_before_file}" ]]; then
    rm -f "${status_before_file}"
  fi

  if [[ -n "${status_after_file}" && -f "${status_after_file}" ]]; then
    rm -f "${status_after_file}"
  fi
}

trap cleanup EXIT

run_step() {
  local label="$1"
  shift

  printf '\n[%s]\n' "${label}"
  "$@"
}

run_in_scratch() {
  local label="$1"
  shift

  printf '\n[%s]\n' "${label}"
  (
    cd "${scratch_dir}/repo"
    CI=true "$@"
  )
}

capture_status_snapshot() {
  local output_file="$1"

  git status --porcelain=v1 --untracked-files=all | LC_ALL=C sort >"${output_file}"
}

cd "${repo_root}"

node scripts/check-node-runtime.mjs
node scripts/check-dependency-alignment.mjs
assert_package_manager

if ! command -v rsync >/dev/null 2>&1; then
  echo "verify requires rsync to prepare an isolated workspace copy." >&2
  exit 1
fi

if ! active_dev_processes="$(find_active_dev_processes)"; then
  echo "verify could not inspect active repository-local processes." >&2
  exit 1
fi

if [[ -n "${active_dev_processes}" ]]; then
  echo "verify cannot run while repository-local dev/watch processes are generating artifacts:" >&2
  printf '%s\n' "${active_dev_processes}" >&2
  echo "Stop the listed processes, then retry 'pnpm verify'." >&2
  exit 1
fi

run_step "1/13 local artifact clean" pnpm artifacts:clean

status_before_file="$(mktemp "${TMPDIR:-/tmp}/piar-verify-status-before.XXXXXX")"
status_after_file="$(mktemp "${TMPDIR:-/tmp}/piar-verify-status-after.XXXXXX")"

capture_status_snapshot "${status_before_file}"

run_step "2/13 generated artifact check" pnpm artifacts:check

scratch_dir="$(mktemp -d "${TMPDIR:-/tmp}/piar-verify.XXXXXX")"
mkdir -p "${scratch_dir}/repo"

rsync \
  -a \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude '.pnpm-store/' \
  --exclude '.turbo/' \
  --exclude 'coverage/' \
  --exclude 'build/' \
  --exclude 'dist/' \
  --exclude '.next/' \
  --exclude 'out/' \
  --exclude '.runtime/' \
  --exclude 'cdk.out/' \
  --exclude '.serverless/' \
  "${repo_root}/" \
  "${scratch_dir}/repo/"

run_in_scratch "3/13 reproducible install" pnpm install --frozen-lockfile
run_in_scratch "4/13 build" pnpm build
run_in_scratch "5/13 typecheck" pnpm typecheck
run_in_scratch "6/13 format check" pnpm format:check
run_in_scratch "7/13 test participation policy" pnpm test:policy
run_in_scratch "8/13 tooling script tests" pnpm test:scripts
run_in_scratch "9/13 workspace tests without coverage" pnpm test
run_in_scratch "10/13 lint" pnpm lint

run_step "11/13 final local artifact clean" pnpm artifacts:clean
run_step "12/13 generated artifact check" pnpm artifacts:check

capture_status_snapshot "${status_after_file}"

if ! cmp -s "${status_before_file}" "${status_after_file}"; then
  echo
  echo "13/13 git status drift detected"
  echo "verify must not change the visible worktree after local artifact hygiene."
  echo
  echo "Before verify:"
  if [[ -s "${status_before_file}" ]]; then
    cat "${status_before_file}"
  else
    printf '<clean>\n'
  fi
  echo
  echo "After:"
  if [[ -s "${status_after_file}" ]]; then
    cat "${status_after_file}"
  else
    printf '<clean>\n'
  fi
  echo
  echo "Diff:"
  diff -u "${status_before_file}" "${status_after_file}" || true
  exit 1
fi

echo
echo "13/13 git status unchanged"
echo "verify completed successfully and left the worktree artifact-free."
