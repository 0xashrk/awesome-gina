# Worked Submission Examples (v0)

This file provides fully worked examples for common submission types.
Use canonical type semantics from `capability-schema.md#canonical-submission-type-definitions-source-of-truth`.

## Example A: Strategy Submission

Type choice rationale:
- Pick `strategy` when the core value is decision logic plus state transitions.

```yaml
---
id: strategy-btc-breakout-ladder
name: BTC Breakout Ladder Strategy
type: strategy
category: strategies/momentum
summary: Scale into BTC when breakout confirmation persists across intervals.
status: active
owner: gina-community
repo: https://github.com/example/btc-breakout-ladder
homepage: https://example.com/btc-breakout-ladder
license: MIT
verification:
  tier: unverified
  lastVerifiedAt: null
tags: [btc, momentum, ladder, risk-managed]
---
```

```md
# BTC Breakout Ladder Strategy

Scale into BTC when momentum confirms across multiple time windows.

## Capability contract
- Trigger: 15m close above 24h range high with volume confirmation
- Inputs:
  - market: BTC-USD
  - confirmationWindows: [15m, 1h]
  - maxExposureUsd: 5000
- Outputs:
  - entryPlan (tiered order sizes + price offsets)
  - riskState (normal, defensive, halted)
- Side effects:
  - emits trade intents
  - writes state snapshots to strategy log
- Failure modes:
  - stale market feed
  - exchange rejects order size
  - risk guard hard-stop
- Strategy state transitions:
  - observing -> arming when breakout + volume confirmed
  - arming -> entering when slippage estimate < threshold
  - entering -> defensive when volatility spike > configured max
  - any -> halted when drawdown guard trips

## Security and permissions
- Required permissions: read-market-data, place-order, read-position

## Evidence
- Setup guide: https://example.com/docs/setup
- Example run: https://example.com/runs/2026-02-01-breakout
```

## Example B: Recipe Submission

Type choice rationale:
- Pick `recipe` when the main value is a runnable automation artifact users can execute directly.

```yaml
---
id: recipe-sol-take-profit-notifier
name: SOL Take Profit Notifier
type: recipe
category: recipes/alerts
summary: Alert and post a checklist when SOL hits configured take-profit bands.
status: active
owner: gina-community
repo: https://github.com/example/sol-tp-notifier
homepage: https://example.com/sol-tp-notifier
license: Apache-2.0
verification:
  tier: unverified
  lastVerifiedAt: null
tags: [sol, alerts, take-profit]
---
```

```md
# SOL Take Profit Notifier

Runs on a fixed schedule and emits actionable alerts for take-profit bands.

## Capability contract
- Trigger: cron `*/15 * * * *`
- Inputs:
  - token: SOL
  - takeProfitBands: [5, 10, 15] %
  - positionSize: user-provided
- Outputs:
  - alert payload with reached band and suggested action checklist
- Side effects:
  - appends run logs
- Failure modes:
  - provider timeout
  - missing user position data
  - messaging provider rate limit
- Strategy state transitions (if applicable):
  - watching -> alerted-band-1 -> alerted-band-2 -> complete

## Security and permissions
- Required permissions: read-market-data, send-message

## Evidence
- Setup guide: https://example.com/docs/sol-notifier-setup
- Example run: https://example.com/runs/sol-notifier-2026-02-03
```

## Example C: Workflow Submission

Type choice rationale:
- Pick `workflow` when the value is multi-step orchestration across tools/services.

```yaml
---
id: workflow-daily-risk-report
name: Daily Risk Report Workflow
type: workflow
category: workflows/operations
summary: Aggregate positions, compute risk limits, and publish a daily ops report.
status: active
owner: gina-community
repo: https://github.com/example/daily-risk-workflow
homepage: https://example.com/daily-risk-workflow
license: MIT
verification:
  tier: unverified
  lastVerifiedAt: null
tags: [risk, operations, reporting]
---
```

```md
# Daily Risk Report Workflow

Coordinates data pulls, rule evaluation, and report publication every day.

## Capability contract
- Trigger: cron `0 13 * * *`
- Inputs:
  - portfolioIds: [core, swing, hedge]
  - riskLimits profile
- Outputs:
  - markdown risk report
  - breach summary payload
- Side effects:
  - writes report to shared storage
  - posts summary to ops channel
- Failure modes:
  - one or more data sources unavailable
  - rule-evaluation step timeout
  - report publish failure

## Workflow steps
1. Fetch positions and balances
2. Compute exposure and VaR summary
3. Evaluate breach rules
4. Render markdown report
5. Post to ops channel and archive artifact

## Security and permissions
- Required permissions: read-positions, read-balances, write-files, send-message

## Evidence
- Setup guide: https://example.com/docs/risk-workflow-setup
- Example run: https://example.com/runs/daily-risk-2026-02-05
```

## Usage Notes

- Reuse these examples as scaffolds; do not copy values blindly.
- Keep links, permissions, and side effects specific to the actual submission.
- Validate every draft against `capability-schema.md` before PR submission.
