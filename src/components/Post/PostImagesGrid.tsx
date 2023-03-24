import { PostGridImage, Loader } from "..";
import useSWRInfinite from "swr/infinite";
import axios from "axios";
import { env } from "../../env/server.mjs";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = {
  path: string;
};

const getPosts = (url: string) =>
  axios.get(url).then((res) => res?.data as IPost[]);

const PostImagesGrid = ({ path }: Props) => {
  const [hasMore, setHasMore] = useState(true);
  const {
    data: posts,
    error,
    mutate,
    size,
    setSize,
  } = useSWRInfinite<IPost[], Error>((index, data: IPost[]) => {
    if (data && !data.length) {
      setHasMore(false);
      return null;
    }
    return `${env.NEXT_PUBLIC_API_HOST}${path}?page=${index}&perPage=10`;
  }, getPosts);
  const router = useRouter();
  const loadCondition = router.pathname === "/explore";

  if (error || !posts) return <></>;

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={() => setSize(size + 1)}
      hasMore={loadCondition && hasMore}
      loader={loadCondition ? <Loader /> : null}
      className="scrollbar-hide grid w-full grid-cols-3 place-items-center gap-1 overflow-hidden md:gap-7"
    >
      {posts.map((postsArr) =>
        postsArr.map((post) => (
          <PostGridImage
            mutatePosts={mutate}
            post={post}
            key={post._id}
            postOwner={post.author as IUser}
          />
        ))
      )}
    </InfiniteScroll>
  );
};

export default PostImagesGrid;
