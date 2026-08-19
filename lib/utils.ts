export const formatPrice = (value: number): string => {
  if (value >= 1_000_000_000_000) {
    const t = (value / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "");
    return `Rp${t}T`;
  }
  if (value >= 1_000_000_000) {
    const m = (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "");
    return `Rp${m}M`;
  }
  if (value >= 1_000_000) {
    const jt = (value / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `Rp${jt}Jt`;
  }
  if (value >= 1_000) {
    const rb = (value / 1_000).toFixed(1).replace(/\.0$/, "");
    return `Rp${rb}Rb`;
  }
  return `Rp${value.toLocaleString("id-ID")}`;
};