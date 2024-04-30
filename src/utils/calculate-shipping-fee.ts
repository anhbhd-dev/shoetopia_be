interface ShippingTier {
  minAmount: number;
  maxAmount: number;
  percentage: number;
}

export type ShippingFeeData = {
  shippingFee: number;
  shippingFeePercentage: number;
};
export function calculateShippingFee(
  amount: number,
  tiers: ShippingTier[],
): ShippingFeeData {
  const sortedTiers = tiers.sort((a, b) => a.minAmount - b.minAmount);

  const applicableTier = sortedTiers.find(
    (tier) => amount >= tier.minAmount && amount <= tier.maxAmount,
  );

  if (applicableTier) {
    // Tính phí vận chuyển dựa trên phần trăm của bậc thang
    return {
      shippingFee: (amount * applicableTier.percentage) / 100,
      shippingFeePercentage: applicableTier.percentage,
    };
  }
  return null;
}

export const defaultShippingFeeTiers: ShippingTier[] = [
  { minAmount: 0, maxAmount: 2000000, percentage: 2.5 },
  { minAmount: 2000000, maxAmount: 5000000, percentage: 1 },
  { minAmount: 5000001, maxAmount: Infinity, percentage: 0 },
];
