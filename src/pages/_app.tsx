import { type AppType } from "next/dist/shared/lib/utils";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
