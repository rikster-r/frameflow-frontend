import { useEffect, useState } from "react";

const useImageEditorWidth = () => {
  const [width, setWidth] = useState<number>();

  useEffect(() => {
    const getWidth = () => {
      if (window.innerWidth > 1536) {
        setWidth(600);
      } else if (window.innerWidth > 768) {
        setWidth(450);
      } else {
        setWidth(350);
      }
    };

    window.addEventListener("resize", getWidth);
    getWidth();

    return () => window.removeEventListener("resize", getWidth);
  }, []);

  return width;
};

export default useImageEditorWidth;
