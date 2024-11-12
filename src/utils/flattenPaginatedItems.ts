import { InfiniteData } from "@tanstack/react-query";

// Helper function to flatten infinite list items to a nicer structure without separate page subarrays
export const flattenPaginatedItems = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
  K extends keyof T = "data"
>(
  data?: InfiniteData<T>,
  dataKey: K = "data" as K
): T[K] => {
  if (!data) return [] as T[K];
  return data.pages.flatMap((page) =>
    Object.prototype.hasOwnProperty.call(page, dataKey) ? page[dataKey] : []
  ) as T[K];
};
