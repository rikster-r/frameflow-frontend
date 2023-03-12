import type { ReactNode } from "react";
import { Header, BottomNav, Sidebar } from "./index";
import useUser from "../hooks/useUser";
import { useRouter } from "next/router";

type Props = {
  children: ReactNode | ReactNode[];
};

const Layout = ({ children }: Props) => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <div
      className={`${
        user ? "sm:flex-row" : ""
      } flex min-h-[100dvh] w-full flex-col dark:bg-black dark:text-neutral-100`}
    >
      {/* Header and BottomNav only for mobile, except if not loggen in, Sidebar only for bigger than mobile */}
      {router.pathname !== "/search" && <Header />}
      {user && <Sidebar />}
      {children}
      {user && <BottomNav />}
    </div>
  );
};

export default Layout;
