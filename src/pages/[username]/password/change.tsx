/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import axios, { isAxiosError } from "axios";
import nookies, { parseCookies } from "nookies";
import { env } from "../../../env/server.mjs";
import { Layout, Avatar } from "../../../components";
import { SWRConfig } from "swr";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, type FormEventHandler } from "react";
import { toast } from "react-toastify";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const username = ctx.params?.username as string;
    const { userToken } = nookies.get(ctx);

    if (!userToken) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
      };
    }

    const userRes = await axios.get(
      `${env.NEXT_PUBLIC_API_HOST}/users/profile`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    const user = userRes.data as IUser;

    if (username !== user.username) {
      return {
        redirect: {
          permanent: true,
          destination: "/",
        },
      };
    }

    return {
      props: {
        user,
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
};

const SettingsPage: NextPage = ({ user }: Props) => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  if (!user) return <></>;

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!currentPassword || !password || !passwordConfirm) return;

    if (password !== passwordConfirm) {
      toast.error("Passwords don't match");
      return;
    }

    const { userToken } = parseCookies();
    if (!userToken) return;

    axios
      .put(
        `${env.NEXT_PUBLIC_API_HOST}/users/${user._id}/password`,
        {
          currentPassword,
          password,
          passwordConfirm,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(() => {
        toast.success("Succesfully updated password");
      })
      .catch((err) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (isAxiosError(err) && err.response?.data?.message) {
          // basically only for if password is incorrect
          toast.error(err.response.data.message as string);
        } else {
          toast.error("Had trouble updating password");
        }
      });
  };

  return (
    <>
      <Head>
        <title>Edit profile &bull; Frameflow</title>
      </Head>
      <SWRConfig
        value={{
          fallback: { [`${env.NEXT_PUBLIC_API_HOST}/users/profile`]: user },
        }}
      >
        <Layout>
          <div className="w-full flex-1 justify-center sm:flex">
            <div className="flex w-full max-w-[900px] rounded-md border-neutral-200 dark:border-neutral-700 sm:mx-6 sm:my-8 sm:border">
              <div className="hidden flex-col border-r border-neutral-200 py-8 dark:border-neutral-700 md:flex">
                <Link
                  href={`/${user.username}/edit`}
                  className={`${
                    router.pathname.includes("edit")
                      ? "border-black font-semibold dark:border-white"
                      : "border-white hover:border-neutral-400 hover:bg-neutral-100 dark:border-black dark:hover:border-neutral-500 dark:hover:bg-neutral-900"
                  } border-l-2 py-3 px-10`}
                >
                  Edit profile
                </Link>
                <Link
                  href={`/${user.username}/password/change`}
                  className={`${
                    router.pathname.includes("password/change")
                      ? "border-black font-semibold dark:border-white"
                      : "border-white hover:border-neutral-400 hover:bg-neutral-100 dark:border-black dark:hover:border-neutral-500 dark:hover:bg-neutral-900"
                  } border-l-2 py-3 px-10`}
                >
                  Change password
                </Link>
              </div>
              <div className="flex-1 py-8 px-4">
                <div className="mb-8 mr-6 hidden grid-cols-[max-content_300px] items-center justify-center gap-6 sm:ml-32 sm:grid">
                  <Avatar
                    className="inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full align-middle"
                    user={user}
                  />
                  <p className="w-full">{user.username}</p>
                </div>
                <form
                  className="grid grid-cols-1 place-content-center items-center gap-3 sm:grid-cols-[max-content_300px] sm:gap-6"
                  onSubmit={handleSubmit}
                >
                  <p className="font-semibold sm:text-right">
                    Current password
                  </p>
                  <input
                    type="text"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-[inherit] px-3 py-1.5 placeholder-neutral-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-neutral-700 dark:focus:border-blue-300"
                  />

                  <p className="mt-4 font-semibold sm:mt-0 sm:text-right">
                    New password
                  </p>
                  <input
                    type="text"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-[inherit] px-3 py-1.5 placeholder-neutral-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-neutral-700 dark:focus:border-blue-300"
                  />

                  <p className="mt-4 font-semibold sm:mt-0 sm:text-right">
                    Confirm password
                  </p>
                  <input
                    type="text"
                    name="passwordConfirm"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-[inherit] px-3 py-1.5 placeholder-neutral-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-neutral-700 dark:focus:border-blue-300"
                  />

                  <button
                    disabled={
                      currentPassword.trim() === "" ||
                      password.trim() === "" ||
                      passwordConfirm.trim() === ""
                    }
                    className="w-max justify-self-end rounded-lg bg-blue-500 px-5 py-2 font-semibold capitalize tracking-wide text-white hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 disabled:opacity-70 disabled:hover:bg-blue-500 sm:col-start-2"
                  >
                    Change password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Layout>
      </SWRConfig>
    </>
  );
};

export default SettingsPage;
