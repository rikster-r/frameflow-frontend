import { env } from "../env/server.mjs";
import axios from "axios";
import useSWR from "swr";

const getFollowers = (url: string) =>
  axios.get(url).then((res) => res?.data as IUser[]);

const useFollowers = (username: string) => {
  const url = `${env.NEXT_PUBLIC_API_HOST}/users/${username}/followers`;
  const {
    data: followers,
    error,
    mutate,
  } = useSWR<IUser[], Error>(url, getFollowers);

  return { followers, error, mutate };
};

export default useFollowers;
