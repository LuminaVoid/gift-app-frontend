import { useAppState } from "../appState";
import { updateBackendUser } from "../giftAppAPI";
import Toggle from "./Toggle";
import { useTranslation } from "react-i18next";

export default function LanguageSwitch() {
  const { i18n } = useTranslation();
  const { user } = useAppState();
  const switchLanguage = () => {
    const newLang = i18n.language === "ru" ? "en" : "ru";
    i18n.changeLanguage(newLang);
    updateBackendUser(user?._id, undefined, newLang);
  };
  return (
    <Toggle
      name="language"
      checked={i18n.language === "ru"}
      onChange={switchLanguage}
    />
  );
}
