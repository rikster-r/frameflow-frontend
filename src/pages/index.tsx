import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import { env } from "../env/server.mjs";
import nookies from "nookies";
import { Layout, Feed, UserSuggestions } from "../components";
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

    const userRes = await axios.get(
      `${env.NEXT_PUBLIC_API_HOST}/users/profile`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    const user = userRes.data as IUser;

    const followersRes = await axios.get(
      `${env.NEXT_PUBLIC_API_HOST}/users/${user.username}/followers`
    );

    return {
      props: {
        user,
        followers: followersRes.data as IUser[],
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
  followers?: IUser[];
  posts?: IPost[];
};

const Home: NextPage = ({ user, followers }: Props) => {
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
          <main className="flex flex-1 gap-16 sm:pt-2 justify-center">
            <Feed />
            <div className="hidden flex-col gap-3 self-start pt-5 pr-12 lg:flex lg:w-[350px]">
              <SWRConfig
                value={{
                  fallback: {
                    [`${env.NEXT_PUBLIC_API_HOST}/users/${user.username}/followers`]:
                      followers,
                  },
                }}
              >
                <UserSuggestions />
              </SWRConfig>
            </div>
          </main>
        </Layout>
      </SWRConfig>
    </>
  );
};

export default Home;
