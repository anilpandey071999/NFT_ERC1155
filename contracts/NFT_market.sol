//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "1.sol";

contract MindDefMarketPlace{
    uint256 public totalNft = 0;
    mapping(uint256 => MarketItem) public idToMarketItem;

    struct MarketItem{
        uint256 marketId;
        address nftContract;
        address seller;
        address owner;
        bool sold;
    }

    function addNftCollection(address nftContract) public {
        idToMarketItem[totalNft] = MarketItem(
            totalNft,
            nftContract,
            msg.sender,
            msg.sender,
            false
        );
        // ERC1155(nftContract).setApprovalForAll(address(this),true);
    }

    function buy(uint256 _totalNft,uint256 nftId,uint256 amount)public{
        MindDefnft(idToMarketItem[_totalNft].nftContract).buynft(idToMarketItem[_totalNft].owner,msg.sender,nftId,amount);
    }
    
}