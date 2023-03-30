import { type ReactNode, useEffect, useContext } from "react";
import { Header, BottomNav, Sidebar } from "./index";
import useUser from "../hooks/useUser";
import { useRouter } from "next/router";
import { PageLoadContext } from "../pages/_app";

type Props = {
  children: ReactNode | ReactNode[];
};

const Layout = ({ children }: Props) => {
  const { user } = useUser();
  const router = useRouter();
  const { setPageLoadProgress } = useContext(PageLoadContext);

  useEffect(() => {
    const handleStart = () => {
      setPageLoadProgress(50);
    };

    const handleStop = () => {
      setPageLoadProgress(100);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

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
