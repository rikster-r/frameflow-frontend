import Image from "next/image";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment, useState } from "react";
import { PostView } from "..";
import axios from "axios";
import { env } from "../../env/server.mjs";
import useSWR from "swr";
import useWindowWidth from "../../hooks/useWindowWidth";
import { useRouter } from "next/router";
import { SWRConfig } from "swr";

type Props = {
  post: IPost;
  postOwner: IUser;
};

const getComments = (url: string) =>
  axios.get(url).then((res) => res?.data as IComment[]);

const PostImage = ({ post, postOwner }: Props) => {
  const { data: comments } = useSWR<IComment[]>(
    `${env.NEXT_PUBLIC_API_HOST}/posts/${post._id}/comments`,
    getComments
  );
  const [open, setOpen] = useState(false);
  const formatter = Intl.NumberFormat("en-US", { notation: "compact" });
  const windowWidth = useWindowWidth();
  const router = useRouter();

  const handleImageClick = () => {
    if (windowWidth > 768) {
      setOpen(true);
    } else {
      void router.push(`/posts/${post._id}`);
    }
  };

  return (
    <>
      <button
        className="group relative block filter hover:bg-gray-700"
        onClick={handleImageClick}
      >
        <Image
          src={post.images.at(0) as string}
          alt=""
          className="aspect-square w-full object-cover group-hover:brightness-75"
          width={200}
          height={200}
        />
        <div className="absolute inset-0 hidden items-center justify-center gap-5 text-lg font-semibold text-white group-hover:inline-flex sm:gap-8">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 sm:h-6 sm:w-6"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <p>{formatter.format(post.likedBy.length)}</p>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 sm:h-6 sm:w-6"
            >
              <path
                fillRule="evenodd"
                d="M5.337 21.718a6.707 6.707 0 01-.533-.074.75.75 0 01-.44-1.223 3.73 3.73 0 00.814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 01-4.246.997z"
                clipRule="evenodd"
              />
            </svg>
            {comments && <p>{comments.length}</p>}
          </div>
        </div>
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpen(false)}
        >
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
                  <PostView
                    postId={post._id}
                    postOwner={postOwner}
                    comments={comments}
                  />
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
    </>
  );
};

export default PostImage;
