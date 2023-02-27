import * as Avatar from "@radix-ui/react-avatar";
import Image from "next/image";
import { getCurrentTimeDifference } from "../lib/luxon";

type Props = {
  author: IUser;
  text: string;
  timestamp: string;
  likedBy?: string[];
};

const Comment = ({ author, text, timestamp, likedBy }: Props) => {
  return (
    <div className="flex h-max w-full px-4 py-3 dark:text-white">
      <Avatar.Root className="mr-4 inline-flex h-8 w-8 select-none items-center justify-center overflow-hidden rounded-full align-middle">
        <Avatar.Image
          className="h-full w-full rounded-[inherit] object-cover object-center"
          src={author?.avatar as string}
          alt={author.username}
        />
        <Avatar.Fallback
          className="flex h-full w-full items-center justify-center rounded-[inherit] object-cover object-center"
          delayMs={600}
        >
          <Image
            src="/defaultAvatar.png"
            width={100}
            height={100}
            alt={author.username}
          />
        </Avatar.Fallback>
      </Avatar.Root>
      <div className="flex w-full flex-col gap-1 text-left text-sm">
        <p className="font-semibold">
          {author.username} <span className="font-normal">{text}</span>
        </p>
        <div className="font-semibold text-neutral-400">
          <span className="mr-3">{getCurrentTimeDifference(timestamp)}</span>
          {likedBy && Boolean(likedBy.length) && (
            <span>Likes: {likedBy.length}</span>
          )}
        </div>
      </div>
      {likedBy && (
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mt-1 h-5 w-5 hover:text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Comment;
