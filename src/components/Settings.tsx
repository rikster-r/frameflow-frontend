import useUser from "../hooks/useUser";
import { ControlsModal, Avatar, Loader } from "./";
import {
  useState,
  useRef,
  type MouseEventHandler,
  type ChangeEventHandler,
  type FormEventHandler,
} from "react";
import axios, { isAxiosError } from "axios";
import { env } from "../env/server.mjs";
import { toast } from "react-toastify";
import { parseCookies } from "nookies";
import { type ZodError } from "zod";

const Settings = () => {
  const { user, mutate: mutateUser } = useUser();
  const [avatarControlsOpen, setAvatarControlsOpen] = useState(false);
  const [avatarUpdating, setAvatarUpdating] = useState(false);
  const [name, setName] = useState(user?.publicName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [description, setDescription] = useState(user?.description || "");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  if (!user) return <></>;

  const handleAvatarChangeClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (user.avatar) {
      setAvatarControlsOpen(true);
    } else if (avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  const handleAvatarUpload: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.target.files || !event.target.files[0]) return;
    const avatar = event.target.files[0];

    // 2097152 bytes === 2mb
    if (avatar.size > 2097152) {
      toast.error("Maximum image size allowed is 2mb");
      return;
    }

    // file type check
    if (avatar.type !== "image/png" && avatar.type !== "image/jpeg") {
      toast.error("Only PNG and JPEG images are allowed");
      return;
    }

    setAvatarUpdating(true);
    setAvatarControlsOpen(false);

    const { userToken } = parseCookies();
    const data = new FormData();
    data.append("images", avatar);

    axios
      .put(`${env.NEXT_PUBLIC_API_HOST}/users/${user._id}/avatar`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken as string}`,
        },
      })
      .then(async () => {
        setAvatarUpdating(false);
        await mutateUser();
      })
      .catch(() => {
        toast.error("Had some trouble updating profile picture");
      });
  };

  const deleteAvatar: MouseEventHandler<HTMLButtonElement> = () => {
    const { userToken } = parseCookies();
    if (!userToken) return;
    setAvatarControlsOpen(false);

    axios
      .delete(`${env.NEXT_PUBLIC_API_HOST}/users/${user._id}/avatar`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(async () => {
        await mutateUser();
      })
      .catch(() => {
        toast.error("Had some trouble updating profile picture");
      });
  };

  const handleInfoSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!username) return;

    const { userToken } = parseCookies();
    if (!userToken) return;

    axios
      .put(
        `${env.NEXT_PUBLIC_API_HOST}/users/${user._id}/info`,
        {
          name,
          username,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(async () => {
        await mutateUser();
        toast.success("Succesfully updated info");
      })
      .catch((err) => {
        if (isAxiosError(err) && err.response?.data) {
          const data = err.response.data as ZodError;
          toast.error(data.issues.at(0)?.message);
        } else {
          toast.error("Had trouble updating your info");
        }
      });
  };

  return (
    <div className="flex-1 py-8 px-4">
      <div className="mb-8 mr-6 grid grid-cols-[max-content_max-content] justify-center gap-6 sm:ml-10 sm:mr-0 sm:grid-cols-[max-content_300px] sm:gap-8">
        <div className="relative flex items-center justify-center">
          <button onClick={handleAvatarChangeClick}>
            <Avatar
              className={`${
                avatarUpdating ? "opacity-50" : ""
              } inline-flex h-12 w-12 select-none items-center justify-center overflow-hidden rounded-full align-middle`}
              user={user}
            />
          </button>
          {avatarUpdating && (
            <div className="absolute">
              <Loader />
            </div>
          )}
        </div>
        <div>
          <p>{user.username}</p>
          <button
            className="font-semibold text-blue-500 hover:text-blue-200"
            onClick={handleAvatarChangeClick}
          >
            Change profile picture
          </button>
        </div>
        <ControlsModal
          open={avatarControlsOpen}
          setOpen={setAvatarControlsOpen}
        >
          <button
            className="w-full py-4 font-semibold text-blue-500"
            onClick={() => avatarInputRef.current?.click()}
          >
            Upload profile picture
          </button>
          <button
            className="w-full py-4 font-semibold text-red-500"
            onClick={deleteAvatar}
          >
            Remove current picture
          </button>
        </ControlsModal>
      </div>
      <form
        className="grid place-content-center items-center gap-6 sm:grid-cols-[max-content_300px] sm:gap-8"
        onSubmit={handleInfoSubmit}
      >
        <p className="text-right font-semibold ">Name</p>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-neutral-200 bg-[inherit] px-3 py-1.5 placeholder-neutral-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-neutral-700 dark:focus:border-blue-300"
        />

        <p className="text-right font-semibold">Username</p>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-md border border-neutral-200 bg-[inherit] px-3 py-1.5 placeholder-neutral-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-neutral-700 dark:focus:border-blue-300"
        />
        <p className="self-start text-right font-semibold">Description</p>
        <div>
          <textarea
            name="description"
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 150))}
            className="min-h-[160px] w-full resize-y rounded-md border border-neutral-200 bg-[inherit] px-3 py-1.5 placeholder-neutral-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-neutral-700 dark:focus:border-blue-300"
          />
          <p className="mt-2 text-sm text-neutral-500">
            {description ? description.length : 0} / 150
          </p>
        </div>
        <button
          disabled={
            username?.trim() === "" ||
            (username === user.username &&
              name === user.publicName &&
              description === user.description)
          }
          className="col-start-2 w-max justify-self-end rounded-lg bg-blue-500 px-5 py-2 font-semibold capitalize tracking-wide text-white hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 disabled:opacity-70 disabled:hover:bg-blue-500"
        >
          Submit
        </button>
      </form>
      <input
        className="hidden"
        accept="image/png, image/jpeg"
        ref={avatarInputRef}
        type="file"
        onChange={handleAvatarUpload}
      />
    </div>
  );
};

export default Settings;
