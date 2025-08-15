import { ethers } from "ethers";
import PropertyNFT from "./PropertyNFT.json"; // ABI from Hardhat artifacts

const CONTRACT_ADDRESS = "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1";

// Use MetaMask for sending transactions (write)
export async function getProvider() {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  throw new Error("MetaMask not found");
}

// Use Hardhat node directly for reads (bypasses ENS logic)
export function getReadProvider() {
  return new ethers.providers.JsonRpcProvider("http://localhost:8545");
}

// Signer for sending transactions
export async function getSigner() {
  const provider = await getProvider();
  return provider.getSigner();
}

// Contract instance for writing (MetaMask signer)
export async function getContract() {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, PropertyNFT.abi, signer);
}

// Contract instance for reads (local provider)
export function getReadContract() {
  const provider = getReadProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, PropertyNFT.abi, provider);
}

// Read NFTs for an address
export async function getMyNFTs(address) {
  const contract = getReadContract();
  const balance = await contract.balanceOf(address);
  let nfts = [];
  for (let i = 0; i < balance; i++) {
    const tokenId = await contract.tokenOfOwnerByIndex(address, i);
    const data = await contract.getProperty(tokenId);
    nfts.push({
      tokenId: tokenId.toString(),
      ...parsePropertyData(data)
    });
  }
  return nfts;
}

function parsePropertyData([itemType, name, value, purchaseDate, vin, addr]) {
  return {
    itemType, name, value: value.toString(), purchaseDate, vin, addr
  };
}

// Create an offer (write)
export async function createOffer(tokenId, buyer, priceEth) {
  const contract = await getContract();
  const price = ethers.utils.parseEther(priceEth);
  const tx = await contract.createOffer(tokenId, buyer, price);
  await tx.wait();
}

// Create batch offers (new)
export async function createBatchOffers(tokenIds, buyer, priceEth) {
  // Sequentially, to work with MetaMask popup flow
  for (const tokenId of tokenIds) {
    // eslint-disable-next-line no-await-in-loop
    await createOffer(tokenId, buyer, priceEth);
  }
}

// Get pending offers for an address (read)
export async function getPendingOffers(address) {
  const contract = getReadContract();
  const offers = await contract.getPendingOffers(address);
  return offers.map(o => ({
    offerId: o.offerId.toString(),
    tokenId: o.tokenId.toString(),
    seller: o.seller,
    buyer: o.buyer,
    price: ethers.utils.formatEther(o.price),
    active: o.active
  }));
}

// Accept an offer (write)
export async function acceptOffer(offerId, priceEth) {
  const contract = await getContract();
  const overrides = {
    value: ethers.utils.parseEther(priceEth)
  };
  const tx = await contract.acceptOffer(offerId, overrides);
  await tx.wait();
}

// ETH balance for any address (read)
export async function getEthBalance(address) {
  console.log('getEthBalance called with:', address);
  if (
    !address ||
    typeof address !== "string" ||
    !address.startsWith("0x") ||
    address.length !== 42
  ) {
    return "0";
  }
  const provider = getReadProvider();
  try {
    const bal = await provider.getBalance(address);
    return ethers.utils.formatEther(bal);
  } catch (e) {
    console.error('Error in getBalance:', e);
    return "0";
  }
}
