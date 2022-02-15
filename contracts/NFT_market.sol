//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./NFT.sol";

contract MindDefMarketPlace{
    uint256 public totalNft = 0;
    mapping(uint256 => MarketItem) public idToMarketItem;
    address public nftContract;

    struct MarketItem{
        uint256 marketId;
        uint256 nftID;
        address seller;
        address owner;
        bool sold;
    }
    constructor(address _nftContract){
        nftContract = _nftContract;
    }

    function addNftCollection(uint256 _nftID) public {
        idToMarketItem[totalNft] = MarketItem({
            marketId:totalNft,
            nftID:_nftID,
            seller:msg.sender,
            owner:msg.sender,
            sold:false
        });
        // ERC1155(nftContract).setApprovalForAll(address(this),true);
    }

    function buy(uint256 _totalNft,uint256 nftId,uint256 amount)public{
        MindDefnft(nftContract).buynft(idToMarketItem[_totalNft].owner,msg.sender,nftId,amount);
        idToMarketItem[_totalNft].owner = msg.sender;
    }
    
}