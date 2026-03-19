import defineWorkflow from "/runtime/tools/workflow/defineWorkflow";

export default defineWorkflow({
  version: 1,
  id: "hyperliquid-position-guardian",
  name: "Hyperliquid Position Guardian",
  description:
    "Monitor live Hyperliquid positions for liquidation, spread, and stop-health breaches and optionally reduce risk.",
  triggers: [{ manual: true }],
  inputs: [
    { name: "coinUniverse", type: "string", default: "" },
    { name: "minLiquidationBufferPct", type: "number", default: 0.08 },
    { name: "maxSpreadPct", type: "number", default: 0.006 },
    { name: "maxReductionPct", type: "number", default: 0.5 },
    { name: "dryRun", type: "boolean", default: true }
  ],
  output_mode: "inline",
  steps: [
    {
      id: "fetch_live_state",
      type: "ts",
      allow: [
        "getHyperliquidAccount",
        "getHyperliquidPositions",
        "getHyperliquidOpenOrders",
        "getHyperliquidPrices",
        "fetchHyperliquidOrderBook"
      ],
      code: `
const [account, positions, openOrders, prices] = await Promise.all([
  callTool("getHyperliquidAccount", {}),
  callTool("getHyperliquidPositions", {}),
  callTool("getHyperliquidOpenOrders", {}),
  callTool("getHyperliquidPrices", {})
])
export default { account, positions, openOrders, prices }
`
    },
    {
      id: "evaluate_guardrails",
      type: "ts",
      depends_on: ["fetch_live_state"],
      code: `
const raw = steps.fetch_live_state?.result
const state = raw?.result ?? raw ?? {}
export default {
  dryRun: Boolean(inputs.dryRun),
  thresholds: {
    minLiquidationBufferPct: Number(inputs.minLiquidationBufferPct ?? 0.08),
    maxSpreadPct: Number(inputs.maxSpreadPct ?? 0.006),
    maxReductionPct: Number(inputs.maxReductionPct ?? 0.5),
  },
  stateSummary: {
    hasAccount: Boolean(state.account),
    hasPositions: Boolean(state.positions),
    hasOpenOrders: Boolean(state.openOrders),
    hasPrices: Boolean(state.prices),
  },
  remediationPlan: "Position-guardian evaluation placeholder",
}
`
    },
    {
      id: "execute_remediation",
      type: "ts",
      depends_on: ["evaluate_guardrails"],
      allow: ["cancelHyperliquidOrder", "placeHyperliquidOrder", "placeHyperliquidStopOrder"],
      code: `
const raw = steps.evaluate_guardrails?.result
const plan = raw?.result ?? raw ?? {}
if (plan.dryRun) {
  export default { executed: false, dryRun: true, actions: [] }
}
export default {
  executed: true,
  dryRun: false,
  actions: [],
  note: "Execution scaffold for stop repair and reduce-only remediation",
}
`
    },
    {
      id: "persist_guard_state",
      type: "ts",
      depends_on: ["execute_remediation"],
      code: `
const raw = steps.execute_remediation?.result
const execution = raw?.result ?? raw ?? {}
export default { persisted: true, execution }
`
    }
  ]
});
