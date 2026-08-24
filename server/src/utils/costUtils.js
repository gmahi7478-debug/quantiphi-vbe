export function getMonthlyCost(cost, billingCycle) {
  return billingCycle === 'Yearly' ? Number(cost) / 12 : Number(cost);
}