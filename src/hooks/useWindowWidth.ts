import { useState, useLayoutEffect } from "react";

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useLayoutEffect(() => {
    const getWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", getWidth);

    return () => window.removeEventListener("resize", getWidth);
  }, []);

  return windowWidth;
};

export default useWindowWidth;
