<script>
  let inputText = '';
  let result = '';
  let loading = false;
  let error = '';

  async function checkToxicity() {
    loading = true;
    error = '';
    try {
      // Dynamically import TensorFlow.js and the toxicity model
      const tf = await import('@tensorflow/tfjs');
      const toxicity = await import('@tensorflow-models/toxicity');
      const model = await toxicity.load(0.9);
      const predictions = await model.classify([inputText]);
      const toxicLabels = predictions.filter(p => p.results[0].match).map(p => p.label);
      result = toxicLabels.length ? `Toxic: ${toxicLabels.join(', ')}` : 'Not toxic';
    } catch (e) {
      error = 'Toxicity check failed: ' + e.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="p-4 flex flex-col">
  <textarea bind:value={inputText} placeholder="Paste chat or message text to check toxicity..." class="border p-2 mb-2"></textarea>
  <button on:click={checkToxicity} class="bg-red-500 text-white px-4 py-2 rounded mb-2" disabled={loading}>Check Toxicity</button>
  {#if loading}
    <div>Checking...</div>
  {/if}
  {#if result}
    <div class="bg-gray-100 p-2 rounded">{result}</div>
  {/if}
  {#if error}
    <div class="text-red-500">{error}</div>
  {/if}
</div>
