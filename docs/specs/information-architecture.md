# Information Architecture

## Recommended Topology

- Add child repos only when there is clear operational need:
  - `<org>/gina-registry` (structured metadata, optional v1)
  - `<org>/gina-tooling` (shared CI/scripts, optional v1+)

## Folder Structure (Dual Model)

```text
awesome-gina/
  README.md
  CONTRIBUTING.md
  CODEOWNERS
  docs/
    categories/
      examples.md
      strategies.md
      recipes.md
      prompts.md
      workflows.md
      skills.md
      filesystem.md
    specs/
      capability-schema.md
      strategy-repository-phase1.md
  recipes/
    <subcategory>/
      <entry-slug>.md
  strategies/
    <subcategory>/
      <entry-slug>.md
  workflows/
    <workflow-folder>/
      README.md
      references/
        <artifact>@latest.ts
  skills/
    official/
      <category>/
        <entry-slug>.md
    community/
      <category>/
        <entry-slug>.md
    <local-or-internal>/
      ...
  .github/
    workflows/
      clawhub-sync.yml
      validate-primitives.yml
```

- `recipes/*`, `strategies/*`, and `workflows/*` are canonical CMS primitive content.
- `skills/official/*` is the synced/exported namespace for ClawHub flows.
- `skills/community/*` is a valid non-synced community namespace.
- Other namespaces under `skills/*` are allowed for local/internal use.

## TOC Standard

- Root `README.md` supports only two levels:
  - Category
  - Subcategory
- Do not nest deeper in root.
- Route detail to category pages under `docs/categories/`.

## Backlink Standard

Each category page:
- Top line: `Up: [Awesome Gina Index](../../README.md)`
- Bottom line: `Back to Contents`

Each entry page:
- Backlink to parent category page.
- Backlink to root README.
- "Related entries" links (2-5, max).

## Root README Outline

```md
# Awesome Gina

## Contents
- [Examples](docs/categories/examples.md)
- [Prompts](docs/categories/prompts.md)
- [Strategies](docs/categories/strategies.md)
- [Workflows](docs/categories/workflows.md)
- [Skills](docs/categories/skills.md)
- [Filesystem](docs/categories/filesystem.md)
- [Recipes](docs/categories/recipes.md)

## Contribution
- Link to CONTRIBUTING.md
```

## Category Page Outline

```md
# Recipes

Up: [Awesome Gina Index](../../README.md)

## Subcategory A
- [Entry Alpha](../../recipes/subcategory-a/entry-alpha.md) - one line

## Subcategory B
- [Entry Beta](../../recipes/subcategory-b/entry-beta.md) - one line

[Back to Contents](../../README.md)
```
