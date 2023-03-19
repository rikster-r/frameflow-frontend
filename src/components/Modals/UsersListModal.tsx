import { Transition, Dialog } from "@headlessui/react";
import { Fragment, type Dispatch, type SetStateAction } from "react";
import { Avatar } from "..";
import Link from "next/link";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  users: IUser[];
};

const UsersListModal = ({ open, setOpen, users, title }: Props) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-in duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-70"
          leave="ease-out duration-100"
          leaveFrom="opacity-70"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              enter="linear duration-150"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-110"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="linear duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-110"
            >
              <Dialog.Panel className="h-[400px] w-[300px] rounded-lg bg-white shadow-xl dark:bg-neutral-800 dark:text-white sm:w-[400px]">
                <div className="flex items-center justify-between">
                  <div className="invisible ml-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <Dialog.Title className="flex-1 py-3 text-center font-semibold">
                    {title}
                  </Dialog.Title>
                  <button className="mr-4" onClick={() => setOpen(false)}>
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
                </div>
                <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto border-t border-neutral-300  dark:border-neutral-700">
                  {users.map((user) => (
                    <Link
                      onClick={() => setOpen(false)}
                      href={`/${user.username}`}
                      className="flex w-full items-center gap-0.5 truncate py-3 px-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      key={user._id}
                    >
                      <Avatar
                        className="mr-4 inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full align-middle"
                        user={user}
                      />
                      <div>
                        <p className="text-sm font-semibold">{user.username}</p>
                        <p className="text-sm text-neutral-400">
                          {user.publicName}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UsersListModal;
