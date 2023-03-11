import {
  type Dispatch,
  type SetStateAction,
  useState,
  useEffect,
  useRef,
} from "react";
import { motion } from "framer-motion";
import useWindowWidth from "../../hooks/useWindowWidth";
import axios from "axios";
import { env } from "../../env/server.mjs";
import useSWR from "swr";
import { Loader } from "..";
import { SearchUsersSection } from "../";

type Props = {
  searchToggled: boolean;
  setSearchToggled: Dispatch<SetStateAction<boolean>>;
};

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

const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data as IUser[]);

const SearchButton = ({ searchToggled, setSearchToggled }: Props) => {
  const [query, setQuery] = useState("");
  const windowWidth = useWindowWidth();
  const slideInRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { data: results, isLoading } = useSWR<IUser[]>(
    query ? `${env.NEXT_PUBLIC_API_HOST}/users/search?username=${query}` : null,
    fetcher
  );

  useEffect(() => {
    const handleEscapeClick = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchToggled(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLElement &&
        !slideInRef.current?.contains(e.target) &&
        !buttonRef.current?.contains(e.target)
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
        ref={buttonRef}
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
        className="fixed top-0 left-[80px] z-10 flex h-screen w-[400px] flex-col gap-2 border-r border-neutral-300 bg-white dark:border-neutral-700 dark:bg-black sm:flex"
        variants={slideVariants}
        initial="collapsed"
        animate={searchToggled ? "full" : "collapsed"}
        transition={{ type: "tween", duration: 0.3 }}
        ref={slideInRef}
      >
        <motion.div
          className="flex h-full flex-col"
          variants={slideChildrenVariants}
          animate={searchToggled ? "visible" : "hidden"}
        >
          <div className="border-b border-neutral-200 py-7 px-4 dark:border-neutral-700">
            <h2 className="mb-6 text-2xl font-semibold">Search query</h2>
            <div className="relative">
              <div className="absolute left-3 top-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5 text-neutral-500 dark:text-neutral-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="w-full rounded-md  bg-neutral-200 px-10 py-2 placeholder-neutral-500 focus:outline-none dark:bg-neutral-800 dark:placeholder-neutral-400"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {isLoading && (
                <div className="absolute right-3 top-2.5">
                  <Loader />
                </div>
              )}
              {!isLoading && query && (
                <button
                  className="absolute right-3 top-2.5 rounded-full bg-neutral-400 p-0.5 dark:bg-neutral-200"
                  onClick={() => setQuery("")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    className="h-4 w-4 stroke-white dark:stroke-black"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <SearchUsersSection results={results} isLoading={isLoading} />
        </motion.div>
      </motion.div>
    </>
  );
};

export default SearchButton;
