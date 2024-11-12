import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import "./index.css";
import ProfilePage from "./routes/ProfilePage.tsx";
import StorePage from "./routes/StorePage.tsx";
import GiftsPage from "./routes/GiftsPage.tsx";
import LeaderboardPage from "./routes/LeaderboardPage.tsx";
import GiftVariantPage from "./routes/GiftVariantPage.tsx";
import { init } from "./utils/telegramSDK.ts";

import "./utils/mockTelegramEnv.ts";
import Menu from "./components/Menu.tsx";
import { Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { AppStateProvider } from "./appState.tsx";
import { ReceiveGift } from "./routes/ReceiveGift.tsx";
import { ProfileHistoryPage } from "./routes/ProfileHistoryPage.tsx";
import { translations } from "./translations.ts";

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root")!);

i18n.use(initReactI18next).init({
  resources: translations,
  lng: "en",
  fallbackLng: "en",
  debug: true,
  interpolation: {
    escapeValue: false,
  },
});

try {
  init(retrieveLaunchParams().startParam === "debug" || import.meta.env.DEV);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AppStateProvider>
          <div id="content">
            <StorePage />
            <GiftVariantPage />
            <Route path="/gifts" component={GiftsPage} />
            <LeaderboardPage />
            <Route path="/profile" component={ProfilePage} />
            <Route path="/profile/history" component={ProfileHistoryPage} />
            <Route path="/user/:id" component={ProfilePage} />
            <Route path="/receive-gift/:id" component={ReceiveGift} />
          </div>
          <Menu />
        </AppStateProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
} catch (e) {
  console.error(e);
  root.render(<div>Oops, are you're using old version of Telegram?</div>);
}
