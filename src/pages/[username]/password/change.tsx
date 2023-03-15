import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import nookies from "nookies";
import { env } from "../../../env/server.mjs";
import { Layout, Settings } from "../../../components";
import { SWRConfig } from "swr";
import Link from "next/link";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const username = ctx.params?.username as string;
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

    const user = userRes.data as IUser;

    if (username !== user.username) {
      return {
        redirect: {
          permanent: true,
          destination: "/",
        },
      };
    }

    return {
      props: {
        user,
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

const SettingsPage: NextPage = ({ user }: Props) => {
  const router = useRouter();
  if (!user) return <></>;

  return (
    <>
      <Head>
        <title>Edit profile &bull; Frameflow</title>
      </Head>
      <SWRConfig
        value={{
          fallback: { [`${env.NEXT_PUBLIC_API_HOST}/users/profile`]: user },
        }}
      >
        <Layout>
          <div className="w-full flex-1 justify-center sm:flex">
            <div className="flex w-full max-w-[900px] rounded-md border-neutral-200 dark:border-neutral-700 sm:mx-6 sm:my-8 sm:border">
              <div className="hidden flex-col border-r border-neutral-200 py-8 dark:border-neutral-700 md:flex">
                <Link
                  href={`/${user.username}/edit`}
                  className={`${
                    router.pathname.includes("edit")
                      ? "border-black font-semibold dark:border-white"
                      : "border-white hover:border-neutral-400 hover:bg-neutral-100 dark:border-black dark:hover:border-neutral-500 dark:hover:bg-neutral-900"
                  } border-l-2 py-3 px-10`}
                >
                  Edit profile
                </Link>
                <Link
                  href={`/${user.username}/password/change`}
                  className={`${
                    router.pathname.includes("password/change")
                      ? "border-black font-semibold dark:border-white"
                      : "border-white hover:border-neutral-400 hover:bg-neutral-100 dark:border-black dark:hover:border-neutral-500 dark:hover:bg-neutral-900"
                  } border-l-2 py-3 px-10`}
                >
                  Change password
                </Link>
              </div>
            </div>
          </div>
        </Layout>
      </SWRConfig>
    </>
  );
};

export default SettingsPage;
