import { useAppState, Theme } from "../appState";
import { updateBackendUser } from "../giftAppAPI";
import Toggle from "./Toggle";

export default function ThemeSwitch() {
  const { user, currentTheme, changeTheme } = useAppState();
  const switchTheme = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const targetTheme = currentTheme === "light" ? Theme.Dark : Theme.Light;
    document.documentElement.setAttribute("data-theme", targetTheme);
    changeTheme(targetTheme);
    updateBackendUser(user?._id, targetTheme);
  };
  return (
    <Toggle
      name="theme"
      checked={currentTheme === Theme.Dark}
      onChange={switchTheme}
    />
  );
}
