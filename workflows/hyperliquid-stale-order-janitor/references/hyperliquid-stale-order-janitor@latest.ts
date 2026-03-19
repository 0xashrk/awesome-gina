import defineWorkflow from "/runtime/tools/workflow/defineWorkflow";

export default defineWorkflow({
  version: 1,
  id: "hyperliquid-stale-order-janitor",
  name: "Hyperliquid Stale Order Janitor",
  description:
    "Classify and optionally cancel orphaned, duplicated, or stale Hyperliquid orders that no longer match live exposure.",
  triggers: [{ manual: true }],
  inputs: [
    { name: "coinUniverse", type: "string", default: "" },
    { name: "maxOrderAgeMinutes", type: "number", default: 90 },
    { name: "cancelDuplicateStops", type: "boolean", default: true },
    { name: "dryRun", type: "boolean", default: true }
  ],
  output_mode: "inline",
  steps: [
    {
      id: "fetch_order_inventory",
      type: "ts",
      allow: ["getHyperliquidPositions", "getHyperliquidOpenOrders", "getHyperliquidPrices"],
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
      id: "classify_orders",
      type: "ts",
      depends_on: ["fetch_order_inventory"],
      code: `
const raw = steps.fetch_order_inventory?.result
const state = raw?.result ?? raw ?? {}
export default {
  dryRun: Boolean(inputs.dryRun),
  params: {
    maxOrderAgeMinutes: Number(inputs.maxOrderAgeMinutes ?? 90),
    cancelDuplicateStops: Boolean(inputs.cancelDuplicateStops ?? true),
  },
  stateSummary: {
    hasPositions: Boolean(state.positions),
    hasOpenOrders: Boolean(state.openOrders),
    hasPrices: Boolean(state.prices),
  },
  cleanupPlan: "Stale-order janitor plan placeholder",
}
`
    },
    {
      id: "apply_cleanup",
      type: "ts",
      depends_on: ["classify_orders"],
      allow: ["cancelHyperliquidOrder"],
      code: `
const raw = steps.classify_orders?.result
const plan = raw?.result ?? raw ?? {}
if (plan.dryRun) {
  export default { executed: false, dryRun: true, canceledOrders: [] }
}
export default {
  executed: true,
  dryRun: false,
  canceledOrders: [],
  note: "Execution scaffold for stale-order cleanup",
}
`
    },
    {
      id: "persist_cleanup_state",
      type: "ts",
      depends_on: ["apply_cleanup"],
      code: `
const raw = steps.apply_cleanup?.result
const execution = raw?.result ?? raw ?? {}
export default { persisted: true, execution }
`
    }
  ]
});
