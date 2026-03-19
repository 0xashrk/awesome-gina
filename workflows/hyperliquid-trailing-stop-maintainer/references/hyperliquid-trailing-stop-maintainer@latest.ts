import defineWorkflow from "/runtime/tools/workflow/defineWorkflow";

export default defineWorkflow({
  version: 1,
  id: "hyperliquid-trailing-stop-maintainer",
  name: "Hyperliquid Trailing Stop Maintainer",
  description:
    "Inspect open positions and protective orders, then compute and optionally apply trailing-stop updates.",
  triggers: [{ manual: true }],
  inputs: [
    { name: "coinUniverse", type: "string", default: "" },
    { name: "breakevenTriggerPct", type: "number", default: 0.015 },
    { name: "trailDistancePct", type: "number", default: 0.01 },
    { name: "maxStopUpdatesPerRun", type: "number", default: 6 },
    { name: "dryRun", type: "boolean", default: true }
  ],
  output_mode: "inline",
  steps: [
    {
      id: "fetch_stop_context",
      type: "ts",
      allow: [
        "getHyperliquidPositions",
        "getHyperliquidOpenOrders",
        "getHyperliquidPrices",
        "fetchHyperliquidCandles"
      ],
      code: `
const [positions, openOrders, prices] = await Promise.all([
  callTool("getHyperliquidPositions", {}),
  callTool("getHyperliquidOpenOrders", {}),
  callTool("getHyperliquidPrices", {})
])
export default { positions, openOrders, prices }
`
    },
    {
      id: "plan_stop_updates",
      type: "ts",
      depends_on: ["fetch_stop_context"],
      code: `
const raw = steps.fetch_stop_context?.result
const state = raw?.result ?? raw ?? {}
export default {
  dryRun: Boolean(inputs.dryRun),
  params: {
    breakevenTriggerPct: Number(inputs.breakevenTriggerPct ?? 0.015),
    trailDistancePct: Number(inputs.trailDistancePct ?? 0.01),
    maxStopUpdatesPerRun: Number(inputs.maxStopUpdatesPerRun ?? 6),
  },
  stateSummary: {
    hasPositions: Boolean(state.positions),
    hasOpenOrders: Boolean(state.openOrders),
    hasPrices: Boolean(state.prices),
  },
  updatePlan: "Trailing-stop maintenance plan placeholder",
}
`
    },
    {
      id: "apply_stop_updates",
      type: "ts",
      depends_on: ["plan_stop_updates"],
      allow: ["cancelHyperliquidOrder", "placeHyperliquidStopOrder"],
      code: `
const raw = steps.plan_stop_updates?.result
const plan = raw?.result ?? raw ?? {}
if (plan.dryRun) {
  export default { executed: false, dryRun: true, stopUpdates: [] }
}
export default {
  executed: true,
  dryRun: false,
  stopUpdates: [],
  note: "Execution scaffold for cancel-and-replace stop maintenance",
}
`
    },
    {
      id: "persist_stop_state",
      type: "ts",
      depends_on: ["apply_stop_updates"],
      code: `
const raw = steps.apply_stop_updates?.result
const execution = raw?.result ?? raw ?? {}
export default { persisted: true, execution }
`
    }
  ]
});
