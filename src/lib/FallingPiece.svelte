<script>
	export let data
	export let coordinates

	$: country = data.element

	let container

	$: html = country.outerHTML

	$: console.log(coordinates[1])

	$: [x, y] = coordinates
</script>

<g class="land-highlight" transform="translate({x} {y})" bind:this={container}>
	{@html html}
</g>
