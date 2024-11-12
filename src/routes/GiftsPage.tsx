import { useTranslation } from "react-i18next";
import { UserGiftsGrid } from "../components/UserGiftsGrid";
import { useAppState } from "../appState";
import { Text } from "../components/Text";

export default function GiftsPage() {
  const { t } = useTranslation();
  const { user } = useAppState();
  return (
    <div className="page">
      <div className="hero">
        <Text type="title">{t("Gifts page title")}</Text>
        <Text type="subtitle" color="textSecondary">
          {t("Gifts page subtitle")}
        </Text>
      </div>
      <UserGiftsGrid userId={user?._id} show={"purchased"} />
    </div>
  );
}
