import "./UserListItem.css";
import { User } from "../types";
import { getProfilePicFallback } from "../utils/getProfilePicFallback";
import { MiniProfilePic } from "./ProfilePic";
import GiftIcon from "../assets/Gifts.svg";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useAppState } from "../appState";

interface UserListItemProps {
  user: User;
  leaderboardSpot: number;
  ownPosition?: boolean;
}

const medalEmojies = ["🥇", "🥈", "🥉"];

export const UserListItem = ({
  user,
  leaderboardSpot,
  ownPosition = false,
}: Readonly<UserListItemProps>) => {
  const { user: loggedInUser } = useAppState();
  const { t } = useTranslation();
  return (
    <Link
      to={`/user/${user._id}`}
      style={{ color: "unset " }}
      className="user-list-link"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className={ownPosition ? "own-position" : ""}
      >
        <div className="user-list-item">
          <motion.div
            layout
            layoutId={ownPosition ? "no_layoutId" : `user_pic_${user._id}`}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="recent-action-profile-pic"
          >
            <MiniProfilePic
              url={user.profilePic}
              fallback={getProfilePicFallback(user)}
            />
          </motion.div>
          <div>
            <span>{user.firstName}</span>
            {(ownPosition || loggedInUser?._id === user._id) && (
              <span className="you-chip">{t("You")}</span>
            )}
          </div>
          <div>
            <img src={GiftIcon} alt="Gift" />
            <span>{t("nGifts", { count: user.receivedGiftCount })}</span>
          </div>
          <div style={leaderboardSpot <= 3 ? { fontSize: "22px" } : {}}>
            {leaderboardSpot <= 3
              ? medalEmojies[leaderboardSpot - 1]
              : `#${leaderboardSpot}`}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export const UserListItemSkeleton = () => {
  return (
    <div>
      <div className="user-list-item user-list-item-skeleton">
        <div className="skeleton-shimmer"></div>
        <div className="skeleton-shimmer"></div>
        <div className="skeleton-shimmer"></div>
        <div className="skeleton-shimmer"></div>
      </div>
    </div>
  );
};
