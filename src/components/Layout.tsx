import type { ReactNode } from "react";
import { Header, BottomNav, Sidebar } from "./index";
import useUser from "../hooks/useUser";

type Props = {
  children: ReactNode | ReactNode[];
};

const Layout = ({ children }: Props) => {
  const { user } = useUser();

  return (
    <div
      className={`${
        user ? "sm:flex-row" : ""
      } flex min-h-screen w-full flex-col dark:bg-black dark:text-neutral-100`}
    >
      {/* Header and BottomNav only for mobile, except if not loggen in, Sidebar only for bigger than mobile */}
      <Header user={user} />
      {user && <Sidebar user={user} />}
      <div className="">{children}</div>
      {user && <BottomNav username={user.username} />}
    </div>
  );
};

export default Layout;
