# Catalonia OS To Turbo Template Backport Audit

## Purpose

Audit the evolution of Catalonia OS against the current PIAR turbo template and decide which
changes should be brought back into the parent template.

This is a selective-backport audit, not an instruction to merge or copy the Catalonia OS tree over
the template. Catalonia OS is now a production product with its own identity, application topology,
AWS account, data model, rollout state, and operational history. The parent template also evolved
after Catalonia OS was created.

## Audit Snapshot

Audit date: 28 August 2026.

| Repository     | Audited revision | Working tree at audit time                                    |
| -------------- | ---------------- | ------------------------------------------------------------- |
| Turbo template | `f2bc746`        | Clean                                                         |
| Catalonia OS   | `e6a7cfa`        | 19 modified tracked files and 5 untracked documentation files |

The Catalonia OS working tree contains an uncommitted DNS audit and AWS Budget update. This report
classifies that work separately from the committed product baseline.

### Implementation Follow-Up - 9 September 2026

Wave 1 of the audit roadmap has now been selectively implemented against the parent template:

- Node.js is pinned to `24.20.0` across local, manifest, hook, and CI owners.
- Next.js 15.5.25, React 19.1.0, Node 24 typings, and NestJS 11 integrations form one guarded
  dependency contract.
- Turbo owns scheduled shared builds and direct app commands use one bounded coordinator.
- runtime, dependency, Tailwind, jsdom, and coordinator tests run through the root tooling gate.
- repository-wide build, typecheck, tests, and lint pass locally under the exact runtime.

The source-backed type-entrypoint correction and safe backend error response remain open Wave 1
items. The neutral Terraform profile remains Wave 2: the initial-question gate now requires an
explicit yes/no retention answer, but the infrastructure boilerplate, ownership manifest, persisted
selection, and tested removal command have not yet been added.

### Exact Shared Baseline

The Catalonia OS initial commit, `1cbed95` from 22 June 2026, has tree
`d8c1ec3379fe6dd554c9265ecdfff0f107db88f0`. That tree is identical to turbo-template commit
`d313162` from 5 June 2026.

This provides an exact comparison point even though the two repositories have separate Git
histories.

From that shared tree:

- the current turbo template changed 48 files with 1,285 insertions and 181 deletions;
- committed Catalonia OS changed 1,460 files with 69,879 insertions and 15,008 deletions;
- the uncommitted Catalonia OS work changes another 19 tracked files with 391 insertions and 91
  deletions, plus 5 new documentation files.

The Catalonia count includes product copy, identity replacement, legacy website content, images,
and application-specific functionality. It must not be interpreted as a template quality score.

## Quantitative Inventory

| Dimension                    | Turbo template | Catalonia OS |
| ---------------------------- | -------------- | ------------ |
| Tracked files                | 690            | 1,608        |
| Workspace packages/apps      | 37             | 49           |
| Test/spec files              | 51             | 119          |
| Markdown files under `docs/` | 55             | 310          |
| GitHub workflow files        | 2              | 4            |

The two trees still share 573 tracked paths. Catalonia has 1,035 tracked paths not present in the
parent; 353 of those are under client applications and include substantial product media. The
parent has 117 paths not present in Catalonia, including the later Accounts and Search feature
package extraction.

## Executive Conclusion

The correct direction is:

1. keep the current turbo template as the integration base;
2. backport repository-correctness fixes first;
3. extract a neutral AWS/Terraform starter as a built-in, removable profile that initialization
   keeps only after an explicit user choice and that plans zero resources until configured;
4. add optional DynamoDB, React Router/Vite, Expo, and integration-service profiles only after the
   base remains green;
5. preserve the parent's PostgreSQL/TypeORM, authentication, Accounts, and Search baseline unless a
   future template-profile decision explicitly replaces them.

Do not merge Catalonia OS wholesale. Its database replacement, authentication removal, client
topology, public content, production resource state, and rollout guards are product decisions, not
universal template upgrades.

## Parent Findings Exposed By Catalonia OS

These are the highest-value findings because the Catalonia work demonstrates a concrete failure and
the parent still contains the pre-fix contract.

### P0. Framework Dependency Alignment - Resolved 9 September 2026

