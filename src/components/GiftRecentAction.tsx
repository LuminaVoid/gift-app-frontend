import "./GiftRecentAction.css";
import { FlattenedGiftAction, GiftActionType } from "../types";
import { getProfilePicFallback } from "../utils/getProfilePicFallback";
import { MiniProfilePic } from "./ProfilePic";
import { useTranslation } from "react-i18next";
import { Text } from "./Text";
import { Link } from "wouter";

interface GiftRecentActionProps {
  giftAction: FlattenedGiftAction;
}

export const GiftRecentAction = ({
  giftAction,
}: Readonly<GiftRecentActionProps>) => {
  const { t } = useTranslation();
  return (
    <div className="recent-action">
      <div className="recent-action-profile-pic">
        <MiniProfilePic
          url={giftAction.buyerId.profilePic}
          fallback={getProfilePicFallback(giftAction.buyerId)}
          icon={giftAction.type === GiftActionType.Purchase ? "buy" : "send"}
        />
      </div>
      <div className="recent-action-type">
        <Text color="textSecondary">
          {giftAction.type === GiftActionType.Purchase
            ? t("Action Buy Gift")
            : t("Action Send Gift")}
        </Text>
      </div>
      <div className="recent-action-description">
        <Link to={`/user/${giftAction.buyerId._id}`}>
          <span className="user-highlight">{`${giftAction.buyerId.firstName} `}</span>
        </Link>
        <span>
          {giftAction.type === GiftActionType.Purchase
            ? t("Action Buy Gift Text")
            : t("Action Send Gift Text")}
        </span>
        {giftAction.type === GiftActionType.Send && giftAction.recipientId && (
          <Link to={`/user/${giftAction.recipientId._id}`}>
            <span className="user-highlight">{` ${giftAction.recipientId.firstName}`}</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export const GiftRecentActionSkeleton = () => {
  return (
    <div className="recent-action" style={{ rowGap: "4px" }}>
      <div
        style={{ width: "40px", height: "40px" }}
        className="recent-action-profile-pic skeleton-shimmer"
      ></div>
      <div
        className="recent-action-type skeleton-shimmer"
        style={{ width: "100%", height: "18px", alignSelf: "flex-end" }}
      ></div>
      <div
        style={{ width: "100%", height: "18px" }}
        className="recent-action-description skeleton-shimmer"
      ></div>
    </div>
  );
};
