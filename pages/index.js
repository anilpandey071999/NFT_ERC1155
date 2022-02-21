import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { nftaddress, nftmarketaddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/MindDefnft.json";
import Market from "../artifacts/contracts/NFT_Market.sol/MindDefMarketPlace.json";
import { useEffect } from 'react';
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import {useState} from "react"
import * as axios from "axios";



export default function Home() {
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [nfts, setNfts] = useState([])

  useEffect(()=>{
    getListedNft();
  })
  let getListedNft = async ()=>{
    console.log("lol");
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    let MarketContract = new ethers.Contract(nftmarketaddress,Market.abi, signer)
    let marketContract = await MarketContract.getListedNft();
    // console.log("marketContract",marketContract);
    // let TokenContract = new ethers.Contract(nftaddress,NFT.abi, signer)
    //  let token = await TokenContract.setApprovalForAll(nftaddress,true)
    // console.log("token",token);
    const items = await Promise.all(
      marketContract.map(async (i) => {
        const meta = await axios.get(i.uri);
        let item = {
          price: meta.data.price,
          nftId:parseInt(i.nftID.toString()),
          name: meta.data.name,
          image: meta.data.image,
          description: meta.data.description,
        };
        return item;
      })
    );
      // console.log(items);
      setNfts(items)
    
    setLoadingState('loaded') 

  }

  const buyNft = async(marketId,price)=>{
    // console.log(a);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    let MarketContract = new ethers.Contract(nftmarketaddress,Market.abi, signer)
    let owner =  await MarketContract.owner() 
    let [to] = await ethereum.request({method: 'eth_requestAccounts'});
     console.log(owner,to,marketId,price,"0x00");
     let TokenContract = new ethers.Contract(nftaddress,NFT.abi, signer)
     let token = await TokenContract.setApprovalForAll(nftaddress,true)
     console.log(token);
     await token.wait()
    let marketContract = await MarketContract.buynft(owner,to,marketId,price,"0x00");
    console.log(marketContract);
  }

  if (loadingState === "loaded" && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
                  <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft.nftId,nft.price)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