The parent Web and Backoffice applications run Next.js `15.5.9` but declare
`eslint-config-next` `16.1.2`. The shared client error package also declares a Next.js 16 peer range.
Catalonia's Amplify hoisted install exposed this split, together with multiple React runtimes, as a
production build failure.

Backport:

- align `eslint-config-next` with the active Next.js version;
- align shared-package Next.js peer ranges with the deployable application;
- make React ownership deterministic for any required hoisted install;
- move pnpm overrides to `pnpm-workspace.yaml`, the repository-level pnpm configuration owner;
- add a clean hoisted-install build check before claiming Amplify compatibility.

Do not copy Catalonia's exact override forever. The rule is that one deployable framework graph has
one compatible Next.js/React version contract.

### P0. Artifact-Free Workspace Type Resolution

The parent points compiled package `types` and conditional export `types` fields at generated
`dist/*.d.ts` files. Its artifact hygiene command removes every `dist` directory. Repository-wide
verification succeeds because dependencies are built inside the scratch copy, but direct local
typechecks and editor resolution can fail immediately after verification.

Catalonia fixed the contradiction by keeping runtime entrypoints on compiled `dist` JavaScript and
pointing public type entrypoints at tracked `src` files. It also added a repository test that rejects
generated or missing type entrypoints.

Backport the complete contract and test across every compiled package.

### P0. Exact Runtime Ownership - Resolved 9 September 2026

The parent `.nvmrc` contains only `20`, package engines use broad `20.x` ranges, and workflows
repeat a hard-coded major version. Catalonia pins `20.19.6`, derives the allowed engine range from
that file, validates all manifest consumers, and requires workflows to use
`node-version-file: '.nvmrc'`.

Backport:

- an exact `major.minor.patch` `.nvmrc` pin;
- `scripts/check-node-runtime.mjs` after generalizing package scope and messages;
- the root `runtime:check` command;
- runtime checks in both Git hooks;
- `.nvmrc`-driven GitHub Actions setup;
- the runtime check as the first verification preflight.

The exact patch should be chosen and validated in the parent rather than copied without review.

### P0. Process-Safe Verification - Resolved 9 September 2026

The parent verification command cleans generated files without first checking whether a local
Next.js, Vite, Expo, Nest, TypeScript, or Turbo watch process is recreating them. Catalonia observed
`.next` being removed and recreated between cleanup and inspection.

Backport the repository-local process preflight and expand generated artifact coverage for every
framework that the parent actually supports. Keep the check bounded to processes whose command and
working context belong to this repository.

### P1. Safe Backend Error Responses

Catalonia introduced `SafeHttpExceptionFilter` so known Nest HTTP errors preserve bounded public
fields while unexpected errors return a fixed `500` response. It also added an application-owned
filter for allowlisted Express body-parser errors such as malformed JSON and oversized bodies.

The parent should backport this behavior and its tests. Adoption must be complete: Catalonia still
uses its legacy `GlobalExceptionFilter` in several disabled, health-only APIs, so copying files
without replacing consumers would retain inconsistent behavior.

### P1. Backoffice Edge Runtime Compatibility

The current parent verification gate passes, but the Backoffice production build reports that its
authentication import graph pulls Axios utilities using `setImmediate` and `process.nextTick` into
the Next.js Edge runtime. This is a runtime-compatibility warning on the middleware/auth path, not a
reason to copy Catalonia's removal of authentication.

Resolve it in the parent by making the middleware dependency graph Edge-compatible, for example by
using a bounded `fetch` client at that boundary or by moving Node-only work behind a Node runtime.
Add an authentication middleware smoke test so a warning cannot become a production-only failure.

### P1. Script Tests In The Main Gate - Resolved 9 September 2026

Catalonia added root tooling tests for runtime alignment, workspace type entrypoints, Terraform
configuration, Terraform plan policy, artifact manifests, Lambda infrastructure, bootstrap IAM,
Tailwind resolution, and Amplify provenance. `pnpm verify` runs them as a distinct stage.

The current Catalonia working tree passes the exact runtime check and all 53 root script tests under
Node.js `20.19.6` and pnpm `10.28.0`. A full application build/test was not rerun as part of this
read-only audit.

