<script>
  import { uploadToIPFS } from '../utils/ipfs.js';
  let uploading = false;
  let uploadUrl = '';
  let error = '';

  import { storeHash } from '../utils/polygon.js';
  import { ethers } from 'ethers';
  // Add your Polygon private key and RPC URL here
  const polygonPrivateKey = 'POLYGON_PRIVATE_KEY_HERE';
  const polygonRpcUrl = 'https://rpc-mumbai.maticvigil.com';

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    uploading = true;
    error = '';
    try {
      // TODO: Replace with your Pinata JWT
      const pinataJWT = 'PINATA_JWT_HERE';
      const { gatewayUrl, ciphertext } = await uploadToIPFS(file, pinataJWT);
      uploadUrl = gatewayUrl;
      // Hash encrypted file and store on Polygon
      const hash = ethers.utils.keccak256(new TextEncoder().encode(ciphertext));
      await storeHash(hash, polygonPrivateKey, polygonRpcUrl);
    } catch (err) {
      error = err.message;
    } finally {
      uploading = false;
    }
  }
</script>

<div class="flex flex-col items-center p-4">
  <input type="file" on:change={handleFile} class="mb-2" />
  {#if uploading}
    <div>Uploading...</div>
  {/if}
  {#if uploadUrl}
    <div>File uploaded: <a href={uploadUrl} target="_blank">{uploadUrl}</a></div>
  {/if}
  {#if error}
    <div class="text-red-500">{error}</div>
  {/if}
</div>
