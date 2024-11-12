import { PropsWithChildren, useRef } from "react";
import "./BottomSheet.css";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "../utils/useClickOutside";
import { CrossIcon } from "./Icons";

const variants = {
  hidden: { y: "100%" },
  visible: { y: 0 },
};

interface BottomSheetProps {
  open: boolean;
  onClose: (e: React.MouseEvent<HTMLElement>) => void;
}

export const BottomSheet = ({
  children,
  open,
  onClose,
}: Readonly<PropsWithChildren<BottomSheetProps>>) => {
  const bottomSheetRef = useRef(null);
  useClickOutside(bottomSheetRef, onClose);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            key="bottom-sheet-backdrop"
            className="bottom-sheet-backdrop"
          ></motion.div>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.4 }}
            key="bottom-sheet"
            className="bottom-sheet"
            ref={bottomSheetRef}
          >
            <button onClick={onClose} className="bottom-sheet-close">
              <CrossIcon
                width={22}
                height={22}
                fill={getComputedStyle(document.body).getPropertyValue(
                  "--labelSecondary"
                )}
              />
            </button>
            <div>{children}</div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};
