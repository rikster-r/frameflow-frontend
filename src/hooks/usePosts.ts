/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { env } from "../env/server.mjs";
import axios from "axios";
import useSWR, { type Key, type Fetcher } from "swr";

const getPosts: Fetcher<IPost[], string> = (url: string) =>
  axios.get(url).then((res) => res?.data as IPost[]);

const usePosts = (username: string) => {
  const url: Key = `${env.NEXT_PUBLIC_API_HOST}/users/${username}/posts`;
  const { data, error, isLoading } = useSWR(url, getPosts);

  const posts = data as IPost[];
  const err = error as Error;
  const loading = isLoading as boolean;
  return { posts, err, loading };
};

export default usePosts;
