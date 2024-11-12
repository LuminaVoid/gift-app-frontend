import {
  QueryFunction,
  QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { apiGetGiftRecentActions, APIGiftActionsResponse } from "../giftAppAPI";
import { EndOfInfiniteList } from "./EndOfInfiniteList";
import { GiftRecentAction, GiftRecentActionSkeleton } from "./GiftRecentAction";
import { useEndOfListObserver } from "../utils/useEndOfListObserver";
import { flattenPaginatedItems } from "../utils/flattenPaginatedItems";
import { useTranslation } from "react-i18next";
import { Text } from "./Text";

interface GiftActionListProps {
  giftVariantId: string;
}

export const GiftActionList = ({
  giftVariantId,
}: Readonly<GiftActionListProps>) => {
  const { t } = useTranslation();
  const fetchGiftActions: QueryFunction<
    APIGiftActionsResponse,
    QueryKey,
    string
  > = async (context) => {
    const response = await apiGetGiftRecentActions(
      giftVariantId,
      context.pageParam
    );
    return response;
  };
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["gift-actions", giftVariantId],
    queryFn: fetchGiftActions,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  const endOfListRef = useEndOfListObserver([
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  ]);

  if (isLoading) {
    return (
      <div>
        <GiftRecentActionSkeleton />
        <GiftRecentActionSkeleton />
        <GiftRecentActionSkeleton />
      </div>
    );
  }

  const flattenedItems = flattenPaginatedItems(data, "giftActions");

  return (
    <>
      {flattenedItems.length === 0 ? (
        <Text color="textSecondary">{t("No recent actions")}</Text>
      ) : (
        <>
          <div>
            {flattenedItems.map((item) => (
              <GiftRecentAction key={item._id} giftAction={item} />
            ))}
          </div>
          <div className="centered" ref={endOfListRef}></div>
          <EndOfInfiniteList
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
          />
        </>
      )}
    </>
  );
};
