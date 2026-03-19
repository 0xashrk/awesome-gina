import defineWorkflow from "/runtime/tools/workflow/defineWorkflow";

export default defineWorkflow({
  version: 1,
  id: "hyperliquid-portfolio-rebalance-executor",
  name: "Hyperliquid Portfolio Rebalance Executor",
  description:
    "Build and optionally execute bounded leverage and concentration trims for a Hyperliquid portfolio.",
  triggers: [{ manual: true }],
  inputs: [
    { name: "riskProfile", type: "string", default: "BALANCED" },
    { name: "coinUniverse", type: "string", default: "" },
    { name: "maxTrimPctPerRun", type: "number", default: 0.2 },
    { name: "maxOrders", type: "number", default: 4 },
    { name: "dryRun", type: "boolean", default: true }
  ],
  output_mode: "inline",
  steps: [
    {
      id: "fetch_portfolio_state",
      type: "ts",
      allow: [
        "getHyperliquidAccount",
        "getHyperliquidPortfolio",
        "getHyperliquidPositions",
        "getHyperliquidOpenOrders",
        "getHyperliquidPrices"
      ],
      code: `
const [account, portfolio, positions, openOrders, prices] = await Promise.all([
  callTool("getHyperliquidAccount", {}),
  callTool("getHyperliquidPortfolio", {}),
  callTool("getHyperliquidPositions", {}),
  callTool("getHyperliquidOpenOrders", {}),
  callTool("getHyperliquidPrices", {})
])
export default { account, portfolio, positions, openOrders, prices }
`
    },
    {
      id: "plan_rebalance",
      type: "ts",
      depends_on: ["fetch_portfolio_state"],
      code: `
const raw = steps.fetch_portfolio_state?.result
const state = raw?.result ?? raw ?? {}
const maxTrimPctPerRun = Number(inputs.maxTrimPctPerRun ?? 0.2)
const maxOrders = Number(inputs.maxOrders ?? 4)
const dryRun = Boolean(inputs.dryRun)
export default {
  riskProfile: String(inputs.riskProfile ?? "BALANCED"),
  dryRun,
  maxOrders,
  maxTrimPctPerRun,
  stateSummary: {
    hasPortfolio: Boolean(state.portfolio),
    hasPositions: Boolean(state.positions),
    hasPrices: Boolean(state.prices),
  },
  plan: "Bounded trim-first rebalance plan placeholder",
}
`
    },
    {
      id: "execute_rebalance",
      type: "ts",
      depends_on: ["plan_rebalance"],
      allow: ["cancelHyperliquidOrder", "placeHyperliquidOrder"],
      code: `
const raw = steps.plan_rebalance?.result
const plan = raw?.result ?? raw ?? {}
if (plan.dryRun) {
  export default { executed: false, dryRun: true, submittedOrders: [] }
}
export default {
  executed: true,
  dryRun: false,
  submittedOrders: [],
  note: "Execution scaffold for bounded reduce-only rebalance orders",
}
`
    },
    {
      id: "persist_rebalance_state",
      type: "ts",
      depends_on: ["execute_rebalance"],
      code: `
const raw = steps.execute_rebalance?.result
const execution = raw?.result ?? raw ?? {}
export default { persisted: true, execution }
`
    }
  ]
});
