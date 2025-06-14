<script>
  let username = '';
  let proof = '';
  let status = '';
  let loading = false;

  async function handleLogin() {
    loading = true;
    status = '';
    try {
      // TODO: Replace with actual Circom proof generation
      proof = btoa(username + '-fake-proof');
      const res = await fetch('/api/auth/zkp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, proof })
      });
      if (!res.ok) throw new Error('ZKP verification failed');
      status = 'Login successful!';
    } catch (e) {
      status = 'Login failed: ' + e.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex flex-col items-center p-4">
  <input bind:value={username} placeholder="Username" class="border p-2 mb-2" />
  <button on:click={handleLogin} class="bg-purple-600 text-white px-4 py-2 rounded mb-2" disabled={loading}>Login with ZKP</button>
  {#if loading}
    <div>Verifying ZKP...</div>
  {/if}
  {#if status}
    <div class="mt-2">{status}</div>
  {/if}
</div>
