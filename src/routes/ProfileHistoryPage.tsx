import { useTranslation } from "react-i18next";
import { Text } from "../components/Text";
import { useAppState } from "../appState";
import {
  ProfileHistoryList,
  ProfileHistoryListSkeleton,
} from "../components/ProfileHistoryList";
import { useEffect } from "react";
import { backButton } from "@telegram-apps/sdk-react";

export const ProfileHistoryPage = () => {
  const { user } = useAppState();
  const { t } = useTranslation();

  useEffect(() => {
    backButton.show();
    return () => {
      backButton.hide();
    };
  }, []);
  return (
    <div>
      <div className="hero">
        <Text type="title">{t("Recent Actions")}</Text>
        <Text type="subtitle" color="textSecondary">
          {t("Here is your action history.")}
        </Text>
      </div>
      {user?._id ? (
        <ProfileHistoryList userId={user?._id} />
      ) : (
        <ProfileHistoryListSkeleton />
      )}
    </div>
  );
};
