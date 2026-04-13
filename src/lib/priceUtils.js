/**
 * Generate price range arrays for filters
 */

export function generatePriceRanges() {
  const ranges = [];
  const start = 500;
  const end = 1000000; // 10 lakh
  const step = 5000;

  for (let price = start; price <= end; price += step) {
    ranges.push(price);
  }

  return ranges;
}

export function formatPrice(price) {
  if (!price) return '0';
  if (price >= 100000) {
    return `${(price / 100000).toFixed(1)}L`;
  }
  if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}K`;
  }
  return price.toString();
}
