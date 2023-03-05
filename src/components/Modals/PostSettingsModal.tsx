import { Fragment, type SetStateAction, type Dispatch } from "react";
import { Transition, Dialog } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { env } from "../../env/server.mjs";
import { useSWRConfig } from "swr";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  post: IPost;
  postOwner: IUser;
  path: string;
};

const PostSettingsModal = ({ open, setOpen, post, postOwner, path }: Props) => {
  const router = useRouter();
  const showPostLink = router.pathname.includes("/posts");
  const { mutate } = useSWRConfig();

  const deletePost = () => {
    axios
      .delete(`${env.NEXT_PUBLIC_API_HOST}/posts/${post._id}`)
      .then(async () => {
        await mutate(
          `${env.NEXT_PUBLIC_API_HOST}/users/${postOwner.username}/${path}`
        );
      })
      .catch(() => {
        toast.error("Error occured while deleting post");
      });
  };

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
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              enter="linear duration-150"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-110"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="linear duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-110"
            >
              <Dialog.Panel className="w-[300px] divide-y divide-neutral-300 rounded-lg bg-white text-center shadow-xl dark:divide-neutral-700 dark:bg-neutral-800 dark:text-white sm:w-[350px]">
                <button
                  className="w-full py-4 font-semibold text-red-500"
                  onClick={deletePost}
                >
                  Delete
                </button>
                {!showPostLink && (
                  <Link href={`/posts/${post._id}`} className="block py-4">
                    Go to post
                  </Link>
                )}
                <button className="w-full py-4" onClick={() => setOpen(false)}>
                  Cancel
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PostSettingsModal;
