import { Price } from "../types";

export const formatPriceString = (price: Price) => {
  const asset = price.currencyType === "crypto" ? price.asset : price.fiat;
  return `${price.amount} ${asset}`;
};

export const getCurrencyCode = (price: Price) => {
  return price.currencyType === "crypto" ? price.asset : price.fiat;
};
