import { useTranslation } from "react-i18next";
import { Text } from "./Text";

export const ErrorMessage = ({ message }: { message?: string }) => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#00000020",
        padding: "8px",
        borderRadius: "8px",
      }}
    >
      <Text type="subtitle" color="textSecondary">
        Error
      </Text>
      <Text type="footnote" color="textSecondary">
        {message ?? t("Something went wrong")}
      </Text>
    </div>
  );
};
