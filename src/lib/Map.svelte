<script>
	import { useMachine } from '@xstate/svelte';
	import { onMount } from 'svelte';

	import { worldMap } from './countries.js';
	import { countries } from './countryIso.js';
	import { gameMachine } from '$lib/gameStore.js';

	const { state, send } = useMachine(gameMachine);

	let map;

	function unique(arr) {
		return [...new Set(arr)];
	}

	function findCountryContainer(el) {
		if (!el.id) return findCountryContainer(el.parentElement);

		if (!el || el.id === map) {
			console.warn('DANGER, found the map container');
			return;
		}

		let possibleISO = el.id.toUpperCase();
		if (!countries[possibleISO]) {
			return findCountryContainer(el.parentElement);
		}

		return {
			element: el,
			iso: possibleISO,
		};
	}

	onMount(() => {
		const pathRegions = map.querySelectorAll('path>title');
		const gRegions = map.querySelectorAll('g>title');

		// unique([...pathRegions, ...gRegions].map(findCountryContainer));

		send('INIT_GAME');

		// ISO.forEach((country) => country.element.classList.add('land-highlight'));
	});

	// let countries;
</script>

<svg
	bind:this={map}
	id="map"
	xmlns="http://www.w3.org/2000/svg"
	version="1.1"
	viewbox="0 0 2754 1398"
>
	{@html worldMap}
</svg>

<style>
	svg {
		width: 100%;
	}
</style>
