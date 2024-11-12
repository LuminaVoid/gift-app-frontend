import { useRoute } from "wouter";
import "./GiftVariantPage.css";
import { AnimatePresence, motion } from "framer-motion";
import { FIRST_VISIT } from "../utils/visistCheck";
import Lottie from "../components/Lottie";
import TonIcon from "../assets/TON.svg";
import EthIcon from "../assets/ETH.svg";
import UsdtIcon from "../assets/USDT.svg";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetGiftVariantById, giftVariantsOptions } from "../giftAppAPI";
import { GiftVariant } from "../types";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  backButton,
  initData,
  mainButton,
  openTelegramLink,
  secondaryButton,
  switchInlineQuery,
  useSignal,
} from "@telegram-apps/sdk-react";
import { useAppState } from "../appState";
import { GiftSplashScreen } from "../components/GiftSplashScreen";
import { formatPriceString, getCurrencyCode } from "../utils/formatPrice";
import { GiftActionList } from "../components/GiftActionList";
import { Text } from "../components/Text";
import { shortenNumber } from "../utils/shortenNumber";

const iconNameToIcon: Record<string, string> = {
  TON: TonIcon,
  ETH: EthIcon,
  USDT: UsdtIcon,
};

export default function GiftVariantPage() {
  const { t, i18n } = useTranslation();
  const tgState = useSignal(initData.state);
  const [isMatch, params] = useRoute("/gift-variant/:id");

  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(giftVariantsOptions.queryKey);
  const cachedVariant = data?.pages
    ?.flatMap((p) => p.giftVariants)
    .find((variant) => variant._id === params?.id);

  const { data: thisVariant } = useQuery<GiftVariant | null>({
    queryKey: ["gift-variant", params?.id],
    queryFn: () => apiGetGiftVariantById(params?.id),
    initialData: cachedVariant,
  });

  const [purchaseState, setPurchaseState] = useState<{
    status: "idle" | "awaiting-invoice" | "paying-invoice" | "invoice-paid";
    invoiceId?: number;
    giftId?: string;
    invoiceUrl?: string;
  }>({ status: "idle" });
  const invoicePollIntervalRef = useRef<number | undefined>(undefined);

  const sendGiftText = t("Send Gift");
  const openStoreText = t("Open Store");
  useEffect(() => {
    const checkInvoiceStatus = async () => {
      const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/purchase-status/${
          purchaseState.invoiceId
        }`
      );
      const respJson = await resp.json();
      if (respJson.data.invoiceStatus === "paid") {
        clearInterval(invoicePollIntervalRef.current);
        setPurchaseState((prev) => ({
          ...prev,
          status: "invoice-paid",
          giftId: respJson.data.giftId,
        }));
        invoicePollIntervalRef.current = undefined;
      }
    };
    if (
      purchaseState.status === "paying-invoice" &&
      !invoicePollIntervalRef.current
    ) {
      const intervalId = setInterval(() => {
        checkInvoiceStatus();
      }, 1000);
      invoicePollIntervalRef.current = intervalId;
    }
  }, [purchaseState, sendGiftText, openStoreText]);

  const { user } = useAppState();

  const mainButtonText = t("Buy a Gift");

  const onMainButtonClick = useCallback(async () => {
    if (thisVariant && user && purchaseState.status !== "invoice-paid") {
      try {
        setPurchaseState({ status: "awaiting-invoice" });
        const resp = await fetch(
          `${import.meta.env.VITE_API_URL}/purchase-gift/${thisVariant._id}`,
          {
            method: "POST",
            body: JSON.stringify({ buyerId: user._id }),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        if (resp.status !== 200) {
          setPurchaseState({ status: "idle" });
          return;
        }
        const respJson = await resp.json();
        const invoiceUrl = respJson.miniAppInvoiceUrl
          ? `${respJson.miniAppInvoiceUrl}&mode=compact`
          : null;
        if (invoiceUrl && respJson.invoiceId) {
          setPurchaseState({
            status: "paying-invoice",
            invoiceId: respJson.invoiceId,
            invoiceUrl,
          });
          openTelegramLink(invoiceUrl);
        } else {
          setPurchaseState({ status: "idle" });
        }
      } catch (error) {
        console.error("Purchase failed", error);
        setPurchaseState({ status: "idle" });
      }
    }
    if (purchaseState.status === "invoice-paid") {
      switchInlineQuery(`gift_${purchaseState.giftId}`, ["users"]);
    }
  }, [thisVariant, user, purchaseState.status, purchaseState.giftId]);

  const staleOnMainButtonClick = useRef(onMainButtonClick);
  const mainButtonParams = useMemo(() => {
    if (thisVariant && purchaseState.status !== "invoice-paid") {
      return {
        text: mainButtonText,
        backgroundColor: "#007aff" as `#${string}`,
        isEnabled: true,
        isVisible: true,
        isLoaderVisible: purchaseState.status !== "idle",
      };
    } else if (purchaseState.status === "invoice-paid") {
      return {
        text: sendGiftText,
        backgroundColor: "#007aff" as `#${string}`,
        isEnabled: true,
        isVisible: true,
        isLoaderVisible: false,
      };
    }
    return {
      isVisible: false,
    };
  }, [thisVariant, mainButtonText, sendGiftText, purchaseState.status]);

  useEffect(() => {
    mainButton.setParams(mainButtonParams);
  }, [mainButtonParams]);

  const secondaryButtonParams = useMemo(() => {
    if (purchaseState.status === "invoice-paid") {
      return {
        text: openStoreText,
        position: "bottom" as const,
        isEnabled: true,
        isVisible: true,
      };
    }
    return {
      isVisible: false,
    };
  }, [openStoreText, purchaseState.status]);

  useEffect(() => {
    secondaryButton.setParams(secondaryButtonParams);
  }, [secondaryButtonParams]);

  const secondaryButtonAction = useRef(() => {
    history.pushState(null, "", "/");
  });

  useEffect(() => {
    secondaryButton.onClick(secondaryButtonAction.current);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      secondaryButton.offClick(secondaryButtonAction.current);
    };
  }, []);

  useEffect(() => {
    mainButton.offClick(staleOnMainButtonClick.current);
    mainButton.onClick(onMainButtonClick);
    staleOnMainButtonClick.current = onMainButtonClick;
  }, [onMainButtonClick]);

  useEffect(() => {
    if (thisVariant) {
      backButton.show();
    } else {
      if (purchaseState.status !== "idle") {
        setPurchaseState({ status: "idle" });
      }
      backButton.hide();
    }
  }, [thisVariant, mainButtonText, purchaseState, user, tgState?.user?.id]);

  const cardBg = thisVariant?.media.bgGradient
    ? `linear-gradient(${thisVariant.media.bgGradient.top}, ${thisVariant.media.bgGradient.bottom})`
    : `linear-gradient(#FE9F4133, #FE9F411A)`;
  return (
    <AnimatePresence>
      {isMatch && thisVariant && purchaseState.status !== "invoice-paid" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: { duration: 0.25, delay: 0.0312 },
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
            filter: "blur(5px)",
            transition: { duration: 0.25 },
          }}
          id="gvar"
          className="abs-page"
        >
          <div
            className="gvar-p-pic"
            style={{ background: `${cardBg}, var(--gift-var-bg)` }}
          >
            <div className="gvar-p-pic-inner" id="gift-animation-target">
              {FIRST_VISIT && (
                <Lottie
                  name={thisVariant.media.lottieUrl}
                  animationData={undefined}
                  initialFrame={thisVariant.media.lottieInitialFrame}
                  sequence={thisVariant.media.lottieSequence}
                  forceLoop={true}
                />
              )}
            </div>
          </div>
          <div className="gvar-p-header">
            <Text type="title">
              {i18n.language === "ru"
                ? thisVariant.name.ru
                : thisVariant.name.en}
            </Text>
            <div className="gvar-p-supply">
              {t("N of Total", {
                n: shortenNumber(thisVariant.soldCount),
                total: shortenNumber(thisVariant.totalSupply),
              })}
            </div>
            <div className="gvar-p-description">
              <Text type="subtitle" color="textSecondary">
                {t("Buy gift callout")}
              </Text>
            </div>
            <div className="gvar-p-price">
              <img
                src={iconNameToIcon[getCurrencyCode(thisVariant.price)]}
                alt={`${getCurrencyCode(thisVariant.price)} currency logo`}
              />
              <Text type="bigText">{formatPriceString(thisVariant.price)}</Text>
            </div>
          </div>
          <div className="divider"></div>
          <div>
            <Text
              type="footnote"
              color="textSecondary"
              style={{ padding: "24px 0px 12px 0px" }}
            >
              {t("Recent actions").toUpperCase()}
            </Text>
            <GiftActionList giftVariantId={thisVariant._id} />
          </div>
        </motion.div>
      )}
      {isMatch && thisVariant && purchaseState.status === "invoice-paid" && (
        <GiftSplashScreen
          giftVariant={thisVariant}
          title={t("Gift Purchased")}
          subtitle={t(
            "The <span>{{giftName}}</span> gift was purchased for <span>{{price}}</span>",
            {
              giftName:
                i18n.language === "ru"
                  ? thisVariant.name.ru
                  : thisVariant.name.en,
              price: formatPriceString(thisVariant.price),
            }
          )}
          toast={{
            title: t("You Bought a Gift"),
            subtitle: t("Now send it to your friend"),
            actionText: t("Send"),
            action: () => {
              switchInlineQuery(`gift_${purchaseState.giftId}`, ["users"]);
            },
          }}
        />
      )}
    </AnimatePresence>
  );
}
