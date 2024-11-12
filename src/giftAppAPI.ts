import {
  infiniteQueryOptions,
  QueryFunction,
  QueryKey,
} from "@tanstack/react-query";
import {
  GiftVariant,
  PopulatedGift,
  User,
  FlattenedGiftAction,
  APIPaginatedResponse,
  FlattenedGiftActionWithGiftInfo,
  APIResponse,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL;

interface APIGiftVariantsResponse {
  giftVariants: GiftVariant[];
  status: "ok" | "error";
  cursor?: string;
}

export const apiGetGiftVariants: QueryFunction<
  APIGiftVariantsResponse,
  QueryKey,
  string
> = async (context) => {
  const resp = await fetch(
    `${API_URL}/gift-variants?pageSize=4&cursor=${context.pageParam}`
  );
  const respJson = (await resp.json()) as APIGiftVariantsResponse;
  if (resp.status === 200) {
    return respJson;
  }
  throw Error();
};

export const apiGetGiftVariantById = async (id?: string) => {
  if (!id) return null;
  const resp = await fetch(`${API_URL}/gift-variants/${id}`);
  const respJson = (await resp.json()) as GiftVariant;
  if (resp.status === 200) {
    return respJson;
  }
  throw Error();
};

export interface APIGiftActionsResponse {
  giftActions: FlattenedGiftAction[];
  status: "ok" | "error";
  cursor?: string;
}

export const apiGetGiftRecentActions = async (
  giftVairantId: string,
  cursor: string
) => {
  const resp = await fetch(
    `${API_URL}/gift-variants/${giftVairantId}/actions?pageSize=5&cursor=${cursor}`
  );
  const respJson = (await resp.json()) as APIGiftActionsResponse;
  if (resp.status === 200) {
    return respJson;
  }
  throw Error();
};

export const apiGetProfileHistory = async (userId: string, cursor: string) => {
  const resp = await fetch(
    `${API_URL}/users/${userId}/history?pageSize=10&cursor=${cursor}`
  );
  const respJson =
    (await resp.json()) as APIPaginatedResponse<FlattenedGiftActionWithGiftInfo>;
  if (resp.status === 200) {
    return respJson;
  }
  throw Error();
};

export interface APIUserGiftsResponse {
  gifts: PopulatedGift[];
  status: "ok" | "error";
  cursor?: string;
}

export const apiGetUserGifts = async (userId: string, cursor: string) => {
  const resp = await fetch(
    `${API_URL}/users/${userId}/gifts?pageSize=9&cursor=${cursor}`
  );
  const respJson = (await resp.json()) as APIUserGiftsResponse;
  if (respJson.status === "ok") {
    return respJson;
  }
  throw Error();
};

export const apiGetUserReceivedGifts = async (
  userId: string,
  cursor: string
) => {
  const resp = await fetch(
    `${API_URL}/users/${userId}/gifts?isReceived=true&pageSize=9&cursor=${cursor}`
  );
  const respJson = (await resp.json()) as APIUserGiftsResponse;
  if (respJson.status === "ok") {
    return respJson;
  }
  throw Error();
};

export type APIReceiveGiftResponse = APIResponse<{
  gift: PopulatedGift;
  giftVariant: GiftVariant;
}>;

export const apiReceiveGift = async (giftId?: string, userId?: string) => {
  if (!giftId || !userId) return null;
  const resp = await fetch(
    `${API_URL}/receive-gift/${giftId}?userId=${userId}`
  );
  const respJson = (await resp.json()) as APIReceiveGiftResponse;
  if (resp.status === 200) {
    return respJson;
  }
  throw Error();
};

export const LEADERBOARD_USERS_PER_PAGE = 1;

export interface APIUsersResponse {
  users: User[];
  status: "ok" | "error";
  cursor?: string;
}

export const apiGetUsers = async (searchStr: string, cursor: string) => {
  const resp = await fetch(
    `${API_URL}/users?pageSize=${LEADERBOARD_USERS_PER_PAGE}&cursor=${cursor}&searchStr=${searchStr}`
  );
  const respJson = (await resp.json()) as APIUsersResponse;
  if (respJson.status === "ok") {
    return respJson;
  }
  throw Error();
};

export const apiGetUserById = async (id?: string) => {
  if (!id) return null;
  const resp = await fetch(`${API_URL}/users/${id}`);
  const respJson = await resp.json();
  if (resp.status === 200) {
    return respJson.user as User;
  }
  throw Error();
};

// Typed tanstack-query configs

export const giftVariantsOptions = infiniteQueryOptions({
  queryKey: ["gift-variants"],
  queryFn: apiGetGiftVariants,
  initialPageParam: "",
  getNextPageParam: (lastPage) => lastPage.cursor,
});

export const updateBackendUser = async (
  userId?: string,
  theme?: string,
  languageCode?: string
) => {
  if (!userId || (!theme && !languageCode)) {
    return;
  }
  try {
    await fetch(
      `${API_URL}/users/${userId}/update?theme=${theme}&languageCode=${languageCode}`,
      {
        method: "POST",
        body: JSON.stringify({ theme: theme, languageCode: languageCode }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Failed to update remote user settings", error);
  }
};
