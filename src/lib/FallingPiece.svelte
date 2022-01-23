<script>
	export let data
	export let transform

	$: country = data.element

	let container

	$: html = country.outerHTML

	// $: console.log(transform[1])

	$: [x, y] = transform
</script>

<g class="land-highlight" transform="translate({x} {y})" bind:this={container}>
	{@html html}
</g>
