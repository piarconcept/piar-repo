# Template Initial Questions

## Purpose

These questions are the required first gate when this repository is used as a template for a new product.

Before changing code, package names, app structure, database configuration, domains, product copy, or feature architecture, the AI agent must confirm the answers below. The goal is to replace template assumptions with the new project's identity and concept before implementation starts.

## When The AI Must Ask These Questions

Ask the initial questions before editing when any of these are true:

- the repository still uses template identity such as `@piar`, `PIAR`, `Piar`, `Piar Concept`, `piar-turbo-template`, `piarconcept.com`, or `support@piarconcept.com`,
- the user asks to start a new product, initialize the template, rename the project, build the first feature, or configure the repo,
- `docs/concept/` does not yet contain enough product context to decide apps, database, auth, or feature scope,
- the requested change would affect package names, app topology, database choice, authentication, deployment, domains, or environment variables.

Do not ask these questions for a read-only explanation, a small documentation lookup, or a narrow bug fix that does not depend on product identity.

## Required Question Block

Ask the user this block, translated to the user's language when needed:

```text
Before I change the template, answer these initial questions:

1. Project identity
   - What is the product display name?
   - What is the technical slug? Example: my-product
   - What npm/package scope should replace @piar? Example: @my-product or @company
   - What organization, company, or author name should replace Piar Concept?
   - What domain, support email, and public website URL should be used, if known?

2. Product summary
   - What are we building in 3-5 sentences?
   - Who are the primary users?
   - What is the first valuable workflow the product must enable?
   - What is explicitly out of scope for the first version?

3. Apps and surfaces
   - Which apps or surfaces do you already know the product needs?
   - If you are not sure, describe the workflows and I will propose the app map.
   - Which surfaces are public, authenticated, admin-only, API-only, background, or integration-only?
   - Which apps are required for MVP and which can wait?

4. Data and database
   - Should we keep PostgreSQL as the default database, or use another database?
   - If PostgreSQL, should this target local Postgres, Neon, Supabase, RDS, or another provider?
   - What are the main business entities we already know?
   - Does the product need migrations from day one?
   - Is there sensitive, private, regulated, or multi-tenant data?

5. Auth and permissions
   - Does the product need authentication?
   - Which roles or user types exist?
   - Which actions are public, authenticated, admin-only, or system-only?

6. Language, content, and brand
   - Which languages/locales are required?
   - What is the default locale?
   - What tone should the product use?
   - Are there brand names, terms, colors, or words that must replace PIAR/Piar references?

7. Integrations and infrastructure
   - Should this project retain the AWS/Terraform infrastructure boilerplate? Answer yes or no.
   - If no, the complete Terraform profile, including its scripts, workflows, tests, dependencies, and documentation, will be removed during personalization.
   - Where should the product be deployed?
   - Which providers are expected for email, storage, payments, analytics, auth, queues, or search?
   - Which environment variables are already known?
   - Are there required domains, subdomains, or ports?

8. Template personalization scope
   - Should I replace template identity globally now, or keep some PIAR template attribution?
   - Should package names, app names, README copy, docs, env examples, and metadata all be updated in this pass?
   - Are there files or areas I must not rename yet?
```

## Minimum Answers Required Before Editing

For a first pass, the user must at least answer:

- product display name,
- technical slug,
- package scope replacement for `@piar`,
- short product summary,
- initial app/surface assumptions or permission for the AI to propose them,
- database choice or permission to keep PostgreSQL,
- whether authentication is needed,
- default locale and required locales,
- whether the AWS/Terraform infrastructure profile should be retained,
- template personalization scope.

If any minimum answer is missing, ask for it before editing.

## Template Identity Replacement Map

Before replacing template identity, create a short replacement map in the handoff or implementation plan.

Review at least these patterns:

- `@piar`
- `PIAR`
- `Piar`
- `Piar Concept`
- `piar-turbo-template`
- `piarconcept.com`
- `support@piarconcept.com`
- package names,
- app names,
- README copy,
- documentation indexes,
- env examples,
- repository metadata.

Do not blindly replace identity strings without checking whether any attribution, license, changelog, or template credit should remain.

## After The User Answers

The AI should:

1. Record or summarize the answers in `docs/concept/`.
2. Apply template-profile choices before feature implementation. If Terraform is rejected, remove
   every path owned by that profile and verify that no dangling references remain.
3. Create or update product concept folders before implementation when the scope is non-trivial.
4. Create the real app folders under `docs/concept/apps/` only after the app map is known.
5. Produce a replacement plan for template identity before global renames.
6. Create implementation waves in `docs/waves/` before multi-package feature work.
7. Run the smallest relevant verification commands after edits.

## Terraform Profile Decision

The parent template may contain a complete AWS/Terraform profile, but retaining it in a generated
product is always an explicit decision:

- **Yes:** keep the complete profile, record the decision, and leave infrastructure disabled until
  the required deployment inputs have been reviewed.
- **No:** remove the profile's infrastructure directory, workflows, scripts, root commands, tests,
  fixtures, dependencies, and dedicated documentation; update generated files and documentation
  indexes; then run the repository verification gate.

Do not interpret an unanswered question as consent to retain Terraform. The removal operation must
use the profile's maintained ownership manifest and must be safe to run more than once.

## Last Updated

28 August 2026 - Added the required Terraform profile retention and complete-removal decision.
