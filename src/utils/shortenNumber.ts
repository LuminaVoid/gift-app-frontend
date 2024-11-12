const numFormatter = Intl.NumberFormat("en", { notation: "compact" });
export const shortenNumber = (n: number) => {
  return numFormatter.format(n);
};
