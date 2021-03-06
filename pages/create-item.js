import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import styles from "../styles/load.module.css";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { nftaddress, nftmarketaddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/MindDefnft.json";
import Market from "../artifacts/contracts/NFT_Market.sol/MindDefMarketPlace.json";

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [showError, setError] = useState(null);
  const [isLoading, setLoader] = useState(false);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  const onChange = async (e) => {
    if (window.ethereum) {
      const file = e.target.files[0];
      try {
        const added = await client.add(file, {
          progress: (prog) => console.log(`received: ${prog}`),
        });
        console.log(added);
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        console.log(url);
        setFileUrl(url);
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        let [to] = await ethereum.request({ method: "eth_requestAccounts" });
        // console.log(owner, to, marketId, price, "0x00");
        let TokenContract = new ethers.Contract(nftaddress, NFT.abi, signer);
        // let balance = await TokenContract.balanceOf(owner, marketId);
        // console.log("balance", balance);

        let chackUserApprovel = await TokenContract.isApprovedForAll(
          to,
          nftmarketaddress
        );
        if (!chackUserApprovel) {
          let token = await TokenContract.setApprovalForAll(
            nftmarketaddress,
            true
          );
          console.log(token);
          await token.wait();
        }
      } catch (error) {
        console.log("Error uploading file: ", error);
        setError(error.Error);
        setInterval(() => {
          setError(null);
        }, 3000);
      }
    } else {
      await provider.enable();
      //  Wrap with Web3Provider from ethers.js
      const web3Provider = new Web3(provider);
      Window.w3 = web3Provider;

      let account = await web3Provider.eth.getAccounts();
      const signer = provider.getSigner();

        let [to] = await ethereum.request({ method: "eth_requestAccounts" });
        // console.log(owner, to, marketId, price, "0x00");
        let TokenContract = new ethers.Contract(nftaddress, NFT.abi, signer);
        // let balance = await TokenContract.balanceOf(owner, marketId);
        // console.log("balance", balance);

        let chackUserApprovel = await TokenContract.isApprovedForAll(
          to,
          nftmarketaddress
        );
        if (!chackUserApprovel) {
          let token = await TokenContract.setApprovalForAll(
            nftmarketaddress,
            true
          );
          console.log(token);
          await token.wait();
        }

    }
  };

  async function createMarket() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) {
      setError("Provid Valid data");
      setInterval(() => {
        setError(null);
      }, 3000);
    }
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      price,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      console.log("data:-", data);
      console.log(added);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
      let nftId = await contract.nft();
      const MarketContract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        signer
      );
      let owner = await MarketContract.owner();
      let tx = await MarketContract.addNftCollection(nftId, price, url);
      // console.log(await tx);
      // console.log(await tx.wait());
      setLoader(true);
      console.log(await tx.wait());
      setLoader(false);
    } catch (error) {
      console.log("Error uploading file: ", error);
      setError(error.Error);
      setInterval(() => {
        setError(null);
      }, 3000);
    }
  }

  if (isLoading) return <div className={styles.loader}></div>;

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <p className="text-2xl font-bold">{showError}</p>
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="rounded mt-4" width="350" src={fileUrl} />
        )}
        <button
          onClick={createMarket}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create Digital Asset
        </button>
      </div>
    </div>
  );
}
