# Awesome Gina

Community-curated strategies, recipes, workflows, skills, and filesystem patterns for practical outcomes.

## Contents

- [Strategies](docs/categories/strategies.md)
- [Recipes](docs/categories/recipes.md)
- [Workflows](docs/categories/workflows.md)
- [Skills](docs/categories/skills.md)
- [Filesystem](docs/categories/filesystem.md)
- [Prompts](docs/prompts/)
- [Submission Wizard Prompt](docs/prompts/submission-wizard-prompt.md)
- [Examples](docs/categories/examples.md)

## Quick Start

1. Read CONTRIBUTING.md.
2. Pick a submission type using docs/specs/capability-schema.md.
3. Choose the canonical path by type:
   - `recipe`: `recipes/<subcategory>/<entry-slug>.md`
   - `strategy`: `strategies/<subcategory>/<entry-slug>.md`
   - `workflow`: `workflows/<workflow-folder>/README.md` with runnable source in `workflows/<workflow-folder>/references/<artifact>@latest.ts`
   - `skill` and `filesystem`: `skills/community/<category>/<entry-slug>.md` (default) or `skills/official/<category>/<entry-slug>.md` (synced/exported)
4. For `recipe`, `strategy`, and `workflow`, include primitive metadata fields: `slug`, `version`, `visibility`, `publicUrl`, and `relationships`.
5. Run `ruby scripts/validate_primitives.rb`.
6. Open a PR using the repository PR template.

## Source Of Truth

These docs define moderation and schema behavior:

- docs/specs/skill-entry-template.md
- docs/specs/capability-schema.md
- docs/specs/publish-button-flow.md
- docs/specs/pr-generation-and-moderation-runbook.md
- docs/specs/security-legal-and-abuse-policy.md
- docs/specs/submission-agent-wizard-runbook.md
- docs/specs/worked-submission-examples.md
- docs/specs/strategy-repository-phase1.md
- registry/schemas/primitive-frontmatter.schema.json
- docs/prompts/submission-wizard-prompt.md
