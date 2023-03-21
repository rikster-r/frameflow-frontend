import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState, type Dispatch, type SetStateAction } from "react";

type Props = {
  images: string[];
  doubleClickHandler: (
    setLikeVisible: Dispatch<SetStateAction<boolean>>
  ) => void;
  width: number;
  height: number;
  sizeClasses: string;
};

const PostImagesCarousel = ({
  images,
  doubleClickHandler,
  width,
  height,
  sizeClasses,
}: Props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likeVisible, setLikeVisible] = useState(false);

  return (
    <div className="relative flex flex-1 items-center justify-center md:row-span-full">
      <Image
        src={images.at(currentImageIndex) as string}
        alt=""
        width={width}
        height={height}
        className={`${sizeClasses} bg-black object-contain`}
        // className="h-full w-full bg-black object-contain"
        onDoubleClick={() => doubleClickHandler(setLikeVisible)}
        priority
      />
      <AnimatePresence mode="wait">
        {likeVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
            className="absolute"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-16 w-16 fill-white"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
      {currentImageIndex > 0 && (
        <button
          className="absolute left-2 flex items-center justify-center rounded-full bg-neutral-900 bg-opacity-70 p-2 text-white transition hover:bg-opacity-60 focus:outline-none"
          onClick={() => setCurrentImageIndex((index) => index - 1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      )}
      {currentImageIndex < images.length - 1 && (
        <button
          className="absolute right-2 flex items-center justify-center rounded-full bg-neutral-900 bg-opacity-70 p-2 text-white transition hover:bg-opacity-60 focus:outline-none"
          onClick={() => setCurrentImageIndex((index) => index + 1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PostImagesCarousel;
