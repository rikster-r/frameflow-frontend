import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";

type Props = {
  status: string;
};

const FourthStep = ({ status }: Props) => {
  return (
    <>
      <div className="flex items-center justify-between ">
        <Dialog.Title className="flex-1 py-3 text-center font-semibold">
          Publication
        </Dialog.Title>
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center gap-5 border-t border-neutral-300 dark:border-neutral-900">
        <div
          className={`${
            status === "pending" ? "animate-spin" : ""
          } flex h-[120px] w-[120px] items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500`}
        >
          <div className="flex h-[110px] w-[110px] items-center justify-center rounded-full bg-white dark:bg-neutral-800">
            {status === "success" && (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="absolute h-16 w-16 text-purple-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </motion.svg>
            )}
            {status === "error" && (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="absolute h-16 w-16 text-purple-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </motion.svg>
            )}
          </div>
        </div>

        {status !== "pending" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-center text-xl">
              {status === "success" ? "Post published." : "Error occured."}
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default FourthStep;
