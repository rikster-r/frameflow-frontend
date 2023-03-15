import useUser from "../hooks/useUser";
import { ControlsModal, Avatar } from "./";
import { useState } from "react";

const Settings = () => {
  const { user } = useUser();
  const [name, setName] = useState(user?.publicName);
  const [username, setUsername] = useState(user?.username);
  const [description, setDescription] = useState(user?.description);

  if (!user) return <></>;

  const handleAvatarChange = () => {
    // todo
  };

  return (
    <div className="flex-1 py-8">
      <div className="mb-8 mr-6 grid grid-cols-[max-content_max-content] justify-center gap-6 sm:ml-10 sm:mr-0 sm:grid-cols-[max-content_300px] sm:gap-8">
        <button onClick={handleAvatarChange}>
          <Avatar
            className="inline-flex h-12 w-12 select-none items-center justify-center overflow-hidden rounded-full align-middle"
            user={user}
          />
        </button>
        <div>
          <p>{user.username}</p>
          <button
            className="font-semibold text-blue-500 hover:text-blue-200"
            onClick={handleAvatarChange}
          >
            Change profile picture
          </button>
        </div>
      </div>
      <form className="grid grid-cols-[max-content_max-content] place-content-center items-center gap-6 sm:grid-cols-[max-content_300px] sm:gap-8 ">
        <p className="text-right font-semibold ">Name</p>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-neutral-200 bg-[inherit] px-3 py-1.5 placeholder-neutral-500 dark:border-neutral-700"
        />

        <p className="text-right font-semibold">Username</p>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-md border border-neutral-200 bg-[inherit] px-3 py-1.5 placeholder-neutral-500 dark:border-neutral-700"
        />
        <p className="self-start text-right font-semibold">Description</p>
        <div>
          <textarea
            name="description"
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 150))}
            className="min-h-[160px] w-full resize-y rounded-md border border-neutral-200 bg-[inherit] px-3 py-1.5 placeholder-neutral-500 dark:border-neutral-700"
          />
          <p className="mt-2 text-sm text-neutral-500">
            {description ? description.length : 0} / 150
          </p>
        </div>
        <button
          disabled={username?.trim() === ""}
          className="col-start-2 w-max justify-self-end rounded-lg bg-blue-500 px-5 py-2 font-semibold capitalize tracking-wide text-white hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 disabled:opacity-70 disabled:hover:bg-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Settings;
