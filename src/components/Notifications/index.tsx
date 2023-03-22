import { motion } from "framer-motion";
import {
  type Dispatch,
  type SetStateAction,
  type Ref,
  forwardRef,
} from "react";
import useWindowWidth from "../../hooks/useWindowWidth";

const slideVariants = {
  collapsed: {
    width: 0,
    transitionEnd: {
      display: "none",
    },
  },
  full: {
    display: "flex",
    width: 400,
    transition: { delay: 0.3 },
  },
};

const slideChildrenVariants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
  visible: {
    opacity: 1,
    transition: { delay: 0.3 },
  },
};

const textVariants = {
  hidden: {
    opacity: 0,
    transitionEnd: {
      display: "none",
    },
  },
  visible: { display: "flex", opacity: 1, transition: { delay: 0.3 } },
};

type Props = {
  toggled: boolean;
  otherPanelsToggled: boolean;
  setToggled: Dispatch<SetStateAction<boolean>>;
};

const NotificationsPanel = (
  { toggled, setToggled, otherPanelsToggled }: Props,
  ref: Ref<HTMLDivElement>
) => {
  const windowWidth = useWindowWidth();

  return (
    <div ref={ref}>
      <motion.button
        className="flex w-full items-center gap-4 rounded-3xl py-3 px-2 xl:hover:bg-neutral-100 dark:xl:hover:bg-neutral-900"
        onClick={() => setToggled((current) => !current)}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-7 w-7"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </motion.svg>
        <motion.p
          className="absolute left-16 hidden text-lg xl:block"
          variants={textVariants}
          animate={
            windowWidth < 1280 || toggled || otherPanelsToggled
              ? "hidden"
              : "visible"
          }
        >
          Notifications
        </motion.p>
      </motion.button>
      <motion.div
        className="fixed top-0 left-[80px] z-10 flex h-screen w-[400px] flex-col gap-2 border-r border-neutral-300 bg-white dark:border-neutral-700 dark:bg-black sm:flex"
        variants={slideVariants}
        initial="collapsed"
        animate={toggled ? "full" : "collapsed"}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <motion.div
          className="flex h-full flex-col"
          variants={slideChildrenVariants}
          animate={toggled ? "visible" : "hidden"}
        >
          {/* notifications section */}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default forwardRef(NotificationsPanel);
