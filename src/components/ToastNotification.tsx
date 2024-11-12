import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";
import Lottie from "./Lottie";
import "./ToastNotification.css";
import { useEffect, useState } from "react";
import { GiftVariant } from "../types";

interface ToastNotificationProps {
  title: string;
  subtitle: string;
  actionText: string;
  action: () => void;
  giftVariant: GiftVariant;
}

export const ToastNotification = ({
  title,
  subtitle,
  actionText,
  action,
  giftVariant,
}: Readonly<ToastNotificationProps>) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 4500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ bottom: "0%" }}
          animate={{ bottom: "20%" }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            duration: 0.325,
            delay: 0.4,
            ease: "easeOut",
            opacity: { duration: 0.15, delay: 0.4 },
            scale: { duration: 0.6, delay: 0.4 },
          }}
          className="toast-container"
        >
          <AnimatePresence>
            <motion.div
              layout
              initial={{ filter: "blur(3px)", scale: 1 }}
              animate={{
                filter: "blur(0px)",
                scale: [0, 1.25, 1],
              }}
              transition={{
                filter: { duration: 0.3, delay: 0.85 },
                scale: { duration: 0.4, delay: 0.85, times: [0, 0.7, 1] },
              }}
            >
              <Lottie
                name={giftVariant.media.lottieUrl}
                animationData={undefined}
                initialFrame={giftVariant.media.lottieInitialFrame}
                sequence={giftVariant.media.lottieSequence}
              />
            </motion.div>
          </AnimatePresence>
          <div>{title}</div>
          <div>{subtitle}</div>
          <div>
            <Button label={actionText} variant="text-small" onClick={action} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
