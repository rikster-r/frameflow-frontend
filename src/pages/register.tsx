import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { type FormEventHandler, useState } from "react";
import { env } from "../env/server.mjs";
import axios, { type AxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { setCookie } from "nookies";

const Register: NextPage = () => {
  const [publicName, setPublicName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [usernameErrors, setUsernameErrors] = useState<string[]>([]);
  const [password, setPassword] = useState<string>("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordShown, setPasswordShown] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setUsernameErrors([]);
    setPasswordErrors([]);

    axios
      .post(`${env.NEXT_PUBLIC_API_HOST}/auth/register`, {
        publicName,
        username,
        password,
      })
      .then(async (res) => {
        setCookie(null, "userToken", (res.data as { token: string }).token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          sameSite: "lax",
          path: "/",
        });

        await router.push("/");
      })
      .catch((err: AxiosError) => {
        type data = {
          issues: Array<{ message: string; path: string[] }>;
        };

        if (err.response?.status === 400) {
          (err.response.data as data).issues.forEach((issue) => {
            if (issue.path.includes("username")) {
              setUsernameErrors((prev) => [...prev, issue.message]);
            } else if (issue.path.includes("password")) {
              setPasswordErrors((prev) => [...prev, issue.message]);
            }
          });
        } else {
          toast.error("Something went wrong. Please try again");
        }
      });
  };

  return (
    <>
      <Head>
        <title>Register &bull; FrameFlow</title>
        <meta
          name="description"
          content="Register to check out photos of your friends"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-gray-100 py-6">
        <div className="w-full max-w-[400px] border-2 border-gray-200 bg-white p-12 shadow-sm">
          <h1 className="pt-10 pb-3 text-center font-logo text-5xl">
            FrameFlow
          </h1>
          <p className="pb-10 text-center font-semibold text-gray-500">
            Register to check out photos of your friends
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="publicName"
              id="publicName"
              className="mb-3 w-full rounded-sm border-2 border-gray-300 bg-gray-100 px-4 py-2"
              placeholder="Public Name (optional)"
              value={publicName}
              onChange={(e) => setPublicName(e.target.value)}
            />
            <input
              type="text"
              name="username"
              id="username"
              className="mb-px w-full rounded-sm border-2 border-gray-300 bg-gray-100 px-4 py-2"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {usernameErrors.map((err) => (
              <p key={err} className="font-semibold text-red-600">
                {err}
              </p>
            ))}
            <div className="relative mb-px mt-3">
              <input
                type={passwordShown ? "text" : "password"}
                name="password"
                id="password"
                className="mb-px w-full rounded-sm border-2 border-gray-300 bg-gray-100 px-4 py-2"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 z-10 font-semibold hover:text-gray-400"
                  onClick={() => setPasswordShown(!passwordShown)}
                >
                  {passwordShown ? "Hide" : "Show"}
                </button>
              )}
            </div>
            {passwordErrors.map((err) => (
              <p key={err} className="mb-3 font-semibold text-red-600">
                {err}
              </p>
            ))}
            <button className="mt-4 w-full rounded-lg bg-blue-500 py-2 text-white">
              Register
            </button>
          </form>
          <div className="inline-flex w-full items-center justify-center">
            <hr className="my-8 h-px w-64 border-0 bg-gray-400" />
            <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3 font-medium text-gray-500">
              OR
            </span>
          </div>
          <button className="flex w-full items-center justify-center gap-1 ">
            <svg
              className="h-8 w-8 scale-75"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M30.0014 16.3109C30.0014 15.1598 29.9061 14.3198 29.6998 13.4487H16.2871V18.6442H24.1601C24.0014 19.9354 23.1442 21.8798 21.2394 23.1864L21.2127 23.3604L25.4536 26.58L25.7474 26.6087C28.4458 24.1665 30.0014 20.5731 30.0014 16.3109Z"
                fill="#4285F4"
              ></path>
              <path
                d="M16.2863 29.9998C20.1434 29.9998 23.3814 28.7553 25.7466 26.6086L21.2386 23.1863C20.0323 24.0108 18.4132 24.5863 16.2863 24.5863C12.5086 24.5863 9.30225 22.1441 8.15929 18.7686L7.99176 18.7825L3.58208 22.127L3.52441 22.2841C5.87359 26.8574 10.699 29.9998 16.2863 29.9998Z"
                fill="#34A853"
              ></path>
              <path
                d="M8.15964 18.769C7.85806 17.8979 7.68352 16.9645 7.68352 16.0001C7.68352 15.0356 7.85806 14.1023 8.14377 13.2312L8.13578 13.0456L3.67083 9.64746L3.52475 9.71556C2.55654 11.6134 2.00098 13.7445 2.00098 16.0001C2.00098 18.2556 2.55654 20.3867 3.52475 22.2845L8.15964 18.769Z"
                fill="#FBBC05"
              ></path>
              <path
                d="M16.2864 7.4133C18.9689 7.4133 20.7784 8.54885 21.8102 9.4978L25.8419 5.64C23.3658 3.38445 20.1435 2 16.2864 2C10.699 2 5.8736 5.1422 3.52441 9.71549L8.14345 13.2311C9.30229 9.85555 12.5086 7.4133 16.2864 7.4133Z"
                fill="#EB4335"
              ></path>
            </svg>
            <p className="font-semibold text-gray-700">Login with Google</p>
          </button>
        </div>
        <div className="w-full max-w-[400px] border-2 border-gray-200 bg-white py-6 text-center shadow-sm">
          <span className="mr-1">Have an account?</span>
          <Link href="/login" className="font-semibold text-blue-500">
            Login
          </Link>
        </div>
      </main>
    </>
  );
};

export default Register;
