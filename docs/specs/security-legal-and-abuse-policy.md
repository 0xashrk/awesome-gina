# Security, Legal, and Abuse Policy (Community Hub)

This policy defines minimum guardrails for publishing community capability entries.

## Security Policy

### Submission Safety Requirements

- No hardcoded secrets, private keys, or tokens.
- Permissions must be explicit and least-privileged.
- Side effects must be declared (transactions, transfers, file operations).

### Sensitive Capability Handling

- Entries touching financial operations, filesystem write access, or transaction signing require `security-review` label.
- These entries cannot bypass Draft PR state.

### Secret and Token Hygiene

- Automatic preflight scans for secret-like patterns.
- Hard reject for exposed credentials.
- Repeated violations may suspend publishing privileges.

## Legal Policy

### Content Ownership and Attribution

- Submitter confirms they have rights to publish included content.
- Third-party code/snippets must include attribution and license compatibility.
- Plagiarized or unlicensed content is rejected.

### License Requirements

- Each entry must declare an explicit license.
- Unknown/ambiguous license -> `needs-info` until clarified.

### Terms Acknowledgement

- Publish flow includes user acknowledgement checkbox:
  - content ownership
  - non-malicious intent
  - compliance with repository guidelines

## Abuse Policy

### Prohibited Behavior

- Spam submission bursts.
- Misleading capability claims.
- Malicious payload references.
- Harassment in PR discussions.

### Enforcement Ladder

1. Warning + `needs-info`.
2. Temporary publishing cooldown.
3. Submission suspension.
4. Permanent ban for repeated or severe abuse.

### Reporting and Response

- Provide a "Report abuse" action on submission and PR status pages that opens the
  `.github/ISSUE_TEMPLATE/report-abuse.yml`.
- Triage abuse reports within 48h.
- Maintain audit log of enforcement actions.

## Privacy Considerations

- Collect only minimal metadata needed for moderation and attribution.
- Do not expose private user identifiers in generated markdown.
- Keep moderation notes internal when they contain sensitive details.

## Incident Response

- If harmful content merges, revert quickly and document why.
- Notify affected maintainers/users when appropriate.
- Add preventive rule/check if incident class is repeatable.
