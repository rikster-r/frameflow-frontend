import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import nookies from "nookies";
import { env } from "../../env/server.mjs";
import { Layout, PostView, ConditionalWrapper } from "../../components";
import useSWR, { SWRConfig } from "swr";
import useWindowWidth from "../../hooks/useWindowWidth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { userToken } = nookies.get(ctx);
    const postId = ctx.params?.id as string;

    const promises = [axios.get(`${env.NEXT_PUBLIC_API_HOST}/posts/${postId}`)];

    if (userToken) {
      promises.push(
        axios.get(`${env.NEXT_PUBLIC_API_HOST}/users/profile`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
      );
    }

    const [postRes, userRes] = await Promise.all(promises);

    return {
      props: {
        user: userRes ? (userRes?.data as IUser) : null,
        post: postRes?.data as IPost,
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
  post?: IPost;
  comments?: IComment[];
};

const getComments = (url: string) =>
  axios.get(url).then((res) => res?.data as IComment[]);

const PostPage: NextPage = ({ user, post }: Props) => {
  const windowWidth = useWindowWidth();
  const { data: comments } = useSWR<IComment[]>(
    post ? `${env.NEXT_PUBLIC_API_HOST}/posts/${post._id}/comments` : null,
    getComments
  );

  if (!post) return <></>;

  const postOwner = post.author as IUser;

  return (
    <>
      <Head>
        <title>{`${post.text || postOwner.username} \u2022 Frameflow`}</title>
        <meta
          name="description"
          content={`View post of ${postOwner.username}`}
        />
      </Head>
      <SWRConfig
        value={{
          fallback: { [`${env.NEXT_PUBLIC_API_HOST}/users/profile`]: user },
        }}
      >
        <ConditionalWrapper
          condition={windowWidth > 768}
          wrap1={(children) => <Layout>{children}</Layout>}
          wrap2={(children) => <>{children}</>}
        >
          <main className="w-full flex-1 items-center justify-center sm:flex">
            <SWRConfig
              value={{
                fallback: {
                  [`${env.NEXT_PUBLIC_API_HOST}/posts/${post._id}`]: post,
                },
              }}
            >
              <PostView
                postId={post._id}
                postOwner={postOwner}
                comments={comments}
              />
            </SWRConfig>
          </main>
        </ConditionalWrapper>
      </SWRConfig>
    </>
  );
};

export default PostPage;
