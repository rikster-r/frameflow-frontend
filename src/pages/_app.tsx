import { type AppType } from "next/dist/shared/lib/utils";
import "../styles/globals.css";
import { ToastContainer, type Theme } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createContext, useEffect, useState } from "react";

type ThemeContextType = {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  //eslint-disable-next-line
  setIsDark: () => {},
});

export interface IUser {
  id: string;
  __v: number;
  publicName: string;
  username: string;
  password: string;
  image: string;
  follows: string[];
  visited: string[];
  savedPosts: string[];
}

const MyApp: AppType = ({ Component, pageProps }) => {
  const [isDark, setIsDark] = useState(false);

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
      <Component {...pageProps} />
      <ToastContainer
        position="top-center"
        hideProgressBar={true}
        autoClose={2500}
      />
    </ThemeContext.Provider>
  );
};

export default MyApp;
