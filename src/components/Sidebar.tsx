import Link from "next/link";
import { motion } from "framer-motion";
import Menu from "./Menu";
import { Avatar, CreatePost } from "./";

type Props = {
  user: IUser;
};

const Sidebar = ({ user }: Props) => {
  return (
    <div className="sticky top-0 z-10 hidden h-screen flex-col gap-2 border-r border-neutral-300 py-8 px-4 dark:border-neutral-700 sm:flex xl:w-[270px]">
      <Link href="/" className="mb-8 pl-3">
        <motion.svg
          fill="currentColor"
          viewBox="0 0 52 52"
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 xl:hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <g>
            <path d="m49.9 10.6c-2.1-4.1-7.4-11.7-17.2-7.2-6.1 2.8-9.5 4.4-9.5 4.4l-8.8 3.8c-2.5 1.2-7.9-0.5-11-1.6-0.9-0.3-1.7 0.6-1.3 1.5 2.1 4.1 7.4 11.7 17.2 7.2 6.1-2.8 18.3-8.1 18.3-8.1 2.5-1.2 7.9 0.5 11 1.6 0.9 0.2 1.7-0.7 1.3-1.6z m-21.1 12.8c-1.1 0.6-5.5 2.6-5.5 2.6l-4.4 1.9c-2.2 1.2-6.9-0.4-9.7-1.5-0.8-0.4-1.5 0.6-1.1 1.4 1.8 4 6.5 11.2 15.1 6.8 5.4-2.7 9.9-4.5 9.9-4.5 2.2-1.2 6.9 0.4 9.7 1.5 0.8 0.3 1.5-0.6 1.1-1.5-1.8-3.9-6.5-11.1-15.1-6.7z m-3.2 17.7c-0.9 0.5-2.4 1.4-2.4 1.4-1.7 1.1-5.2-0.3-7.3-1.3-0.6-0.3-1.1 0.6-0.8 1.4 1.3 3.6 4.8 10.1 11.3 6.1 2.4-1.5 2.4-1.4 2.4-1.4 1.8-0.9 5.2 0.3 7.3 1.3 0.6 0.3 1.1-0.6 0.8-1.4-1.3-3.6-4.6-9.8-11.3-6.1z"></path>
          </g>
          <path d="m25.9 25.1"></path>
        </motion.svg>
        <p className="hidden font-logo text-4xl xl:block">Frameflow</p>
      </Link>
      <Link
        href="/"
        className="flex items-center gap-4 rounded-3xl py-3 px-2 xl:hover:bg-neutral-100 dark:xl:hover:bg-neutral-900"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-7 w-7 scale-100 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </motion.svg>
        <p className="hidden text-lg xl:block">Home</p>
      </Link>
      <button className="flex items-center gap-4 rounded-3xl py-3 px-2 xl:hover:bg-neutral-100 dark:xl:hover:bg-neutral-900">
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
        <p className="hidden text-lg xl:block">Search</p>
      </button>
      <Link
        href="/explore"
        className="flex items-center gap-4 rounded-3xl py-3 px-2 xl:hover:bg-neutral-100 dark:xl:hover:bg-neutral-900"
      >
        <motion.svg
          className="h-7 w-7"
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <path d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z" />
          <path d="M725.888 315.008C676.48 428.672 624 513.28 568.576 568.64c-55.424 55.424-139.968 107.904-253.568 157.312a12.8 12.8 0 0 1-16.896-16.832c49.536-113.728 102.016-198.272 157.312-253.632 55.36-55.296 139.904-107.776 253.632-157.312a12.8 12.8 0 0 1 16.832 16.832z" />
        </motion.svg>
        <p className="hidden text-lg xl:block">Explore</p>
      </Link>
      <button className="flex items-center gap-4 rounded-3xl py-3 px-2 xl:hover:bg-neutral-100 dark:xl:hover:bg-neutral-900">
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
        <p className="hidden text-lg xl:block">Notifications</p>
      </button>
      <CreatePost user={user} />
      <Link
        href={`/${user.username}`}
        className="flex items-center gap-4 rounded-3xl py-3 px-2 xl:hover:bg-neutral-100 dark:xl:hover:bg-neutral-900"
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Avatar
            className="inline-flex h-7 w-7 select-none items-center justify-center overflow-hidden rounded-full align-middle"
            user={user}
          />
        </motion.div>
        <p className="hidden text-lg xl:block">Profile</p>
      </Link>
      <Menu username={user.username} />
    </div>
  );
};

export default Sidebar;
