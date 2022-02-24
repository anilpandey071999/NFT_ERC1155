import Head from "next/head";
import Image from "next/image";
import { nftaddress, nftmarketaddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/MindDefnft.json";
import Market from "../artifacts/contracts/NFT_Market.sol/MindDefMarketPlace.json";
import { useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useState } from "react";
import * as axios from "axios";

export default function Home() {
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    getListedNft();
  });
  async  function listnft(marketId){
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    let MarketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer
    );
    console.log(marketContract,marketId);
    let marketContract = await MarketContract.listForSale(marketId - 1);
    // console.log(marketContract);
  }
  let getListedNft = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    let MarketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer
    );
    let marketContract = await MarketContract.getAllNft();
    const items = await Promise.all(
      marketContract.map(async (i) => {
        //   console.log(i);
        const meta = await axios.get(i.uri);
        // console.log(i);
        let item = {
          price: meta.data.price,
          nftId:parseInt(i.nftID.toString()),
          name: meta.data.name,
          image: meta.data.image,
          description: meta.data.description,
          title: (i.openForSell)?"unlisted":"listed"
        };
        return item;
      })
    );
    // console.log(items);
    setNfts(items);

    setLoadingState("loaded");
  };

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;
  return (  
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} />
              <div className="p-4">
                <p
                  style={{ height: "64px" }}
                  className="text-2xl font-semibold"
                >
                  {nft.name}
                </p>
                <div style={{ height: "70px", overflow: "hidden" }}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl mb-4 font-bold text-white">
                  {nft.price} MD
                </p>
                <button
                  className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => listnft(nft.nftId)}
                >
                  {nft.title}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
