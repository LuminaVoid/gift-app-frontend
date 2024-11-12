import {
  backButton,
  mainButton,
  secondaryButton,
  viewport,
  themeParams,
  miniApp,
  initData,
  $debug,
  init as initSDK,
  switchInlineQuery,
} from "@telegram-apps/sdk-react";

export function init(debug: boolean): void {
  // Set @telegram-apps/sdk-react debug mode.
  $debug.set(debug);

  // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
  // Also, configure the package.
  initSDK();

  const inlineQuerySupported = debug ? true : switchInlineQuery.isSupported();

  // Check if all required components are supported.
  if (
    !backButton.isSupported() ||
    !miniApp.isSupported() ||
    !secondaryButton.isSupported() ||
    !inlineQuerySupported
  ) {
    throw new Error("ERR_NOT_SUPPORTED");
  }

  // Mount all components used in the project.
  mainButton.mount();
  secondaryButton.mount();
  backButton.mount();
  backButton.onClick(() => {
    history.back();
  });
  miniApp.mount();
  themeParams.mount();
  initData.restore();
  void viewport
    .mount()
    .catch((e) => {
      console.error("Something went wrong mounting the viewport", e);
    })
    .then(() => {
      viewport.bindCssVars();
    });

  viewport.expand();
  // Define components-related CSS variables.
  miniApp.bindCssVars();
  themeParams.bindCssVars();
}
