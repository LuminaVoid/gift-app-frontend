import { useTranslation } from "react-i18next";
import "./EndOfInfiniteList.css";

interface EndOfInfiniteListProps {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}

export const EndOfInfiniteList = ({
  isFetchingNextPage,
  hasNextPage,
}: Readonly<EndOfInfiniteListProps>) => {
  const { t } = useTranslation();
  return (
    <>
      {isFetchingNextPage && (
        <div className="centered">
          <div className="spinner"></div>
        </div>
      )}
      {!hasNextPage && (
        <div style={{ opacity: 0.3, marginTop: "12px" }} className="centered">
          {t("You've reached the end of the list.")}
        </div>
      )}
    </>
  );
};
