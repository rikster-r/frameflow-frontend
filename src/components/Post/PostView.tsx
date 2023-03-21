import { Dialog } from "@headlessui/react";
import { useRouter } from "next/router";
import {
  Comment,
  UsersListModal,
  Avatar,
  ControlsModal,
  CommentInput,
  ConditionalWrapper,
  PostImagesCarousel,
} from "..";
import { formatTimestamp } from "../../lib/luxon";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import useUser from "../../hooks/useUser";
import { useState, useRef } from "react";
import { env } from "../../env/server.mjs";
import useSWR, { type KeyedMutator } from "swr";
import {
  updateUserFollowList,
  updateUserSavedList,
  updatePostLikesCount,
} from "../../lib/controllers";

type Props = {
  mutatePosts?: KeyedMutator<IPost[][]>;
  postId: string;
  postOwner: IUser;
  comments?: IComment[];
};

const fetcher = (url: string) =>
  axios.get(url).then((res) => res?.data as IPost);

const PostView = ({ postId, postOwner, comments, mutatePosts }: Props) => {
  const { data: post } = useSWR<IPost>(
    `${env.NEXT_PUBLIC_API_HOST}/posts/${postId}`,
    fetcher
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [likesCountOpen, setLikesCountOpen] = useState(false);
  const commentTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const { user } = useUser();

  if (!post) return <></>;

  const deletePost = () => {
    if (!user) return;

    axios
      .delete(`${env.NEXT_PUBLIC_API_HOST}/posts/${post._id}`)
      .then(async () => {
        await router.push(`/${user.username}`);
      })
      .catch(() => {
        toast.error("Error occured while deleting post");
      });
  };

  const children = (
    <>
      <PostImagesCarousel
        images={post.images}
        doubleClickHandler={(setLikeVisible) =>
          updatePostLikesCount(post, user, mutatePosts, true, setLikeVisible)
        }
        width={400}
        height={400}
        sizeClasses="h-full w-full"
      />
      <div className="-order-1 flex h-max w-full items-center border-b border-neutral-200 p-4 dark:border-neutral-700">
        <Avatar
          className="mr-4 inline-flex h-8 w-8 select-none items-center justify-center overflow-hidden rounded-full align-middle"
          user={postOwner}
        />
        <Link
          href={`/${postOwner.username}`}
          className="font-semibold hover:text-neutral-400 dark:text-white dark:hover:text-neutral-700"
        >
          {postOwner.username}{" "}
        </Link>
        {user && user.username !== postOwner.username && (
          <>
            {user.follows.includes(postOwner._id) ? (
              <>
                <p className="font-sembibold mx-2 dark:text-white">&bull;</p>
                <button
                  className="font-semibold dark:text-white"
                  onClick={() => updateUserFollowList(postOwner, user)}
                >
                  Unfollow
                </button>
              </>
            ) : (
              <>
                <p className="font-sembibold mx-2 dark:text-white">&bull;</p>
                <button
                  className="font-semibold text-blue-500"
                  onClick={() => updateUserFollowList(postOwner, user)}
                >
                  Follow
                </button>
              </>
            )}
          </>
        )}
        {!router.pathname.includes("/posts") && (
          <button
            className="ml-auto mr-3 sm:mr-0"
            onClick={() => setSettingsOpen(true)}
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
        <ControlsModal open={settingsOpen} setOpen={setSettingsOpen}>
          {user && user.username === postOwner.username && (
            <button
              className="w-full py-4 font-semibold text-red-500"
              onClick={deletePost}
            >
              Delete
            </button>
          )}
          {!router.pathname.includes("/posts") && (
            <Link href={`/posts/${post._id}`} className="block w-full py-4">
              Go to post
            </Link>
          )}
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
                  author={comment.author as IUser}
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
      <div className="sticky bottom-0 border-y border-neutral-200 bg-white p-4 text-left dark:border-neutral-700 dark:bg-black md:block">
        <div className="flex gap-4">
          <button
            onClick={() => updatePostLikesCount(post, user, mutatePosts, false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`${
                user && post.likedBy.some((liker) => liker._id === user._id)
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
          <button
            className="ml-auto"
            onClick={() => updateUserSavedList(post, user)}
          >
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
            onClick={() => {
              if (post.likedBy.length) setLikesCountOpen(true);
            }}
          >
            {post.likedBy.length} like{post.likedBy.length !== 1 && "s"}
          </button>
          {Boolean(post.likedBy.length) && (
            <UsersListModal
              title="Likes"
              open={likesCountOpen}
              setOpen={setLikesCountOpen}
              users={post.likedBy}
            />
          )}
        </div>
        <p className="capt mt-1 pl-1 text-sm text-neutral-400">
          {formatTimestamp(post.createdAt)}
        </p>
      </div>
      {user && <CommentInput postId={post._id} ref={commentTextAreaRef} />}
    </>
  );

  return (
    <ConditionalWrapper
      condition={router.pathname.includes("/posts")}
      wrap1={(children) => (
        <div
          className={`scrollbar-hide grid h-[100dvh] w-[100vw] grid-cols-1 grid-rows-[4rem_auto_1fr] overflow-y-scroll bg-white shadow-xl dark:bg-black dark:text-white sm:static sm:w-auto sm:min-w-[60vw] sm:max-w-[65vw] md:h-[calc(100vh-70px)] md:grid-cols-2 md:grid-rows-[4rem_1fr_auto_auto] md:overflow-hidden md:rounded-r-lg`}
        >
          {children}
        </div>
      )}
      wrap2={(children) => (
        <Dialog.Panel
          className={`scrollbar-hide grid w-full min-w-[60vw] max-w-[65vw] grid-cols-1 grid-rows-[4rem_480px] overflow-hidden overflow-y-scroll rounded-r-lg bg-white shadow-xl dark:bg-black dark:text-white md:h-[calc(100vh-70px)] md:grid-cols-2 md:grid-rows-[4rem_1fr_auto_auto]`}
        >
          {children}
        </Dialog.Panel>
      )}
    >
      {children}
    </ConditionalWrapper>
  );
};

export default PostView;
