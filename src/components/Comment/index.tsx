import { useState, type RefObject } from "react";
import { getCurrentTimeDifference } from "../../lib/luxon";
import axios from "axios";
import { env } from "../../env/server.mjs";
import { useSWRConfig } from "swr";
import { UsersListModal, Avatar, ControlsModal } from "..";
import { toast } from "react-toastify";
import Link from "next/link";

type Props = {
  author: IUser;
  text: string;
  createdAt: string;
  likedBy?: IUser[];
  userId?: string;
  postId?: string;
  commentId?: string;
  commentInputRef?: RefObject<HTMLTextAreaElement>;
};

const Comment = ({
  author,
  text,
  createdAt,
  likedBy,
  userId,
  postId,
  commentId,
  commentInputRef,
}: Props) => {
  const [controlsOpen, setControlsOpen] = useState(false);
  const [likesCountOpen, setLikesCountOpen] = useState(false);
  const { mutate } = useSWRConfig();

  const updatePostLikesCount = () => {
    if (!likedBy || !userId || !postId || !commentId) return;

    const newLikesField = likedBy.some((liker) => liker._id === userId)
      ? likedBy.filter((liker) => liker._id !== userId)
      : [...likedBy, userId];

    axios
      .put(`${env.NEXT_PUBLIC_API_HOST}/comments/${commentId}/likes`, {
        likedBy: newLikesField,
      })
      .then(async () => {
        await Promise.all([
          mutate(`${env.NEXT_PUBLIC_API_HOST}/posts/${postId}/comments`),
          mutate(`${env.NEXT_PUBLIC_API_HOST}/comments/${commentId}/likes`),
        ]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteComment = () => {
    if (!postId || !userId || !commentId) return;

    axios
      .delete(`${env.NEXT_PUBLIC_API_HOST}/comments/${commentId}`)
      .then(async () => {
        await mutate(`${env.NEXT_PUBLIC_API_HOST}/posts/${postId}/comments`);
      })
      .catch(() => {
        toast.error("Error occured while deleting comment");
      });
  };

  const addAuthorNameToInput = () => {
    if (
      commentInputRef === undefined ||
      commentInputRef.current === null ||
      commentInputRef.current.value.length > 0
    ) {
      return;
    }

    commentInputRef.current.value = `@${author.username}`;
  };

  return (
    <div
      className="group flex h-max w-full items-start px-4 py-3 dark:text-white"
      onDoubleClick={updatePostLikesCount}
    >
      <Avatar
        className="mr-4 inline-flex h-8 w-8 select-none items-center justify-center overflow-hidden rounded-full align-middle"
        user={author}
      />
      <div className="flex flex-1 flex-col gap-1 text-left text-sm">
        <p className="font-semibold">
          <Link
            href={`/${author.username}`}
            className="mr-2 hover:text-gray-400"
          >
            {author.username}
          </Link>
          <span className="font-normal">{text}</span>
        </p>
        <div className="relative flex items-center gap-3 font-semibold text-neutral-500 dark:text-neutral-400">
          <span className="font-normal">
            {getCurrentTimeDifference(createdAt)}
          </span>
          {likedBy && Boolean(likedBy.length) && (
            <button onClick={() => setLikesCountOpen(true)}>
              Likes: {likedBy.length}
            </button>
          )}
          {commentId && likedBy && (
            <UsersListModal
              title="Likes"
              open={likesCountOpen}
              setOpen={setLikesCountOpen}
              users={likedBy}
            />
          )}
          {userId && commentInputRef && userId !== author._id && (
            <button onClick={addAuthorNameToInput}>Reply</button>
          )}
          {commentId && userId === author._id && (
            <button
              className="invisible group-hover:visible group-focus:visible"
              onClick={() => setControlsOpen(true)}
            >
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
                  d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            </button>
          )}
          <ControlsModal open={controlsOpen} setOpen={setControlsOpen}>
            <button
              className="w-full py-4 font-semibold text-red-500"
              onClick={deleteComment}
            >
              Delete
            </button>
          </ControlsModal>
        </div>
      </div>
      {likedBy && userId && (
        <button onClick={updatePostLikesCount}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`${
              userId && likedBy.some((liker) => liker._id === userId)
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
