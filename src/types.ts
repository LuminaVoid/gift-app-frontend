import { LottieSequence } from "./components/Lottie";

export const CURRENCY_TYPES = ["crypto", "fiat"] as const;

type CurrencyType = (typeof CURRENCY_TYPES)[number];

export const CRYPTO_CURRENCIES = [
  "USDT",
  "TON",
  "BTC",
  "ETH",
  "LTC",
  "BNB",
  "TRX",
  "USDC",
] as const;

type CryptoCurrency = (typeof CRYPTO_CURRENCIES)[number];

export const FIAT_CURRENCIES = [
  "USD",
  "EUR",
  "RUB",
  "BYN",
  "UAH",
  "GBP",
  "CNY",
  "KZT",
  "UZS",
  "GEL",
  "TRY",
  "AMD",
  "THB",
  "INR",
  "BRL",
  "IDR",
  "AZN",
  "AED",
  "PLN",
  "ILS",
] as const;

type FiatCurrency = (typeof FIAT_CURRENCIES)[number];

// Follows the definitions for createInvoice method
// https://help.crypt.bot/crypto-pay-api#createInvoice
export interface BasePrice {
  currencyType: CurrencyType;
  amount: string;
}

export interface CryptoPrice extends BasePrice {
  currencyType: "crypto";
  asset: CryptoCurrency;
}

export interface FiatPrice extends BasePrice {
  currencyType: "fiat";
  fiat: FiatCurrency;
}

export type Price = CryptoPrice | FiatPrice;

export interface User {
  _id: string;
  userId: number;
  username: string;
  firstName: string;
  lastName?: string;
  profilePic?: string;
  isPremium: boolean;
  languageCode: "en" | "ru";
  leaderboardSpot: number;
  receivedGiftCount: number;
}

export interface LeaderboardUser {
  id: string;
  firstName: string;
  lastName?: string;
  receivedGiftCount: number;
  profilePic?: string;
}

export type GiftVariant = {
  _id: string;
  name: {
    en: string;
    ru: string;
  };
  media: {
    thumbnailUrl: string;
    bgGradient: {
      top: string;
      bottom: string;
    };
    lottieUrl: string;
    lottieInitialFrame?: number;
    lottieSequence?: LottieSequence;
  };
  totalSupply: number;
  soldCount: number;
  price: Price;
};

export type Gift = {
  _id: string;
  variantId: string;
  createdAt: Date;
};

export type PopulatedGift = {
  _id: string;
  variantId: string;
  ordinal: number;
  createdAt: Date;
  receivedAt: Date;
  buyerId: User;
  purchasePrice: Price;
};

export enum GiftActionType {
  Purchase = "purchase",
  Send = "send",
}

export interface FlattenedGiftAction {
  _id: string;
  type: GiftActionType;
  giftId: string;
  buyerId: User;
  recipientId: User;
  variantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlattenedGiftActionWithGiftInfo
  extends Omit<FlattenedGiftAction, "giftId"> {
  giftId: PopulatedGift;
}

export interface APIPaginatedResponse<T> {
  status: "success" | "error";
  isLastPage: boolean;
  data: T[];
  cursor?: string;
}

export interface APIResponse<T> {
  status: "success" | "error";
  data: T | null;
  message?: string;
}
