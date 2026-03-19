import defineWorkflow from "/runtime/tools/workflow/defineWorkflow";

export default defineWorkflow({
  version: 1,
  id: "hyperliquid-kill-switch-and-flatten",
  name: "Hyperliquid Kill Switch and Flatten",
  description:
    "Cancel open orders and flatten in-scope Hyperliquid positions under an operator-controlled emergency policy.",
  triggers: [{ manual: true }],
  inputs: [
    { name: "coinUniverse", type: "string", default: "" },
    { name: "flattenAll", type: "boolean", default: false },
    { name: "operatorAck", type: "string", default: "" },
    { name: "dryRun", type: "boolean", default: true }
  ],
  output_mode: "inline",
  steps: [
    {
      id: "fetch_emergency_state",
      type: "ts",
      allow: ["getHyperliquidAccount", "getHyperliquidPositions", "getHyperliquidOpenOrders"],
      code: `
const [account, positions, openOrders] = await Promise.all([
  callTool("getHyperliquidAccount", {}),
  callTool("getHyperliquidPositions", {}),
  callTool("getHyperliquidOpenOrders", {})
])
export default { account, positions, openOrders }
`
    },
    {
      id: "build_flatten_plan",
      type: "ts",
      depends_on: ["fetch_emergency_state"],
      code: `
const raw = steps.fetch_emergency_state?.result
const state = raw?.result ?? raw ?? {}
const operatorAck = String(inputs.operatorAck ?? "").trim()
export default {
  dryRun: Boolean(inputs.dryRun),
  flattenAll: Boolean(inputs.flattenAll),
  operatorAckPresent: operatorAck.length > 0,
  coinUniverse: String(inputs.coinUniverse ?? ""),
  stateSummary: {
    hasAccount: Boolean(state.account),
    hasPositions: Boolean(state.positions),
    hasOpenOrders: Boolean(state.openOrders),
  },
  flattenPlan: "Kill-switch flatten plan placeholder",
}
`
    },
    {
      id: "execute_flatten",
      type: "ts",
      depends_on: ["build_flatten_plan"],
      allow: ["cancelHyperliquidOrder", "placeHyperliquidOrder"],
      code: `
const raw = steps.build_flatten_plan?.result
const plan = raw?.result ?? raw ?? {}
if (plan.dryRun || !plan.operatorAckPresent) {
  export default { executed: false, dryRun: true, canceledOrders: [], flattenedPositions: [] }
}
export default {
  executed: true,
  dryRun: false,
  canceledOrders: [],
  flattenedPositions: [],
  note: "Execution scaffold for emergency order cancel and flatten sequence",
}
`
    },
    {
      id: "persist_kill_switch_state",
      type: "ts",
      depends_on: ["execute_flatten"],
      code: `
const raw = steps.execute_flatten?.result
const execution = raw?.result ?? raw ?? {}
export default { persisted: true, execution }
`
    }
  ]
});
