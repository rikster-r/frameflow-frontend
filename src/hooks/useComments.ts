import { env } from "../env/server.mjs";
import axios from "axios";
import useSWR from "swr";

const getComments = (url: string) =>
  axios.get(url).then((res) => res?.data as IComment[]);

const useComments = (postId: string) => {
  const url = `${env.NEXT_PUBLIC_API_HOST}/posts/${postId}/comments`;
  const { data: comments, error } = useSWR<IComment[], Error>(url, getComments);

  return { comments, error };
};

export default useComments;
