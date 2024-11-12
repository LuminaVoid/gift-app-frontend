import "./EmptyDataMessage.css";
import { useTranslation } from "react-i18next";
import Baloons from "../assets/emoji-balloons.json";
import Lottie from "./Lottie";
import { Link } from "wouter";
import { Text } from "./Text";

interface EmptyDataMessageProps {
  message: string;
  linkToStore?: boolean;
}

export const EmptyDataMessage = ({
  message,
  linkToStore = false,
}: Readonly<EmptyDataMessageProps>) => {
  const { t } = useTranslation();
  return (
    <div className="empty-data-message">
      <Lottie name="baloons" animationData={Baloons} />
      <Text type="subtitle">{message}</Text>
      {linkToStore && <Link to="/">{t("Open Store")}</Link>}
    </div>
  );
};
