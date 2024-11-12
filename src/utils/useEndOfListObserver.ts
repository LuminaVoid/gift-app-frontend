import { useCallback, useRef } from "react";

type EndOfListObserverDepsArray = [() => void, boolean, boolean, boolean];

export const useEndOfListObserver = ([
  fetchNextPage,
  hasNextPage,
  isFetching,
  isLoading,
]: EndOfListObserverDepsArray) => {
  const observer = useRef<IntersectionObserver>();
  const endOfListRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading]
  );
  return endOfListRef;
};
