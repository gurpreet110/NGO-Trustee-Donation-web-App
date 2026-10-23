export function hasMaxTwoDecimals(value) {
  if (!Number.isFinite(value)) return false;
  const scaled = value * 100;
  return Math.abs(scaled - Math.round(scaled)) < 1e-8;
}

export function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}

export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
