import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import { env } from "../../env/server.mjs";
import nookies from "nookies";
import { Layout, ProfileHeader, PostImagesGrid } from "../../components";
import { SWRConfig } from "swr";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { userToken } = nookies.get(ctx);
    const username = ctx.params?.username as string;

    const promises = [
      axios.get(`${env.NEXT_PUBLIC_API_HOST}/users/${username}`),
      axios.get(`${env.NEXT_PUBLIC_API_HOST}/users/${username}/followers`),
      axios.get(`${env.NEXT_PUBLIC_API_HOST}/users/${username}/saved`),
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

    const [pageOwnerRes, followersRes, savedPostsRes, userRes] =
      await Promise.all(promises);

    if (
      (userRes?.data as IUser)?.username !==
      (pageOwnerRes?.data as IUser)?.username
    ) {
      return {
        redirect: {
          permanent: true,
          destination: `/${(pageOwnerRes?.data as IUser).username}`,
        },
      };
    }

    return {
      props: {
        user: userRes ? (userRes?.data as IUser) : null,
        followers: followersRes?.data as IUser[],
        posts: savedPostsRes?.data as IPost[],
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
  followers?: IUser[];
  posts?: IPost[];
};

const SavedPage: NextPage = ({ user, followers, posts }: Props) => {
  if (!user || !followers || !posts) return <></>;

  return (
    <>
      <Head>
        <title>{`@${user.username} \u2022 Frameflow`}</title>
        <meta
          name="description"
          content={`View saved posts of ${user.username}`}
        />
      </Head>
      <div
        className={`flex min-h-screen flex-col dark:bg-black dark:text-neutral-100 ${
          user ? " sm:flex-row" : ""
        }`}
      >
        <SWRConfig value={{ fallback: { user } }}>
          <Layout>
            <div className="w-full flex-1 justify-center sm:flex">
              <div className="my-4 flex w-full max-w-[900px] flex-col items-center sm:mx-6 sm:my-8">
                <SWRConfig value={{ fallback: { posts, followers } }}>
                  <ProfileHeader pageOwner={user} />
                </SWRConfig>

                <main className="grid w-full grid-cols-3 gap-1 md:gap-7">
                  <SWRConfig value={{ fallback: { posts } }}>
                    <PostImagesGrid pageOwner={user} path="saved" />
                  </SWRConfig>
                </main>
              </div>
            </div>
          </Layout>
        </SWRConfig>
      </div>
    </>
  );
};

export default SavedPage;
