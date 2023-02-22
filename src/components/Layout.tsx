import type { ReactNode } from "react";
import { useRouter } from "next/router";
import { Header, BottomNav, Sidebar } from "./index";

type Props = {
  user: IUser;
  children: ReactNode | ReactNode[];
};

const Layout = ({ user, children }: Props) => {
  const router = useRouter();
  const clause = router.pathname === "/" || user;

  return (
    <div
      className={`${
        clause ? "sm:flex-row" : ""
      } flex min-h-screen w-full flex-col dark:bg-black dark:text-neutral-100 `}
    >
      {/* Header and BottomNav only for mobile, except if not loggen in, Sidebar only for bigger than mobile */}
      <Header user={user} />
      {clause && <Sidebar user={user} />}
      {children}
      {clause && <BottomNav username={user.username} />}
    </div>
  );
};

export default Layout;
