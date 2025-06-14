<script>
  let summary = '';
  let loading = false;
  let error = '';
  let inputText = '';

  async function summarize() {
    loading = true;
    error = '';
    try {
      // Dynamically import transformers.js for browser summarization
      const { pipeline } = await import('@xenova/transformers');
      const summarizer = await pipeline('summarization');
      const result = await summarizer(inputText, { min_length: 10, max_length: 60 });
      summary = result[0].summary_text;
    } catch (e) {
      error = 'Summarization failed: ' + e.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="p-4 flex flex-col">
  <textarea bind:value={inputText} placeholder="Paste chat or message text to summarize..." class="border p-2 mb-2"></textarea>
  <button on:click={summarize} class="bg-blue-500 text-white px-4 py-2 rounded mb-2" disabled={loading}>Summarize</button>
  {#if loading}
    <div>Summarizing...</div>
  {/if}
  {#if summary}
    <div class="bg-gray-100 p-2 rounded">{summary}</div>
  {/if}
  {#if error}
    <div class="text-red-500">{error}</div>
  {/if}
</div>
