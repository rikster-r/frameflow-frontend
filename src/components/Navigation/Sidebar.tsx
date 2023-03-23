import Link from "next/link";
import { motion } from "framer-motion";
import Menu from "./Menu";
import { Avatar, CreatePost, SearchPanel, NotificationsPanel } from "..";
import { useRouter } from "next/router";
import useWindowWidth from "../../hooks/useWindowWidth";
import useUser from "../../hooks/useUser";
import usePanelToggled from "../../hooks/usePanelToggled";

const logoVariants = {
  hidden: {
    scale: 0,
    transitionEnd: {
      display: "none",
    },
  },
  visible: { display: "flex", scale: 1, transition: { delay: 0.3 } },
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

const sidebarVariants = {
  collapsed: { width: 80 },
  full: { width: 270, transition: { delay: 0.3 } },
};

const Sidebar = () => {
  const { user } = useUser();
  const windowWidth = useWindowWidth();
  const { asPath } = useRouter();
  const {
    ref: searchPanelRef,
    isToggled: searchToggled,
    setIsToggled: setSearchToggled,
  } = usePanelToggled();
  const {
    ref: notificationsPanelRef,
    isToggled: notificationsToggled,
    setIsToggled: setNotificationsToggled,
  } = usePanelToggled();
  const panelToggled = searchToggled || notificationsToggled;

  if (!user) return <></>;

  return (
    <div className="sticky top-0 z-10 hidden h-screen w-[80px] flex-col sm:flex xl:w-[270px]">
      <motion.div
        className="flex h-full flex-col gap-2 border-r border-neutral-300 py-8 px-4 dark:border-neutral-700"
        variants={sidebarVariants}
        animate={windowWidth < 1280 || panelToggled ? "collapsed" : "full"}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <Link href="/" className="mb-8 h-7 pl-3">
          <motion.svg
            fill="currentColor"
            viewBox="0 0 52 52"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            variants={logoVariants}
            initial="hidden"
            animate={windowWidth < 1280 || panelToggled ? "visible" : "hidden"}
          >
            <g>
              <path d="m49.9 10.6c-2.1-4.1-7.4-11.7-17.2-7.2-6.1 2.8-9.5 4.4-9.5 4.4l-8.8 3.8c-2.5 1.2-7.9-0.5-11-1.6-0.9-0.3-1.7 0.6-1.3 1.5 2.1 4.1 7.4 11.7 17.2 7.2 6.1-2.8 18.3-8.1 18.3-8.1 2.5-1.2 7.9 0.5 11 1.6 0.9 0.2 1.7-0.7 1.3-1.6z m-21.1 12.8c-1.1 0.6-5.5 2.6-5.5 2.6l-4.4 1.9c-2.2 1.2-6.9-0.4-9.7-1.5-0.8-0.4-1.5 0.6-1.1 1.4 1.8 4 6.5 11.2 15.1 6.8 5.4-2.7 9.9-4.5 9.9-4.5 2.2-1.2 6.9 0.4 9.7 1.5 0.8 0.3 1.5-0.6 1.1-1.5-1.8-3.9-6.5-11.1-15.1-6.7z m-3.2 17.7c-0.9 0.5-2.4 1.4-2.4 1.4-1.7 1.1-5.2-0.3-7.3-1.3-0.6-0.3-1.1 0.6-0.8 1.4 1.3 3.6 4.8 10.1 11.3 6.1 2.4-1.5 2.4-1.4 2.4-1.4 1.8-0.9 5.2 0.3 7.3 1.3 0.6 0.3 1.1-0.6 0.8-1.4-1.3-3.6-4.6-9.8-11.3-6.1z"></path>
            </g>
            <path d="m25.9 25.1"></path>
          </motion.svg>
          <motion.p
            className="invisible font-logo text-4xl xl:visible"
            variants={textVariants}
            animate={windowWidth < 1280 || panelToggled ? "hidden" : "visible"}
          >
            Frameflow
          </motion.p>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-4 rounded-3xl py-3 px-2 xl:hover:bg-neutral-100 dark:xl:hover:bg-neutral-900"
        >
          {asPath === "/" && !panelToggled ? (
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 w-7"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </motion.svg>
          ) : (
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
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </motion.svg>
          )}
          <motion.p
            className={`${
              asPath === "/" ? "font-bold" : ""
            } absolute left-16 hidden text-lg xl:block`}
            variants={textVariants}
            animate={windowWidth < 1280 || panelToggled ? "hidden" : "visible"}
          >
            Home
          </motion.p>
        </Link>
        <SearchPanel
          ref={searchPanelRef}
          toggled={searchToggled}
          otherPanelsToggled={notificationsToggled}
          setToggled={setSearchToggled}
        />
        <Link
          href="/explore"
          className="flex items-center gap-4 rounded-3xl py-3 px-2 xl:hover:bg-neutral-100 dark:xl:hover:bg-neutral-900"
        >
          {asPath === "/explore" && !panelToggled ? (
            <motion.svg
              className="h-7 w-7"
              viewBox="0 0 15 15"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <path d="M5.61805 9.38198L6.87269 6.87269L9.38198 5.61805L8.12734 8.12734L5.61805 9.38198Z" />
              <path d="M0 7.5C0 3.35786 3.35786 0 7.5 0C11.6421 0 15 3.35786 15 7.5C15 11.6421 11.6421 15 7.5 15C3.35786 15 0 11.6421 0 7.5ZM10.9472 4.72362C11.0435 4.53113 11.0057 4.29864 10.8536 4.14646C10.7014 3.99428 10.4689 3.95655 10.2764 4.0528L6.27641 6.0528C6.17964 6.10118 6.10118 6.17964 6.0528 6.27641L4.0528 10.2764C3.95655 10.4689 3.99428 10.7014 4.14646 10.8536C4.29864 11.0057 4.53113 11.0435 4.72362 10.9472L8.72362 8.94723C8.82038 8.89885 8.89885 8.82038 8.94723 8.72362L10.9472 4.72362Z" />
            </motion.svg>
          ) : (
            <motion.svg
              className="h-7 w-7"
              viewBox="-1.5 -1.5 18.00 18.00"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <path d="M4.5 10.5L4.05279 10.2764C3.95654 10.4689 3.99427 10.7014 4.14645 10.8536C4.29863 11.0057 4.53111 11.0435 4.72361 10.9472L4.5 10.5ZM6.5 6.5L6.27639 6.05279C6.17963 6.10117 6.10117 6.17963 6.05279 6.27639L6.5 6.5ZM10.5 4.5L10.9472 4.72361C11.0435 4.53111 11.0057 4.29863 10.8536 4.14645C10.7014 3.99427 10.4689 3.95654 10.2764 4.05279L10.5 4.5ZM8.5 8.5L8.72361 8.94721C8.82037 8.89883 8.89883 8.82037 8.94721 8.72361L8.5 8.5ZM7.5 14C3.91015 14 1 11.0899 1 7.5H0C0 11.6421 3.35786 15 7.5 15V14ZM14 7.5C14 11.0899 11.0899 14 7.5 14V15C11.6421 15 15 11.6421 15 7.5H14ZM7.5 1C11.0899 1 14 3.91015 14 7.5H15C15 3.35786 11.6421 0 7.5 0V1ZM7.5 0C3.35786 0 0 3.35786 0 7.5H1C1 3.91015 3.91015 1 7.5 1V0ZM4.94721 10.7236L6.94721 6.72361L6.05279 6.27639L4.05279 10.2764L4.94721 10.7236ZM6.72361 6.94721L10.7236 4.94721L10.2764 4.05279L6.27639 6.05279L6.72361 6.94721ZM10.0528 4.27639L8.05279 8.27639L8.94721 8.72361L10.9472 4.72361L10.0528 4.27639ZM8.27639 8.05279L4.27639 10.0528L4.72361 10.9472L8.72361 8.94721L8.27639 8.05279Z" />
            </motion.svg>
          )}

          <motion.p
            className={`${
              asPath === "/explore" ? "font-bold" : ""
            } absolute left-16 hidden text-lg xl:block`}
            variants={textVariants}
            animate={windowWidth < 1280 || panelToggled ? "hidden" : "visible"}
          >
            Explore
          </motion.p>
        </Link>
        <NotificationsPanel
          ref={notificationsPanelRef}
          toggled={notificationsToggled}
          otherPanelsToggled={searchToggled}
          setToggled={setNotificationsToggled}
        />
        <CreatePost panelToggled={panelToggled} />
        <Link
          href={`/${user.username}`}
          className="flex items-center gap-4 rounded-3xl py-3 px-2 xl:hover:bg-neutral-100 dark:xl:hover:bg-neutral-900"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Avatar
              className={`${
                asPath === `/${user.username}`
                  ? "outline outline-2 outline-black dark:outline-white"
                  : ""
              } inline-flex h-7 w-7 select-none items-center justify-center overflow-hidden rounded-full align-middle`}
              user={user}
            />
          </motion.div>
          <motion.p
            className={`${
              asPath === `/${user.username}` ? "font-bold" : ""
            } absolute left-16 hidden text-lg xl:block`}
            variants={textVariants}
            animate={windowWidth < 1280 || panelToggled ? "hidden" : "visible"}
          >
            Profile
          </motion.p>
        </Link>
        <Menu panelToggled={panelToggled} />
      </motion.div>
    </div>
  );
};

export default Sidebar;
