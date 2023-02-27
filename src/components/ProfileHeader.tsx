import * as Avatar from "@radix-ui/react-avatar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  user?: IUser;
  pageOwner: IUser;
  posts: IPost[];
  subscribers: IUser[];
};

const ProfileHeader = ({ user, pageOwner, posts, subscribers }: Props) => {
  const formatter = Intl.NumberFormat("en-US", { notation: "compact" });
  const router = useRouter();

  return (
    <>
      <div
        className={`${
          pageOwner?.publicName || pageOwner?.description ? "mb-4" : ""
        } flex w-full`}
      >
        <Avatar.Root className="mx-6 inline-flex h-20 w-20 select-none items-center justify-center overflow-hidden rounded-full bg-black align-middle sm:mx-6 sm:h-36 sm:w-36 md:mb-4 md:h-40 md:w-40 lg:my-6 lg:ml-12 lg:mr-24">
          <Avatar.Image
            className="h-full w-full rounded-[inherit] object-cover"
            src={pageOwner?.avatar as string}
            alt={pageOwner.publicName}
          />
          <Avatar.Fallback
            className="flex h-full w-full items-center justify-center"
            delayMs={600}
          >
            <Image
              src="/defaultAvatar.png"
              width={300}
              height={300}
              alt={pageOwner.publicName}
            />
          </Avatar.Fallback>
        </Avatar.Root>
        <div className="flex flex-1 flex-col sm:items-start lg:mt-6">
          <div className="flex flex-col justify-evenly gap-2 sm:flex-row sm:gap-6">
            <p className="text-xl">{pageOwner.username}</p>
            {user ? (
              user.username === pageOwner.username ? (
                <Link
                  href={`/${user.username}/edit`}
                  className="h-max w-max rounded-lg bg-neutral-100 px-12 py-1 font-semibold capitalize text-black hover:bg-neutral-200 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 sm:px-6"
                >
                  Edit profile
                </Link>
              ) : (
                <button className="h-max w-max rounded-lg bg-blue-500 px-12 py-1 font-semibold capitalize text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 sm:px-10">
                  Follow
                </button>
              )
            ) : null}
          </div>
          <div className="mt-6 hidden w-full max-w-[500px] justify-between sm:flex md:pr-16">
            <div className="flex flex-wrap gap-1.5">
              <span className="font-semibold">
                {formatter.format(posts.length)}
              </span>
              <span>publications</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="font-semibold">
                {formatter.format(subscribers.length)}
              </span>
              <span>subscribers</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="font-semibold">
                {formatter.format(pageOwner.follows.length)}
              </span>
              <span>subscriptions</span>
            </div>
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
            {formatter.format(posts.length)}
          </span>
          <span className="text-neutral-500">publications</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="font-semibold">
            {formatter.format(subscribers.length)}
          </span>
          <span className="text-neutral-500">subscribers</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="font-semibold">
            {formatter.format(pageOwner?.follows.length)}
          </span>
          <span className="text-neutral-500">subscriptions</span>
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
      <div></div>
    </>
  );
};

export default ProfileHeader;
