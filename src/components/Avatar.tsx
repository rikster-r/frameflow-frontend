import * as RadixAvatar from "@radix-ui/react-avatar";
import Image from "next/image";

type Props = {
  className: string;
  user?: IUser;
};

const Avatar = ({ className, user }: Props) => {
  return (
    <RadixAvatar.Root className={className}>
      <RadixAvatar.Image
        className="h-full w-full rounded-[inherit] object-cover object-center"
        src={user?.avatar as string}
        alt={user ? user.username : ""}
      />
      <RadixAvatar.Fallback
        className="flex h-full w-full items-center justify-center rounded-[inherit] object-cover object-center"
        delayMs={600}
      >
        <Image
          src="/defaultAvatar.png"
          width={200}
          height={200}
          alt={user ? user.username : ""}
        />
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
};

export default Avatar;
