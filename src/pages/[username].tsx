import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import { env } from "../env/server.mjs";
import nookies from "nookies";
import { Layout, ProfileHeader } from "../components";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { userToken } = nookies.get(ctx);

    const promises = [
      //get page owner
      axios.get(
        `${env.NEXT_PUBLIC_API_HOST}/users/${ctx.params?.username as string}`
      ),
      //get page owner posts
      axios.get(
        `${env.NEXT_PUBLIC_API_HOST}/users/${
          ctx.params?.username as string
        }/posts`
      ),
    ];

    if (userToken) {
      promises.push(
        // get user
        axios.get(`${env.NEXT_PUBLIC_API_HOST}/users/profile`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
      );
    }

    const [pageOwnerRes, postsRes, userRes] = await Promise.all(promises);

    return {
      props: {
        user: userRes?.data as IUser,
        pageOwner: pageOwnerRes?.data as IUser,
        posts: postsRes?.data as IPost,
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
};

const UserPage: NextPage = ({ user, pageOwner }: Props) => {
  return (
    <>
      <Head>
        <title>@{pageOwner?.username} &bull; Frameflow</title>
      </Head>
      {/* renders header always if not logged in */}
      <div
        className={`flex min-h-screen flex-col dark:bg-black dark:text-neutral-100 ${
          user ? " sm:flex-row" : ""
        }`}
      >
        <Layout user={user as IUser}>
          <div className="w-full flex-1 justify-center sm:flex">
            <div className="my-4 flex w-full max-w-[900px] flex-col items-center sm:mx-6 sm:my-12">
              <ProfileHeader
                user={user as IUser}
                pageOwner={pageOwner as IUser}
              />
              <main></main>
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
};

export default UserPage;
