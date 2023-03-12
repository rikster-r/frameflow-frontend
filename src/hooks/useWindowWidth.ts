import { useState, useLayoutEffect } from "react";

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState<number>(1500);

  useLayoutEffect(() => {
    const getWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    getWidth();

    window.addEventListener("resize", getWidth);

    return () => window.removeEventListener("resize", getWidth);
  }, []);

  return windowWidth;
};

export default useWindowWidth;
