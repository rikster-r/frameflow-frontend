import { useState, useRef, useEffect } from "react";

const usePanelToggled = () => {
  const [isToggled, setIsToggled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscapeClick = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsToggled(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setIsToggled(false);
      }
    };

    document.addEventListener("keydown", handleEscapeClick);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscapeClick);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return { ref, isToggled, setIsToggled };
};

export default usePanelToggled;
