import "./App.css";
import Layout from "./layouts";
import HomePage from "./pages/home";
import { TonConnectButton, TonConnectUIProvider, THEME} from '@tonconnect/ui-react';
import FloatingWalletComponent from "./components/testTon";

export default function App() {
  return (
    <HomePage>
                       {/* <TonConnectUIProvider manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"> */}

        <div className="app">

        {/* <FloatingWalletComponent/> */}
        </div>
        
          {/* </TonConnectUIProvider> */}
    </HomePage>
  );
}
