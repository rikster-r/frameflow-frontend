import {
  useEffect,
  type ChangeEventHandler,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import type { IUser } from "../../pages/_app";
import {
  type Theme,
  EmojiStyle,
  type EmojiClickData,
} from "emoji-picker-react";
import useImageEditorWidth from "../../hooks/useImageEditorWidth";

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

const ThirdStep = ({ text, setText, user, setStep }: Props) => {
  const width = useImageEditorWidth();

  const updateText: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setText(e.target.value.slice(0, 1000));
  };

  const addEmoji = (emojiData: EmojiClickData) => {
    setText((text) => text + emojiData.emoji);
  };

  // todo: change svg to profile picture
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
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
              <Popover.Panel className="-z-50Z absolute -left-2 bottom-10 origin-bottom-left rounded-md p-3 dark:bg-neutral-900">
                <EmojiPicker
                  theme={localStorage.getItem("theme") as Theme}
                  // arbitrary
                  width={(width as number) - 80}
                  height={
                    (width as number) === 350 ? 150 : (width as number) - 250
                  }
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
