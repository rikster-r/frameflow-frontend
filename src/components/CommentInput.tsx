import { useState, forwardRef, type Ref } from "react";
import {
  type Theme,
  EmojiStyle,
  type EmojiClickData,
} from "emoji-picker-react";
import { env } from "../env/server.mjs";
import axios from "axios";
import { useSWRConfig } from "swr";
import { toast } from "react-toastify";
import { parseCookies } from "nookies";
import { Popover, Transition } from "@headlessui/react";
import dynamic from "next/dynamic";

// https://github.com/ealush/emoji-picker-react#nextjs
const EmojiPicker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

type Props = {
  postId: string;
  comments?: IComment[];
};

const CommentInput = (
  { postId, comments }: Props,
  ref: Ref<HTMLTextAreaElement>
) => {
  const [commentText, setCommentText] = useState("");
  const { mutate } = useSWRConfig();

  const addEmoji = (emojiData: EmojiClickData) => {
    setCommentText((commentText) => commentText + emojiData.emoji);
  };

  const postComment = () => {
    if (!commentText.trim()) return;
    const { userToken } = parseCookies();
    if (!userToken || !comments) return;

    axios
      .post(
        `${env.NEXT_PUBLIC_API_HOST}/posts/${postId}/comments`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(async (res) => {
        setCommentText("");
        await mutate(`${env.NEXT_PUBLIC_API_HOST}/posts/${postId}/comments`, [
          res.data,
          ...comments,
        ]);
      })
      .catch(() => {
        toast.error("Something went wrong. Please try again");
      });
  };

  return (
    <div className="sticky bottom-0 flex items-center gap-3 border-t border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-black">
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
        ref={ref}
        name="commentText"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="h-7 flex-1 resize-none overflow-y-auto bg-[inherit] text-sm placeholder:text-neutral-400 focus:outline-none"
        placeholder="Add comment..."
        rows={9}
        maxLength={1000}
      />
      <button
        className="font-semibold text-blue-500 hover:text-blue-200"
        onClick={postComment}
      >
        Post
      </button>
    </div>
  );
};

export default forwardRef(CommentInput);
