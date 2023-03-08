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
import Link from "next/link";
import { Avatar } from "../";

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

const getSearchResults = (url: string) =>
  axios.get(url).then((res) => res.data as IUser[]);

const SearchButton = ({ searchToggled, setSearchToggled }: Props) => {
  const [query, setQuery] = useState("");
  const url = `${env.NEXT_PUBLIC_API_HOST}/users/search?username=${query}`;
  const { data: results, isLoading } = useSWR<IUser[]>(
    query ? url : null,
    getSearchResults
  );
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
          <div className="border-b border-neutral-200 py-7 px-6 dark:border-neutral-700">
            <h2 className="mb-6 text-2xl font-semibold">Search query</h2>
            <div className="relative">
              <input
                type="text"
                className="w-full rounded-md  bg-neutral-200 px-4 py-2 placeholder-neutral-500 focus:outline-none dark:bg-neutral-800 dark:placeholder-neutral-400"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {isLoading && (
                <div role="status" className="absolute right-3 top-2.5">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
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
          {!isLoading && !results && (
            <div className="w-full px-6 py-4 ">
              <div className="flex justify-between">
                <h3 className="font-semibold">Recent</h3>
                <button className="font-semibold text-blue-500 hover:text-blue-900 dark:hover:text-blue-200">
                  Clear all
                </button>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            </div>
          )}
          {results &&
            results.map((user) => (
              <Link
                href={`/${user.username}`}
                className="flex w-full items-center gap-0.5 truncate px-6 py-3 hover:bg-gray-100"
                key={user._id}
              >
                <Avatar
                  className="mr-4 inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full align-middle"
                  user={user}
                />
                <div>
                  <p className="text-sm font-semibold">{user.username}</p>
                  <p className="text-sm text-neutral-400">{user.publicName}</p>
                </div>
              </Link>
            ))}
          {results && results.length === 0 && (
            <div className="flex h-full items-center justify-center text-neutral-500">
              No results.
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default SearchButton;
