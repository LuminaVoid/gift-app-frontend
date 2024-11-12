import "./GiftSplashScreen.css";
import { ToastNotification } from "./ToastNotification";
import Lottie from "./Lottie";
import { GiftVariant } from "../types";
import EffectGiftPurchase from "../assets/effect-gift-purchased.json";
import { AnimatePresence, motion } from "framer-motion";
import { DelayedRender } from "./DelayedRender";

interface GiftSplashScreenProps {
  giftVariant: GiftVariant;
  title: string;
  subtitle: string;
  toast: {
    title: string;
    subtitle: string;
    actionText: string;
    action: () => void;
  };
}

export const GiftSplashScreen = ({
  giftVariant,
  title,
  subtitle,
  toast,
}: Readonly<GiftSplashScreenProps>) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.5, delay: 0.0625 },
        }}
        exit={{
          opacity: 0,
          scale: 0.9,
          filter: "blur(5px)",
          transition: { duration: 0.5 },
        }}
        className="abs-page gift-splash"
      >
        <div>
          <Lottie
            name={giftVariant.media.lottieUrl}
            animationData={undefined}
            initialFrame={giftVariant.media.lottieInitialFrame}
            sequence={giftVariant.media.lottieSequence}
          />
          <div className="effect-overlay">
            <DelayedRender delay={750}>
              <Lottie
                name={"effect-gift-purchase"}
                animationData={EffectGiftPurchase}
                initialFrame={0}
                sequence={["forward"]}
              />
            </DelayedRender>
          </div>
        </div>
        <div>{title}</div>
        <div dangerouslySetInnerHTML={{ __html: subtitle }}></div>
        <ToastNotification
          title={toast.title}
          subtitle={toast.subtitle}
          actionText={toast.actionText}
          action={toast.action}
          giftVariant={giftVariant}
        />
      </motion.div>
    </AnimatePresence>
  );
};
