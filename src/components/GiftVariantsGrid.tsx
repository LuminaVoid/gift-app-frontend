import { useInfiniteQuery } from "@tanstack/react-query";
import GiftVariantCard, { GiftVariantCardSkeleton } from "./GiftVariantCard";
import { AnimatePresence, motion } from "framer-motion";
import { EndOfInfiniteList } from "./EndOfInfiniteList";
import { useEndOfListObserver } from "../utils/useEndOfListObserver";
import { flattenPaginatedItems } from "../utils/flattenPaginatedItems";
import { ErrorMessage } from "./ErrorMessage";
import { giftVariantsOptions } from "../giftAppAPI";

export const GiftVariantGrid = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    status,
  } = useInfiniteQuery(giftVariantsOptions);

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
          key="gift-variants-skeleton"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="two-columns"
        >
          <GiftVariantCardSkeleton />
          <GiftVariantCardSkeleton />
          <GiftVariantCardSkeleton />
          <GiftVariantCardSkeleton />
        </motion.div>
      ) : status === "error" ? (
        <ErrorMessage message={error.message} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          key="gift-variants"
        >
          <div className="two-columns">
            {flattenPaginatedItems(data, "giftVariants").map((item) => (
              <GiftVariantCard key={item._id} giftVariant={item} />
            ))}
          </div>
          <div className="centered" ref={endOfListRef}></div>
          <EndOfInfiniteList
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
