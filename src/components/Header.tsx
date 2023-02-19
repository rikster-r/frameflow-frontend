import Link from "next/link";
import { motion } from "framer-motion";
import CreatePost from "./CreatePost";
import type { IUser } from "../pages/_app";

type Props = {
  user: IUser;
};

const Header = ({ user }: Props) => {
  return (
    <header className="flex items-center border-b border-neutral-300 px-4 py-3 dark:border-neutral-700 sm:hidden">
      <div className="mr-auto font-logo text-4xl">Frameflow</div>
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
    </header>
  );
};

export default Header;
