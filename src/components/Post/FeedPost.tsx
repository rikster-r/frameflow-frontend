import {
  Avatar,
  ControlsModal,
  PostModal,
  PostView,
  UsersListModal,
  CommentInput,
  PostImagesCarousel,
} from "..";
import Link from "next/link";
import useUser from "../../hooks/useUser";
import { useState } from "react";
import { toast } from "react-toastify";
import { env } from "../../env/server.mjs";
import axios from "axios";
import { getCurrentTimeDifference } from "../../lib/luxon";
import useSWR, { type KeyedMutator } from "swr";
import useWindowWidth from "../../hooks/useWindowWidth";
import { useRouter } from "next/router";
import {
  updateUserFollowList,
  updateUserSavedList,
  updatePostLikesCount,
} from "../../lib/controllers";

type Props = {
  postId: string;
  mutatePosts: KeyedMutator<IPost[][]>;
};

const getPost = (url: string) =>
  axios.get(url).then((res) => res?.data as IPost);

const getComments = (url: string) =>
  axios.get(url).then((res) => res?.data as IComment[]);

const FeedPost = ({ postId, mutatePosts }: Props) => {
  const { user } = useUser();
  const { data: post } = useSWR<IPost>(
    `${env.NEXT_PUBLIC_API_HOST}/posts/${postId}`,
    getPost
  );
  const { data: comments } = useSWR<IComment[]>(
    post ? `${env.NEXT_PUBLIC_API_HOST}/posts/${post._id}/comments` : null,
    getComments
  );
  const [controlsOpen, setControlsOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [likesCountOpen, setLikesCountOpen] = useState(false);
  const windowWidth = useWindowWidth();
  const router = useRouter();

  if (!user || !post) return <></>;
  const postOwner = post.author as IUser;

  const copyToClipboard = () => {
    navigator.clipboard
      // window location already ends with "/"
      .writeText(`${window.location.toString()}posts/${post._id}`)
      .then(() => {
        toast.success("Successfully copied url");
      })
      .catch(() => {
        toast.error("Couldn't copy url");
      });
  };

  const handlePostOpen = () => {
    if (windowWidth > 768) {
      setPostOpen(true);
    } else {
      void router.push(`/posts/${post._id}`);
    }
  };

  return (
    <>
      <div>
        <div className="flex w-full items-end py-4">
          <Avatar
            className="mr-4 ml-2 inline-flex h-9 w-9 select-none items-center justify-center overflow-hidden rounded-full align-middle"
            user={postOwner}
          />
          <div className="flex flex-col">
            <div className="flex items-center">
              <Link
                href={`/${postOwner.username}`}
                className="font-semibold hover:text-neutral-400 dark:text-white dark:hover:text-neutral-700"
              >
                {postOwner.username}
              </Link>
              <div className="ml-2 text-neutral-400">
                &bull;
                <span className="ml-2">
                  {getCurrentTimeDifference(post.createdAt)}
                </span>
              </div>
              {!user.follows.includes(postOwner._id) && (
                <div className="ml-2 text-neutral-400">
                  &bull;
                  <button
                    className="ml-2 font-semibold text-blue-500 hover:text-blue-200 dark:text-blue-400"
                    onClick={() => updateUserFollowList(postOwner, user)}
                  >
                    Follow
                  </button>
                </div>
              )}
            </div>
            {post.location && (
              <p className="text-left text-xs text-neutral-700">
                {post.location}
              </p>
            )}
          </div>
          <button
            onClick={() => setControlsOpen(true)}
            className="ml-auto mr-2 self-center"
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
          <ControlsModal open={controlsOpen} setOpen={setControlsOpen}>
            {user.follows.includes(postOwner._id) && (
              <button
                className="w-full py-4 font-semibold text-red-500"
                onClick={() => updateUserFollowList(postOwner, user)}
              >
                Unfollow
              </button>
            )}
            <Link href={`/posts/${post._id}`} className="block w-full py-4">
              Go to post
            </Link>
            <button className="w-full py-4" onClick={copyToClipboard}>
              Copy url
            </button>
          </ControlsModal>
        </div>
        <PostImagesCarousel
          images={post.images}
          doubleClickHandler={(setLikeVisible) =>
            updatePostLikesCount(post, user, mutatePosts, true, setLikeVisible)
          }
          width={400}
          height={400}
          sizeClasses="h-auto w-full"
        />
        <div className="flex gap-4 py-4 px-2">
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
          <button onClick={handlePostOpen}>
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
        <div className="px-3 pb-1 text-sm sm:px-2 sm:text-base">
          <button
            className={`${
              post.likedBy.length ? "" : "hover:cursor-default"
            } font-semibold`}
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
        {post.text && (
          <div className="px-3 pb-1 text-sm sm:px-2 sm:text-base">
            <span className="mr-2 font-semibold">{postOwner.username}</span>
            <span>{showFullText ? post.text : post.text.slice(0, 125)}</span>
            {!showFullText && post.text.length > 125 && (
              <span
                className="text-neutral-500 hover:cursor-pointer dark:text-neutral-300"
                onClick={() => setShowFullText(true)}
              >
                ... More
              </span>
            )}
          </div>
        )}
        {comments && comments.length > 0 && (
          <button
            className="px-3 text-sm text-neutral-500 dark:text-neutral-300 sm:px-2 sm:text-base"
            onClick={handlePostOpen}
          >
            See all comments ({comments.length})
          </button>
        )}
        <CommentInput postId={postId} />
      </div>

      <PostModal post={post} open={postOpen} setOpen={setPostOpen}>
        <PostView
          mutatePosts={mutatePosts}
          postId={post._id}
          postOwner={postOwner}
          comments={comments}
        />
      </PostModal>
    </>
  );
};

export default FeedPost;
