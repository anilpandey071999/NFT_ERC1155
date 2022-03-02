import "../styles/globals.css";
// import '../styles/load.css'
import Link from "next/link";
import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { nftaddress, nftmarketaddress } from "../config";
import Market from "../artifacts/contracts/NFT_Market.sol/MindDefMarketPlace.json";

import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

function MyApp({ Component, pageProps }) {
  const [account, setAccount] = useState(null);
  const [ownerAccount, setOwnerAccount] = useState(null);

  useEffect(() => {
    walletconnect();
  });

  const walletconnect = async () => {
    console.log("walletconnect");
    // Create a connector
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    });

    // Check if connection is already established
    if (!connector.connected) {
      // create new session
      connector.createSession();
    }
    // Subscribe to connection events
    connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }

      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
      console.log("connect", accounts, chainId);
      setAccount(accounts);
    });

    connector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }

      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];
      console.log(accounts, chainId);
    });

    connector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }

      // Delete connector
    });

    const { accounts, chainId } = await connector.connect();
    console.log(accounts, chainId);
  };
  const getAccount = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    let MarketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer
    );
    let owner = await MarketContract.owner();
    let [to] = await ethereum.request({ method: "eth_requestAccounts" });
    console.log(owner, to);
    setOwnerAccount(owner);
    setAccount(to);
  };

  // if (account == null) return "Hello";

  if (parseInt(account) != parseInt(ownerAccount))
    return (
      <div>
        <nav className="border-b p-6">
          <p className="text-4xl font-bold">Minddef Marketplace</p>
          <label className="text-4mt text-blue-500">{account}</label>
          <div className="flex mt-4">
            <Link href="/">
              <a className="mr-4 text-pink-500">Home</a>
            </Link>
            <Link href="/ArtistNft">
              <a className="mr-6 text-pink-500">My Digital Assets</a>
            </Link>
          </div>
        </nav>
        <Component {...pageProps} />
      </div>
    );

  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Minddef Marketplace</p>
        <label className="text-4mt text-blue-500">{account}</label>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">Home</a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-pink-500">Sell Digital Asset</a>
          </Link>
          <Link href="/ArtistNft">
            <a className="mr-6 text-pink-500">My Digital Assets</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
