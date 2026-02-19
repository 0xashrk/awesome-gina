# Submission Flow (v0 Manual)

This document defines the current user flow for publishing a use case to `awesome-gina`.

## Current State

- There is no live in-product `Publish Use Case` API integration yet.
- Submissions are currently handled via manual PRs to `this repository`.
- This keeps process simple while quality gates are established.
- Canonical type definitions: `capability-schema.md#canonical-submission-type-definitions-source-of-truth`.

## v0 User Flow (Current)

1. User picks one submission type: `strategy`, `recipe`, `workflow`, `skill`, or `filesystem`.
2. User fills the community entry template.
3. User opens a PR to `this repository`.
4. CI checks run (links + metadata). Policy/security checks are reviewer-driven in v0.
5. Maintainers triage with labels and request changes if needed.
6. Approved entries merge as `unverified`.
7. Verified promotion happens later after maintainer validation.

## Required Submission Sections

- Basic: title, summary, repo/homepage, license.
- Capability contract: trigger/inputs/outputs/side effects/failure modes.
- Strategy/recipe behavior: strategy states + transition rules (when applicable).
- Safety: auth model, required secrets (names only), permission scope.
- Evidence: setup link, example link, optional logs/screenshots.

## Moderation Labels Used in v0

- `needs-info`
- `security-review`
- `unverified`
- `verified`
- `stale`

## Minimum Acceptance Bar

- Required fields complete.
- Reproducible setup and evidence.
- Explicit permissions and side effects.
- No secrets/credentials in submission content.

## Future Integration Target (Not Live Yet)

If an API publish endpoint is added later, it should map to the same rules above and create Draft PRs by default.
