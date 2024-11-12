import { SearchIcon } from "./Icons";
import "./SearchInput.css";
import { useTranslation } from "react-i18next";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchInput = ({
  value,
  onChange,
}: Readonly<SearchInputProps>) => {
  const { t } = useTranslation();
  return (
    <div className="sticky-search-container">
      <div className="search-input">
        <input
          onChange={onChange}
          id="search-input"
          autoComplete="off"
          type="text"
          value={value}
        />
        <label htmlFor="search-input">
          <SearchIcon
            fill={getComputedStyle(document.body).getPropertyValue(
              "--search-placeholder-clr"
            )}
          />
          <span>{t("Search")}</span>
        </label>
      </div>
    </div>
  );
};
