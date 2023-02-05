import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Context } from "../../App";
import Torus from "@toruslabs/torus-embed";
import { sequence } from "0xsequence";

function Wallet() {
  const [address, setAddress] = useState(null);
  const state = useContext(Context);

  const providerOptions = {
    /* See Provider Options Section */ injected: {
      display: {
        name: "Default Wallet",
        description: "Connect with the provider in your Browser",
      },
      options: {
        networkParams: {
          chainId: "137", // default: 1
          networkName: "Matic Mainnet",
        },
      },
      package: null,
    },

    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", // required
      },
    },
    torus: {
      package: Torus, // required
      display: {
        description: "Create your wallet with torus",
      },
      options: {
        networkParams: {
          chainId: "137", // default: 1
          networkName: "Matic Mainnet",
        },
      },
    },
    sequence: {
      package: sequence, // required
      display: {
        description: "Google Signin supported",
      },
      options: {
        appName: "Warp", // optional
        defaultNetwork: "polygon", // optional
      },
    },
  };

  return async function getWeb3() {
    const web3Modal = new Web3Modal({
      disableInjectedProvider: false,
      network: "mainnet", // optional
      cacheProvider: false, // optional
      providerOptions, // required
      theme: "dark",
    });

    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log(address);
    setAddress(address);
    state.setDatabase({
      ...state.database,
      wallet: address,
      signer: signer,
    });

    instance.on("accountsChanged", console.log("ACCOunt Changed"));
    instance.on("chainChanged", console.log("Chain Changed"));
    instance.on("networkChanged", console.log("Network Changed"));
  };
}

export default Wallet;
