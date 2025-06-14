// Hardhat deploy script for MetadataStore.sol
require('dotenv').config();
const fs = require('fs');

async function main() {
  const MetadataStore = await ethers.getContractFactory('MetadataStore');
  const contract = await MetadataStore.deploy();
  await contract.deployed();
  console.log('MetadataStore deployed to:', contract.address);
  // Export ABI and address for frontend/backend
  fs.writeFileSync(
    '../frontend/abis/MetadataStore.json',
    JSON.stringify({ abi: MetadataStore.interface.format('json'), address: contract.address }, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
