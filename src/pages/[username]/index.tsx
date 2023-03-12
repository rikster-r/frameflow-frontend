import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import { env } from "../../env/server.mjs";
import nookies from "nookies";
import { Layout, ProfileHeader, PostImagesGrid } from "../../components";
import { SWRConfig } from "swr";
import { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { userToken } = nookies.get(ctx);
    const username = ctx.params?.username as string;

    const promises = [
      axios.get(`${env.NEXT_PUBLIC_API_HOST}/users/${username}`),
      axios.get(`${env.NEXT_PUBLIC_API_HOST}/users/${username}/followers`),
      axios.get(`${env.NEXT_PUBLIC_API_HOST}/users/${username}/posts`),
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

    const [pageOwnerRes, followersRes, postsRes, userRes] = await Promise.all(
      promises
    );

    return {
      props: {
        user: userRes ? (userRes?.data as IUser) : null,
        pageOwner: pageOwnerRes?.data as IUser,
        followers: followersRes?.data as IUser[],
        posts: postsRes?.data as IPost[],
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
  followers?: IUser[];
  posts?: IPost[];
};

const UserPage: NextPage = ({ user, pageOwner, followers, posts }: Props) => {
  useEffect(() => {
    if (
      !user ||
      !pageOwner ||
      user._id === pageOwner._id ||
      user.visited.includes(pageOwner._id)
    )
      return;

    const newVisitedList = user.visited.concat();
    newVisitedList.push(pageOwner._id);

    axios
      .put(`${env.NEXT_PUBLIC_API_HOST}/users/${user._id}/visited`, {
        visited: newVisitedList,
      })
      .catch((err) => {
        console.error("Error updating visited list");
      });
  }, []);

  if (!pageOwner || !followers) return <></>;

  return (
    <>
      <Head>
        <title>{`@${pageOwner.username} \u2022 Frameflow`}</title>
        <meta
          name="description"
          content={`View photos of ${pageOwner.publicName}`}
        />
      </Head>
      <SWRConfig
        value={{
          fallback: { [`${env.NEXT_PUBLIC_API_HOST}/users/profile`]: user },
        }}
      >
        <Layout>
          <div className="w-full flex-1 justify-center sm:flex">
            <div className="my-4 flex w-full max-w-[900px] flex-col items-center sm:mx-6 sm:my-8">
              <SWRConfig
                value={{
                  fallback: {
                    [`${env.NEXT_PUBLIC_API_HOST}/users/${pageOwner.username}/posts`]:
                      posts,
                    [`${env.NEXT_PUBLIC_API_HOST}/users/${pageOwner.username}/followers`]:
                      followers,
                  },
                }}
              >
                <ProfileHeader pageOwner={pageOwner} />
              </SWRConfig>

              <main>
                <SWRConfig
                  value={{
                    fallback: {
                      [`${env.NEXT_PUBLIC_API_HOST}/users/${pageOwner.username}/posts`]:
                        posts,
                    },
                  }}
                >
                  <PostImagesGrid path={`/users/${pageOwner.username}/posts`} />
                </SWRConfig>
              </main>
            </div>
          </div>
        </Layout>
      </SWRConfig>
    </>
  );
};

export default UserPage;
