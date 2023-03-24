import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import nookies from "nookies";
import { env } from "../env/server.mjs";
import { Layout, PostImagesGrid } from "../components";
import { SWRConfig } from "swr";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { userToken } = nookies.get(ctx);

    const userRes = userToken
      ? await axios.get(`${env.NEXT_PUBLIC_API_HOST}/users/profile`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
      : null;

    return {
      props: {
        user: userRes ? (userRes?.data as IUser) : null,
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

const ExplorePage: NextPage = ({ user }: Props) => {
  return (
    <>
      <Head>
        <title>Explore &bull; Frameflow</title>
        <meta name="description" content="Explore latest posts on Frameflow" />
      </Head>
      <SWRConfig
        value={{
          fallback: { [`${env.NEXT_PUBLIC_API_HOST}/users/profile`]: user },
        }}
      >
        <Layout>
          <div className="w-full flex-1 justify-center sm:flex">
            <main className="my-4 flex w-full max-w-[900px] flex-col items-center sm:mx-6 sm:my-8">
              <PostImagesGrid path="/posts/latest" />
            </main>
          </div>
        </Layout>
      </SWRConfig>
    </>
  );
};

export default ExplorePage;
