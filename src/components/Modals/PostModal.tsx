import { Transition, Dialog } from "@headlessui/react";
import {
  Fragment,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import { SWRConfig } from "swr";
import { env } from "../../env/server.mjs";

type Props = {
  post: IPost;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  // composition with PostView
  children: ReactNode | ReactNode[];
};

const PostModal = ({ post, open, setOpen, children }: Props) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-in duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-70"
          leave="ease-out duration-100"
          leaveFrom="opacity-70"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-90 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              enter="linear duration-150"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-110"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="linear duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-110"
            >
              <SWRConfig
                value={{
                  fallback: {
                    [`${env.NEXT_PUBLIC_API_HOST}/posts/${post._id}`]: post,
                  },
                }}
              >
                {children}
              </SWRConfig>
            </Transition.Child>
            <div className="fixed right-3 top-5 text-white sm:right-10">
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
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PostModal;
