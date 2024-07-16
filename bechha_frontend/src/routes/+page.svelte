<script lang="ts">
  import apiConnector from '$lib/ApiConnector';
  import SearchCard from '$lib/SearchCard.svelte';
  import { CardType } from '$lib/types';
  import { onMount } from 'svelte';
  import SampleImage from "$lib/samples/00100_frame0009.jpg"
  let activeType: CardType = CardType.ContentSearch;

  function handleActivate(event:any) {
    activeType = event.detail;
  }

  export async function load() {
    try {
      const searchResults = await apiConnector.search(['person', 'bicycle'], 1, 10);
      // const tasks = await apiConnector.getTasks();
    } catch (error) {
      console.error(error);
    }
  }

  function openModal(item:any) {
    (document.getElementById('modal-description') as any).innerText = 'Video ' + item + ' detailed description...';
    (document.getElementById('modal') as any).style.display = 'flex';
  }

  function closeModal() {
    (document.getElementById('modal') as any).style.display = 'none';
  }
</script>

<div class="w-full h-full px-64">
  <div class="grid grid-cols-1 place-content-center w-full h-[7.5%]">
    <h1 class="text-5xl font-bold text text-center">bechha</h1>
  </div>
  <div class="grid grid-rows-6 w-full h-[92.5%]">
    <div class="w-full h-full row-span-1 flex flex-row flex-nowrap">
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
        <!-- <div class="divider divider-horizontal w-fit py-4 flex-none"></div> -->
        <div class="card-container">
          <SearchCard 
            type={CardType.Browse} 
            checked={true} 
            options={["Han Solo", "Greedo", "Luke Skywalker"]} 
            on:activate={handleActivate} 
            active={activeType === CardType.Browse} 
          />
        </div>
      </div>
      <div class="divider divider-horizontal divider-neutral w-fit py-4 flex-none"></div>
      <div class="grid place-content-center gap-4 flex-initial">
        <!-- Upload -->
        <h1 class="text-xl font-medium text-center">Upload files here <span class="text-2xl font-bold">☟</span></h1>
        <input type="file" class="file-input file-input-bordered w-full max-w-xs" />
      </div>
    </div>
    <div class="w-full h-[calc(100% - 1.25rem)] row-span-5 mt-5 overflow-y-auto">
      <!-- Results -->
      <div class="w-full h-full flex flex-row flex-wrap justify-between gap-2">
        {#each [1,2,3,4,5] as item}
          <button class="card bg-base-100 shadow-xl flex-none basis-1/5 border cursor-pointer" on:click={()=>openModal({item})}>
            <figure class="w-full">
              <img class="aspect-video w-full" src={SampleImage} alt="Movie">
            </figure>
            <div class="card-body p-2">
              <h2 class="card-title text-sm">Video {item }</h2>
              <p class="text-sm">videoID: {item}</p>
              <p class="text-sm">timeframe: {item * 10}ms</p>
            </div>
          </button>
        {/each}
      </div>
      <div class="join mt-4">
        <button class="join-item btn">1</button>
        <button class="join-item btn btn-active">2</button>
        <button class="join-item btn">3</button>
        <button class="join-item btn">4</button>
      </div>
    </div>
    
    <!-- Modal -->
    <div id="modal" class="modal flex">
      <div class="modal-content">
        <div class="flex-1">
          <h2 class="text-2xl">Detailed Description</h2>
          <p id="modal-description"></p>
          <button class="btn mt-4" on:click={closeModal}>Close</button>
        </div>
        <div class="flex-1">
          <!-- svelte-ignore a11y-media-has-caption -->
          <video id="modal-video" controls class="w-full h-full">
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
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
  .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.5);
      justify-content: center;
      align-items: center;
    }
    .modal-content {
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      display: flex;
      flex-direction: row;
      gap: 20px;
    }
</style>