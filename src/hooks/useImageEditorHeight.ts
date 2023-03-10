import { useEffect, useState } from "react";

const useImageEditorHeight = () => {
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const getHeight = () => {
      if (window.innerWidth < 640) {
        setHeight(window.innerHeight * 0.55 - 20);
      } else {
        setHeight(Math.min(window.innerHeight * 0.7, 900) - 49);
      }
    };
    getHeight();

    window.addEventListener("resize", getHeight);

    return () => window.removeEventListener("resize", getHeight);
  }, []);

  return height;
};

export default useImageEditorHeight;
