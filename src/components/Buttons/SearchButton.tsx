import { type Dispatch, type SetStateAction, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import useWindowWidth from "../../hooks/useWindowWidth";

type Props = {
  searchToggled: boolean;
  setSearchToggled: Dispatch<SetStateAction<boolean>>;
};

const slideInVariants = {
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

const textVariants = {
  hidden: {
    opacity: 0,
    transitionEnd: {
      display: "none",
    },
  },
  visible: { display: "flex", opacity: 1, transition: { delay: 0.3 } },
};

const SearchButton = ({ searchToggled, setSearchToggled }: Props) => {
  const windowWidth = useWindowWidth();
  const slideInRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscapeClick = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchToggled(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLElement &&
        slideInRef.current &&
        !slideInRef.current?.contains(e.target)
      ) {
        setSearchToggled(false);
      }
    };

    document.addEventListener("keydown", handleEscapeClick);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscapeClick);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSearchToggled, slideInRef]);

  return (
    <>
      <motion.button
        className="flex w-full items-center gap-4 rounded-3xl py-3 px-2 xl:hover:bg-neutral-100 dark:xl:hover:bg-neutral-900"
        onClick={() => setSearchToggled((current) => !current)}
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
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </motion.svg>
        <motion.p
          className="absolute left-16 hidden text-lg xl:block"
          variants={textVariants}
          animate={windowWidth < 1280 || searchToggled ? "hidden" : "visible"}
        >
          Search
        </motion.p>
      </motion.button>
      <motion.div
        className="fixed top-0 left-[80px] z-10 flex h-screen w-[400px] flex-col gap-2 border-r border-neutral-300 bg-white py-8 px-4 dark:border-neutral-700 dark:bg-black sm:flex"
        variants={slideInVariants}
        initial="collapsed"
        animate={searchToggled ? "full" : "collapsed"}
        transition={{ type: "tween", duration: 0.3 }}
        ref={slideInRef}
      ></motion.div>
    </>
  );
};

export default SearchButton;
