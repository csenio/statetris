<script>
	import {useMachine} from '@xstate/svelte'
	import {onMount} from 'svelte'

	import {worldMap} from './countries.js'
	import {gameMachine} from '$lib/gameStore.js'
	import FallingPiece from '$lib/FallingPiece.svelte'

	const {state, send} = useMachine(gameMachine)

	let map

	onMount(() => {
		const allCountries = map.querySelectorAll('[data-iso]')

		const gridDimensions = {width: 2754, height: 1398}

		send('INIT_GAME', {
			availablePieces: [...allCountries].map((c) => ({element: c})),
			gridDimensions,
		})
	})

	function handleKeyDown(e) {
		if (e.key === 'ArrowLeft' || e.key === 'a') {
			send('MOVE_LEFT')
		}
		if (e.key === 'ArrowRight' || e.key === 'd') {
			send('MOVE_RIGHT')
		}
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

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
	{#if $state.context.currentPiece?.element}
		<FallingPiece data={$state.context.currentPiece} coordinates={$state.context.coordinates} />
	{/if}
</svg>

<style>
	svg {
		width: 100%;
	}
</style>
