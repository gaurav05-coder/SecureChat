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
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-xs flex flex-col items-center">
      <h1 class="text-2xl font-bold mb-4 text-purple-700">SecureChat Login</h1>
      <input bind:value={username} placeholder="Enter username" class="border border-gray-300 rounded px-4 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-purple-400" />
      <button on:click={login} class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full font-semibold transition">Login</button>
    </div>
    <!-- Tailwind test: -->
    <div class="mt-6 text-sm text-gray-500">If this box is <span class="bg-red-400 text-white px-2 rounded">red</span>, Tailwind works!</div>
  </div>
{:else}
  <div class="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-100">
    <!-- Header -->
    <header class="bg-purple-700 text-white py-4 px-6 shadow flex items-center justify-between">
      <span class="font-bold text-lg tracking-wide">SecureChat</span>
      <span class="text-sm">Logged in as <b>{username}</b></span>
    </header>
    <!-- Messages -->
    <main class="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-2">
      {#if $messages.length === 0}
        <div class="text-gray-400 text-center mt-10">No messages yet. Start the conversation!</div>
      {/if}
      {#each $messages as msg}
        <div class="flex" class:bg-green-50={msg.self} class:bg-white={!msg.self} class:justify-end={msg.self} class:justify-start={!msg.self}>
          <div class="rounded-lg px-4 py-2 shadow text-sm max-w-xs break-words"
               class:bg-green-100={msg.self} class:bg-purple-100={!msg.self}>
            <span class="block font-semibold text-purple-700 mb-1">{msg.senderId}</span>
            <span>{msg.content}</span>
          </div>
        </div>
      {/each}
    </main>
    <!-- Input -->
    <form class="flex gap-2 p-4 bg-white border-t border-gray-200" on:submit|preventDefault={handleSend}>
      <input bind:value={input} placeholder="Type a message..." class="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
      <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold transition" type="submit">Send</button>
    </form>
  </div>
{/if}
