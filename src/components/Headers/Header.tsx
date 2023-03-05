import Link from "next/link";
import { motion } from "framer-motion";
import CreatePost from "../CreatePost";

type Props = {
  user?: IUser;
};

const Header = ({ user }: Props) => {
  return (
    <header
      className={`flex w-full items-center justify-center border-b border-neutral-300 px-4 py-3 dark:border-neutral-700 ${
        user ? "sm:hidden" : ""
      } `}
    >
      <div className="flex w-full max-w-[900px] items-center justify-between">
        <Link href="/" className="mr-auto font-logo text-4xl">
          Frameflow
        </Link>
        {user ? (
          <div className="flex items-center justify-center">
            <CreatePost user={user} />
            <Link href="/notifications">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="ml-4 h-7 w-7 active:fill-black"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </motion.svg>
            </Link>
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-5 py-2 font-semibold capitalize tracking-wide text-white hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="mx-5 my-2 rounded-lg font-semibold capitalize tracking-wide text-blue-700  hover:text-blue-400 focus:outline-none"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
