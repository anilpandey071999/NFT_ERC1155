//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
contract MindDefnft is ERC1155{
    uint256 public goldCoin = 0;
    uint256 public nft = 1;
    address public owner;
    mapping(uint256=>string) public nft_uri;

    constructor(address _owner)ERC1155("MindDef_nft"){
        owner = _owner;
        _mint(msg.sender, goldCoin, 10**18, "");
    }

    function mintnft(address sender ) public {
        require(sender == owner,"Only for the Owner");
        _mint(sender, nft, 1, "");
        nft++;
    }
}