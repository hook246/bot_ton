import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import * as React from "react";
//import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { WalletModalProvider, WalletModalContext} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { SolongWalletAdapter } from "@solana/wallet-adapter-solong";
import { clusterApiUrl } from "@solana/web3.js";
import Header from "../components/header";
import Footer from "../components/footer";
import { SnackbarProvider } from 'notistack';

import {
  useConnection,
  useWallet,
  ConnectionContext,
  WalletContext,
} from "@solana/wallet-adapter-react";


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Layout({ children, customHeaderButton }) {
  const { publicKey, wallet, disconnect } = useWallet();
  window.walletDisconnect = disconnect
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const wallets = [];
  //window.solanaWalletConnect = useWallet()
  // const { publicKey, sendTransaction } = useWallet();

  return (

          <ThemeProvider theme={defaultTheme}>
            <SnackbarProvider maxSnack={10}>
              <CssBaseline />
              <Header size="small" customButton={customHeaderButton} />
              <div className="container" style={{minHeight: '600px'}}>
                {children}
              </div>

              {/* <Footer /> */}
            </SnackbarProvider>
          </ThemeProvider>

  );
}
