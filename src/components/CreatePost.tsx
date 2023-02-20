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
  FirstStep,
  SecondStep,
  ThirdStep,
  FourthStep,
} from "./CreatePostSteps";
import { toast } from "react-toastify";
import type { IUser } from "../pages/_app";
import axios from "axios";
import { env } from "../env/server.mjs";
import { parseCookies } from "nookies";

type Props = {
  user: IUser;
};

const CreatePost = ({ user }: Props) => {
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
      .catch((err) => {
        console.log(err);
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
        return <FirstStep handleSelectClick={handleSelectClick} />;
      case 2:
        return (
          <SecondStep
            files={files}
            setFiles={setFiles}
            setStep={setStep}
            handleSelectClick={handleSelectClick}
          />
        );
      case 3:
        return (
          <ThirdStep
            user={user}
            text={text}
            setText={setText}
            setStep={setStep}
          />
        );
      case 4:
        return <FourthStep status={status} />;
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
        <p className="hidden text-lg xl:block">Create</p>
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
                <Dialog.Panel className="relative flex h-[400px] w-full max-w-[350px] transform flex-col overflow-hidden rounded-lg bg-white text-left shadow-xl  transition-all dark:bg-neutral-800  dark:text-gray-50 md:h-[450px] md:max-w-[450px] 2xl:h-[600px] 2xl:max-w-[600px]">
                  {currentStep}
                </Dialog.Panel>
              </Transition.Child>
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
