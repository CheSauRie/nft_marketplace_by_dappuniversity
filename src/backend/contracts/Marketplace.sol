// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./hardhat/console.sol";

contract Marketplace is ReentrancyGuard {

    // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales 
    uint public itemCount; 

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        address payable owner;
        bool sold;
    }

    // itemId -> Item
    mapping(uint => Item) public items;

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed owner
    );
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function Offer(IERC721 _nft, uint _tokenId, uint _price) public {
        // Require that the seller owns the token
        require(_nft.ownerOf(_tokenId) == msg.sender, "You do not own this token");

        // Approve the marketplace to transfer the token
        _nft.approve(address(this), _tokenId);

        // Increment the item count
        itemCount++;

        // Create the item and add it to items mapping
        items[itemCount] = Item(itemCount, _nft, _tokenId, _price, payable(msg.sender), payable(address(0)), false);

        // Emit the Offered event
        emit Offered(itemCount, address(_nft), _tokenId, _price, msg.sender);
    }

    // Make item to offer on the marketplace
    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");
        // increment itemCount
        itemCount ++;
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            payable(msg.sender),
            false
        );
        // emit Offered event
        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(msg.sender != 0x90F79bf6EB2c4f870365E785982E1f101E93b906, "you are admin of this page");
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        require(!item.sold, "item already sold");
        // pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        // update item to sold
        item.sold = true;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        item.owner = payable(msg.sender);
        // emit Bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }


    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price*(100 + feePercent))/100);
    }

    function reSell(uint _itemId, uint _price) external nonReentrant {
        Item storage item = items[_itemId];
        require(item.nft.ownerOf(item.tokenId) == msg.sender, "You are not the owner of the NFT");
        require(item.owner == msg.sender, "Only the owner can resell the item");
        require(item.sold, "Item not sold");

        // Transfer the token back to the contract
        item.nft.transferFrom(msg.sender, address(this), item.tokenId);

        // Update the item details
        item.price = _price;
        item.sold = false;
        item.seller = payable(msg.sender);
        item.owner = payable(address(0));

        // Emit the Offered event
        emit Offered(
            itemCount,
            address(item.nft),
            item.tokenId,
            _price,
            msg.sender
        );
    }
    
    function getItemsByOwner(address owner) public view returns (Item[] memory) {
    Item[] memory ownedItems;
    uint counter = 0;
    for (uint i = 0; i < itemCount; i++) {
        if (items[i].owner == owner) {
            ownedItems[counter] = items[i];
            counter++;
        }
    }
    // resize the array to save space
    assembly { mstore(ownedItems, counter) }
    return ownedItems;
    }

    function isSold(uint _itemId) public view returns (bool) {
        Item storage item = items[_itemId];
        return item.sold;
    }

    function claimFromFixedAccount(uint _itemId) external nonReentrant {
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(msg.sender != 0x90F79bf6EB2c4f870365E785982E1f101E93b906, "you are admin of this page");
        require(!item.sold, "item already sold");
        require(item.seller == 0x90F79bf6EB2c4f870365E785982E1f101E93b906, "item is not owned by the fixed account");

        // update item to sold
        item.sold = true;
        // transfer nft to claimer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        item.owner = payable(msg.sender);
        // emit Bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }

    function approveMarketplace(uint itemId) external {
        Item storage item = items[itemId];
        require(msg.sender == item.owner, "Only the owner can approve the marketplace");

        // Approve the marketplace contract to transfer the token on behalf of the owner
        item.nft.approve(address(this), item.tokenId);
    }

    function approve(uint itemId, address to, uint256 tokenId) external {
        Item storage item = items[itemId];
        item.nft.approve(to, tokenId);
    }

    function getTokenId(uint itemId) public view returns (uint) {
        Item storage item = items[itemId];
        return item.tokenId;
    }

    function ownerOf(uint _itemId) public view returns (address) {
        return items[_itemId].owner;
    }
}
