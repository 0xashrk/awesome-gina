# Strategy Repository Phase 1 Spec

## Purpose

Phase 1 establishes `strategy` as a first-class primitive in this repository and introduces an initial bundle that connects existing recipes and workflows.

## Scope (Phase 1 Only)

- Add a top-level `strategies/` directory.
- Add at least one concrete strategy entry that bundles multiple recipes.
- Add machine-readable bundle references from strategy to recipe/workflow IDs.
- Expose strategies in repository navigation (`README` and category docs).

This phase does not change submission lanes, sync behavior, or CI pipelines.

## Primitive Model

- `recipe`: runnable scheduled/triggered prompt text automation.
- `strategy`: orchestration label and decision surface that bundles one or more recipes (and optionally workflows) into a coherent operating plan.
- `workflow`: multi-step code execution primitive.

## Strategy Entry Contract (Phase 1)

Strategy entries follow existing markdown + frontmatter patterns and add the following bundle/linking fields:

- `slug`: stable URL-safe slug.
- `version`: strategy version string.
- `visibility`: `public` | `unlisted` | `private`.
- `publicUrl`: canonical public route path used by app/CMS.
- `relationships.recipeIds[]`: bundle membership for recipes.
- `relationships.workflowIds[]`: optional workflow dependencies used by bundled recipes.

## Directory Layout (Phase 1)

```text
awesome-gina/
  strategies/
    trading/
      strategy-daily-btc-markets.md
      strategy-hourly-crypto-markets.md
```

## URL Convention (Phase 1)

- Canonical strategy route shape: `/library/strategies/<slug>`.
- Strategy entries must define `publicUrl` matching this shape.

## Initial Bundles Included In Phase 1

`strategy-daily-btc-markets` bundles:

- `recipe-btc-daily-buy-75-95`
- `recipe-daily-btc-stop-loss`
- `recipe-daily-crypto-predictions-sell-all`

`strategy-hourly-crypto-markets` bundles:

- `recipe-btc-hourly-buy-75-95`
- `recipe-eth-hourly-buy-75-95`
- `recipe-sol-hourly-buy-75-95`
- `recipe-xrp-hourly-buy-75-95`
- `recipe-hourly-sell-all-positions`
- `recipe-hourly-redeem-close-orders`

## Cross-Linking Rules (Phase 1)

- Strategy entry must include linked recipe/workflow IDs in `relationships`.
- Bundled recipe/workflow entries should include `relationships.strategyIds[]` backlinks when they are part of a declared strategy.

## Out Of Scope

- Generated registry JSON feeds
- Schema enforcement CI for new fields
- Lane or sync workflow refactors
- Full migration of all existing entries
