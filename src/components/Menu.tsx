import tabStore from "../assets/tab-store.json";
import tabGifts from "../assets/tab-gifts.json";
import tabLeaderboard from "../assets/tab-leaderboard.json";
import tabProfile from "../assets/tab-profile.json";
import "./Menu.css";
import { FC, useEffect, useRef } from "react";
import { DotLottieWorker } from "@lottiefiles/dotlottie-web";
import { Link, LinkProps, useRoute } from "wouter";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";

interface MenuItem {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iconAnimation: any;
  to: string;
  activeOnRoutes: string;
}

const menuItems: MenuItem[] = [
  {
    title: "Store",
    iconAnimation: tabStore,
    to: "/",
    activeOnRoutes: "/$|/gift-variant/:id",
  },
  {
    title: "Gifts",
    iconAnimation: tabGifts,
    to: "/gifts",
    activeOnRoutes: "/gifts",
  },
  {
    title: "Leaderboard",
    iconAnimation: tabLeaderboard,
    to: "/leaderboard",
    activeOnRoutes: "/leaderboard$|/user/:id",
  },
  {
    title: "Profile",
    iconAnimation: tabProfile,
    to: "/profile",
    activeOnRoutes: "/profile$|/profile/history$",
  },
];

interface MenuIconProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animationData: any;
  play: boolean;
}

function MenuIcon({ name, animationData, play }: Readonly<MenuIconProps>) {
  const ref = useRef<HTMLCanvasElement>(null);
  const lottieRef = useRef<DotLottieWorker | null>(null);
  useEffect(() => {
    if (play && lottieRef.current) {
      lottieRef.current.stop();
      lottieRef.current.play();
      return;
    }
    if (ref.current === null) {
      return;
    }

    if (ref.current.hasAttribute("animation")) {
      return;
    }

    ref.current.setAttribute("animation", "true");

    lottieRef.current = new DotLottieWorker({
      canvas: ref.current,
      data: animationData,
      loop: false,
      autoplay: false,
      workerId: "lottie-worker-menu",
    });
  }, [name, animationData, play]);
  return (
    <div className="lottie-icon">
      <canvas
        style={{ width: 26, height: 26 }}
        className="lottie-canvas"
        ref={ref}
      ></canvas>
    </div>
  );
}

const NavLink: FC<LinkProps & MenuItem> = ({
  title,
  iconAnimation,
  ...props
}) => {
  const { t } = useTranslation();
  const [isActive] = useRoute(props.activeOnRoutes);
  return (
    <Link to={props.to} className={isActive ? "navlink active" : "navlink"}>
      <>
        <div>
          <MenuIcon
            name={title}
            play={isActive}
            animationData={iconAnimation}
          />
        </div>
        <p className={"tab-name"}>{t(title)}</p>
      </>
    </Link>
  );
};

export default function Menu() {
  const [isHidden] = useRoute("/gift-variant/:id");
  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.ul initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}>
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.to}
                title={item.title}
                iconAnimation={item.iconAnimation}
                activeOnRoutes={item.activeOnRoutes}
              />
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );
}
