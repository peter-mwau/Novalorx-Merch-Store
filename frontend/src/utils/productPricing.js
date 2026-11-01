export function getPriceCents(value, fallback = 0) {
  const candidates = [
    value?.priceCents,
    value?.price,
    value?.unitPriceCents,
    value?.product?.priceCents,
  ];
  const price = candidates.find((candidate) => candidate !== null && candidate !== undefined && candidate !== "");
  const numericPrice = Number(price);
  return Number.isFinite(numericPrice) ? numericPrice : fallback;
}

export function getVariantPriceCents(product, variant) {
  return getPriceCents(variant, getPriceCents(product));
}
