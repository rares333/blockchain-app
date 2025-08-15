// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract PropertyNFT is ERC721, ERC721Enumerable {
    enum ItemType { Car, House }

    struct Property {
        ItemType itemType;
        string name;
        uint256 value;
        string purchaseDate;
        string vin;       // Only for cars
        string addr;      // Only for houses
    }

    uint256 public nextTokenId;
    mapping(uint256 => Property) public properties;

    // --- Escrow offer system ---
    struct Offer {
        uint256 offerId;
        uint256 tokenId;
        address seller;
        address buyer;
        uint256 price; // in wei
        bool active;
    }

    uint256 public offerCount;
    mapping(uint256 => Offer) public offers; // offerId => Offer
    mapping(address => uint256[]) public pendingOffersFor; // buyer => offerIds

    constructor() ERC721("VirtualProperty", "VPROP") {}

    // --- NFT Minting (as before) ---
    function mintCar(
        address to,
        string memory name,
        uint256 value,
        string memory purchaseDate,
        string memory vin
    ) public {
        properties[nextTokenId] = Property(
            ItemType.Car,
            name,
            value,
            purchaseDate,
            vin,
            ""
        );
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }

    function mintHouse(
        address to,
        string memory name,
        uint256 value,
        string memory purchaseDate,
        string memory addr
    ) public {
        properties[nextTokenId] = Property(
            ItemType.House,
            name,
            value,
            purchaseDate,
            "",
            addr
        );
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }

    function getProperty(uint256 tokenId) public view returns (
        string memory itemType,
        string memory name,
        uint256 value,
        string memory purchaseDate,
        string memory vin,
        string memory addr
    ) {
        Property memory p = properties[tokenId];
        itemType = p.itemType == ItemType.Car ? "car" : "house";
        return (
            itemType,
            p.name,
            p.value,
            p.purchaseDate,
            p.vin,
            p.addr
        );
    }

    // --- OFFER SYSTEM ---

    // 1. Seller creates an offer for a specific buyer at a price
    function createOffer(uint256 tokenId, address buyer, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not NFT owner");
        offers[offerCount] = Offer({
            offerId: offerCount,
            tokenId: tokenId,
            seller: msg.sender,
            buyer: buyer,
            price: price,
            active: true
        });
        pendingOffersFor[buyer].push(offerCount);
        offerCount++;
    }

    // 2. Buyer accepts offer by sending ETH
    function acceptOffer(uint256 offerId) external payable {
        Offer storage offer = offers[offerId];
        require(offer.active, "Offer not active");
        require(offer.buyer == msg.sender, "Not the recipient");
        require(msg.value >= offer.price, "Not enough ETH sent");
        require(ownerOf(offer.tokenId) == offer.seller, "Seller no longer owns NFT");

        offer.active = false;

        // Transfer NFT
        _safeTransfer(offer.seller, offer.buyer, offer.tokenId, "");

        // Pay the seller
        payable(offer.seller).transfer(offer.price);

        // Remove pending offer for buyer
        uint256[] storage ids = pendingOffersFor[offer.buyer];
        for (uint i = 0; i < ids.length; i++) {
            if (ids[i] == offerId) {
                ids[i] = ids[ids.length - 1];
                ids.pop();
                break;
            }
        }
    }

    // Helper: get all pending offers for a user
    function getPendingOffers(address user) external view returns (Offer[] memory) {
        uint256[] storage ids = pendingOffersFor[user];
        Offer[] memory result = new Offer[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = offers[ids[i]];
        }
        return result;
    }

    // --- REQUIRED OVERRIDES FOR ERC721 + ERC721Enumerable ---
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    )
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