Backport the `test:scripts` gate immediately, then add tests only for capabilities present in the
parent.

## Reusable Architecture Improvements

### Executables As Composition Roots

Catalonia initially implemented Playoff and Mail controllers, services, provider tokens, Basic Auth,
and exception behavior inside executable NestJS applications. The corrected design moved reusable
feature API behavior to `packages/features/<feature>/api`, provider-neutral clients to
`packages/integrations`, and cross-service authentication/error behavior to backend infrastructure.

Backport the rule and package-creation guidance. Do not backport the Playoff or Catalonia mail
business integrations as required template features.

### One BFF Per Client And A Separate Identity Boundary

Catalonia corrected the use of “BFF” as a generic backend label. Each active client owns one BFF;
shared identity is a separate API boundary. It also demonstrated that server-bound NextAuth routes
cannot simply be carried into static React Router clients.

This should become a documented topology rule and optional app profile, not a forced rewrite of the
parent's current two-client baseline.

### Shared Language-Neutral Content

Catalonia separated language-neutral destinations, routes, contact values, and navigation groups
from localized text. Localized copy has one owner in `@chc/messages`; cross-client destination data
has one owner in a framework-neutral content package.

Backport the ownership pattern and examples. Do not copy club routes, contacts, social accounts, or
public content.

### Mobile Root Boundary

The Expo implementation moved providers, public/private navigation, screens, product components,
UI primitives, and tokens out of `App.tsx`. This is a sound optional mobile-app scaffold. It should
be added only if the template offers an Expo profile.

### DynamoDB Migration Discipline

Catalonia built a migration tool with separate `bootstrap`, `status`, `plan`, and `apply` modes; a
dedicated history table; leases; checksums; point-in-time recovery gates; explicit confirmations;
and forward-only production correction records.

This is strong reusable infrastructure for an optional DynamoDB profile. It must not replace the
parent's default PostgreSQL/TypeORM path. Product-specific Article and ContactSubmission schemas,
checksums, account IDs, and repair commands must stay out of the template.

## Terraform And AWS Backport Assessment

### What Should Be Added To The Parent

The parent currently has no executable infrastructure directory. Catalonia provides enough proven
material to add a serious AWS/Terraform starter profile, but it needs extraction rather than a file
copy.

Recommended neutral structure:

```text
infrastructure/
├── README.md
├── config/
│   ├── README.md
│   └── production.example.json
├── deployment/
│   ├── README.md
│   └── aws-artifacts.example.json
└── terraform/
    ├── README.md
    ├── bootstrap/
    ├── environments/production/
    └── modules/
        ├── amplify-nextjs/
        ├── budget/
        ├── lambda-http-api/
        ├── private-object-bucket/
        ├── public-media-delivery/
        └── static-site/
```

Optional profiles may later add generic DynamoDB, migration-history, and identity modules.

### Template Initialization And Removal Contract

The Terraform scaffold should exist in the parent template so its structure, tests, and operating
contract remain reviewable. It should not survive automatically in every product created from the
template.

The initial-question gate must require an explicit answer to: `Should this project retain the
AWS/Terraform infrastructure profile? (yes/no)`.

- **Yes:** retain the complete profile, record the decision in `docs/concept/`, and keep its
  production root at a tested zero-resource baseline until the project supplies and reviews its
  infrastructure inputs.
- **No:** remove `infrastructure/` and every profile-owned workflow, script, root command, test,
  fixture, dependency, documentation page, and index reference. Regenerate affected generated
  files such as the package lock, verify there are no dangling Terraform references, and run the
  normal repository quality gate.

The profile must own an explicit removal manifest. Removal must be deterministic, idempotent, and
path-exact instead of relying on broad file globs. The same contract should be usable by the
AI-driven initial-question workflow and by any future interactive initializer.

### Required Template Invariants

1. Initialization requires and records an explicit yes/no Terraform profile decision.
2. A no decision removes the entire profile and leaves no dead commands, workflow references,
   dependencies, tests, fixtures, or documentation links.
3. A retained production root starts with `enabledComponents: []` and plans zero managed production
   resource changes.
4. Bootstrap is a separate, explicit one-time operation because remote state and OIDC do not yet
   exist.
