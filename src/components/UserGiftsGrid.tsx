import {
  QueryFunction,
  QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  apiGetUserGifts,
  apiGetUserReceivedGifts,
  APIUserGiftsResponse,
} from "../giftAppAPI";
import { AnimatePresence, motion } from "framer-motion";
import GiftCard, { GiftCardSkeleton } from "./GiftCard";
import { EndOfInfiniteList } from "./EndOfInfiniteList";
import { EmptyDataMessage } from "./EmptyDataMessage";
import { useTranslation } from "react-i18next";
import { useEndOfListObserver } from "../utils/useEndOfListObserver";
import { flattenPaginatedItems } from "../utils/flattenPaginatedItems";
import { ErrorMessage } from "./ErrorMessage";
import { useAppState } from "../appState";

interface UserGiftsGridProps {
  userId?: string;
  show?: "received" | "purchased";
}

export const UserGiftsGrid = ({
  userId,
  show = "received",
}: Readonly<UserGiftsGridProps>) => {
  const { t } = useTranslation();
  const { user } = useAppState();

  const fetchUserGifts: QueryFunction<
    APIUserGiftsResponse,
    QueryKey,
    string
  > = async (context) => {
    if (!userId) throw Error();
    if (show === "purchased") {
      const response = await apiGetUserGifts(userId, context.pageParam);
      return response;
    } else {
      const response = await apiGetUserReceivedGifts(userId, context.pageParam);
      return response;
    }
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    status,
  } = useInfiniteQuery({
    queryKey: ["gifts", userId, show],
    queryFn: fetchUserGifts,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.cursor,
    enabled: !!userId,
  });

  const endOfListRef = useEndOfListObserver([
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  ]);

  return (
    <AnimatePresence mode="popLayout">
      {status === "pending" ? (
        <motion.div
          key="user-gifts-skeleton"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="three-columns"
        >
          <GiftCardSkeleton />
          <GiftCardSkeleton />
          <GiftCardSkeleton />
          <GiftCardSkeleton />
          <GiftCardSkeleton />
          <GiftCardSkeleton />
          <GiftCardSkeleton />
          <GiftCardSkeleton />
          <GiftCardSkeleton />
        </motion.div>
      ) : status === "error" ? (
        <ErrorMessage message={error.message} />
      ) : (
        <motion.div
          key="user-gifts"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {data.pages[0].gifts.length === 0 ? (
            <EmptyDataMessage
              message={
                userId === user?._id
                  ? t("You don't have any gifts yet.")
                  : t("This user doesn't have any gifts yet")
              }
              linkToStore
            />
          ) : (
            <>
              <div className="three-columns">
                {flattenPaginatedItems(data, "gifts").map((item) => (
                  <GiftCard
                    key={item._id}
                    gift={item}
                    isReceived={show === "received"}
                  />
                ))}
              </div>
              <div className="centered" ref={endOfListRef}></div>
              <EndOfInfiniteList
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
