import "./LeaderboardPage.css";
import { useState } from "react";
import { SearchInput } from "../components/SearchInput";
import { UserListItem, UserListItemSkeleton } from "../components/UserListItem";
import {
  QueryFunction,
  QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { apiGetUsers, APIUsersResponse } from "../giftAppAPI";
import { AnimatePresence, motion } from "framer-motion";
import { EndOfInfiniteList } from "../components/EndOfInfiniteList";
import { useDebounce } from "../utils/useDebounce";
import { EmptyDataMessage } from "../components/EmptyDataMessage";
import { useTranslation } from "react-i18next";
import { useAppState } from "../appState";
import { useRoute } from "wouter";
import { useEndOfListObserver } from "../utils/useEndOfListObserver";
import { flattenPaginatedItems } from "../utils/flattenPaginatedItems";
import { ErrorMessage } from "../components/ErrorMessage";

export default function LeaderboardPage() {
  const [searchString, setSearchString] = useState("");
  const { t } = useTranslation();
  const [isLeaderboardPage] = useRoute("/leaderboard");

  const { user } = useAppState();

  const debouncedSearch = useDebounce(searchString, 100);

  const fetchUsers: QueryFunction<APIUsersResponse, QueryKey, string> = async (
    context
  ) => {
    const response = await apiGetUsers(debouncedSearch, context.pageParam);
    return response;
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
    queryKey: ["users", debouncedSearch],
    queryFn: fetchUsers,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  const endOfListRef = useEndOfListObserver([
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  ]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.currentTarget.value);
  };

  return (
    <>
      {isLeaderboardPage && user && (
        <UserListItem
          user={user}
          leaderboardSpot={user.leaderboardSpot}
          ownPosition
        />
      )}
      {isLeaderboardPage && (
        <motion.div
          exit={{
            opacity: 0.9,
            scale: 0.9,
            filter: "blur(5px)",
            position: "fixed",
            width: "100dvw",
          }}
          transition={{ duration: 0.5 }}
          id="leaderboard-page"
          className={isLeaderboardPage ? "" : "leaderboard-backdrop"}
        >
          <SearchInput onChange={onSearchChange} value={searchString} />
          <AnimatePresence mode="popLayout">
            {status === "pending" ? (
              <motion.div
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                key="leaderboard-skeleton"
              >
                <UserListItemSkeleton />
                <UserListItemSkeleton />
                <UserListItemSkeleton />
                <UserListItemSkeleton />
                <UserListItemSkeleton />
                <UserListItemSkeleton />
                <UserListItemSkeleton />
                <UserListItemSkeleton />
                <UserListItemSkeleton />
                <UserListItemSkeleton />
                <UserListItemSkeleton />
                <UserListItemSkeleton />
                <UserListItemSkeleton />
                <UserListItemSkeleton />
              </motion.div>
            ) : status === "error" ? (
              <div style={{ padding: "16px" }}>
                <ErrorMessage message={error.message} />
              </div>
            ) : (
              <div key="leaderboard">
                {data.pages[0].users.length === 0 ? (
                  <div className="no-search-results-container">
                    <EmptyDataMessage
                      message={t("No user found for search", {
                        searchString,
                      })}
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      {flattenPaginatedItems(data, "users").map((item) => (
                        <UserListItem
                          key={item._id}
                          user={item}
                          leaderboardSpot={item.leaderboardSpot}
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
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}