5. AWS account ID, region, repository, Environment, branch, domain, budget, notification contacts,
   package scope, and application inventory come from answered template questions or example
   placeholders.
6. Providers fail closed with `allowed_account_ids`.
7. GitHub uses OIDC and short-lived credentials; long-lived AWS keys are not part of the template.
8. A manual apply uses the saved plan produced in the same run, exact confirmation text,
   concurrency serialization, and explicit destroy/replacement approval.
9. Terraform provider lockfiles contain checksums for every supported local and CI platform and CI
   uses `-lockfile=readonly`.
10. Secret values never enter tracked JSON, Terraform variables, plans, state, or workflow output.
    Terraform may receive only approved secret parameter names.
11. Application readiness and infrastructure activation are separate gates.
12. Lambda APIs declare exact routes, throttles, immutable artifacts, environment variables, and
    least-privilege data-plane statements. Wildcard proxy routes are not the default.
13. Every enabled component has a documented cost and recovery path.
14. The generic parent CI workflow remains active for pushes and pull requests.

### Modules Suitable For Extraction

| Catalonia module/capability | Decision           | Required neutralization                                                                                                     |
| --------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Remote-state bootstrap      | Extract            | Remove club tags, account defaults, repository subjects, and role names                                                     |
| GitHub OIDC roles           | Extract            | Generate exact subjects from template inputs; keep least-privilege role separation                                          |
| AWS Budget                  | Extract            | Disabled by default; require configurable amount, currency explanation, and contacts                                        |
| Amplify Next.js             | Extract            | Remove app name/repository assumptions; retain manual release and provenance checks as an optional profile                  |
| Static S3 + CloudFront site | Extract            | Generalize site inventory, domains, cache rules, and outputs                                                                |
| Lambda HTTP API             | Extract            | Retain exact routes, throttles, optional concurrency, logs, immutable artifact key, and caller-supplied IAM statements      |
| Private object bucket       | Extract            | Rename generically; keep encryption, public-access block, versioning, lifecycle, and `prevent_destroy` choices configurable |
| Public media CloudFront/OAC | Extract            | Make it an optional delivery module without Article assumptions                                                             |
| Generic DynamoDB table      | Optional           | Keep out of the default Postgres profile                                                                                    |
| Migration-history table     | Optional           | Ship only with the DynamoDB migration profile                                                                               |
| Cognito skeleton            | Do not extract yet | Catalonia intentionally has no accepted auth implementation or application client                                           |
| Article table               | Do not extract     | Product-specific key, indexes, rebuild stages, and production history                                                       |
| ContactSubmission table     | Do not extract     | Product-specific entity and personal-data policy                                                                            |
| Current custom-domain path  | Do not extract     | Catalonia documents it as a legacy static-site-only path that does not serve the Amplify migration                          |

### Configuration And Artifact Contracts

Catalonia's separation between non-secret production configuration and deployable artifact
metadata is worth keeping:

- a checked-in non-secret configuration file defines enabled infrastructure components;
- a separate artifact manifest defines which app can actually produce a deployable artifact;
- validators generate temporary Terraform variable JSON;
- `artifactReady` and `enabled` are distinct states;
- an enabled Lambda pins a commit-addressed immutable object;
- a mutable `latest.zip` pointer is never a Terraform activation input.

The parent implementation should replace Catalonia's hard-coded resource-address phase guard with
a reusable policy model. Product repositories may extend that model with exact migration phases,
but the template itself must not encode one live production plan.

### Documentation To Bring Back With Terraform

The infrastructure code is incomplete without its operating contract. The parent Terraform profile
must include:

- prerequisites and provider/runtime ownership;
- remote-state bootstrap and secure state custody;
- GitHub Environment and OIDC setup;
- local plan and manual GitHub plan/apply instructions;
- zero-resource baseline proof;
- component activation procedure;
- secrets and Parameter Store rules;
- provider lockfile maintenance;
- cost controls and service exclusions;
- partial-apply inspection and recovery;
- application artifact readiness;
- rollback and zero-change follow-up plans;
- explicit statements of what remains manual.

The reusable architecture and learning notes listed below should be generalized and copied with the
profile rather than left only in Catalonia OS.

