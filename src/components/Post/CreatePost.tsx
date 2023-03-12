import { motion } from "framer-motion";
import {
  Fragment,
  useState,
  useEffect,
  useRef,
  type ChangeEventHandler,
  type MouseEventHandler,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  InputStep,
  SizingStep,
  CaptionStep,
  SubmitStep,
} from "../CreatePostSteps";
import { toast } from "react-toastify";
import axios from "axios";
import { env } from "../../env/server.mjs";
import { parseCookies } from "nookies";
import useWindowWidth from "../../hooks/useWindowWidth";

type Props = {
  searchToggled?: boolean;
};

const textVariants = {
  hidden: {
    opacity: 0,
    transitionEnd: {
      display: "none",
    },
  },
  visible: { display: "flex", opacity: 1, transition: { delay: 0.3 } },
};

const CreatePost = ({ searchToggled }: Props) => {
  const windowWidth = useWindowWidth();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState(1);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("pending");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step !== 4) return;

    const { userToken } = parseCookies();
    const data = new FormData();
    files.forEach((file) => data.append("images", file));
    data.append("text", text);

    axios
      .post(`${env.NEXT_PUBLIC_API_HOST}/posts`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken as string}`,
        },
      })
      .then(() => {
        setTimeout(() => setStatus("success"), 1000);
      })
      .catch(() => {
        setTimeout(() => setStatus("error"), 1000);
      });
  }, [step]);

  const handleClose = () => {
    if (inputRef.current) inputRef.current.value = "";
    setFiles([]);
    setText("");
    setStatus("pending");
    setStep(1);
    setOpen(false);
  };

  const handleSelectClick: MouseEventHandler<HTMLButtonElement> = () => {
    // typescript null check
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFilesInput: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newFiles = Array.from(event.target.files || []);

    // size check
    if (newFiles.length + files.length > 9) {
      toast.error("Only 9 images are allowed");
      return;
    }

    // 2097152 bytes === 2mb
    if (newFiles.some((file) => file.size > 2097152)) {
      toast.error("Maximum image size allowed is 2mb");
      return;
    }

    // file type check

    if (
      newFiles.some(
        (file) => file.type !== "image/png" && file.type !== "image/jpeg"
      )
    ) {
      toast.error("Only PNG and JPEG images are allowed");
      return;
    }

    if (files.length === 0) setStep(2);

    setFiles([...files, ...newFiles]);

    // typescript null check
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const getCurrentStep = () => {
    switch (step) {
      case 1:
        return <InputStep handleSelectClick={handleSelectClick} />;
      case 2:
        return (
          <SizingStep
            files={files}
            setFiles={setFiles}
            setStep={setStep}
            handleSelectClick={handleSelectClick}
          />
        );
      case 3:
        return (
          <CaptionStep
            text={text}
            setText={setText}
            setStep={setStep}
          />
        );
      case 4:
        return <SubmitStep status={status} />;
    }
  };

  const currentStep = getCurrentStep();

  return (
    <div className="relative">
      <button
        className="flex w-full items-center gap-4 rounded-3xl py-3 px-2 xl:hover:bg-neutral-100 dark:xl:hover:bg-neutral-900"
        onClick={() => setOpen(true)}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-7 w-7"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </motion.svg>
        <motion.p
          className="absolute left-12 hidden text-lg xl:block"
          variants={textVariants}
          animate={windowWidth < 1280 || searchToggled ? "hidden" : "visible"}
        >
          Create
        </motion.p>
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-70"
            leave="ease-in duration-200"
            leaveFrom="opacity-70"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-90 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="flex w-full items-center justify-center">
                  <Dialog.Panel className="relative flex h-[55vh] max-h-[900px] w-[90vw] max-w-[900px] flex-col overflow-hidden rounded-lg bg-white text-left shadow-xl  dark:bg-neutral-800 dark:text-gray-50 sm:h-[70vh] sm:w-[70vh]">
                    {currentStep}
                  </Dialog.Panel>
                </div>
              </Transition.Child>
              <div className="fixed right-10 top-5 text-white">
                <button onClick={() => setOpen(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-8 w-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <input
                className="hidden"
                accept="image/png, image/jpeg"
                ref={inputRef}
                type="file"
                onChange={handleFilesInput}
                multiple
              />
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default CreatePost;
