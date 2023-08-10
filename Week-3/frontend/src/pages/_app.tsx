import { type AppType } from "next/app";

import '~/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css';

const MyApp: AppType<{}> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default MyApp;