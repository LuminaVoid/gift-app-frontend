import { useTranslation } from "react-i18next";
import { GiftSplashScreen } from "../components/GiftSplashScreen";
import { useRoute } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiReceiveGift, APIReceiveGiftResponse } from "../giftAppAPI";
import { useAppState } from "../appState";
import { ErrorMessage } from "../components/ErrorMessage";
import { useEffect } from "react";
import { mainButton } from "@telegram-apps/sdk-react";

const goToProfile = () => {
  history.pushState(null, "", "/profile");
};

export const ReceiveGift = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAppState();
  const [, params] = useRoute("/receive-gift/:id");
  const {
    isFetching,
    isLoading,
    isPending,
    isError,
    data: receiveGiftResp,
  } = useQuery<APIReceiveGiftResponse | null>({
    queryKey: ["receive-gift", params?.id, user?._id],
    queryFn: () => apiReceiveGift(params?.id, user?._id),
    enabled: !!params?.id && !!user?._id,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries();
    };
  }, [queryClient]);

  const mainButtonText = t("Open Profile");

  useEffect(() => {
    mainButton.setParams({
      text: mainButtonText,
      backgroundColor: "#007aff",
      isEnabled: true,
      isVisible: true,
      isLoaderVisible: false,
    });
    mainButton.onClick(goToProfile);
    return () => {
      mainButton.offClick(goToProfile);
    };
  }, [mainButtonText]);

  if (isLoading || isFetching || isPending) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "16px",
        }}
      >
        <div className="spinner"></div>
      </div>
    );
  }

  if (!receiveGiftResp || !receiveGiftResp.data || isError) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "16px",
        }}
      >
        <ErrorMessage
          message={t("The gift does not exist or was already claimed")}
        />
      </div>
    );
  }

  return (
    <GiftSplashScreen
      giftVariant={receiveGiftResp.data.giftVariant}
      title={t("Gift Received")}
      subtitle={t("You have received the gift <span>{{giftName}}</span>", {
        giftName:
          i18n.language === "ru"
            ? receiveGiftResp.data.giftVariant.name.ru
            : receiveGiftResp.data.giftVariant.name.en,
      })}
      toast={{
        title: t("Gift Received"),
        subtitle: t("{{giftName}} from {{senderName}}", {
          giftName:
            i18n.language === "ru"
              ? receiveGiftResp.data.giftVariant.name.ru
              : receiveGiftResp.data.giftVariant.name.en,
          senderName: receiveGiftResp.data.gift.buyerId.firstName,
        }),
        actionText: t("View"),
        action: () => {
          history.pushState(
            null,
            "",
            `/profile?showGift=${receiveGiftResp.data?.gift._id}`
          );
        },
      }}
    />
  );
};
