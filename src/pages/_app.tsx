import { type AppType } from "next/dist/shared/lib/utils";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createContext, useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";

type ThemeContextType = {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
};

type PageLoadContextType = {
  pageLoadProgress: number;
  setPageLoadProgress: (progress: number) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  //eslint-disable-next-line
  setIsDark: () => {},
});

export const PageLoadContext = createContext<PageLoadContextType>({
  pageLoadProgress: 0,
  //eslint-disable-next-line
  setPageLoadProgress: () => {},
});

const MyApp: AppType = ({ Component, pageProps }) => {
  const [isDark, setIsDark] = useState(false);
  const [pageLoadProgress, setPageLoadProgress] = useState(0);

  useEffect(() => {
    const definedTheme = localStorage.getItem("theme");

    if (
      !definedTheme &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDark(true);
    } else if (definedTheme === "dark") {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");

    document.documentElement.className = isDark ? "dark" : "";
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      <PageLoadContext.Provider
        value={{ pageLoadProgress, setPageLoadProgress }}
      >
        <Component {...pageProps} />
        <ToastContainer
          position="top-center"
          hideProgressBar={true}
          autoClose={2500}
        />
        <LoadingBar
          className="rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500"
          height={4}
          progress={pageLoadProgress}
          loaderSpeed={500}
          waitingTime={400}
          shadow={false}
          onLoaderFinished={() => setPageLoadProgress(0)}
        />
      </PageLoadContext.Provider>
    </ThemeContext.Provider>
  );
};

export default MyApp;
