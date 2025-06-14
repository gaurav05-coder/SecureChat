<script>
  import { messages, user, connectSocket, sendMessage } from './lib/socket.js';
  import { v4 as uuidv4 } from 'uuid';
  import { get } from 'svelte/store';
  let input = '';
  let username = '';
  let loggedIn = false;

  function login() {
    const u = { id: uuidv4(), username };
    user.set(u);
    connectSocket(u.id);
    loggedIn = true;
  }

  function handleSend() {
    if (input.trim()) {
      const u = get(user);
      sendMessage({
        id: uuidv4(),
        senderId: u.id,
        chatRoomId: 'main',
        content: input,
        timestamp: Date.now()
      });
      input = '';
    }
  }
</script>

{#if !loggedIn}
  <div class="flex flex-col items-center justify-center h-screen">
    <input bind:value={username} placeholder="Enter username" class="border p-2 mb-2" />
    <button on:click={login} class="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
  </div>
{:else}
  <div class="flex flex-col h-screen">
    <div class="flex-1 overflow-y-auto p-4">
      {#each $messages as msg}
        <div class="mb-2"><b>{msg.senderId}:</b> {msg.content}</div>
      {/each}
    </div>
    <div class="p-4 flex">
      <input bind:value={input} placeholder="Type a message..." class="border flex-1 p-2 mr-2" />
      <button on:click={handleSend} class="bg-green-500 text-white px-4 py-2 rounded">Send</button>
    </div>
  </div>
{/if}

<style>
  .h-screen { height: 100vh; }
</style>
