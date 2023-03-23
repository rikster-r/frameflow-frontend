import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import { env } from "../env/server.mjs";
import nookies from "nookies";
import { Layout, NotificationsUsersSection } from "../components";
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

const NotificationsPage = ({ user }: Props) => {
  if (!user) return <></>;

  return (
    <>
      <Head>
        <title>Search &bull; Frameflow</title>
        <meta name="description" content="Explore latest posts on Frameflow" />
      </Head>
      <SWRConfig
        value={{
          fallback: { [`${env.NEXT_PUBLIC_API_HOST}/users/profile`]: user },
        }}
      >
        <Layout>
          <div className="w-full flex-1 justify-center sm:flex">
            <NotificationsUsersSection />
          </div>
        </Layout>
      </SWRConfig>
    </>
  );
};

export default NotificationsPage;
