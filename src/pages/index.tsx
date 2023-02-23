import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import { env } from "../env/server.mjs";
import nookies from "nookies";
import { Layout } from "../components";

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
      <Layout user={user}>
        <main className="flex-1 sm:flex sm:flex-grow-0">
          {/* main scroll */}
        </main>
        <div className="hidden lg:flex">{/* latest users */}</div>
      </Layout>
    </>
  );
};

export default Home;
