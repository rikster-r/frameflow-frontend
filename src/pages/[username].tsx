import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import { env } from "../env/server.mjs";
import nookies from "nookies";
import { Layout, ProfileHeader, PostImage } from "../components";
import usePosts from "../hooks/usePosts";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { userToken } = nookies.get(ctx);
    const username = ctx.params?.username as string;

    const promises = [
      axios.get(`${env.NEXT_PUBLIC_API_HOST}/users/${username}`),
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

    const [pageOwnerRes, subscribersRes, userRes] = await Promise.all(promises);

    return {
      props: {
        user: userRes ? (userRes?.data as IUser) : null,
        pageOwner: pageOwnerRes?.data as IUser,
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
  subscribers?: IUser[];
};

const UserPage: NextPage = ({ user, pageOwner, subscribers }: Props) => {
  const { posts, err, loading } = usePosts(pageOwner?.username as string);

  if (!pageOwner || !subscribers || err || loading) return <></>;

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
        <Layout user={user as IUser}>
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
                    <PostImage
                      post={post}
                      key={post._id}
                      user={user}
                      postOwner={pageOwner}
                    />
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
