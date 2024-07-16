<script lang="ts">
  import apiConnector from '$lib/ApiConnector';
  import SearchCard from '$lib/SearchCard.svelte';
  import { CardType, type SearchResult } from '$lib/types';
  import { onMount } from 'svelte';
  import SampleImage from "$lib/samples/00100_frame0009.jpg"
	import Videoplayer from '$lib/Videoplayer.svelte';
  let activeType: CardType = CardType.ContentSearch;
  let selectedSegmentItem: SearchResult = {
            extractedFrom: "00000",
            starting_frame: 0,
            ending_frame: 9999,
            starting_time: 0,
            ending_time: 9999,
            frames: 9999,
            duration: 9999,
            frameUrl: "segment/00000/00000_frame0000.jpg",
            description: "the quiet neighbor - the quiet neighbor the quiet neighbor - the quiet neighbor the quiet neighbor - the quiet neighbor the quiet neighbor - the quiet neighbor the quiet neighbor - the quiet neighbor he quiet neighbor - the quiet neighbor the quiet neighbor - the quiet neighbor the quiet neighbor - the quiet neighbor the quiet neighbor - the quiet neighbor the quiet neighbor - the quiet neighbor he quiet neighbor - the quiet neighbor the quiet neighbor - the quiet neighbor the quiet neighbor - the quiet neighbor the quiet neighbor - the quiet neighbor the quiet neighbor - the quiet neighbor he quiet neighbor - the quiet neighbor the quiet neighbor - the quiet neighbor the quiet neighbor - the quiet neighbor the quiet neighbor - the quiet neighbor the quiet neighbor - the quiet neighbor",
            tokens: [
                "quiet",
                "neighbor",
                "quiet",
                "neighbor",
                "neighbor",
                "quiet",
                "neighbor",
                "neighbor",
                "quiet",
                "neighbor",
                "neighbor",
                "quiet",
                "neighbor",
            ]
        };

  function handleActivate(event:any) {
    activeType = event.detail;
  }

  function openDetailModal(item: SearchResult) {
    (document.getElementById("detailModal") as HTMLDialogElement).showModal();
  }

  export async function load() {
    try {
      const searchResults = await apiConnector.search(['person', 'bicycle'], 1, 10);
      // const tasks = await apiConnector.getTasks();
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div class="w-full h-full px-4">
  <div class="grid grid-cols-1 place-content-center w-full h-[7.5%]">
    <h1 class="text-5xl font-bold text text-center">bechha</h1>
  </div>
  <div class="grid grid-rows-6 w-full h-[92.5%]">
    <div class="w-full h-full row-span-1 flex flex-row flex-nowrap justify-center">
      <!-- Main Area -->
      <div class="scrollable-container">
        <div class="card-container">
          <SearchCard 
            type={CardType.ContentSearch} 
            checked={false} 
            tags={["sample tag 1", "sample tag 2"]} 
            placeholder="Search here" 
            on:activate={handleActivate} 
            active={activeType === CardType.ContentSearch} 
          />
        </div>
        <div class="card-container">
          <SearchCard 
            type={CardType.Browse} 
            checked={true} 
            options={["VideoID"]} 
            on:activate={handleActivate} 
            active={activeType === CardType.Browse} 
          />
        </div>
      </div>
    </div>
    <div class="w-full h-[calc(100% - 1.25rem)] row-span-5 mt-5">
      <!-- Results -->
      <div class="w-full h-[80%] flex flex-row flex-wrap justify-center gap-4 overflow-y-auto shadow-inner">
        {#each [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17] as item}
          <button class="card bg-base-100 shadow-xl basis-1/5 border cursor-pointer" on:click={()=>openDetailModal(item)}>
            <figure class="w-full">
              <img class="aspect-video w-full" src={SampleImage} alt="Movie">
            </figure>
            <div class="card-body p-2">
              <h2 class="card-title text-sm">VideoID: <em>{item}</em></h2>
              <p class="text-sm">Time: | <em>{item}</em> - <em>{item}</em> |  <b>ms</b></p>
            </div>
          </button>
        {/each}
      </div>
      <div class="grid w-full h-[20%] place-content-center">
        <div class="join">
          <button class="join-item btn btn-active">1</button>
        </div>
      </div>
    </div>
  </div>

  <dialog id="detailModal" class="modal">
    <div class="modal-box w-11/12 max-w-6xl grid grid-cols-3 gap-4">
      <div class="w-full col-span-1 flex flex-col gap-4">
        <h3 class="text-lg font-bold">VideoID: {selectedSegmentItem.extractedFrom}</h3>
        <p class="overflow-y-auto max-h-24 shadow-inner">Description: {selectedSegmentItem.description}</p>
        <p class="text-sm">Time: | <em>{selectedSegmentItem.starting_time}</em> - <em>{selectedSegmentItem.ending_time}</em> | (in ms)</p>
        <p class="text-sm">Frames: | <em>{selectedSegmentItem.starting_frame}</em> - <em>{selectedSegmentItem.ending_frame}</em> |</p>
        <p class="py-4">Duration: {selectedSegmentItem.duration} (in ms)</p>
        <div>
          <h3 class="font-bold mb-2"><u>Tokens</u></h3>
          <div class="flex flex-row gap-2 overflow-x-auto p-2 shadow-inner">
            {#each selectedSegmentItem.tokens as token}
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
        <svelte:component this={Videoplayer} />
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>

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