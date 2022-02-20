const hre = require("hardhat");

async function main() {
    /**
     * getting the account
     */
    const [accounts] = await hre.ethers.getSigners();
    console.log(accounts.address);
    /**
     * Deploying NFT contract by parssing the owner address
     */
    const NFT = await hre.ethers.getContractFactory("MindDefnft");
    const nft = await NFT.deploy(accounts.address);
    await nft.deployed();
    console.log("NFT ERC1155 contract address:- ",nft.address);

    /**
     * Deploying NFT market place by parssing the ERC1155 contract address and owner address
     */
    const NFT_MarketPlace = await hre.ethers.getContractFactory("MindDefMarketPlace");
    const nft_marketPlace = await NFT_MarketPlace.deploy(nft.address,accounts.address);
    await nft_marketPlace.deployed();
    console.log("NFT Market Place contract address:- ",nft_marketPlace.address)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});