## Fixed-Bug And Learning Matrix

| Catalonia learning                                                        | Portability | Parent action                                                           |
| ------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------- |
| Active dev process recreates generated artifacts during verification      | Direct      | Backport preflight and regression coverage                              |
| `.nvmrc`, engines, hooks, and workflows drift                             | Direct      | Backport exact runtime ownership                                        |
| Workspace types resolve only from cleaned `dist`                          | Direct      | Backport source-backed type entrypoints and test                        |
| Next/React versions split under hoisted pnpm                              | Direct      | Align parent graph before AWS/Amplify work                              |
| Vite resolves a physical application-local Tailwind path                  | Profile     | Add package-graph resolution test with the Vite profile                 |
| Linked shared package emits CommonJS into an ESM Vite graph               | Profile     | Require ESM output for Vite-consumed shared packages                    |
| `next dev` collides with `next build` in `.next`                          | Direct      | Add to verification guidance and process preflight                      |
| Recursive global messages break `next-intl` key inference                 | Direct      | Use explicit app-owned namespace augmentation                           |
| Express parser errors become unsafe or incorrect `500`s                   | Direct      | Backport bounded parser mapping and live adapter tests                  |
| Integration logic lives in executable API folders                         | Direct      | Backport composition-root and feature-package rules                     |
| Shared Basic Auth/error behavior is duplicated                            | Direct      | Extract reusable backend infrastructure where needed                    |
| Expo build output enters TypeScript input and crashes typecheck           | Profile     | Add generated-directory exclusions with Expo profile                    |
| DynamoDB Local volume is root-owned                                       | Profile     | Keep non-root service plus one-shot volume ownership initializer        |
| Terraform nullable validation calls string functions on `null`            | Direct      | Generalize into Terraform validation guidance/tests                     |
| Terraform bootstrap runs against the wrong AWS account                    | Direct      | Require caller check and provider account allowlist                     |
| Terraform lock lacks Linux checksum                                       | Direct      | Generate supported-platform checksums and use read-only CI lock         |
| Terraform S3 refresh needs permissions not obvious from create config     | Direct      | Test provider refresh permissions and document safe taint recovery      |
| Opt-out application deployment still creates shared infrastructure        | Direct      | Start from an opt-in zero-resource production root                      |
| Aggregate Terraform guard dependency causes unrelated plan churn          | Direct      | Use preconditions for validation and real data flow for ordering        |
| Generic Lambda module grants a generic table and wildcard routes          | Direct      | Require service-owned IAM statements and exact routes                   |
| Mutable artifact metadata lookup blocks Terraform plan                    | Direct      | Pin immutable keys directly; keep `latest` outside activation           |
| Lambda reserved concurrency exceeds a small regional quota                | Direct      | Make it optional and review account-wide allocation                     |
| API Gateway stage settings are created before routes                      | Direct      | Add explicit route-to-stage dependency                                  |
| esbuild omits Nest design metadata needed for constructor injection       | Direct      | Require explicit injection tokens and real Lambda handler tests         |
| Amplify normalizes GitHub repository URL case                             | Profile     | Normalize case and optional `.git`, then compare the full repository    |
| Amplify release reports symbolic `HEAD`                                   | Profile     | Verify the concrete build-time commit marker                            |
| Article key design creates technical items instead of business aggregates | Lesson      | Add to optional DynamoDB modeling guide, not template runtime code      |
| Imported nested media preserves keys but violates domain shape            | Lesson      | Require domain materialization and live read smoke tests for migrations |

## Changes That Must Not Be Backported As Template Defaults

- `@chc`, Catalonia OS, club brand, routes, copy, images, emails, domains, or social profiles.
- AWS account `572059939236`, `eu-west-3` as a universal region, current budget values, live resource
  identifiers, generated endpoints, artifact SHAs, or production item checksums.
- The replacement of PostgreSQL/TypeORM with DynamoDB.
- Article, ContactSubmission, Playoff, Mail, corporate website, or legacy MongoDB behavior as
  required template features.
