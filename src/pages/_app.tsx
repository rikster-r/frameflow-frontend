import { type AppType } from "next/dist/shared/lib/utils";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface IUser {
  id: string;
  __v: number;
  publicName: string;
  username: string;
  password: string;
  image: string;
  follows: string[];
  visited: string[];
  savedPosts: string[];
}

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        hideProgressBar={true}
        autoClose={2000}
        position="bottom-right"
      />
    </>
  );
};

export default MyApp;
