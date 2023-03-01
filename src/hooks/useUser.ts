import { env } from "../env/server.mjs";
import axios from "axios";
import useSWR, { type Fetcher } from "swr";
import { parseCookies } from "nookies";

const getUser: Fetcher<IUser, string> = (url: string) => {
  const { userToken } = parseCookies();
  if (!userToken) throw new Error("Unauhthorized");

  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
    .then((res) => res?.data as IUser);
};

const useUser = () => {
  const url = `${env.NEXT_PUBLIC_API_HOST}/users/profile`;
  const { data: user, error, isLoading } = useSWR<IUser, Error>(url, getUser);

  return { user, error, isLoading };
};

export default useUser;
