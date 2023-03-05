import { useState } from "react";
import { getCurrentTimeDifference } from "../lib/luxon";
import axios from "axios";
import { env } from "../env/server.mjs";
import { useSWRConfig } from "swr";
import { UsersListModal, Avatar } from "./";

type Props = {
  author: IUser;
  text: string;
  createdAt: string;
  likedBy?: string[];
  userId?: string;
  postId?: string;
  commentId?: string;
};

const Comment = ({
  author,
  text,
  createdAt,
  likedBy,
  userId,
  postId,
  commentId,
}: Props) => {
  const [likesCountOpen, setLikesCountOpen] = useState(false);
  const { mutate } = useSWRConfig();

  const updateLikesCount = () => {
    if (!likedBy || !userId || !postId || !commentId) return;

    const newLikesField = likedBy.includes(userId)
      ? likedBy.filter((id) => id !== userId)
      : [...likedBy, userId];

    axios
      .put(`${env.NEXT_PUBLIC_API_HOST}/comments/${commentId}/likes`, {
        likedBy: newLikesField,
      })
      .then(async () => {
        await mutate(`${env.NEXT_PUBLIC_API_HOST}/posts/${postId}/comments`);
        await mutate(`${env.NEXT_PUBLIC_API_HOST}/comments/${commentId}/likes`);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="flex h-max w-full items-start px-4 py-3 dark:text-white">
      <Avatar
        className="mr-4 inline-flex h-8 w-8 select-none items-center justify-center overflow-hidden rounded-full align-middle"
        user={author}
      />
      <div className="flex w-full flex-col gap-1 text-left text-sm">
        <p className="font-semibold">
          {author.username} <span className="font-normal">{text}</span>
        </p>
        <div className="relative font-semibold text-neutral-400">
          <span className="mr-3">{getCurrentTimeDifference(createdAt)}</span>
          {likedBy && Boolean(likedBy.length) && (
            <button onClick={() => setLikesCountOpen(true)}>
              Likes: {likedBy.length}
            </button>
          )}
          {commentId && likedBy && (
            <UsersListModal
              title="likes"
              open={likesCountOpen}
              setOpen={setLikesCountOpen}
              path={`/comments/${commentId}/likes`}
            />
          )}
        </div>
      </div>
      {likedBy && userId && (
        <button onClick={updateLikesCount}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`${
              userId && likedBy.includes(userId)
                ? "fill-red-500 stroke-red-500 text-red-500"
                : "hover:text-neutral-400"
            } mt-1 h-5 w-5`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Comment;
