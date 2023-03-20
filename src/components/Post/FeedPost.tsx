import {
  Avatar,
  ControlsModal,
  PostModal,
  PostView,
  UsersListModal,
  CommentInput,
} from "..";
import Link from "next/link";
import useUser from "../../hooks/useUser";
import { useState } from "react";
import { toast } from "react-toastify";
import { parseCookies } from "nookies";
import { env } from "../../env/server.mjs";
import axios from "axios";
import { getCurrentTimeDifference } from "../../lib/luxon";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useSWR, { type KeyedMutator } from "swr";
import useWindowWidth from "../../hooks/useWindowWidth";
import { useRouter } from "next/router";

type Props = {
  postId: string;
  mutatePosts: KeyedMutator<IPost[][]>;
};

const getPost = (url: string) =>
  axios.get(url).then((res) => res?.data as IPost);

const getComments = (url: string) =>
  axios.get(url).then((res) => res?.data as IComment[]);

const FeedPost = ({ postId, mutatePosts }: Props) => {
  const { user, mutate: mutateUser } = useUser();
  const { data: post, mutate: mutatePost } = useSWR<IPost>(
    `${env.NEXT_PUBLIC_API_HOST}/posts/${postId}`,
    getPost
  );
  const { data: comments } = useSWR<IComment[]>(
    post ? `${env.NEXT_PUBLIC_API_HOST}/posts/${post._id}/comments` : null,
    getComments
  );
  const [controlsOpen, setControlsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likeVisible, setLikeVisible] = useState(false);
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
        await mutateUser();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const updateLikesCount = (withAnimation?: boolean) => {
    if (!user) return;

    const newLikesField = post.likedBy.some((liker) => liker._id === user._id)
      ? post.likedBy.filter((liker) => liker._id !== user._id)
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

        await Promise.all([mutatePost(), mutatePosts()]);
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
        await Promise.all([mutateUser()]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div>
        <div className="flex w-full items-center py-4">
          <Avatar
            className="mr-4 ml-2 inline-flex h-8 w-8 select-none items-center justify-center overflow-hidden rounded-full align-middle"
            user={postOwner}
          />
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
                onClick={updateUserFollowList}
              >
                Follow
              </button>
            </div>
          )}
          <button
            onClick={() => setControlsOpen(true)}
            className="ml-auto mr-2"
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
                onClick={updateUserFollowList}
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
        <div className="relative flex items-center justify-center">
          <Image
            src={post.images.at(currentImageIndex) as string}
            alt=""
            width={465}
            height={400}
            className="h-auto w-full bg-black object-contain hover:cursor-pointer"
            onDoubleClick={() => updateLikesCount(true)}
            priority
          />
          <AnimatePresence mode="wait">
            {likeVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1.5 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                className="absolute"
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
        <div className="flex gap-4 py-4 px-2">
          <button onClick={() => updateLikesCount()}>
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
