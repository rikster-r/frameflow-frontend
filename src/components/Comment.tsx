import * as Avatar from "@radix-ui/react-avatar";
import Image from "next/image";
import { getCurrentTimeDifference } from "../lib/luxon";

type Props = {
  author: IUser;
  text: string;
  timestamp: string;
  likes?: number;
};

const Comment = ({ author, text, timestamp, likes }: Props) => {
  return (
    <div className="flex h-max w-full p-4 dark:text-white">
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
        <p className="font-semibold text-neutral-400">
          <span className="mr-3">{getCurrentTimeDifference(timestamp)}</span>
          {likes && <span>Likes: {likes}</span>}
        </p>
      </div>
    </div>
  );
};

export default Comment;
