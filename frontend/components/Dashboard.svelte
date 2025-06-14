<script>
  import { onMount } from 'svelte';
  let chartDiv;

  onMount(() => {
    import('d3').then(d3 => {
      // Placeholder data
      const data = [4, 8, 15, 16, 23, 42];
      const width = 300, height = 150;
      const svg = d3.select(chartDiv)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
      svg.selectAll('rect')
        .data(data)
        .enter().append('rect')
        .attr('x', (d, i) => i * 40)
        .attr('y', d => height - d * 3)
        .attr('width', 35)
        .attr('height', d => d * 3)
        .attr('fill', 'steelblue');
      svg.selectAll('text')
        .data(data)
        .enter().append('text')
        .text(d => d)
        .attr('x', (d, i) => i * 40 + 17)
        .attr('y', d => height - d * 3 - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#333');
    });
  });
</script>

<div class="p-4">
  <h2 class="text-xl font-bold mb-2">Chat Analytics Dashboard</h2>
  <div bind:this={chartDiv}></div>
  <div class="mt-4 text-gray-600">Metrics coming soon: messages/min, users online, toxicity rate, etc.</div>
</div>
