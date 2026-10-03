export const plans = {
  free: { name: "Free", monthly: 0, annual: 0, vessels: 1, ports: 1, queries: 30, history: "24 hours", seats: 1 },
  watch: { name: "Watch", monthly: 29, annual: 290, vessels: 5, ports: 3, queries: 500, history: "90 days", seats: 1 },
  operations: { name: "Operations", monthly: 99, annual: 990, vessels: 25, ports: 10, queries: 5000, history: "2 years", seats: 5 },
  enterprise: { name: "Enterprise", monthly: null, annual: null, vessels: Infinity, ports: Infinity, queries: Infinity, history: "Full archive", seats: Infinity },
} as const;

export type PlanKey = keyof typeof plans;

export const planOrder: PlanKey[] = ["free", "watch", "operations", "enterprise"];

