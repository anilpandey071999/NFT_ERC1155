//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./NFT.sol";

contract MindDefMarketPlace{
    uint256 public totalNft = 0;
    mapping(uint256 => MarketItem) public idToMarketItem;
    address public nftContract;
    address public owner;

    struct MarketItem{
        uint256 nftID;
        uint256 price;
        address seller;
        string uri;
        bool openForSell;
        bool sold;
    }
    constructor(address _nftContract,address _owner){
        nftContract = _nftContract;
        owner = _owner;
    }

    function addNftCollection(uint256 _nftID,string memory _uri) public {
        idToMarketItem[totalNft] = MarketItem({
            nftID:_nftID,
            price: 0,
            seller:msg.sender,
            uri: _uri,
            openForSell: false,
            sold:false
        });
    }

    function listingForSell(uint256 marketId) public{
        require(totalNft >= marketId,"Invalid MarketId");
        idToMarketItem[marketId].openForSell = false;
    }

    function setPricenft(uint256 nftCost,uint256 _totalNft) public {
        require(msg.sender == owner,"Only for the Owner");
        idToMarketItem[_totalNft].price = nftCost;
    }

    function buynft(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        uint256 _totalNft
    ) public {
        require(idToMarketItem[_totalNft].price <= amount,"Please pay listed amount");
        ERC1155(nftContract).safeTransferFrom(to,from,0, amount, "0x00");
        ERC1155(nftContract).safeTransferFrom(from, to, id, 1, "0x00");
    }

    function fetchMyNFT() public view returns(MarketItem[] memory){
        uint itemCount  = 0;
        uint totalItemCount = totalNft ;
        uint currentIndex = 0;
        for (uint256 index = 0; index < totalItemCount; index++) {
            if(idToMarketItem[index+1].seller == msg.sender){
                itemCount += 1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 index = 0; index < totalItemCount; index++) {
            if(idToMarketItem[index+1].seller == msg.sender){
                MarketItem storage currentItem = idToMarketItem[index];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}