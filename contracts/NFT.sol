//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
contract MindDefnft is ERC1155{
    uint256 public goldCoin = 0;
    uint256 public nft = 1;
    mapping(uint256=>uint256) public constOfnft;
    mapping(address=>uint256) public ownerOfNft;
    address internal owner;

    constructor(address _owner)ERC1155("MindDef_nft"){
        owner = _owner;
        _mint(msg.sender, goldCoin, 10**18, "");
    }

    function mintnft() public {
        require(msg.sender == owner,"Only for the Owner");
        _mint(msg.sender, nft, 1, "");
        nft++;
    }

    function setPricenft(uint256 nftCost,uint256 tokenId) public {
        require(msg.sender == owner,"Only for the Owner");
        constOfnft[tokenId] = nftCost;
    }

    function buynft(
        address from,
        address to,
        uint256 id,
        uint256 amount
    ) public {
        require(constOfnft[id] <= amount,"Please pay listed amount");
        safeTransferFrom(from, to, goldCoin, amount, "0x00");
        safeTransferFrom(from, to, id, 1, "0x00");
    }
}