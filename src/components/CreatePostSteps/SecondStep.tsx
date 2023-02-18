import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  type Dispatch,
  type SetStateAction,
  type MouseEventHandler,
  Fragment,
  useState,
  useEffect,
  useRef,
} from "react";
import AvatarEditor from "react-avatar-editor";
import useImageEditorWidth from "../../hooks/useImageEditorWidth";
import Image from "next/image";

type Props = {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  setStep: Dispatch<SetStateAction<number>>;
  handleSelectClick: MouseEventHandler<HTMLButtonElement>;
};

// Image sizing step
const SecondStep = ({ files, setFiles, setStep, handleSelectClick }: Props) => {
  const editorWidth = useImageEditorWidth();
  const editorRef = useRef<AvatarEditor>(null);
  // !should not be used directly. instead use switchImage function
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  // filled with 9 by default in case any new images are added
  const [scales, setScales] = useState<number[]>(Array(9).fill(1));
  const [rotations, setRotations] = useState<number[]>(Array(9).fill(0));

  // for images menu
  const [uneditedImages, setUneditedImages] = useState<File[]>(files);
  const [imageUrls, setImageUrls] = useState<string[]>();

  useEffect(() => {
    setImageUrls(files.map((file) => URL.createObjectURL(file)));

    // add new images
    setUneditedImages(
      files.map((file, i) => {
        if (i < uneditedImages.length) return uneditedImages[i] as File;
        return file;
      })
    );

    return () => {
      if (imageUrls) {
        imageUrls.forEach((url) => URL.revokeObjectURL(url));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const nextStep = () => {
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
    saveFileChanges();
    setCurrentFileIndex(index);
  };

  const rotateImage = () => {
    let newRotation = (rotations[currentFileIndex] as number) + 90;
    if (newRotation > 270) newRotation = 0;

    setRotations(
      rotations.map((rotation, i) => {
        if (i === currentFileIndex) return newRotation;
        return rotation;
      })
    );
  };

  const scaleImage = (value: number) => {
    setScales(
      scales.map((scale, i) => {
        if (i === currentFileIndex) return value;
        return scale;
      })
    );
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
          width={editorWidth}
          height={(editorWidth as number) - 50}
          className=" dark:bg-neutral-900"
          border={0}
          scale={scales[currentFileIndex]}
          rotate={rotations[currentFileIndex]}
        />
        {/* Previous button */}
        {currentFileIndex > 0 && (
          <div className="fixed inset-y-auto left-2">
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
          <div className="fixed inset-y-auto right-2">
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
        {/* Scale Slider */}
        <div className="fixed bottom-2 left-2">
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
                    min="0.5"
                    max="3"
                    step="0.1"
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
        {/* Rotation button */}
        <div className="fixed bottom-2 left-12">
          <button
            className="inline-flex w-full justify-center rounded-full bg-neutral-900 bg-opacity-70 p-2 text-white transition hover:bg-opacity-60 focus:outline-none"
            onClick={rotateImage}
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
                d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3"
              />
            </svg>
          </button>
        </div>
        {/* Images Menu button */}
        <div className="fixed bottom-2 right-2">
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

export default SecondStep;
