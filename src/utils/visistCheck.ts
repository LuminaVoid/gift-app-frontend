export let FIRST_VISIT = true;

window.history.pushState = new Proxy(window.history.pushState, {
  apply: (
    target,
    thisArg,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    argArray: [data: any, unused: string, url?: string | URL | null | undefined]
  ) => {
    FIRST_VISIT = false;
    return target.apply(thisArg, argArray);
  },
});
