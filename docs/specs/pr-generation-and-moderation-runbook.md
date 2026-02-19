# PR Generation and Moderation Runbook

This runbook covers how submissions become pull requests and how maintainers triage them.

## PR Submission Rules (v0)

- Target repo: `this repository`.
- Submissions are manual PRs in v0.
- Draft PR is preferred for first submission.
- Branch naming `community/<entry-id>-<timestamp>` and commit format
  `community: add <entry-id> use case` are recommended conventions (not hard requirements).

## File Targets

- Add/update one entry file in `skills/<category>/<slug>.md`.
- Update matching category page in `docs/categories/*.md`.
- Optionally update root README when category is new.

## PR Body Template

- What this adds.
- Primitive type(s).
- Capability contract summary.
- Safety and permissions summary.
- Evidence links.
- Validation result summary.

## Labeling Rules

- Default labels in v0: `community-submission`, `unverified`.
- Labels are applied manually unless target-repo automation is installed.
- Add `security-review` when auth/secrets scope is non-trivial.
- Add `needs-info` when required evidence is missing.

## Moderation SLA

- First response target: 48h.
- Final decision target: 7 days.

## Triage Decision Matrix

Accept when:
- Required fields from `capability-schema.md` are complete.
- Content is reproducible enough for users.
- Safety and permissions are explicit.
- No obvious spam/plagiarism.

Request changes when:
- Capability contract is vague.
- Setup/evidence is incomplete.
- Links are broken.

Reject when:
- Malicious or deceptive behavior detected.
- Severe missing attribution/license conflict.
- Repeated low-quality spam.

## Escalation Paths

- Security concern -> assign `security-review`, block merge.
- Legal/licensing concern -> assign maintainer/legal owner, block merge.
- Harassment/abuse -> follow abuse policy and lock thread if needed.

## Verified Tier Promotion

From `unverified` to `verified` requires:
- Maintainer validation run.
- `verification.lastVerifiedAt` set.
- Clear note in PR about what was validated.

## Ops Metrics

- Submission volume.
- Draft PR creation success rate.
- Merge/reject ratio.
- Median time to first response.
- Top rejection reasons.

## Weekly Cadence

- Weekly triage pass for open community PRs.
- Weekly report of bottlenecks and repeated failure patterns.
