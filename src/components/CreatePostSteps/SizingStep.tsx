import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  type Dispatch,
  type SetStateAction,
  type MouseEventHandler,
  Fragment,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import AvatarEditor from "react-avatar-editor";
import useImageEditorWidth from "../../hooks/useImageEditorWidth";
import useImageEditorHeight from "../../hooks/useImageEditorHeight";
import Image from "next/image";

type Props = {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  setStep: Dispatch<SetStateAction<number>>;
  handleSelectClick: MouseEventHandler<HTMLButtonElement>;
};

// Image sizing step
const SizingStep = ({ files, setFiles, setStep, handleSelectClick }: Props) => {
  const editorRef = useRef<AvatarEditor>(null);
  // !should not be used directly. instead use switchImage function
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  // filled with 9 by default in case any new images are added
  const [scales, setScales] = useState<number[]>(Array(9).fill(1));

  const editorWidth = useImageEditorWidth();
  const editorHeight = useImageEditorHeight();
  const [aspectRatio, setAspectRatio] = useState(1 / 1);

  let canvasWidth: number | undefined;
  let canvasHeight: number | undefined;
  switch (aspectRatio) {
    case 1 / 1:
      canvasWidth = editorWidth as number;
      canvasHeight = editorHeight as number;
      break;
    case 16 / 9:
      canvasWidth = editorWidth as number;
      canvasHeight = ((editorHeight as number) * 9) / 16;
      break;
    case 4 / 5:
      canvasHeight = editorHeight as number;
      canvasWidth = ((editorWidth as number) * 4) / 5;
      break;
    case 9 / 16:
      canvasHeight = editorHeight as number;
      canvasWidth = ((editorWidth as number) * 9) / 16;
      break;
  }

  const uneditedImagesRef = useRef<File[]>([]);

  const uneditedImages = useMemo(() => {
    // get only the new files
    const newFiles = files.slice(uneditedImagesRef.current.length);
    return [...uneditedImagesRef.current, ...newFiles];
  }, [files]);

  useEffect(() => {
    uneditedImagesRef.current = uneditedImages;
  }, [uneditedImages]);

  const imageUrls = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );

  useEffect(() => {
    return () => {
      if (imageUrls.length <= 1) return;
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  const nextStep = () => {
    imageUrls.forEach((url) => URL.revokeObjectURL(url));
    saveFileChanges();
    setStep(3);
  };

  const saveFileChanges = () => {
    if (!editorRef.current) return;
    const canvas = editorRef.current.getImage();

    const filesCopy = [...files];
    const name = filesCopy[currentFileIndex]?.name as string;

    canvas.toBlob((blob) => {
      const file = new File([blob as Blob], name, { type: "image/png" });

      filesCopy[currentFileIndex] = file;
      setFiles(filesCopy);
    }, "image/png");
  };

  const switchImage = (index: number) => {
    if (index === currentFileIndex) return;
    saveFileChanges();
    setCurrentFileIndex(index);
  };

  const scaleImage = (value: number) => {
    setScales([
      ...scales.slice(0, currentFileIndex),
      value,
      ...scales.slice(currentFileIndex + 1),
    ]);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="invisible ml-4">
          <p className="font-semibold text-blue-500">Next</p>
        </div>
        <Dialog.Title className="flex-1 py-3 text-center font-semibold">
          Crop image
        </Dialog.Title>
        <button className="mr-4 " onClick={nextStep}>
          <p className="font-semibold text-blue-500 hover:text-blue-200">
            Next
          </p>
        </button>
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center border-t border-neutral-300 dark:border-neutral-900">
        <AvatarEditor
          ref={editorRef}
          image={uneditedImages[currentFileIndex] as File}
          width={canvasWidth}
          height={canvasHeight}
          className="dark:bg-neutral-900"
          border={0}
          scale={scales[currentFileIndex]}
        />
        {/* Previous button */}
        {currentFileIndex > 0 && (
          <div className="absolute inset-y-auto left-2">
            <button
              className="inline-flex w-full items-center justify-center rounded-full bg-neutral-900 bg-opacity-70 p-2 text-white transition hover:bg-opacity-60 focus:outline-none"
              onClick={() => switchImage(currentFileIndex - 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          </div>
        )}
        {/* Next Button */}
        {currentFileIndex < files.length - 1 && (
          <div className="absolute inset-y-auto right-2">
            <button
              className="inline-flex w-full items-center justify-center rounded-full bg-neutral-900 bg-opacity-70 p-2 text-white transition hover:bg-opacity-60 focus:outline-none"
              onClick={() => switchImage(currentFileIndex + 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        )}
        {/* Aspect Ratio Select */}
        <div className="absolute bottom-2 left-2">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-full bg-neutral-900 bg-opacity-70 p-2 text-white transition hover:bg-opacity-60 focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute bottom-12 flex w-32 origin-bottom-left flex-col divide-y divide-gray-100 rounded-md bg-neutral-900 text-neutral-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  <button
                    onClick={() => setAspectRatio(1 / 1)}
                    className={`${
                      aspectRatio === 1 / 1 ? "text-white" : "text-gray-500"
                    } flex cursor-pointer items-center px-4 py-3 font-semibold `}
                  >
                    1:1
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    onClick={() => setAspectRatio(16 / 9)}
                    className={`${
                      aspectRatio === 16 / 9 ? "text-white" : "text-gray-500"
                    } flex cursor-pointer items-center px-4 py-3 font-semibold `}
                  >
                    16:9
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    onClick={() => setAspectRatio(9 / 16)}
                    className={`${
                      aspectRatio === 9 / 16 ? "text-white" : "text-gray-500"
                    } flex cursor-pointer items-center px-4 py-3 font-semibold `}
                  >
                    9:16
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    onClick={() => setAspectRatio(4 / 5)}
                    className={`${
                      aspectRatio === 4 / 5 ? "text-white" : "text-gray-500"
                    } flex cursor-pointer items-center px-4 py-3 font-semibold `}
                  >
                    4:5
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        {/* Scale Slider */}
        <div className="absolute bottom-2 left-12">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-full bg-neutral-900 bg-opacity-70 p-2 text-white transition hover:bg-opacity-60 focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                  />
                </svg>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute bottom-12 origin-bottom-left divide-y divide-gray-100 rounded-md bg-neutral-900 text-neutral-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={scales[currentFileIndex]}
                    onInput={(event) =>
                      scaleImage(
                        Number((event.target as HTMLInputElement).value)
                      )
                    }
                    className="m-3 flex h-3 w-32 cursor-pointer items-center rounded-lg bg-gray-200 accent-gray-100 dark:bg-gray-700"
                  />
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        {/* Images Menu button */}
        <div className="absolute bottom-2 right-2">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-full bg-neutral-900 bg-opacity-70 p-2 text-white transition hover:bg-opacity-60 focus:outline-none">
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
                    d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"
                  />
                </svg>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute bottom-12 right-2 grid w-80 origin-bottom-right grid-cols-3 place-items-center gap-2 divide-y divide-gray-100 rounded-md bg-neutral-700 bg-opacity-70 p-3 text-neutral-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {imageUrls?.map((url, index) => (
                  <Image
                    src={url}
                    alt=""
                    key={url}
                    width={100}
                    height={100}
                    className="aspect-square rounded-md border-none bg-neutral-800 bg-opacity-50 object-cover p-3 hover:cursor-pointer"
                    onClick={() => switchImage(index)}
                  />
                ))}
                {imageUrls && imageUrls.length < 9 && (
                  <button
                    className="flex aspect-square w-1/2 items-center justify-center rounded-full border-none bg-neutral-800 bg-opacity-50 p-3"
                    onClick={handleSelectClick}
                  >
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
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </button>
                )}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </>
  );
};

export default SizingStep;
