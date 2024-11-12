import { useTranslation } from "react-i18next";
import LanguageSwitch from "../components/LanguageSwitch";
import ProfilePic from "../components/ProfilePic";
import ThemeSwitch from "../components/ThemeSwitch";
import { UserGiftsGrid } from "../components/UserGiftsGrid";
import { getProfilePicFallback } from "../utils/getProfilePicFallback";
import "./ProfilePage.css";
import { ClockIcon } from "../components/Icons/ClockIcon";
import { useAppState } from "../appState";
import { Link, useRoute } from "wouter";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetUserById, APIUsersResponse } from "../giftAppAPI";
import { User } from "../types";
import TgPremiumIcon from "../assets/tgPremium.svg";
import { motion } from "framer-motion";
import { Text } from "../components/Text";
import { useEffect } from "react";
import { backButton } from "@telegram-apps/sdk-react";
import { ErrorMessage } from "../components/ErrorMessage";

type UsersPage = {
  pageParams: string[];
  pages: APIUsersResponse[];
};

type CachedUsers = [QueryKey, UsersPage | undefined];

const findUserAmongCachedUsers = (
  cachedUsers: CachedUsers[],
  userId?: string
) => {
  if (!userId) {
    return null;
  }
  for (const cachedResponse of cachedUsers) {
    if (!cachedResponse[1]) {
      continue;
    }
    for (const page of cachedResponse[1].pages) {
      const foundUser = page.users.find((user) => user._id === userId);
      if (foundUser) {
        return foundUser;
      }
    }
  }
};

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAppState();

  const [isAnotherUser, params] = useRoute("/user/:id");
  const [isProfilePage] = useRoute("/profile");
  const isOwnProfile = isAnotherUser ? params.id === user?._id : isProfilePage;
  const isRouteMatch = isOwnProfile || isAnotherUser;

  const queryClient = useQueryClient();
  const data = queryClient.getQueriesData<UsersPage>({ queryKey: ["users"] });
  const cachedUser = findUserAmongCachedUsers(data, params?.id);

  const { data: thisUser } = useQuery<User | null>({
    queryKey: ["users-by-id", params?.id],
    queryFn: () => apiGetUserById(params?.id),
    initialData: cachedUser,
    enabled: !isOwnProfile,
  });

  useEffect(() => {
    if (isAnotherUser) {
      backButton.show();
    } else {
      backButton.hide();
    }
    return () => {
      backButton.hide();
    };
  }, [isAnotherUser]);

  const displayedUser = isOwnProfile ? user : thisUser;

  if (!displayedUser) {
    return <ErrorMessage message="User not found" />;
  }
  return (
    <>
      {isRouteMatch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="page"
        >
          <div className="profile-header">
            {isOwnProfile ? <ThemeSwitch /> : <div></div>}
            <ProfilePic
              userId={displayedUser._id}
              url={displayedUser.profilePic}
              fallback={getProfilePicFallback(displayedUser)}
              leaderboardPosition={displayedUser.leaderboardSpot}
            />
            {isOwnProfile ? <LanguageSwitch /> : <div></div>}
            <div className="profile-info">
              <div className="profile-username">
                <Text type="title">
                  {displayedUser.firstName} {displayedUser.lastName}
                </Text>
                {displayedUser.isPremium && (
                  <img src={TgPremiumIcon} alt="Telegram Premium icon" />
                )}
              </div>
              <div className="profile-received-gifts">
                {t("nGiftsReceived", {
                  count: displayedUser.receivedGiftCount,
                })}
              </div>
              {isOwnProfile && (
                <Link to="/profile/history" className="profile-recent-actions">
                  <ClockIcon
                    width={24}
                    height={24}
                    fill={getComputedStyle(document.body).getPropertyValue(
                      "--primary"
                    )}
                  />
                  <span>{t("Recent Actions")} ›</span>
                </Link>
              )}
            </div>
          </div>
          <UserGiftsGrid userId={displayedUser._id} show="received" />
        </motion.div>
      )}
    </>
  );
}
