<script lang="ts">
	import { CardType } from './types';
	import { createEventDispatcher, onMount } from 'svelte';
	import MultiSelect from 'svelte-multiselect';
	let loading = false;
	export let selected: string[];
	export let type: CardType;
	export let options: string[];

	onMount(() => {});

	const dispatch = createEventDispatcher();

	function activateCard() {
		dispatch('activate', {
			type,
			selected
		});
	}
</script>

<button
	type="button"
	class="border rounded-lg p-4 border-black transition-transform transform h-full flex flex-col justify-between"
	aria-label={type === CardType.ContentSearch ? 'Content Search' : 'Browse'}
>
	<div class="w-full h-full">
		<div class="flex justify-between items-center mb-2">
			<h2 class="text-lg font-bold">
				{type === CardType.ContentSearch ? 'Content Search' : 'Browse'}
			</h2>
		</div>
		{#if type === CardType.ContentSearch}
			<div class="w-full">
				<MultiSelect
					id="searchtags"
					{options}
					placeholder="Take your pick..."
					bind:selected
					{loading}
				/>
			</div>
		{:else if type === CardType.Browse}
			<select class="select select-bordered w-full select-sm">
				{#each options as option}
					<option>{option}</option>
				{/each}
			</select>
		{/if}
	</div>
	<button on:click={activateCard} class="btn btn-outline btn-xs">Search</button>
</button>

<style>
	button {
		transition:
			box-shadow 0.3s ease,
			opacity 0.3s ease,
			border-color 0.3s ease; /* Smooth transition for shadow, opacity, and border color */
		width: 100%;
		border-width: 2px; /* Ensure consistent border width */
	}
</style>
