import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { useState } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { env } from "../env/server.mjs";
import {
  type Theme,
  EmojiStyle,
  type EmojiClickData,
} from "emoji-picker-react";
import { Comment } from "./";
import { formatTimestamp } from "../lib/luxon";
import { Popover, Transition } from "@headlessui/react";
import dynamic from "next/dynamic";
import { parseCookies } from "nookies";
import axios from "axios";
import { toast } from "react-toastify";

// https://github.com/ealush/emoji-picker-react#nextjs
const EmojiPicker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

type Props = {
  user: IUser;
  post: IPost;
  postOwner: IUser;
};

const PostView = ({ user, post, postOwner }: Props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [commentText, setCommentText] = useState("");

  const addEmoji = (emojiData: EmojiClickData) => {
    setCommentText((commentText) => commentText + emojiData.emoji);
  };

  const postComment = () => {
    if (!commentText.trim()) return;
    const { userToken } = parseCookies();
    if (!userToken) return;

    axios
      .post(
        `${env.NEXT_PUBLIC_API_HOST}/posts/${post._id}/comments`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(() => {
        // todo
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong. Please try again");
      });
  };

  return (
    <Dialog.Panel className="flex h-[70vh] w-[calc(100vw-4rem)] flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-black dark:text-white sm:w-[65vw]  md:h-[calc(100vh-4rem)] lg:flex-row">
      <div className="relative order-1 flex w-full min-w-max flex-1 items-center justify-center lg:order-none">
        <Image
          src={post.images.at(currentImageIndex) as string}
          alt=""
          width={400}
          height={400}
          className="absolute h-full w-full  bg-black object-contain"
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
          <p className="font-semibold dark:text-white">{postOwner.username} </p>
          {user.username !== postOwner.username && (
            <>
              <p className="font-sembibold mx-2 dark:text-white">&bull;</p>
              <button className="font-semibold text-blue-500">Follow</button>
            </>
          )}
        </div>
        <div className="flex-1">
          <Comment
            author={postOwner}
            text={post.text}
            timestamp={post.timestamp}
          />
        </div>
        <div className="border-y border-neutral-200 p-4 text-left dark:border-neutral-700">
          <div className="flex gap-4">
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-7 w-7 hover:text-neutral-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-7 w-7 hover:text-neutral-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                />
              </svg>
            </button>
            <button className="ml-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-7 w-7 hover:text-neutral-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
            </button>
          </div>
          <p className="mt-3 pl-1 font-semibold">{post.likedBy.length} likes</p>
          <p className="capt mt-1 pl-1 text-sm text-neutral-400">
            {formatTimestamp(post.timestamp)}
          </p>
        </div>
        <div className="flex items-center gap-3 p-4">
          <Popover className="relative h-full">
            <Popover.Button className="h-full text-sm text-neutral-900 hover:cursor-pointer dark:text-neutral-100 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                />
              </svg>
            </Popover.Button>

            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel className="absolute -left-2 bottom-10 origin-bottom-left rounded-md p-3 dark:bg-neutral-900">
                <EmojiPicker
                  theme={localStorage.getItem("theme") as Theme}
                  height={300}
                  // most performant
                  emojiStyle={EmojiStyle.NATIVE}
                  onEmojiClick={addEmoji}
                  skinTonesDisabled
                  searchDisabled
                  previewConfig={{ showPreview: false }}
                />
              </Popover.Panel>
            </Transition>
          </Popover>
          <textarea
            name="commentText"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="h-6 flex-1 resize-none bg-[inherit] placeholder:text-neutral-400 focus:outline-none"
            placeholder="Add comment..."
          />
          <button
            className="font-semibold text-blue-500 hover:text-blue-200"
            onClick={postComment}
          >
            Post
          </button>
        </div>
      </div>
    </Dialog.Panel>
  );
};

export default PostView;
