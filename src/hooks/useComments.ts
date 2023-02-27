/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { env } from "../env/server.mjs";
import axios from "axios";
import useSWR, { type Key, type Fetcher } from "swr";

const getComments: Fetcher<IComment[], string> = (url: string) =>
  axios.get(url).then((res) => res?.data as IComment[]);

const useComments = (postId: string) => {
  const url: Key = `${env.NEXT_PUBLIC_API_HOST}/posts/${postId}/comments`;
  const { data, error, isLoading } = useSWR(url, getComments);

  const comments = data as IComment[];
  const err = error as Error;
  const loading = isLoading as boolean;
  return { comments, err, loading };
};

export default useComments;
