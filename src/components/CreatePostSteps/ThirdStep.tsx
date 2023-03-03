import {
  type ChangeEventHandler,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import {
  type Theme,
  EmojiStyle,
  type EmojiClickData,
} from "emoji-picker-react";
import useImageEditorWidth from "../../hooks/useImageEditorWidth";
import useImageEditorHeight from "../../hooks/useImageEditorHeight";
import { Avatar } from "../";

import dynamic from "next/dynamic";

// https://github.com/ealush/emoji-picker-react#nextjs
const EmojiPicker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

type Props = {
  user: IUser;
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  setStep: Dispatch<SetStateAction<number>>;
};

// Caption input step
const ThirdStep = ({ text, setText, user, setStep }: Props) => {
  const width = useImageEditorWidth();
  const height = useImageEditorHeight();

  const updateText: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setText(e.target.value.slice(0, 1000));
  };

  const addEmoji = (emojiData: EmojiClickData) => {
    setText((text) => text + emojiData.emoji);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="invisible ml-4">
          <p className="font-semibold text-blue-500">Share</p>
        </div>
        <Dialog.Title className="flex-1 py-3 text-center font-semibold">
          Add caption
        </Dialog.Title>
        <button className="mr-4" onClick={() => setStep(4)}>
          <p className="font-semibold text-blue-500 hover:text-blue-200">
            Share
          </p>
        </button>
      </div>
      <div className="relative flex h-full flex-1 flex-col gap-6 border-t border-neutral-300 p-6 dark:border-neutral-900">
        <div className="flex items-center gap-2">
          <Avatar
            className="inline-flex h-8 w-8 select-none items-center justify-center overflow-hidden rounded-full align-middle"
            user={user}
          />
          <p className="font-semibold ">{user.username}</p>
        </div>
        <div className="h-full">
          <textarea
            className="h-full w-full resize-none bg-inherit focus:outline-none"
            name="text"
            value={text}
            onChange={updateText}
            placeholder="Enter text..."
          />
        </div>
        <div className="flex w-full justify-between">
          <Popover className="relative flex-1">
            <Popover.Button className="text-sm text-neutral-500 hover:cursor-pointer hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
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
                  d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                />
              </svg>
            </Popover.Button>

            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel className="absolute -left-2 bottom-10 origin-bottom-left rounded-md p-3 dark:bg-neutral-900">
                <EmojiPicker
                  theme={localStorage.getItem("theme") as Theme}
                  // arbitrary
                  width={(width as number) - 50}
                  height={Math.min((height as number) - 200, 300)}
                  // most performant
                  emojiStyle={EmojiStyle.NATIVE}
                  onEmojiClick={addEmoji}
                  skinTonesDisabled
                  searchDisabled
                  previewConfig={{ showPreview: false }}
                />
              </Popover.Panel>
            </Transition>
          </Popover>
          <Popover className="relative">
            <Popover.Button
              className="text-sm text-neutral-500 hover:cursor-pointer hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              as="span"
            >
              {text.length}/1000
            </Popover.Button>

            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel className="absolute right-0 bottom-8 z-50 w-80 origin-bottom-right rounded-md bg-neutral-800 p-3 dark:bg-neutral-900">
                <p className="text-neutral-50">
                  Text longer than 125 characters is cut off in the feed
                </p>
              </Popover.Panel>
            </Transition>
          </Popover>
        </div>
      </div>
    </>
  );
};

export default ThirdStep;
