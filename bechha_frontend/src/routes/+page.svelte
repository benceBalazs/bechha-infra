<script lang="ts">
	import apiConnector from '$lib/ApiConnector';
	import SearchCard from '$lib/SearchCard.svelte';
	import { CardType, type SearchResult, type SearchResultDetail } from '$lib/types';
	import { onMount } from 'svelte';
	import SampleImage from '$lib/samples/00100_frame0009.jpg';
	import Videoplayer from '$lib/Videoplayer.svelte';

	let activeType: CardType = CardType.ContentSearch;
	let isSearchActive: boolean = true;
	let searchResult: Promise<SearchResult> = apiConnector.search(['man'], 1, 8);
	let availableTags: string[];
	let searchTags: string[];
	let selectedItem: SearchResultDetail = {
		fileName: '00199_frame0144.jpg',
		extractedFrom: '00199',
		starting_frame: 21592,
		ending_frame: 21837,
		starting_time: 863679,
		ending_time: 873480,
		frames: 245,
		duration: 9801,
		frameUrl: 'segment/00199/00199_frame0144.jpg',
		description: 'a man standing on top of a rock',
		tokens: ['cliff', 'man', 'standing', 'top', 'rock'],
		category: ['cliff']
	};

	onMount(() => {
		getAvailableTags();
	});

	function openDetailModal(item: SearchResultDetail) {
		selectedItem = item;
		(document.getElementById('detailModal') as HTMLDialogElement).showModal();
	}

	function getAvailableTags() {
		apiConnector
			.getTags()
			.then((tags: string[]) => {
				availableTags = tags;
				console.log(availableTags);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function handleActivate(event: any) {
		activeType = event.detail;
		isSearchActive = !isSearchActive;
	}

	async function handleTagSelection(event: any) {
		console.log(event.detail.selected);
		searchResult = apiConnector.search(event.detail.selected, 1, 8);
	}
	function convertMilliseconds(ms: number): string {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

		return `${minutes}m ${formattedSeconds}s`;
	}
</script>

<div class="w-full h-full px-4">
	<div class="grid place-content-center w-full h-[7.5%]">
		<div class=" w-fit flex gap-6">
			<svg
				width="50"
				height="50"
				viewBox="0 0 375 375"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M7 331.826C7 350.604 22.2223 365.826 41 365.826H174.85C180.29 365.826 185.65 364.521 190.481 362.02L292.913 308.99C298.817 305.933 303.695 301.214 306.944 295.414L358.14 204.031C363.924 193.707 363.924 181.119 358.14 170.795L306.689 78.9566C303.6 73.4427 299.035 68.8989 293.507 65.8354L270.046 52.8343L192.647 12.8005C187.818 10.3033 182.462 9 177.026 9H41C22.2223 9 7 24.2223 7 43V331.826Z"
					fill="white"
				/>
				<path
					d="M154.228 9H18C11.9249 9 7 13.9249 7 20V160.447C7 170.328 19.0163 175.198 25.8959 168.106L162.124 27.6587C168.89 20.6821 163.947 9 154.228 9Z"
					fill="#F70000"
				/>
				<path
					d="M7 355V214.553C7 204.672 19.0163 199.802 25.8959 206.894L162.124 347.341C168.89 354.318 163.947 366 154.228 366H18C11.9249 366 7 361.075 7 355Z"
					fill="#F70000"
				/>
				<path
					d="M164.801 40.3912L28.4727 181.152C25.0926 184.642 25.0926 190.185 28.4727 193.675L164.801 334.435C171.606 341.461 183.154 334.119 179.679 324.976L128.613 190.61C127.831 188.551 127.831 186.276 128.613 184.216L179.679 49.8499C183.154 40.7074 171.606 33.3656 164.801 40.3912Z"
					fill="#00F00A"
				/>
				<path
					d="M144.527 175.776L196.827 35.9569C200.348 26.5447 211.323 22.3511 220.223 27.0176C227.471 30.8177 230.897 39.3099 228.316 47.0756L201.589 127.477C194.702 148.193 210.124 169.571 231.955 169.571H277.955C298.332 169.571 312.235 148.949 304.592 130.059L285.144 81.9908C281.509 73.0072 291.166 64.4336 299.656 69.1063C301.336 70.0311 302.725 71.4067 303.666 73.0782L359.17 171.72C364.653 181.463 364.653 193.361 359.17 203.105L303.666 301.747C302.725 303.418 301.336 304.794 299.656 305.719C291.166 310.391 281.509 301.818 285.144 292.834L304.592 244.766C312.235 225.876 298.332 205.254 277.955 205.254H233.696C211.374 205.254 195.911 227.531 203.716 248.444L231.879 323.898C234.908 332.014 231.37 341.113 223.653 345.05C214.731 349.601 203.827 345.52 200.086 336.229L144.814 198.938C141.829 191.524 141.727 183.261 144.527 175.776Z"
					fill="#232CFE"
				/>
			</svg>
			<h1 class="text-5xl font-bold text text-center">bechha</h1>
		</div>
	</div>
	<div class="grid grid-rows-6 w-full h-[92.5%]">
		<div class="w-full h-full row-span-1 grid grid-cols-2 gap-4">
			<!-- Main Area -->
			<div class="card-container justify-self-end">
				<SearchCard
					type={CardType.ContentSearch}
					checked={isSearchActive}
					options={availableTags}
					selected={searchTags}
					on:activate={handleActivate}
					on:tagselection={handleTagSelection}
					active={activeType === CardType.ContentSearch}
				/>
			</div>
			<div class="card-container justify-self-start">
				<SearchCard
					type={CardType.Browse}
					checked={!isSearchActive}
					options={['VideoID']}
					selected={searchTags}
					on:activate={handleActivate}
					active={activeType === CardType.Browse}
				/>
			</div>
		</div>
		<div class="w-full h-[calc(100% - 1.25rem)] row-span-5 mt-5">
			<!-- Results -->
			{#await searchResult}
				<div class="grid place-content-center w-full h-full">
					<h1 class="text-4xl font-bold">Waiting for query</h1>
				</div>
			{:then value}
				<div
					class="w-full h-[80%] flex flex-row flex-wrap justify-center gap-4 overflow-y-auto shadow-inner"
				>
					{#each value.results as item}
						<button
							class="card card-compact bg-base-100 w-96 shadow-xl basis-1/5 border cursor-pointer"
							on:click={() => openDetailModal(item)}
						>
							<figure class="w-full">
								<img
									class="aspect-video w-full"
									src={apiConnector.getThumbnail(item.frameUrl)}
									alt="Movie"
								/>
							</figure>
							<div class="card-body p-0">
								<h2 class="card-title text-sm">
                  <em>
                    <div class="badge badge-secondary">{item.extractedFrom}</div>
                    {item.fileName}
                  </em>
								</h2>
								<span class="text-xs">
									Time: | <em>{item.starting_time}</em> - <em>{item.ending_time}</em> | <b>ms</b>
								</span>
								<span class="text-xs">
									Time: <em>{convertMilliseconds(item.starting_time)}</em> -
									<em>{convertMilliseconds(item.ending_time)}</em>
								</span>
								<div class="card-actions justify-center">
									{#each item.tokens as token}
										<div class="badge badge-outline text-xs">{token}</div>
									{/each}
								</div>
							</div>
						</button>
					{/each}
				</div>
				<div class="grid w-full h-[20%] place-content-center">
					<div class="join">
						<button class="join-item btn btn-active">1</button>
					</div>
				</div>

				<dialog id="detailModal" class="modal">
					<div class="modal-box w-11/12 max-w-6xl grid grid-cols-3 gap-4">
						<div class="w-full col-span-1 flex flex-col gap-4">
							<h3 class="text-lg font-bold">VideoID: {selectedItem.extractedFrom}</h3>
							<p class="overflow-y-auto max-h-24 shadow-inner">
								Description: {selectedItem.description}
							</p>
							<p class="text-sm">
								Time: | <em>{selectedItem.starting_time}</em> -
								<em>{selectedItem.ending_time}</em> | (in ms)
							</p>
							<p class="text-sm">
								Frames: | <em>{selectedItem.starting_frame}</em> -
								<em>{selectedItem.ending_frame}</em> |
							</p>
							<p class="py-4">Duration: {selectedItem.duration} (in ms)</p>
							<div>
								<h3 class="font-bold mb-2"><u>Tokens</u></h3>
								<div class="flex flex-row gap-2 overflow-x-auto p-2 shadow-inner">
									{#each selectedItem.tokens as token}
										<div class="badge badge-outline">{token}</div>
									{/each}
								</div>
							</div>
							<button class="btn btn-outline">
								<span class="loading loading-spinner"></span>
								Waiting for DRES reply
							</button>
						</div>
						<div class="w-full h-full col-span-2 aspect-auto">
							<Videoplayer
								source={apiConnector.getVideoStream(selectedItem.extractedFrom)}
								startTime={selectedItem.starting_time}
								endTime={selectedItem.ending_time}
							/>
						</div>
					</div>
					<form method="dialog" class="modal-backdrop">
						<button>close</button>
					</form>
				</dialog>
			{:catch error}
				<div class="grid place-content-center w-full h-full">
					<h1 class="text-4xl font-bold">Error retrieving: {error}</h1>
				</div>
			{/await}
		</div>
	</div>
</div>

<style>
	.scrollable-container {
		display: flex;
		gap: 1rem;
		padding: 0.5rem;
		overflow-x: auto;
		height: 100%;
	}

	.card-container {
		flex: 1 0 auto;
		min-width: 300px;
		max-width: 400px;
		height: 100%; /* Ensure the card takes the full height */
	}
</style>
