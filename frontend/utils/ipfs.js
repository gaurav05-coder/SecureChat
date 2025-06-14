import { encryptAES, generateAESKey } from './encrypt.js';

// Encrypt file with AES-GCM and upload to Pinata
export async function uploadToIPFS(file, pinataJWT) {
  const key = await generateAESKey();
  const fileBuffer = await file.arrayBuffer();
  const { ciphertext, iv } = await encryptAES(new Uint8Array(fileBuffer), key);

  // Prepare encrypted file as Blob
  const encryptedBlob = new Blob([new Uint8Array(atob(ciphertext).split('').map(c => c.charCodeAt(0)))], { type: file.type });
  const formData = new FormData();
  formData.append('file', encryptedBlob, file.name + '.enc');

  // Pinata API upload
  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pinataJWT}`
    },
    body: formData
  });
  if (!res.ok) throw new Error('Pinata upload failed');
  const data = await res.json();
  return {
    cid: data.IpfsHash,
    gatewayUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
    iv,
    key,
    ciphertext
  };
}