- Removal of authentication and NextAuth from the parent baseline.
- React Router/Vite for Backoffice as the only supported client framework.
- The current Catalonia application count or one-BFF-per-current-client inventory.
- DNS zone contents, registrar evidence, Microsoft 365 records, or Catalonia redirect-domain rules.
- The product-specific progressive plan guard with exact Terraform addresses from already-applied
  production phases.
- The removal of repository CI.

## Regressions And Residual Risks In Catalonia OS

### Repository CI Is Missing

Catalonia has four workflows for manual infrastructure/application delivery and scheduled security
audit, but no push/pull-request CI workflow. Its own canonical documentation records this as a gap.
The parent already has CI and must keep it while adding deployment workflows.

### Current Audit Includes Uncommitted Work

The DNS audit and Budget-only workflow scope are not part of Catalonia's audited `HEAD`. They are
useful evidence, but they must not be presented as a released baseline until committed and fully
verified.

### Safe Error Handling Is Not Fully Adopted

Playoff, Mail, and Web use the safer filter path, while App BFF, Backoffice BFF, Mobile BFF, and Auth
API still register the legacy global filter. Most are disabled shells, but the template extraction
should resolve the inconsistency rather than preserve it.

### Product Configuration Is Hard-Coded

Terraform variables, OIDC subjects, cost-center tags, route maps, plan-guard addresses, resource
names, and workflow smoke routes encode Catalonia's live environment. The code is strong production
evidence but not a reusable template until these values are generated or required inputs.

### Documentation Personalization Defect

`docs/concept/initial-questions/answers.md` says “`@chc` becomes `@chc`” in its replacement section.
This is a small but useful warning: global identity replacement can corrupt the historical
replacement map even when no old PIAR strings remain. The parent personalization workflow should
preserve “before” and “after” values structurally rather than subject both to text replacement.

### Test Gaps Remain

Catalonia has materially more test files and several strong production guard suites, but 13
workspace packages still use `--passWithNoTests`. The parent has 19 such workspaces. Backporting the
tooling does not remove the need to convert risk-gap packages to real tests incrementally. The
parent's current participation policy reports 24 documented risk-gap workspaces, 4 documented
exceptions, and only 9 workspaces with real tests.

## Parent Improvements That Must Be Preserved

The parent changed after the shared baseline. In particular, it moved Accounts and Search API
behavior out of `apps/api/backoffice-bff` and into dedicated feature packages, with direct tests and
architecture documentation.

Catalonia's later topology and persistence changes do not contain that same feature baseline. Any
backport must therefore be applied onto current parent `HEAD`; using Catalonia as the new base would
silently lose parent work.

## Recommended Backport Waves

### Wave 0 - Freeze The Contract

- Record parent and Catalonia revisions.
- Decide the exact parent Node patch.
- Treat AWS/Terraform as a built-in removable profile selected by an explicit initial question.
- Define supported deployment profiles and preserve PostgreSQL as the default.
- Add explicit acceptance criteria and forbidden product-specific values.

Exit gate: approved migration matrix and clean parent verification baseline.

### Wave 1 - Repository Correctness

- Align Next.js, ESLint, React, and shared peer contracts.
- Move pnpm overrides to the workspace owner.
- Add exact runtime ownership and hook/workflow checks.
- Add active-process verification preflight.
- Move workspace type conditions to tracked source and add the regression test.
- Add root script tests to `pnpm verify`.
- Backport safe exception handling and bounded parser mapping.

Exit gate: direct typechecks pass without `dist`; normal and hoisted clean builds pass; parent CI
remains green.

### Wave 2 - Neutral Terraform Foundation

- Add `infrastructure/` documentation and example configuration.
- Add the initial Terraform yes/no question, persisted decision, exact profile ownership manifest,
  and deterministic removal operation.
- Extract bootstrap, provider constraints, multi-platform locks, account allowlist, remote state,
  and OIDC roles.
- Add a production root whose default plan is zero resources.
- Extract a disabled Budget module as the first simple component example.

Exit gate: formatting and validation pass; generated template production variables contain no PIAR
or Catalonia live identifiers; empty plan policy is test-covered; yes and no initialization paths
both pass the full repository verification gate, and the no path contains no Terraform residue.

### Wave 3 - Artifact And Deployment Contracts

