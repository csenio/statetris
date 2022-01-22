<script>
	import { useMachine } from '@xstate/svelte';
	import { onMount } from 'svelte';

	import { worldMap } from './countries.js';
	import { gameMachine } from '$lib/gameStore.js';
	import FallingPiece from '$lib/FallingPiece.svelte';

	const { send } = useMachine(gameMachine);

	let map;

	let currentCountry;

	onMount(() => {
		const allCountries = map.querySelectorAll('[data-iso]');

		currentCountry = [...allCountries][0];

		send('INIT_GAME', {
			availablePieces: [],
			grid_size: [],
		});
	});
</script>

<svg
	bind:this={map}
	id="map"
	xmlns="http://www.w3.org/2000/svg"
	version="1.1"
	viewbox="0 0 2754 1398"
>
	<g>
		{@html worldMap}
	</g>
	{#if currentCountry}
		<FallingPiece country={currentCountry} />
	{/if}
</svg>

<style>
	svg {
		width: 100%;
	}
</style>
