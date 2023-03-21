import axios from "axios";
import { env } from "../env/server.mjs";
import { Avatar } from "../components";
import Link from "next/link";
import useSWR from "swr";
import useUser from "../hooks/useUser";
import { useMemo } from "react";
import { updateUserFollowList } from "../lib/controllers";

const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data as IUser[]);

const UserSuggestions = () => {
  const { user } = useUser();
  const { data: followers } = useSWR(
    user
      ? `${env.NEXT_PUBLIC_API_HOST}/users/${user.username}/followers`
      : null,
    fetcher
  );
  const suggestions = useMemo(
    () =>
      followers && user
        ? followers.filter((follower) => !user.follows.includes(follower._id))
        : [],
    []
  );

  if (!user || !followers) return <></>;

  if (!suggestions.length) return <></>;

  return (
    <>
      <h2 className="font-semibold text-neutral-500 dark:text-neutral-300">
        Suggestions for you
      </h2>
      {suggestions.map((follower) => (
        <Link
          href={`/${follower.username}`}
          className="flex w-full items-center gap-0.5 truncate py-2"
          key={follower._id}
        >
          <Avatar
            className="mr-4 inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full align-middle"
            user={follower}
          />
          <div>
            <p className="text-sm font-semibold">{follower.username}</p>
            <p className="text-sm text-neutral-400">{follower.publicName}</p>
          </div>
          {user.follows.includes(follower._id) ? (
            <button
              className="ml-auto font-semibold"
              onClick={(e) => {
                e.preventDefault();
                updateUserFollowList(follower, user);
              }}
            >
              Unfollow
            </button>
          ) : (
            <button
              className="ml-auto font-semibold text-blue-500 hover:text-blue-200 dark:text-blue-400"
              onClick={(e) => {
                e.preventDefault();
                updateUserFollowList(follower, user);
              }}
            >
              Follow
            </button>
          )}
        </Link>
      ))}
    </>
  );
};

export default UserSuggestions;
