import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'
import "react-toggle/style.css"
import { wrapper } from '../store/index';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function MyApp({ Component, pageProps }) {

  return (
    <PayPalScriptProvider deferLoading={true}>
      <Component {...pageProps} />
    </PayPalScriptProvider>
  )
}
export default wrapper.withRedux(MyApp);
