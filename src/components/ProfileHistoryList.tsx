import "./ProfileHistoryList.css";
import { useTranslation } from "react-i18next";
import { Text } from "../components/Text";
import { MarketIcon, ReceiveIcon, SendIcon } from "./Icons";
import {
  apiGetGiftVariantById,
  apiGetProfileHistory,
  giftVariantsOptions,
} from "../giftAppAPI";
import {
  QueryFunction,
  QueryKey,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  APIPaginatedResponse,
  FlattenedGiftActionWithGiftInfo,
  GiftActionType,
  GiftVariant,
} from "../types";
import { flattenPaginatedItems } from "../utils/flattenPaginatedItems";
import { Link } from "wouter";
import { formatPriceString } from "../utils/formatPrice";
import { format } from "date-fns";
import { enUS, ru } from "date-fns/locale";
import { useEndOfListObserver } from "../utils/useEndOfListObserver";
import { EndOfInfiniteList } from "./EndOfInfiniteList";
import { EmptyDataMessage } from "./EmptyDataMessage";

type HistoryItemType = "send" | "receive" | "purchase";

const iconNameToIcon = {
  send: <SendIcon width={17} height={17} />,
  purchase: <MarketIcon width={17} height={17} />,
  receive: <ReceiveIcon width={17} height={17} />,
} as const;

const getHistoryItemType = (
  historyItem: FlattenedGiftActionWithGiftInfo,
  userId: string
): HistoryItemType => {
  if (historyItem.type === GiftActionType.Purchase) {
    return "purchase";
  }
  if (historyItem.recipientId._id === userId) {
    return "receive";
  }
  return "send";
};

const getHistoryItemDetails = (
  historyItemType: HistoryItemType,
  historyItem: FlattenedGiftActionWithGiftInfo,
  translatedStrings: { to: string; from: string }
) => {
  if (historyItemType === "send") {
    return (
      <div>
        <span>{translatedStrings.to} </span>
        <Link to={`/user/${historyItem.recipientId._id}`}>
          {historyItem.recipientId.firstName}
        </Link>
      </div>
    );
  }
  if (historyItemType === "receive") {
    return (
      <div>
        <span>{translatedStrings.from} </span>
        <Link to={`/user/${historyItem.buyerId._id}`}>
          {historyItem.buyerId.firstName}
        </Link>
      </div>
    );
  }
  return <div>{formatPriceString(historyItem.giftId.purchasePrice)}</div>;
};

const ProfileHistoryItem = ({
  historyItem,
  userId,
}: {
  historyItem: FlattenedGiftActionWithGiftInfo;
  userId: string;
}) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(giftVariantsOptions.queryKey);
  const cachedVariant = data?.pages
    ?.flatMap((p) => p.giftVariants)
    .find((variant) => variant._id === historyItem.variantId);

  const { data: thisVariant } = useQuery<GiftVariant | null>({
    queryKey: ["gift-variant", historyItem.variantId],
    queryFn: () => apiGetGiftVariantById(historyItem.variantId),
    initialData: cachedVariant,
  });
  const itemType = getHistoryItemType(historyItem, userId);
  const itemDetails = getHistoryItemDetails(itemType, historyItem, {
    to: t("history-to"),
    from: t("history-from"),
  });
  return (
    <div className="profile-history-item">
      <div className={`profile-history-item-icon-${itemType}`}>
        <img src={thisVariant?.media.thumbnailUrl} alt="" />
        {iconNameToIcon[itemType]}
      </div>
      <div>
        <Text color="textSecondary">{t(`history-type-${itemType}`)}</Text>
        <Text type="bigText">
          {i18n.language === "ru" ? thisVariant?.name.ru : thisVariant?.name.en}
        </Text>
      </div>
      {itemDetails}
    </div>
  );
};

const ProfileHistoryItemSkeleton = () => {
  return (
    <div className="profile-history-item">
      <div
        style={{ width: "40px", height: "40px" }}
        className="skeleton-shimmer"
      ></div>
      <div style={{ rowGap: "4px" }}>
        <div
          style={{ width: "100%", height: "18px", alignSelf: "flex-end" }}
          className="skeleton-shimmer"
        ></div>
        <div
          style={{ width: "100%", height: "18px" }}
          className="skeleton-shimmer"
        ></div>
      </div>
      <div
        style={{ width: "100%", height: "40px" }}
        className="skeleton-shimmer"
      ></div>
    </div>
  );
};

export const ProfileHistoryListSkeleton = () => {
  return (
    <div>
      <div className="history-date">
        <div
          className="skeleton-shimmer"
          style={{ height: "16px", width: "120px", borderRadius: "4px" }}
        ></div>
      </div>
      <ProfileHistoryItemSkeleton />
      <ProfileHistoryItemSkeleton />
      <ProfileHistoryItemSkeleton />
      <div className="history-date">
        <div
          className="skeleton-shimmer"
          style={{ height: "16px", width: "120px", borderRadius: "4px" }}
        ></div>
      </div>
      <ProfileHistoryItemSkeleton />
      <ProfileHistoryItemSkeleton />
    </div>
  );
};

export const ProfileHistoryList = ({ userId }: { userId: string }) => {
  const { t, i18n } = useTranslation();
  const fetchGiftActions: QueryFunction<
    APIPaginatedResponse<FlattenedGiftActionWithGiftInfo>,
    QueryKey,
    string
  > = async (context) => {
    const response = await apiGetProfileHistory(userId, context.pageParam);
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
    queryKey: [`profile-history-${userId}`],
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

  if (!data) {
    return <ProfileHistoryListSkeleton />;
  }

  const flattenedItems = flattenPaginatedItems(data, "data");

  const itemsByDate = flattenedItems.reduce<
    Record<string, FlattenedGiftActionWithGiftInfo[]>
  >((acc, cur) => {
    const d = new Date(cur.createdAt);
    const dateStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (acc[dateStr]) {
      acc = { ...acc, [dateStr]: [...acc[dateStr], cur] };
      return acc;
    }
    acc = { ...acc, [dateStr]: [cur] };
    return acc;
  }, {});

  return (
    <div>
      {flattenedItems.length === 0 ? (
        <div style={{ padding: "16px" }}>
          <EmptyDataMessage message={t("History is Empty")} />
        </div>
      ) : (
        <>
          {Object.keys(itemsByDate).map((dateKey) => (
            <div key={dateKey}>
              <div className="history-date">
                <Text type="footnote" color="labelDate">
                  {format(dateKey, "d MMMM", {
                    locale: i18n.language === "ru" ? ru : enUS,
                  }).toLocaleUpperCase()}
                </Text>
              </div>
              {itemsByDate[dateKey].map((item) => (
                <ProfileHistoryItem
                  key={item._id}
                  historyItem={item}
                  userId={userId}
                />
              ))}
            </div>
          ))}
          <div className="centered" ref={endOfListRef}></div>
          <EndOfInfiniteList
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
          />
        </>
      )}
    </div>
  );
};
