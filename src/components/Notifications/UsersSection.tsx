import { updateUserFollowList } from "../../lib/controllers";
import Link from "next/link";
import Image from "next/image";
import { env } from "../../env/server.mjs";
import axios from "axios";
import useUser from "../../hooks/useUser";
import useSWR from "swr";
import { Avatar, Loader } from "../";
import { getCurrentTimeDifference } from "../../lib/luxon";

const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data as INotification[]);

const NotificationsUsersSection = () => {
  const { user } = useUser();
  const { data: notifications, isLoading } = useSWR<INotification[]>(
    user ? `${env.NEXT_PUBLIC_API_HOST}/users/${user._id}/notifications` : null,
    fetcher
  );

  if (!user) return <></>;

  return (
    <>
      <div className="px-4 pt-7 pb-6">
        <h2 className="text-2xl font-semibold">Notifications</h2>
      </div>
      {isLoading && (
        <div className="flex h-full items-center justify-center">
          <Loader />
        </div>
      )}
      {notifications && notifications.length === 0 && (
        <div className="flex h-full items-center justify-center text-neutral-500">
          No notifications.
        </div>
      )}
      {notifications && (
        <div className="overflow-y-auto">
          {notifications.map((notification) => (
            <div
              className="flex w-full items-center gap-0.5 truncate px-6 py-3 "
              key={notification._id}
            >
              <Link href={`/${notification.from.username}`}>
                <Avatar
                  className="mr-4 inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full align-middle"
                  user={notification.from}
                />
              </Link>
              <Link href={`/${notification.from.username}`}>
                <div>
                  <p className="text-sm font-semibold">
                    {notification.from.username}
                  </p>
                  <p className="text-sm">
                    {notification.action === "Follow"
                      ? "started following you."
                      : "liked your post."}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {getCurrentTimeDifference(notification.createdAt)}
                  </p>
                </div>
              </Link>
              {notification.action === "Follow" ? (
                <>
                  {user.follows.includes(notification.from._id) ? (
                    <button
                      className="ml-auto h-max w-max rounded-lg bg-neutral-100 px-6 py-1 font-semibold capitalize text-black hover:bg-neutral-200 sm:px-8"
                      onClick={(e) => {
                        e.preventDefault();
                        updateUserFollowList(notification.from, user);
                      }}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      className="ml-auto h-max w-max rounded-lg bg-blue-500 px-6 py-1 font-semibold capitalize text-white hover:bg-blue-600 sm:px-8"
                      onClick={(e) => {
                        e.preventDefault();
                        updateUserFollowList(notification.from, user);
                      }}
                    >
                      Follow
                    </button>
                  )}
                </>
              ) : (
                <Link
                  href={`/posts/${
                    notification?.data?.likedPost?._id as string
                  }`}
                  className="ml-auto h-12 w-12 "
                >
                  <Image
                    width={100}
                    height={100}
                    alt=""
                    src={notification?.data?.likedPost?.images.at(0) as string}
                    className="h-full w-full object-cover"
                  />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default NotificationsUsersSection;
