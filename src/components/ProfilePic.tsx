import { MarketIcon, SendIcon } from "./Icons";
import { motion } from "framer-motion";
import "./ProfilePic.css";

interface MiniProfilePicProps {
  url?: string;
  fallback: {
    color: string;
    letter: string;
  };
  size?: "s" | "xs";
  icon?: "send" | "buy";
}

const iconNameToIcon = {
  send: <SendIcon width={17} height={17} />,
  buy: <MarketIcon width={17} height={17} />,
} as const;

export function MiniProfilePic({
  url,
  fallback,
  size = "s",
  icon,
}: Readonly<MiniProfilePicProps>) {
  const style = url
    ? { background: `url(${url})`, backgroundSize: "100% 100%" }
    : {
        backgroundImage: `linear-gradient(white, ${fallback.color})`,
        backgroundSize: "100% 200%",
        backgroundPosition: "bottom",
      };
  return (
    <div className={`mini-profile-pic-container pp-${size}`}>
      <div className={`mini-profile-pic pp-${size}`} style={style}>
        {url ? "" : fallback.letter}
      </div>
      {icon && (
        <div className={`mini-profile-pic-icon mini-profile-pic-icon-${icon}`}>
          {iconNameToIcon[icon]}
        </div>
      )}
    </div>
  );
}

interface ProfilePicProps {
  userId: string;
  url?: string;
  fallback: {
    color: string;
    letter: string;
  };
  leaderboardPosition: number;
}

export default function ProfilePic({
  userId,
  url,
  fallback,
  leaderboardPosition,
}: Readonly<ProfilePicProps>) {
  const style = url
    ? { background: `url(${url})`, backgroundSize: "100% 100%" }
    : {
        backgroundImage: `linear-gradient(white, ${fallback.color})`,
        backgroundSize: "100% 200%",
        backgroundPosition: "bottom",
      };
  return (
    <div className="profile-pic-container">
      <motion.div
        layoutId={`user_pic_${userId}`}
        animate={{ zIndex: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="profile-pic"
        style={style}
      >
        {url ? "" : fallback.letter}
      </motion.div>
      <div className={`profile-rating rating-${leaderboardPosition}`}>
        #{leaderboardPosition}
      </div>
    </div>
  );
}
