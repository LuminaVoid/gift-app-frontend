import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GiftVariant, PopulatedGift } from "../types";
import Button from "./Button";
import "./GiftCard.css";
import Lottie from "./Lottie";
import { apiGetGiftVariantById, giftVariantsOptions } from "../giftAppAPI";
import { BottomSheet } from "./BottomSheet";
import { useEffect, useState } from "react";
import { GiftSheetContent } from "./GiftSheetContent";
import { MiniProfilePic } from "./ProfilePic";
import { getProfilePicFallback } from "../utils/getProfilePicFallback";
import { useTranslation } from "react-i18next";
import { formatPriceString } from "../utils/formatPrice";
import TonIcon from "../assets/TON.svg";
import EthIcon from "../assets/ETH.svg";
import UsdtIcon from "../assets/USDT.svg";
import { Link, useSearch } from "wouter";
import { format } from "date-fns";
import { shortenNumber } from "../utils/shortenNumber";

interface GiftCardProps {
  gift: PopulatedGift;
  isReceived: boolean;
}

const iconNameToIcon: Record<string, string> = {
  TON: TonIcon,
  ETH: EthIcon,
  USDT: UsdtIcon,
};

export default function GiftCard({
  gift,
  isReceived = true,
}: Readonly<GiftCardProps>) {
  const [showSheet, setShowSheet] = useState(false);
  const searchStr = useSearch();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(giftVariantsOptions.queryKey);
  const cachedVariant = data?.pages
    ?.flatMap((p) => p.giftVariants)
    .find((variant) => variant._id === gift.variantId);

  const { data: thisVariant } = useQuery<GiftVariant | null>({
    queryKey: ["gift-variant", gift.variantId],
    queryFn: () => apiGetGiftVariantById(gift.variantId),
    initialData: cachedVariant,
  });

  useEffect(() => {
    const searchParams = searchStr.split("=");
    if (searchParams[0] === "showGift" && searchParams[1] === gift._id) {
      setShowSheet(true);
    }
  }, [searchStr, gift._id]);

  const displaySheet = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => {
    e.stopPropagation();
    setShowSheet(true);
  };

  const onSheetClosed = () => {
    setShowSheet(false);
  };

  if (!thisVariant) {
    return <GiftCardSkeleton />;
  }
  return (
    <div className="gift-card">
      {isReceived && (
        <div className="gift-card-received-data">
          <div>
            <MiniProfilePic
              url={gift.buyerId.profilePic}
              fallback={getProfilePicFallback(gift.buyerId)}
              size="xs"
            />
          </div>
          <div>
            {t("N of Total", {
              n: 1,
              total: shortenNumber(thisVariant.totalSupply),
            })}
          </div>
        </div>
      )}
      {!isReceived && (
        <p className="gift-card-title">
          {i18n.language === "ru" ? thisVariant.name.ru : thisVariant.name.en}
        </p>
      )}
      <div
        onClick={isReceived ? displaySheet : undefined}
        onKeyDown={isReceived ? displaySheet : undefined}
        role={isReceived ? "button" : "presentation"}
        className="gift-card-lottie"
      >
        <Lottie
          name={thisVariant.media.lottieUrl}
          animationData={undefined}
          initialFrame={thisVariant.media.lottieInitialFrame}
          sequence={thisVariant.media.lottieSequence}
        />
      </div>
      {isReceived && (
        <p className="gift-card-title-received">
          {i18n.language === "ru" ? thisVariant.name.ru : thisVariant.name.en}
        </p>
      )}
      {!isReceived && <Button onClick={displaySheet} label="Send" />}
      <BottomSheet open={showSheet} onClose={onSheetClosed}>
        {isReceived ? (
          <GiftSheetContent
            canSend={false}
            gift={gift}
            giftVariant={thisVariant}
            title={
              i18n.language === "ru" ? thisVariant.name.ru : thisVariant.name.en
            }
            tableContent={[
              [
                t("From"),
                ``,
                <>
                  <img src={gift.buyerId.profilePic} alt="" />
                  <Link to={`/user/${gift.buyerId._id}`}>
                    <span>{`${gift.buyerId.firstName} ${
                      gift.buyerId.lastName ?? ""
                    }`}</span>
                  </Link>
                </>,
              ],
              [
                t("Date"),
                t("date at time", {
                  date: format(gift.receivedAt, "dd.MM.yy"),
                  time: format(gift.receivedAt, "HH:mm"),
                }),
                null,
              ],
              [
                t("Price"),
                formatPriceString(gift.purchasePrice),
                <img
                  key="gift-price-img"
                  src={
                    iconNameToIcon[
                      gift.purchasePrice.currencyType === "crypto"
                        ? gift.purchasePrice.asset
                        : gift.purchasePrice.fiat
                    ]
                  }
                  alt=""
                />,
              ],
              [
                t("Availability"),
                t("N of Total", {
                  n: gift.ordinal,
                  total: thisVariant.totalSupply,
                }),
                null,
              ],
            ]}
          />
        ) : (
          <GiftSheetContent
            canSend={true}
            gift={gift}
            giftVariant={thisVariant}
            title={t("Send Gift")}
            tableContent={[
              [
                t("Gift"),
                i18n.language === "ru"
                  ? thisVariant.name.ru
                  : thisVariant.name.en,
                null,
              ],
              [
                t("Date"),
                t("date at time", {
                  date: format(gift.createdAt, "dd.MM.yy"),
                  time: format(gift.createdAt, "HH:mm"),
                }),
                null,
              ],
              [
                t("Price"),
                formatPriceString(gift.purchasePrice),
                <img
                  key="gift-price-img"
                  src={
                    iconNameToIcon[
                      gift.purchasePrice.currencyType === "crypto"
                        ? gift.purchasePrice.asset
                        : gift.purchasePrice.fiat
                    ]
                  }
                  alt=""
                />,
              ],
              [
                t("Availability"),
                t("N of Total", {
                  n: gift.ordinal,
                  total: thisVariant.totalSupply,
                }),
                null,
              ],
            ]}
          />
        )}
      </BottomSheet>
    </div>
  );
}

export const GiftCardSkeleton = () => {
  return (
    <div className="gift-card">
      <p className="gift-card-title gift-card-title-skeleton skeleton-shimmer"></p>
      <div className="gift-card-lottie gift-card-lottie-skeleton skeleton-shimmer"></div>
      <Button
        onClick={() => {}}
        label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        disabled
      />
    </div>
  );
};
