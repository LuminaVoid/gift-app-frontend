import { useTranslation } from "react-i18next";
import "./GiftSheetContent.css";
import { Gift, GiftVariant } from "../types";
import Lottie from "./Lottie";
import { SparkleContainer } from "./SparkleContainer";
import React, { useEffect } from "react";
import { mainButton, switchInlineQuery } from "@telegram-apps/sdk-react";

type TableRow = [string, string, React.ReactNode];

interface GiftSheetContentProps {
  canSend: boolean;
  gift: Gift;
  giftVariant: GiftVariant;
  title: string;
  tableContent: [TableRow, TableRow, TableRow, TableRow];
}

export const GiftSheetContent = ({
  canSend,
  gift,
  giftVariant,
  title,
  tableContent,
}: Readonly<GiftSheetContentProps>) => {
  const { t } = useTranslation();
  const mainButtonText = t("Send Gift to Contact");
  useEffect(() => {
    if (canSend) {
      mainButton.setParams({
        text: mainButtonText,
        backgroundColor: "#007aff",
        isEnabled: true,
        isVisible: true,
      });
      mainButton.onClick(() => {
        switchInlineQuery(`gift_${gift._id}`, ["users"]);
      });
    }
    return () => {
      mainButton.setParams({
        isVisible: false,
      });
    };
  }, [mainButtonText, gift._id, canSend]);
  return (
    <div className="gift-sheet">
      <div>
        <SparkleContainer>
          <Lottie
            name={giftVariant.media.lottieUrl}
            animationData={undefined}
            initialFrame={giftVariant.media.lottieInitialFrame}
            sequence={giftVariant.media.lottieSequence}
            forceLoop={true}
          />
        </SparkleContainer>
      </div>
      <div>{title}</div>
      <div>
        {tableContent.map((row) => (
          <React.Fragment key={row[0]}>
            <div>{row[0]}</div>
            <div>
              {row[2]}
              <span>{row[1]}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
