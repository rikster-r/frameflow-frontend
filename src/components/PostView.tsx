import Image from "next/image";
import { useState, useRef } from "react";
import { env } from "../env/server.mjs";
import {
  Comment,
  UsersListModal,
  Avatar,
  ControlsModal,
  CommentInput,
} from ".";
import { formatTimestamp } from "../lib/luxon";
import { Dialog } from "@headlessui/react";
import { parseCookies } from "nookies";
import axios from "axios";
import { useSWRConfig } from "swr";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  user?: IUser;
  post: IPost;
  postOwner: IUser;
  comments?: IComment[];
  path: "saved" | "posts";
};

const PostView = ({ user, post, postOwner, comments, path }: Props) => {
  const [likeVisible, setLikeVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [likesCountOpen, setLikesCountOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const commentTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate } = useSWRConfig();

  const updateLikesCount = (withAnimation?: boolean) => {
    if (!user) return;

    const newLikesField = post.likedBy.includes(user._id)
      ? post.likedBy.filter((id) => id !== user._id)
      : [...post.likedBy, user._id];

    axios
      .put(`${env.NEXT_PUBLIC_API_HOST}/posts/${post._id}/likes`, {
        likedBy: newLikesField,
      })
      .then(async () => {
        if (withAnimation && newLikesField.length > post.likedBy.length) {
          setLikeVisible(true);

          setTimeout(() => setLikeVisible(false), 1000);
        }

        await Promise.all([
          mutate(
            `${env.NEXT_PUBLIC_API_HOST}/users/${postOwner.username}/${path}`
          ),
          mutate(`${env.NEXT_PUBLIC_API_HOST}/posts/${post._id}/likes`),
        ]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const updateUserSavedList = () => {
    const { userToken } = parseCookies();
    if (!user || !userToken) return;

    const newSavedList = user.savedPosts.includes(post._id)
      ? user.savedPosts.filter((id) => id !== post._id)
      : [...user.savedPosts, post._id];

    axios
      .put(
        `${env.NEXT_PUBLIC_API_HOST}/users/${user._id}/saved`,
        {
          savedPosts: newSavedList,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(async () => {
        await mutate(`${env.NEXT_PUBLIC_API_HOST}/users/profile`);
        await mutate(
          `${env.NEXT_PUBLIC_API_HOST}/users/${postOwner.username}/saved`
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const updateUserFollowList = () => {
    const { userToken } = parseCookies();
    if (!user || !userToken) return;

    const newFollowList = user.follows.includes(postOwner._id)
      ? user.follows.filter((id) => id !== postOwner._id)
      : [...user.follows, postOwner._id];

    axios
      .put(`${env.NEXT_PUBLIC_API_HOST}/users/${user._id}/follows`, {
        follows: newFollowList,
      })
      .then(async () => {
        await mutate(`${env.NEXT_PUBLIC_API_HOST}/users/profile`);
        await mutate(
          `${env.NEXT_PUBLIC_API_HOST}/users/${postOwner.username}/followers`
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

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
    <Dialog.Panel className="scrollbar-hide grid h-[80vh] w-[calc(100vw-4rem)] grid-cols-1  grid-rows-[4rem_400px_auto] overflow-y-scroll rounded-lg bg-white shadow-xl dark:bg-black dark:text-white sm:w-[65vw] md:h-[calc(100vh-4rem)] md:grid-cols-2 md:grid-rows-[4rem_1fr_auto_auto] md:overflow-hidden">
      <div
        className="relative flex flex-1 items-center justify-center md:row-span-full"
        onDoubleClick={() => updateLikesCount(true)}
      >
        <Image
          src={post.images.at(currentImageIndex) as string}
          alt=""
          width={400}
          height={400}
          className="absolute h-full w-full bg-black object-contain"
        />
        <AnimatePresence mode="wait">
          {likeVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
              className="fixed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-16 w-16 fill-white"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
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
      <div className="-order-1 flex h-max w-full items-center border-b border-neutral-200 p-4 dark:border-neutral-700">
        <Avatar
          className="mr-4 inline-flex h-8 w-8 select-none items-center justify-center overflow-hidden rounded-full align-middle"
          user={postOwner}
        />
        <p className="font-semibold dark:text-white">{postOwner.username} </p>
        {user && user.username !== postOwner.username && (
          <>
            {user.follows.includes(postOwner._id) ? (
              <>
                <p className="font-sembibold mx-2 dark:text-white">&bull;</p>
                <button
                  className="font-semibold dark:text-white"
                  onClick={updateUserFollowList}
                >
                  Unfollow
                </button>
              </>
            ) : (
              <>
                <p className="font-sembibold mx-2 dark:text-white">&bull;</p>
                <button
                  className="font-semibold text-blue-500"
                  onClick={updateUserFollowList}
                >
                  Follow
                </button>
              </>
            )}
          </>
        )}
        {user && user.username === postOwner.username && (
          <button className="ml-auto" onClick={() => setSettingsOpen(true)}>
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
        <ControlsModal open={settingsOpen} setOpen={setSettingsOpen}>
          <button
            className="w-full py-4 font-semibold text-red-500"
            onClick={deletePost}
          >
            Delete
          </button>
        </ControlsModal>
      </div>
      <div className="scrollbar-hide flex-1 md:overflow-y-scroll">
        {post.text || comments?.length ? (
          <>
            {post.text && (
              <Comment
                author={postOwner}
                text={post.text}
                createdAt={post.createdAt}
              />
            )}
            {comments &&
              comments.map((comment) => (
                <Comment
                  key={comment._id}
                  userId={user?._id}
                  postId={post._id}
                  commentId={comment._id}
                  author={comment.author}
                  text={comment.text}
                  likedBy={comment.likedBy}
                  createdAt={comment.createdAt}
                  commentInputRef={commentTextAreaRef}
                />
              ))}
          </>
        ) : (
          <div className="hidden h-full flex-col items-center justify-center gap-2 md:flex">
            <p className="text-2xl font-bold">No comments.</p>
            <p>Start discourse</p>
          </div>
        )}
      </div>
      <div className="sticky bottom-0 border-t border-neutral-200 bg-white p-4 text-left dark:border-neutral-700 dark:bg-black md:block">
        <div className="relative flex gap-4">
          <button onClick={() => updateLikesCount()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`${
                user && post.likedBy.includes(user._id)
                  ? "fill-red-500 stroke-red-500 text-red-500"
                  : "hover:text-neutral-400"
              } h-7 w-7`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
          <button
            onClick={() => {
              commentTextAreaRef.current?.focus();
            }}
          >
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
          <button className="ml-auto" onClick={updateUserSavedList}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`${
                user && user.savedPosts.includes(post._id)
                  ? "fill-black stroke-black dark:fill-white dark:stroke-white"
                  : "hover:text-neutral-400"
              } h-7 w-7`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              />
            </svg>
          </button>
        </div>
        <div className="relative">
          <button
            className={`${
              post.likedBy.length ? "" : "hover:cursor-default"
            } mt-3 pl-1 font-semibold`}
            onClick={() => setLikesCountOpen(true)}
          >
            {post.likedBy.length} like{post.likedBy.length !== 1 && "s"}
          </button>
          {Boolean(post.likedBy.length) && (
            <UsersListModal
              title="Likes"
              open={likesCountOpen}
              setOpen={setLikesCountOpen}
              path={`/posts/${post._id}/likes`}
            />
          )}
        </div>
        <p className="capt mt-1 pl-1 text-sm text-neutral-400">
          {formatTimestamp(post.createdAt)}
        </p>
      </div>
      {user && (
        <CommentInput
          postId={post._id}
          comments={comments}
          ref={commentTextAreaRef}
        />
      )}
    </Dialog.Panel>
  );
};

export default PostView;
