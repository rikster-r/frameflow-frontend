import { motion } from "framer-motion";
import { useContext, Fragment } from "react";
import Link from "next/link";
import { ThemeContext } from "../../pages/_app";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import LogoutButton from "../Buttons/LogoutButton";
import useWindowWidth from "../../hooks/useWindowWidth";
import useUser from "../../hooks/useUser";

type Props = {
  panelToggled: boolean;
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

const Menu = ({ panelToggled }: Props) => {
  const { user } = useUser();
  const { isDark, setIsDark } = useContext(ThemeContext);
  const windowWidth = useWindowWidth();

  if (!user) return <></>;

  return (
    <div className="relative mt-auto w-full">
      <HeadlessMenu as="div" className="relative inline-block w-full text-left">
        {({ open }) => (
          <>
            <HeadlessMenu.Button className="flex w-full items-center gap-4 rounded-3xl py-3 px-2 xl:hover:bg-neutral-100 dark:xl:hover:bg-neutral-900">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={open ? 2.3 : 1.5}
                stroke="currentColor"
                className="h-7 w-7"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </motion.svg>
              <motion.p
                className={`${
                  open ? "font-bold" : ""
                } absolute left-12 hidden text-lg xl:block`}
                variants={textVariants}
                animate={
                  windowWidth < 1280 || panelToggled ? "hidden" : "visible"
                }
              >
                More
              </motion.p>
            </HeadlessMenu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-100"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <HeadlessMenu.Items className="absolute bottom-16 z-20 w-[250px] origin-bottom rounded-md bg-white shadow-md dark:bg-neutral-800">
                <HeadlessMenu.Item>
                  <Link
                    href={`/${user.username}/edit`}
                    className="flex items-center border-b border-neutral-300 px-4 py-3 hover:bg-neutral-100 dark:border-0 dark:hover:bg-neutral-900"
                  >
                    <p className="mr-auto text-lg">Settings</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-7 w-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </Link>
                </HeadlessMenu.Item>
                <HeadlessMenu.Item>
                  <Link
                    href={`/${user.username}/saved`}
                    className="flex items-center border-b border-neutral-300 px-4 py-3 hover:bg-neutral-100  dark:border-0 dark:hover:bg-neutral-900 "
                  >
                    <p className="mr-auto text-lg">Saved</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-7 w-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                      />
                    </svg>
                  </Link>
                </HeadlessMenu.Item>
                <HeadlessMenu.Item>
                  <button
                    className="flex w-full items-center border-b border-neutral-300 px-4 py-3 hover:bg-neutral-100  dark:border-0 dark:hover:bg-neutral-900 "
                    onClick={() => setIsDark(!isDark)}
                  >
                    <p className="mr-auto text-lg">Change theme</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-7 w-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                      />
                    </svg>
                  </button>
                </HeadlessMenu.Item>
                <HeadlessMenu.Item>
                  <LogoutButton />
                </HeadlessMenu.Item>
              </HeadlessMenu.Items>
            </Transition>
          </>
        )}
      </HeadlessMenu>
    </div>
  );
};

export default Menu;
