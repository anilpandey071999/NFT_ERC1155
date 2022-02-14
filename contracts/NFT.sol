//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
contract MindDef_NFT is ERC1155{
    uint256 public Gold_Coin = 0;
    uint256 public Nft = 1;
    mapping(uint256=>uint256) public constOfNFT;
    address owner;

    constructor(address _owner)ERC1155("MindDef_NFT"){
        owner = _owner;
        _mint(msg.sender, Gold_Coin, 10**18, "");
    }

    function mintNFT(uint256 Nft_Cost) public {
        require(msg.sender == owner);
        constOfNFT[Nft] = Nft_Cost;
        _mint(msg.sender, Nft, 1, "");
        Nft++;
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not owner nor approved"
        );
        if(id == 0){
            _safeTransferFrom(from, to, Gold_Coin, amount, data);
        }else{
            require(constOfNFT[id] <= amount,"Please pay listed amount");
            _safeTransferFrom(from, to, Gold_Coin, amount, data);
            _safeTransferFrom(from, to, id, 1, data);
        }
    }
}