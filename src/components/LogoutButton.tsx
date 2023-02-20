import { destroyCookie } from "nookies";
import type { MouseEventHandler } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const LogoutButton = () => {
  const router = useRouter();

  const logout: MouseEventHandler<HTMLButtonElement> = () => {
    destroyCookie(null, "userToken");
    router
      .push("/")
      .catch((err) => toast.error("Couldn't log out. Please try again"));
  };

  return (
    <button
      className="flex w-full items-center px-4 py-3 hover:bg-neutral-100  dark:hover:bg-neutral-900"
      onClick={logout}
    >
      <p className="text-lg text-red-500">Log out</p>
    </button>
  );
};

export default LogoutButton;
