import Link from "next/link";
import { Avatar, Loader } from "..";
import axios from "axios";
import { env } from "../../env/server.mjs";
import useSWR from "swr";
import useUser from "../../hooks/useUser";

type Props = {
  results?: IUser[];
  isLoading: boolean;
};

const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data as IUser[]);

const UsersSection = ({ results, isLoading }: Props) => {
  const { user } = useUser();
  const { data: visited, mutate: mutateVisited } = useSWR<IUser[]>(
    user ? `${env.NEXT_PUBLIC_API_HOST}/users/${user.username}/visited` : null,
    fetcher
  );

  const removeFromVisitedList = (removeAll: boolean, id?: string) => {
    if (!visited || !user) return;

    const newVisitedList = removeAll
      ? []
      : user.visited.concat().filter((userId) => userId !== id);

    axios
      .put(`${env.NEXT_PUBLIC_API_HOST}/users/${user._id}/visited`, {
        visited: newVisitedList,
      })
      .then(async () => {
        await mutateVisited();
      })
      .catch(() => {
        console.error("Error deleting user from visited list");
      });
  };

  return (
    <>
      {!isLoading && !results && (
        <div className="w-full px-6 py-4 ">
          <div className="flex justify-between">
            <h3 className="font-semibold">Recent</h3>
            {visited && visited.length > 0 && (
              <button
                className="font-semibold text-blue-500 hover:text-blue-900 dark:hover:text-blue-200"
                onClick={() => removeFromVisitedList(true)}
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
      {isLoading && (
        <div className="flex h-full items-center justify-center">
          <Loader />
        </div>
      )}
      {!results &&
        !isLoading &&
        visited &&
        visited.map((user) => (
          <Link
            href={`/${user.username}`}
            className="flex w-full items-center gap-0.5 truncate px-6 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            key={user._id}
          >
            <Avatar
              className="mr-4 inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full align-middle"
              user={user}
            />
            <div>
              <p className="text-sm font-semibold">{user.username}</p>
              <p className="text-sm text-neutral-400">{user.publicName}</p>
            </div>
            <button
              onClick={() => removeFromVisitedList(false, user._id)}
              className="ml-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-7 w-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </Link>
        ))}
      {results &&
        results.map((user) => (
          <Link
            href={`/${user.username}`}
            className="flex w-full items-center gap-0.5 truncate px-6 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            key={user._id}
          >
            <Avatar
              className="mr-4 inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full align-middle"
              user={user}
            />
            <div>
              <p className="text-sm font-semibold">{user.username}</p>
              <p className="text-sm text-neutral-400">{user.publicName}</p>
            </div>
          </Link>
        ))}
      {results && results.length === 0 && (
        <div className="flex h-full items-center justify-center text-neutral-500">
          No results.
        </div>
      )}
    </>
  );
};

export default UsersSection;
