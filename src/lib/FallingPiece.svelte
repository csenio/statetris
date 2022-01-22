<script>
	import { onMount } from 'svelte';

	export let country;

	let container;

	onMount(() => {
		container.appendChild(country.cloneNode(true));
	});

	// copy element data but with location at 0 0
	const { x, y } = country.getBBox();
</script>

<g class="land-highlight" transform="translate(0 -{y})" bind:this={container} />
