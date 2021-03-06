import "../styles/globals.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { nftaddress, nftmarketaddress } from "../config";
import Market from "../artifacts/contracts/NFT_Market.sol/MindDefMarketPlace.json";

import WalletConnects from "@walletconnect/web3-provider";
import { providers } from "ethers"

function MyApp({ Component, pageProps }) {
  const [account, setAccount] = useState(null);
  const [connectors, setConnector] = useState(null);

  const [ownerAccount, setOwnerAccount] = useState(null);

  useEffect(() => {
    getAccount();
    connectWCManual();
  });

  const connectWCManual = async () => {
    if(!account){
      try {
        const wcProvider = new WalletConnects({
          infuraId: "7a04f5a9200041c8b82445299e76ea16",
          qrcode: true
        });
        await wcProvider.enable();
        const ethers = new providers.Web3Provider(wcProvider);
        console.log(await ethers.getBalance("ricmoo.eth"));
        console.log("Successfully connected to WC", wcProvider.accounts);
        setAccount(wcProvider.accounts)
        return wcProvider;
      } catch (e) {
        console.log("Error connecting WC:", e);
        throw e;
      }
    }
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
