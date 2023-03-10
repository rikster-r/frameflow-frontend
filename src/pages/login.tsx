import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { type FormEventHandler, useState } from "react";
import { env } from "../env/server.mjs";
import axios, { type AxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { setCookie } from "nookies";

const Login: NextPage = () => {
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
      .post(`${env.NEXT_PUBLIC_API_HOST}/auth/login`, { username, password })
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
        <title>Login &bull; Frameflow</title>
        <meta
          name="description"
          content="Welcome back to FrameFlow. Login to check out more"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-neutral-100 py-6">
        <div className="w-full max-w-[400px] border-2 border-neutral-200 bg-white p-12 shadow-sm ">
          <h1 className="py-10 text-center font-logo text-6xl">Frameflow</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              id="username"
              className="mb-px w-full rounded-sm border-2 border-neutral-300 bg-neutral-100 px-4 py-2"
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
                className="mb-px w-full rounded-sm border-2 border-neutral-300 bg-neutral-100 px-4 py-2"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 z-10 font-semibold hover:text-neutral-400"
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
              Login
            </button>
          </form>
        </div>
        <div className="w-full max-w-[400px] border-2 border-neutral-200 bg-white py-6 text-center shadow-sm">
          <span className="mr-1">Don&apos;t have an account yet?</span>
          <Link href="/register" className="font-semibold text-blue-500">
            Register
          </Link>
        </div>
      </main>
    </>
  );
};

export default Login;
