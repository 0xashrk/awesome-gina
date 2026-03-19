import defineWorkflow from "/runtime/tools/workflow/defineWorkflow";

export default defineWorkflow({
  version: 1,
  id: "hyperliquid-multi-asset-trend-basket",
  name: "Hyperliquid Multi Asset Trend Basket",
  description:
    "Scan a configured universe, rank trend-aligned candidates, and optionally execute a bounded Hyperliquid basket.",
  triggers: [{ manual: true }],
  inputs: [
    { name: "coinUniverse", type: "string", required: true },
    { name: "interval", type: "string", default: "4h" },
    { name: "maxPositions", type: "number", default: 3 },
    { name: "riskPctPerPosition", type: "number", default: 0.0075 },
    { name: "dryRun", type: "boolean", default: true }
  ],
  output_mode: "inline",
  steps: [
    {
      id: "scan_universe",
      type: "ts",
      allow: [
        "getHyperliquidAccount",
        "getHyperliquidPositions",
        "getHyperliquidOpenOrders",
        "getHyperliquidPrices",
        "fetchHyperliquidCandles",
        "fetchHyperliquidOrderBook"
      ],
      code: `
const [account, positions, openOrders, prices] = await Promise.all([
  callTool("getHyperliquidAccount", {}),
  callTool("getHyperliquidPositions", {}),
  callTool("getHyperliquidOpenOrders", {}),
  callTool("getHyperliquidPrices", {})
])
export default { account, positions, openOrders, prices, universe: String(inputs.coinUniverse ?? "") }
`
    },
    {
      id: "select_basket",
      type: "ts",
      depends_on: ["scan_universe"],
      code: `
const raw = steps.scan_universe?.result
const state = raw?.result ?? raw ?? {}
export default {
  dryRun: Boolean(inputs.dryRun),
  interval: String(inputs.interval ?? "4h"),
  maxPositions: Number(inputs.maxPositions ?? 3),
  riskPctPerPosition: Number(inputs.riskPctPerPosition ?? 0.0075),
  universe: state.universe ?? "",
  basketPlan: "Multi-asset trend basket selection placeholder",
}
`
    },
    {
      id: "execute_basket",
      type: "ts",
      depends_on: ["select_basket"],
      allow: ["cancelHyperliquidOrder", "placeHyperliquidOrder", "placeHyperliquidStopOrder"],
      code: `
const raw = steps.select_basket?.result
const plan = raw?.result ?? raw ?? {}
if (plan.dryRun) {
  export default { executed: false, dryRun: true, basketOrders: [] }
}
export default {
  executed: true,
  dryRun: false,
  basketOrders: [],
  note: "Execution scaffold for multi-asset basket entries and stops",
}
`
    },
    {
      id: "persist_basket_state",
      type: "ts",
      depends_on: ["execute_basket"],
      code: `
const raw = steps.execute_basket?.result
const execution = raw?.result ?? raw ?? {}
export default { persisted: true, execution }
`
    }
  ]
});
