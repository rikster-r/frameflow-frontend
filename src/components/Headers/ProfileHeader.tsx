import Link from "next/link";
import { useRouter } from "next/router";
import usePosts from "../../hooks/usePosts";
import useUser from "../../hooks/useUser";
import useFollowers from "../../hooks/useFollowers";
import { Avatar, UsersListModal } from "..";
import axios from "axios";
import { env } from "../../env/server.mjs";
import { useState } from "react";

type Props = {
  pageOwner: IUser;
};

const ProfileHeader = ({ pageOwner }: Props) => {
  const formatter = Intl.NumberFormat("en-US", { notation: "compact" });
  const router = useRouter();
  const { posts, error: postsError } = usePosts(pageOwner.username, "posts");
  const {
    followers,
    error: followersError,
    mutate: mutateFollowers,
  } = useFollowers(pageOwner.username);
  const { user, mutate: mutateUser } = useUser();
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  const updateUserFollowList = () => {
    if (!user) return;

    const newFollowList = user.follows.includes(pageOwner._id)
      ? user.follows.filter((id) => id !== pageOwner._id)
      : [...user.follows, pageOwner._id];

    axios
      .put(`${env.NEXT_PUBLIC_API_HOST}/users/${user._id}/follows`, {
        follows: newFollowList,
      })
      .then(async () => {
        await mutateUser();
        await mutateFollowers();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div
        className={`${
          pageOwner?.publicName || pageOwner?.description ? "mb-4" : ""
        } flex w-full`}
      >
        <Avatar
          className="mx-6 inline-flex h-20 w-20 select-none items-center justify-center overflow-hidden rounded-full bg-black align-middle sm:mx-6 sm:h-36 sm:w-36 md:mb-4 md:h-40 md:w-40 lg:my-6 lg:ml-12 lg:mr-24"
          user={pageOwner}
        />
        <div className="flex flex-1 flex-col sm:items-start lg:mt-6">
          <div className="flex flex-col justify-evenly gap-2 sm:flex-row sm:gap-6">
            <p className="text-xl">{pageOwner.username}</p>
            {user && (
              <>
                {user.username === pageOwner.username ? (
                  <Link
                    href={`/${user.username}/edit`}
                    className="h-max w-max rounded-lg bg-neutral-100 px-12 py-1 font-semibold capitalize text-black hover:bg-neutral-200 focus:outline-none focus:ring focus:ring-neutral-300 focus:ring-opacity-80 sm:px-6"
                  >
                    Edit profile
                  </Link>
                ) : (
                  <>
                    {user.follows.includes(pageOwner._id) ? (
                      <button
                        className="h-max w-max rounded-lg bg-neutral-100 px-12 py-1 font-semibold capitalize text-black hover:bg-neutral-200 focus:outline-none focus:ring focus:ring-neutral-300 focus:ring-opacity-80 sm:px-10"
                        onClick={updateUserFollowList}
                      >
                        Unfollow
                      </button>
                    ) : (
                      <button
                        className="h-max w-max rounded-lg bg-blue-500 px-12 py-1 font-semibold capitalize text-white hover:bg-blue-600 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-80 sm:px-10"
                        onClick={updateUserFollowList}
                      >
                        Follow
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <div className="mt-6 hidden w-full max-w-[500px] justify-between sm:flex md:pr-16">
            <div className="flex flex-wrap gap-1.5">
              <span className="font-semibold">
                {!posts || postsError
                  ? 0
                  : formatter.format(posts?.length || 0)}
              </span>
              <span>publications</span>
            </div>
            <button
              className="flex flex-wrap gap-1.5"
              onClick={() => setFollowersOpen(true)}
            >
              <span className="font-semibold">
                {!followers || followersError
                  ? 0
                  : formatter.format(followers.length)}
              </span>
              <span>followers</span>
            </button>
            <button
              className="flex flex-wrap gap-1.5"
              onClick={() => setFollowingOpen(true)}
            >
              <span className="font-semibold">
                {!followers || followersError
                  ? 0
                  : formatter.format(pageOwner.follows.length)}
              </span>
              <span>following</span>
            </button>
          </div>
          {pageOwner?.publicName && (
            <div className="mt-6 hidden w-full max-w-[500px] justify-between pr-16 sm:flex">
              <p className="w-[300px] text-sm font-semibold">
                {pageOwner?.publicName}
              </p>
            </div>
          )}
          {pageOwner?.description && (
            <div className="mt-4 hidden w-full max-w-[500px] justify-between pr-16 sm:flex">
              <p className="w-[300px] text-sm">{pageOwner?.description}</p>
            </div>
          )}
        </div>
      </div>
      {pageOwner?.publicName && (
        <div className="w-full pl-6 sm:hidden">
          <p className="w-[300px] text-sm font-semibold">
            {pageOwner?.publicName}
          </p>
        </div>
      )}
      {pageOwner?.description && (
        <div className="mt-1 w-full pl-6 sm:hidden">
          <p className="w-[300px] text-sm">{pageOwner?.description}</p>
        </div>
      )}
      <div className="mt-4 flex w-full items-center justify-evenly border-t border-neutral-300 py-3 px-2 text-sm dark:border-neutral-700 sm:hidden">
        <div className="flex flex-col items-center justify-center">
          <span className="font-semibold">
            {formatter.format(posts?.length || 0)}
          </span>
          <span className="text-neutral-500">publications</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="font-semibold">
            {followers ? formatter.format(followers.length) : 0}
          </span>
          <span className="text-neutral-500">followers</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="font-semibold">
            {formatter.format(pageOwner?.follows.length)}
          </span>
          <span className="text-neutral-500">following</span>
        </div>
      </div>

      <div className="mb-4 flex w-full items-center justify-evenly border-t border-neutral-300 px-2 text-sm dark:border-neutral-700 md:mb-7">
        {user && user.username === pageOwner.username && (
          <>
            <Link
              href={`/${pageOwner.username}`}
              className={`${
                router.pathname.includes("saved")
                  ? ""
                  : "border-t border-neutral-800 dark:border-neutral-100"
              } dark flex items-center gap-2 py-4`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                />
              </svg>
              <p className="uppercase ">PUBLICATIONS</p>
            </Link>
            <Link
              href={`/${pageOwner.username}/saved`}
              className={`${
                router.pathname.includes("saved")
                  ? "border-t border-neutral-800 dark:border-neutral-100"
                  : ""
              } dark flex items-center gap-2 py-4`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
              <p className="uppercase">SAVED</p>
            </Link>
          </>
        )}
      </div>
      <UsersListModal
        title="Followers"
        open={followersOpen}
        setOpen={setFollowersOpen}
        path={`/users/${pageOwner.username}/followers`}
      />
      <UsersListModal
        title="Following"
        open={followingOpen}
        setOpen={setFollowingOpen}
        path={`/users/${pageOwner.username}/following`}
      />
    </>
  );
};

export default ProfileHeader;
