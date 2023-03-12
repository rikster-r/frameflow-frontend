import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import { env } from "../env/server.mjs";
import nookies from "nookies";
import {
  Layout,
  PostImagesGrid,
  Loader,
  SearchUsersSection,
} from "../components";
import { SWRConfig } from "swr";
import { useState } from "react";
import useSWR from "swr";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { userToken } = nookies.get(ctx);

    if (!userToken) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
      };
    }

    const userRes = await axios.get(
      `${env.NEXT_PUBLIC_API_HOST}/users/profile`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      props: {
        user: userRes.data as IUser,
      },
    };
  } catch (err) {
    return {
      props: {},
    };
  }
};

type Props = {
  user?: IUser;
};

const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data as IUser[]);

const SearchPage: NextPage = ({ user }: Props) => {
  const [searchToggled, setSearchToggled] = useState(false);
  const [query, setQuery] = useState("");
  const { data: results, isLoading } = useSWR<IUser[]>(
    query ? `${env.NEXT_PUBLIC_API_HOST}/users/search?username=${query}` : null,
    fetcher
  );

  if (!user) return <></>;

  return (
    <>
      <Head>
        <title>Search &bull; Frameflow</title>
        <meta name="description" content="Explore latest posts on Frameflow" />
      </Head>
      <SWRConfig value={{ fallback: { [`${env.NEXT_PUBLIC_API_HOST}/users/profile`]: user } }}>
        <Layout>
          <div className="w-full flex-1 justify-center sm:flex">
            <div className="my-4 flex w-full flex-col items-center sm:mx-6 sm:my-8">
              <div className="flex w-full items-center px-3">
                {searchToggled && (
                  <button
                    className="ml-2 mr-4"
                    onClick={() => setSearchToggled(false)}
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
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                      />
                    </svg>
                  </button>
                )}
                <div
                  className="relative w-full"
                  onClick={() => setSearchToggled(true)}
                >
                  <div className="absolute left-3 top-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5 text-neutral-500 dark:text-neutral-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="w-full rounded-xl bg-neutral-200 px-10 py-2 placeholder-neutral-500 focus:outline-none dark:bg-neutral-800 dark:placeholder-neutral-400"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-2.5">
                      <Loader />
                    </div>
                  )}
                  {!isLoading && query && (
                    <button
                      className="absolute right-3 top-2.5 rounded-full bg-neutral-400 p-0.5 dark:bg-neutral-200"
                      onClick={() => setQuery("")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        className="h-4 w-4 stroke-white dark:stroke-black"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
            {searchToggled ? (
              <SearchUsersSection results={results} isLoading={isLoading} />
            ) : (
              <PostImagesGrid path="/posts/latest" />
            )}
          </div>
        </Layout>
      </SWRConfig>
    </>
  );
};

export default SearchPage;
