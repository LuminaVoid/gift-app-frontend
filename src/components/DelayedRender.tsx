import { useState, useEffect, PropsWithChildren } from "react";

type DelayedProps = {
  delay: number;
};

export const DelayedRender = ({
  children,
  delay,
}: Readonly<PropsWithChildren<DelayedProps>>) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isShown ? children : null;
};
