import { env } from "../env/server.mjs";
import axios from "axios";
import useSWR from "swr";

const getPosts = (url: string) =>
  axios.get(url).then((res) => res?.data as IPost[]);

const usePosts = (username: string) => {
  const url = `${env.NEXT_PUBLIC_API_HOST}/users/${username}/posts`;
  const { data: posts, error } = useSWR<IPost[], Error>(url, getPosts);

  return { posts, error };
};

export default usePosts;
