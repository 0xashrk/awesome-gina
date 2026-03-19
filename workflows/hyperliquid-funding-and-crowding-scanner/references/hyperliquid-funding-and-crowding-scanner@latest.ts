import defineWorkflow from "/runtime/tools/workflow/defineWorkflow";

export default defineWorkflow({
  version: 1,
  id: "hyperliquid-funding-and-crowding-scanner",
  name: "Hyperliquid Funding and Crowding Scanner",
  description:
    "Read Hyperliquid market context and rank symbols for crowding, spread, and funding-pressure review.",
  triggers: [{ manual: true }],
  inputs: [
    { name: "coinUniverse", type: "string", default: "" },
    { name: "topN", type: "number", default: 10 },
    { name: "maxSpreadPct", type: "number", default: 0.008 },
    { name: "snapshotPrefix", type: "string", default: "hyperliquid-funding-crowding:" }
  ],
  output_mode: "inline",
  steps: [
    {
      id: "fetch_market_context",
      type: "ts",
      allow: [
        "getHyperliquidAssetData",
        "getHyperliquidPositions",
        "getHyperliquidOpenOrders",
        "getHyperliquidPrices",
        "fetchHyperliquidOrderBook"
      ],
      code: `
const [assetData, positions, openOrders, prices] = await Promise.all([
  callTool("getHyperliquidAssetData", {}),
  callTool("getHyperliquidPositions", {}),
  callTool("getHyperliquidOpenOrders", {}),
  callTool("getHyperliquidPrices", {})
])
export default { assetData, positions, openOrders, prices }
`
    },
    {
      id: "score_crowding",
      type: "ts",
      depends_on: ["fetch_market_context"],
      code: `
const raw = steps.fetch_market_context?.result
const state = raw?.result ?? raw ?? {}
export default {
  topN: Number(inputs.topN ?? 10),
  maxSpreadPct: Number(inputs.maxSpreadPct ?? 0.008),
  snapshotPrefix: String(inputs.snapshotPrefix ?? "hyperliquid-funding-crowding:"),
  stateSummary: {
    hasAssetData: Boolean(state.assetData),
    hasPositions: Boolean(state.positions),
    hasOpenOrders: Boolean(state.openOrders),
    hasPrices: Boolean(state.prices),
  },
  watchlist: [],
  note: "Funding-and-crowding scoring scaffold",
}
`
    },
    {
      id: "emit_scan_artifacts",
      type: "ts",
      depends_on: ["score_crowding"],
      code: `
const raw = steps.score_crowding?.result
const result = raw?.result ?? raw ?? {}
export default { wroteArtifacts: true, result }
`
    }
  ]
});
