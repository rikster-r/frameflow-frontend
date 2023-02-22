import * as Avatar from "@radix-ui/react-avatar";
import Image from "next/image";
import Link from "next/link";

type Props = {
  user: IUser;
  pageOwner: IUser;
};

const ProfileHeader = ({ user, pageOwner }: Props) => {
  const formatter = Intl.NumberFormat("en-US", { notation: "compact" });

  return (
    <>
      <div
        className={`${
          pageOwner?.publicName || pageOwner?.description ? "mb-4" : ""
        } flex w-full`}
      >
        <Avatar.Root className="mx-6 inline-flex h-20 w-20 select-none items-center justify-center overflow-hidden rounded-full bg-black align-middle sm:mx-6 sm:h-36 sm:w-36 md:h-40 md:w-40 lg:ml-12 lg:mr-24">
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
        <div className="flex flex-1 flex-col sm:items-start">
          <div className="flex flex-col justify-evenly gap-2 sm:flex-row sm:gap-6">
            <p className="text-xl">{pageOwner.username}</p>
            {user.username === pageOwner.username ? (
              <Link
                href={`/${user.username}/edit`}
                className="h-max w-max rounded-lg bg-neutral-100 px-12 py-1 font-semibold capitalize text-black hover:bg-neutral-200 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 sm:px-6"
              >
                Edit profile
              </Link>
            ) : (
              <button
                className={`${
                  user
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : " bg-neutral-100 hover:bg-neutral-200"
                } h-max w-max rounded-lg px-12 py-1 font-semibold capitalize focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 sm:px-10`}
              >
                Follow
              </button>
            )}
          </div>
          <div className="mt-6 hidden w-full max-w-[500px] justify-between sm:flex md:pr-16">
            <div className="flex flex-wrap gap-1.5">
              <span className="font-semibold">2</span>
              <span>publications</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="font-semibold">2</span>
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
              <p className="w-[300px] text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
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
      <div className="mt-4 flex w-full items-center justify-evenly border-y border-neutral-300 py-3 px-2 text-sm dark:border-neutral-700 sm:hidden">
        <div className="flex flex-col items-center justify-center">
          <span className="font-semibold">2</span>
          <span className="text-neutral-500">publications</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="font-semibold">2</span>
          <span className="text-neutral-500">subscribers</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="font-semibold">
            {formatter.format(pageOwner?.follows.length)}
          </span>
          <span className="text-neutral-500">subscriptions</span>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
