import { useEffect, useState } from "react";

const useImageEditorWidth = () => {
  const [width, setWidth] = useState<number>();

  useEffect(() => {
    const getWidth = () => {
      if (window.innerWidth < 640) {
        setWidth(window.innerWidth * 0.9);
      } else {
        setWidth(Math.min(window.innerHeight * 0.7, 900));
      }
    };

    window.addEventListener("resize", getWidth);
    getWidth();

    return () => window.removeEventListener("resize", getWidth);
  }, []);

  return width;
};

export default useImageEditorWidth;
