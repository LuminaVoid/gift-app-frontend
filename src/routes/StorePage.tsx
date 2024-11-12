import "./StorePage.css";
import GiftIcon from "../assets/Gifts.svg";
import { useRoute } from "wouter";
import { GiftVariantGrid } from "../components/GiftVariantsGrid";
import { useTranslation } from "react-i18next";
import { Text } from "../components/Text";

export default function StorePage() {
  const { t } = useTranslation();
  const [isMatch] = useRoute("/");
  const [isViewingGift] = useRoute("/gift-variant/:id");
  if (isMatch || isViewingGift) {
    return (
      <div
        id="store-page"
        className={`abs-page ${isViewingGift ? "store-page-backdrop" : ""}`}
      >
        <div className="hero">
          <img src={GiftIcon} alt="Buy and Send Gifts" />
          <Text type="title">{t("Store page title")}</Text>
          <Text type="subtitle" color="textSecondary">
            {t("Store page subtitle")}
          </Text>
        </div>
        <GiftVariantGrid />
      </div>
    );
  }
  return null;
}
