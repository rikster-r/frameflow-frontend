import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import { env } from "../env/server.mjs";
import nookies from "nookies";
import { Layout, Feed } from "../components";
import { SWRConfig } from "swr";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { userToken } = nookies.get(ctx);
    if (!userToken) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
        props: {},
      };
    }

    const res = await axios.get(`${env.NEXT_PUBLIC_API_HOST}/users/profile`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return {
      props: {
        user: res.data as IUser,
      },
    };
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }
};

type Props = {
  user?: IUser;
};

const Home: NextPage = ({ user }: Props) => {
  if (!user) return <></>;

  return (
    <>
      <Head>
        <title>Frameflow</title>
        <meta name="description" content="Photos from all over the world" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SWRConfig
        value={{
          fallback: { [`${env.NEXT_PUBLIC_API_HOST}/users/profile`]: user },
        }}
      >
        <Layout>
          <main className="flex flex-1 items-center justify-center py-4">
            <Feed />
          </main>
          <div className="hidden lg:flex">{/* users who follow you */}</div>
        </Layout>
      </SWRConfig>
    </>
  );
};

export default Home;
