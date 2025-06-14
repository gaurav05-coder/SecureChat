<script>
  import { onMount } from 'svelte';
  import { encryptAES, decryptAES, generateAESKey } from '../utils/encrypt.js';
  import { initSocket, sendMessage } from '../utils/socket.js';
  import { writable } from 'svelte/store';

  let input = '';
  let messages = writable([]);
  let aesKey;
  let socket;

  onMount(async () => {
    aesKey = await generateAESKey();
    socket = initSocket(async (encryptedMsg) => {
      // Decrypt incoming message
      const plaintext = await decryptAES(encryptedMsg.data, aesKey);
      messages.update(msgs => [...msgs, { ...encryptedMsg, plaintext }]);
    });
  });

  import { storeHash } from '../utils/polygon.js';
  // Add your Polygon private key and RPC URL here
  const polygonPrivateKey = 'POLYGON_PRIVATE_KEY_HERE';
  const polygonRpcUrl = 'https://rpc-mumbai.maticvigil.com';
  import { ethers } from 'ethers';

  async function handleSend() {
    if (input.trim()) {
      const encrypted = await encryptAES(input, aesKey);
      sendMessage({ data: encrypted });
      messages.update(msgs => [...msgs, { data: encrypted, plaintext: input, self: true }]);
      // Hash message and store on Polygon
      try {
        const hash = ethers.utils.keccak256(new TextEncoder().encode(input));
        await storeHash(hash, polygonPrivateKey, polygonRpcUrl);
      } catch (e) {
        console.error('Polygon storeHash failed:', e);
      }
      input = '';
    }
  }
</script>

<div class="flex flex-col h-full">
  <div class="flex-1 overflow-y-auto p-4">
    {#each $messages as msg}
      <div class="mb-2 {msg.self ? 'text-right' : ''}"><b>{msg.self ? 'You' : 'Peer'}:</b> {msg.plaintext}</div>
    {/each}
  </div>
  <div class="p-4 flex">
    <input bind:value={input} placeholder="Type a message..." class="border flex-1 p-2 mr-2" />
    <button on:click={handleSend} class="bg-green-500 text-white px-4 py-2 rounded">Send</button>
  </div>
</div>
