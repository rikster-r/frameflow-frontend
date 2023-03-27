import { parseCookies } from "nookies";
import { env } from "../env/server.mjs";
import axios from "axios";
import { mutate, type KeyedMutator } from "swr";
import type { Dispatch, SetStateAction } from "react";

export const updateUserFollowList = async (
  userToFollow: IUser,
  currentUser?: IUser
) => {
  const { userToken } = parseCookies();
  if (!currentUser || !userToken) return;

  const newFollowList = currentUser.follows.includes(userToFollow._id)
    ? currentUser.follows.filter((userId) => userId !== userToFollow._id)
    : [...currentUser.follows, userToFollow._id];

  try {
    await Promise.all([
      mutate(
        `${env.NEXT_PUBLIC_API_HOST}/users/profile`,
        {
          ...currentUser,
          follows: newFollowList,
        },
        { revalidate: false }
      ),
      axios.put(
        `${env.NEXT_PUBLIC_API_HOST}/users/${currentUser._id}/follows`,
        {
          follows: newFollowList,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      ),
    ]);
  } catch (err) {
    console.error(err);
  } finally {
    await Promise.all([
      mutate(
        `${env.NEXT_PUBLIC_API_HOST}/users/${userToFollow.username}/followers`
      ),
      mutate(`${env.NEXT_PUBLIC_API_HOST}/users/profile`),
    ]);
  }
};

export const updateUserSavedList = async (
  postToSave: IPost,
  currentUser?: IUser
) => {
  const { userToken } = parseCookies();
  if (!currentUser || !userToken) return;

  const newSavedList = currentUser.savedPosts.includes(postToSave._id)
    ? currentUser.savedPosts.filter((id) => id !== postToSave._id)
    : [...currentUser.savedPosts, postToSave._id];

  try {
    await Promise.all([
      mutate(
        `${env.NEXT_PUBLIC_API_HOST}/users/profile`,
        {
          ...currentUser,
          savedPosts: newSavedList,
        },
        { revalidate: false }
      ),
      axios.put(
        `${env.NEXT_PUBLIC_API_HOST}/users/${currentUser._id}/saved`,
        {
          savedPosts: newSavedList,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      ),
    ]);
  } catch (err) {
    console.error(err);
  } finally {
    await mutate(`${env.NEXT_PUBLIC_API_HOST}/users/profile`);
  }
};

/*
 * @param withAnimation - if animation of like popping over image should play
 * @param likeVisible - state setter of like icon visibility over image when like is triggered by double click
 * @param mutatePosts - swr mutator for posts, is an argument because posts could be retrieved from any path
 */
export const updatePostLikesCount = async (
  post: IPost,
  currentUser?: IUser,
  mutatePosts?: KeyedMutator<IPost[][]>,
  withAnimation?: boolean,
  setLikeVisible?: Dispatch<SetStateAction<boolean>>
) => {
  const { userToken } = parseCookies();
  if (!currentUser || !userToken) return;

  const newLikesField = post.likedBy.some(
    (liker) => liker._id === currentUser._id
  )
    ? post.likedBy.filter((liker) => liker._id !== currentUser._id)
    : [...post.likedBy, currentUser];

  if (withAnimation && setLikeVisible) {
    setLikeVisible(true);
    setTimeout(() => setLikeVisible(false), 1000);
  }

  if (
    !withAnimation ||
    (withAnimation && newLikesField.length > post.likedBy.length)
  ) {
    try {
      await Promise.all([
        mutate(
          `${env.NEXT_PUBLIC_API_HOST}/posts/${post._id}`,
          {
            ...post,
            likedBy: newLikesField,
          },
          { revalidate: false }
        ),
        axios.put(
          `${env.NEXT_PUBLIC_API_HOST}/posts/${post._id}/likes`,
          {
            likedBy: newLikesField,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        ),
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      await Promise.all([
        mutate(`${env.NEXT_PUBLIC_API_HOST}/posts/${post._id}`),
        mutatePosts && mutatePosts(),
      ]);
    }
  }
};
