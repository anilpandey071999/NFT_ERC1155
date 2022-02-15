const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomiclabs/hardhat-waffle");


describe("Greeter", function () {
  it("Mint the NFT", async  () => {
    const [accounts,accounts1,accounts2] = await hre.ethers.getSigners();    
    const GetNft = await ethers.getContractFactory("MindDefnft");
    const getNft = await GetNft.deploy(accounts.address);
    await getNft.deployed();
    await getNft.mintnft();
    let a = await getNft.nft();
    expect(parseInt(a.toString())).to.equal(2);
  });

  it("seting Price",async ()=>{
    const [accounts,accounts1,accounts2] = await hre.ethers.getSigners();    
    const GetNft = await ethers.getContractFactory("MindDefnft");
    const getNft = await GetNft.deploy(accounts.address);
    await getNft.deployed();
    await getNft.mintnft();
    await getNft.nft();
    await getNft.setPricenft(10,1);

    expect(parseInt(await getNft.constOfnft(1))).to.equal(10);
  })

  
});
