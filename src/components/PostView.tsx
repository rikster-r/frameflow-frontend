import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { useState } from "react";
import * as Avatar from "@radix-ui/react-avatar";

type Props = {
  post: IPost;
  postOwner: IUser;
};

const PostView = ({ post, postOwner }: Props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <Dialog.Panel className="flex h-[70vh] w-[calc(100vw-4rem)] flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-neutral-800 sm:w-[65vw] md:h-[calc(100vh-4rem)] lg:flex-row">
      <div className="relative order-1 flex w-full flex-1 items-center justify-center lg:order-none">
        <Image
          src={post.images.at(currentImageIndex) as string}
          alt=""
          width={400}
          height={400}
          className="absolute h-full w-full bg-black object-contain"
        />
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
        {currentImageIndex < post.images.length - 1 && (
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
      <div className="flex w-[500px] flex-col">
        <div className="flex h-max w-full items-center border-b border-neutral-200 p-4 dark:border-neutral-700">
          <Avatar.Root className="mr-4 inline-flex h-8 w-8 select-none items-center justify-center overflow-hidden rounded-full align-middle">
            <Avatar.Image
              className="h-full w-full rounded-[inherit] object-cover object-center"
              src={postOwner?.avatar as string}
              alt={postOwner.publicName}
            />
            <Avatar.Fallback
              className="flex h-full w-full items-center justify-center rounded-[inherit] object-cover object-center"
              delayMs={600}
            >
              <Image
                src="/defaultAvatar.png"
                width={100}
                height={100}
                alt={postOwner.publicName}
              />
            </Avatar.Fallback>
          </Avatar.Root>
          <p className="font-semibold dark:text-white">
            {postOwner.username}{" "}
          </p>
          <p className="font-sembibold mx-2 dark:text-white">&bull;</p>
          <button className="font-semibold text-blue-500">Follow</button>
        </div>
      </div>
    </Dialog.Panel>
  );
};

export default PostView;
