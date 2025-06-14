// Polygon (Mumbai) smart contract integration for MetadataStore
import { ethers } from 'ethers';
import metadataStore from '../abis/MetadataStore.json';

// Connect to Polygon Mumbai
export function getContract(signerOrProvider) {
  return new ethers.Contract(metadataStore.address, metadataStore.abi, signerOrProvider);
}

// Store a hash (message/file) on-chain
export async function storeHash(hash, privateKey, rpcUrl) {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = getContract(wallet);
  const tx = await contract.storeHash(hash);
  await tx.wait();
  return tx.hash;
}

// Get hashes for a user
export async function getHashes(address, rpcUrl) {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const contract = getContract(provider);
  return await contract.getHashes(address);
}
