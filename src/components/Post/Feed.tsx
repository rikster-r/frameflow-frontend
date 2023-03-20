import axios from "axios";
import { env } from "../../env/server.mjs";
import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";
import useUser from "../../hooks/useUser";
import { SWRConfig } from "swr";
import { FeedPost, Loader } from "..";

const getPosts = (url: string) =>
  axios.get(url).then((res) => res?.data as IPost[]);

const Feed = () => {
  const [hasMore, setHasMore] = useState(true);
  const { user } = useUser();
  const {
    data: posts,
    error,
    isLoading,
    size,
    setSize,
    mutate,
  } = useSWRInfinite<IPost[], Error>((index, data: IPost[]) => {
    if (!user || (data && !data.length)) {
      setHasMore(false);
      return null;
    }
    return `${env.NEXT_PUBLIC_API_HOST}/users/${user.username}/feed?page=${index}&perPage=20`;
  }, getPosts);

  if (isLoading) return <Loader />;

  if (error || !posts)
    return (
      <div className="self-start text-lg">
        Some error happened while trying to retrieve posts
      </div>
    );

  if (posts.at(0)?.length === 0)
    return (
      <div className="self-start text-lg">
        You&apos;re not currently following anyone with active posts.
      </div>
    );

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={() => setSize(size + 1)}
      hasMore={hasMore}
      loader={
        <div className="inline-flex">
          <Loader />
        </div>
      }
      className="scrollbar-hide flex w-full max-w-[470px] flex-col items-center gap-8 divide-y divide-neutral-200 dark:divide-neutral-800"
    >
      {posts.map((postsArr) =>
        postsArr.map((post) => (
          <SWRConfig
            key={post._id}
            value={{
              fallback: {
                [`${env.NEXT_PUBLIC_API_HOST}/posts/${post._id}`]: post,
              },
            }}
          >
            <FeedPost postId={post._id} mutatePosts={mutate} />
          </SWRConfig>
        ))
      )}
    </InfiniteScroll>
  );
};

export default Feed;
