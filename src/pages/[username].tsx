import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import { env } from "../env/server.mjs";
import nookies from "nookies";
import { Layout, ProfileHeader } from "../components";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment } from "react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { userToken } = nookies.get(ctx);
    const username = ctx.params?.username as string;

    const promises = [
      axios.get(`${env.NEXT_PUBLIC_API_HOST}/users/${username}`),
      axios.get(`${env.NEXT_PUBLIC_API_HOST}/users/${username}/posts`),
      axios.get(`${env.NEXT_PUBLIC_API_HOST}/users/${username}/subscribers`),
    ];

    if (userToken) {
      promises.push(
        axios.get(`${env.NEXT_PUBLIC_API_HOST}/users/profile`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
      );
    }

    const [pageOwnerRes, postsRes, subscribersRes, userRes] = await Promise.all(
      promises
    );

    return {
      props: {
        user: userRes?.data as IUser,
        pageOwner: pageOwnerRes?.data as IUser,
        posts: postsRes?.data as IPost,
        subscribers: subscribersRes?.data as IUser[],
      },
    };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 400) {
      return {
        notFound: true,
      };
    }

    return {
      props: {},
    };
  }
};

type Props = {
  user?: IUser;
  pageOwner?: IUser;
  posts?: IPost[];
  subscribers?: IUser[];
};

const UserPage: NextPage = ({ user, pageOwner, posts, subscribers }: Props) => {
  const [open, setOpen] = useState(false);
  const formatter = Intl.NumberFormat("en-US", { notation: "compact" });

  // typescript check
  if (!pageOwner || !user || !posts || !subscribers) return <></>;

  return (
    <>
      <Head>
        <title>{`@${pageOwner.username} \u2022 Frameflow`}</title>
        <meta
          name="description"
          content={`View photos of ${pageOwner.publicName}`}
        />
      </Head>
      {/* renders header always if not logged in */}
      <div
        className={`flex min-h-screen flex-col dark:bg-black dark:text-neutral-100 ${
          user ? " sm:flex-row" : ""
        }`}
      >
        <Layout user={user}>
          <div className="w-full flex-1 justify-center sm:flex">
            <div className="my-4 flex w-full max-w-[900px] flex-col items-center sm:mx-6 sm:my-8">
              <ProfileHeader
                user={user}
                pageOwner={pageOwner}
                posts={posts}
                subscribers={subscribers}
              />

              <main className="grid w-full grid-cols-3 gap-1 md:gap-7">
                {posts.map((post) => {
                  return (
                    <div className="relative" key={post._id}>
                      <button
                        className="group relative filter hover:bg-gray-700"
                        onClick={() => setOpen(true)}
                      >
                        <Image
                          src={post.images.at(0) as string}
                          alt=""
                          className="h-full w-full object-cover group-hover:brightness-75"
                          width={200}
                          height={200}
                        />
                        <div className="absolute inset-0 hidden items-center justify-center gap-8 text-lg font-semibold text-white group-hover:inline-flex">
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="h-6 w-6"
                            >
                              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                            </svg>
                            <p>{formatter.format(post.likedBy.length)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="h-6 w-6"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.337 21.718a6.707 6.707 0 01-.533-.074.75.75 0 01-.44-1.223 3.73 3.73 0 00.814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 01-4.246.997z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {/* todo comments */}
                            <p>0</p>
                          </div>
                        </div>
                      </button>
                      <Transition.Root show={open} as={Fragment}>
                        <Dialog
                          as="div"
                          className="relative z-10"
                          onClose={() => setOpen(false)}
                        >
                          <Transition.Child
                            as={Fragment}
                            enter="ease-in duration-100"
                            enterFrom="opacity-0"
                            enterTo="opacity-40"
                            leave="ease-out duration-100"
                            leaveFrom="opacity-40"
                            leaveTo="opacity-0"
                          >
                            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
                          </Transition.Child>

                          <div className="fixed inset-0 z-10 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                              <Transition.Child
                                as={Fragment}
                                enter="linear duration-200"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-110"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="linear duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-110"
                              >
                                <Dialog.Panel className="relative flex h-[400px] w-full max-w-[350px] transform flex-col overflow-hidden rounded-lg bg-white text-left shadow-xl  transition-all dark:bg-neutral-800  dark:text-gray-50 md:h-[450px] md:max-w-[450px] 2xl:h-[600px] 2xl:max-w-[600px]">
                                  {/* todo post showcase */}
                                </Dialog.Panel>
                              </Transition.Child>
                              <Dialog.Panel className="fixed right-5 top-5 text-white">
                                <button onClick={() => setOpen(false)}>
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
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </Dialog.Panel>
                            </div>
                          </div>
                        </Dialog>
                      </Transition.Root>
                    </div>
                  );
                })}
              </main>
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
};

export default UserPage;
