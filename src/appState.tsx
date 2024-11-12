import { useQuery } from "@tanstack/react-query";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User } from "./types";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line react-refresh/only-export-components
export enum Theme {
  Dark = "dark",
  Light = "light",
}

const LS_THEME_KEY = "theme";

interface AppStateContextType {
  user: User | null;
  currentTheme: Theme;
  changeTheme: (toTheme: Theme) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

export const AppStateProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren) => {
  const tgState = useSignal(initData.state);
  const [currentTheme, setCurrentTheme] = useState(() => {
    const lsTheme = localStorage.getItem(LS_THEME_KEY);
    if (lsTheme) {
      document.documentElement.setAttribute("data-theme", lsTheme);
      return lsTheme as Theme;
    }
    return Theme.Light;
  });
  const { i18n } = useTranslation();

  useEffect(() => {
    // Redirect if deeplinking to receive gift
    if (tgState?.startParam?.startsWith("gift")) {
      const giftId = tgState.startParam.split("_")[1] || null;
      if (giftId) {
        history.pushState(null, "", `/receive-gift/${giftId}`);
      }
    }
  }, [tgState?.startParam]);

  const { data } = useQuery({
    queryKey: ["connected-user"],
    queryFn: async () => {
      const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${
          tgState?.user?.id
        }?isTelegramId=true`
      );
      const respJson = await resp.json();
      if (resp.status === 200 && respJson.status === "success") {
        setCurrentTheme(respJson.user.theme);
        document.documentElement.setAttribute(
          "data-theme",
          respJson.user.theme
        );
        localStorage.setItem(LS_THEME_KEY, respJson.user.theme);
        return respJson;
      }
      throw Error();
    },
    enabled: !!tgState?.user?.id,
  });

  const contextValue = useMemo(
    () => ({
      user: data?.user ?? null,
      currentTheme,
      changeTheme: (toTheme: Theme) => {
        localStorage.setItem(LS_THEME_KEY, toTheme);
        setCurrentTheme(toTheme);
      },
    }),
    [data?.user, currentTheme]
  );

  useEffect(() => {
    if (
      contextValue.user?.languageCode &&
      i18n.language !== contextValue.user?.languageCode
    ) {
      i18n.changeLanguage(contextValue.user.languageCode);
    }
  }, [i18n, contextValue.user?.languageCode]);

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppState = () => {
  const appState = useContext(AppStateContext);

  if (!appState) {
    throw new Error("appState has to be used within <AppStateProvider>");
  }
  return appState;
};