- Add neutral production configuration and artifact manifest validators.
- Add immutable Lambda packaging contract and generic Lambda HTTP API module.
- Add manual infrastructure and artifact workflows using OIDC.
- Keep existing push/pull-request CI and security workflows.

Exit gate: workflow and script tests reject wrong account, wrong branch, mutable artifacts,
undeclared routes, missing components, and destructive plans.

### Wave 4 - Optional Web And Static Delivery

- Extract Amplify Next.js, static S3/CloudFront, private object bucket, and optional public delivery
  modules.
- Generalize release provenance and smoke-test inputs.
- Document console/bootstrap exceptions and rollback.

Exit gate: no live deployment is enabled by default; an example product can generate a reviewed
plan only after answering infrastructure questions.

### Wave 5 - Optional DynamoDB And Additional App Profiles

- Add DynamoDB Local, generic table, migration history, and migration runner as an explicit
  alternative profile.
- Add React Router/Vite and Expo scaffolds only if selected by the product app map.
- Add profile-specific Tailwind/ESM and Expo typecheck tests.

Exit gate: selecting a profile is explicit, documented, and does not mutate the default Postgres
baseline.

### Wave 6 - Documentation And Final QA

- Generalize and port the reusable architecture fixes and learning logs.
- Update setup, repository, package creation, quality, workflow, and migration guides.
- Test template personalization so historical replacement maps remain correct.
- Run the complete parent clean/verify gate and an isolated generated-project smoke test.

Exit gate: the template is artifact-free, CI-backed, documented, and contains no Catalonia
production identity or state.

## Acceptance Checklist For The Terraform Boilerplate

- [ ] Product initialization requires and records an explicit Terraform yes/no answer.
- [ ] Choosing no removes all profile-owned code, workflows, commands, dependencies, tests,
      fixtures, and documentation without dangling references.
- [ ] Choosing yes retains a complete but zero-resource-by-default profile.
- [ ] Profile removal is manifest-backed, path-exact, idempotent, and directly tested.
- [ ] No production resource is enabled by default.
- [ ] No live account, domain, email, resource ID, endpoint, or artifact SHA is committed as a
      default.
- [ ] Bootstrap refuses the wrong AWS account before resource creation.
- [ ] Production uses remote encrypted state and locking.
- [ ] GitHub access uses exact-subject OIDC roles.
- [ ] A manual apply consumes its own saved plan.
- [ ] Destruction and replacement require separate explicit approval.
- [ ] Provider locks cover supported local and CI platforms.
- [ ] Configuration and artifact manifests have direct tests.
- [ ] Application readiness and infrastructure activation remain separate.
- [ ] Lambda routes and IAM statements are service-owned and exact.
- [ ] Secrets are names-only in Terraform and values never enter state or logs.
- [ ] Costs, recovery, rollback, and manual steps are documented.
- [ ] Existing CI still runs on push and pull request.
- [ ] The default PostgreSQL template still installs, builds, typechecks, tests, and lints.

## Audit Verification

Completed during the audit:

- proved the identical shared tree from both repositories' Git objects;
- inspected committed histories and current working-tree deltas;
- inventoried tracked files, packages, tests, documentation, and workflows;
- reviewed Catalonia's architecture-fix and learning-log records;
- reviewed the Terraform module, configuration, artifact, workflow, and runbook structure;
- compared parent and Catalonia runtime, package-export, verification, and framework dependency
  contracts;
- ran Catalonia's runtime alignment check under Node.js `20.19.6` and pnpm `10.28.0`;
- ran all 53 Catalonia root tooling tests successfully;
- ran the complete parent `pnpm verify` gate successfully under Node.js `20.19.6` and pnpm
  `10.28.0`; build, typecheck, formatting, test policy, tests, lint, artifact hygiene, and worktree
  drift checks all completed.

Not completed in this audit:

- no AWS, DNS, registrar, GitHub, database, or deployment mutation;
- no Terraform plan against live remote state;
- no full Catalonia application build/test/coverage run;
- no implementation backport into the parent.

The final bullet describes the original 28 August audit boundary. See the 9 September implementation
follow-up above for the repository-correctness subset completed afterward.

## Last Updated

9 September 2026 - Recorded the completed Node.js 24 repository-correctness backport and remaining Terraform wave.
