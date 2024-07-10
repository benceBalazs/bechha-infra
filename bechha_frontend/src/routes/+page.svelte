<!-- <script lang="ts">
  import { onMount } from 'svelte';

  interface VideoResult {
    id: number;
    keyframe: number;
    time: string;
  }

  let results: VideoResult[] = [];
  let searchQuery: string = '';
  let videoFile: File | null = null;
  let modalContent: VideoResult = { id: 0, keyframe: 0, time: '' };
  let currentPage: number = 1;
  let itemsPerPage: number = 12;
  let paginatedResults: VideoResult[] = [];

  const handleSearch = async () => {
    // Fetch results based on searchQuery
    // results = await fetchResults(searchQuery);
    paginateResults();
  };

  const handleUpload = async () => {
    if (videoFile) {
      // Upload video and handle response
      // const response = await uploadVideo(videoFile);
    }
  };

  const openModal = (item: VideoResult) => {
    modalContent = item;
    (document.getElementById('modal') as HTMLInputElement).checked = true;
  };

  const paginateResults = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    paginatedResults = results.slice(start, end);
  };

  onMount(() => {
    // Simulated results for display purposes
    results = Array.from({ length: 60 }, (_, i) => ({
      id: 1337,
      keyframe: 4885,
      time: '18:23:43',
    }));
    paginateResults();
  });

  const nextPage = () => {
    currentPage++;
    paginateResults();
  };

  const prevPage = () => {
    currentPage--;
    paginateResults();
  };

  const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      videoFile = input.files[0];
    } else {
      videoFile = null;
    }
  };
</script>

<div class="min-h-screen bg-gray-100 p-6">
  <div class="flex justify-between items-center mb-4">
    <div class="text-lg">
      <span class="font-bold">DRES Server Status:</span> 
      <span class="text-green-600 ml-2">● Connected</span>
    </div>
    <h1 class="text-4xl font-bold text-center text-gray-800">bechha</h1>
  </div>

  <div class="bg-white p-6 rounded-lg shadow-lg mb-6 flex justify-between">
    <div class="w-1/2 pr-2">
      <h2 class="text-xl font-semibold mb-2">Content Search</h2>
      <input type="text" bind:value={searchQuery} placeholder="Content Filter (e.g., Cheese, Oregano, Bicycle)" class="input input-bordered w-full" />
    </div>
    <div class="w-1/2 pl-2">
      <h2 class="text-xl font-semibold mb-2">Browsing</h2>
      <select class="select select-bordered w-full">
        <option>Sort by VideoID</option>
        <option>Sort by Date</option>
        <option>Sort by Color</option>
      </select>
    </div>
    <div class="w-1/2 pl-2">
      <h2 class="text-xl font-semibold mb-2">Upload Video</h2>
      <input type="file" on:change={handleFileChange} class="file-input file-input-bordered w-full max-w-xs" />
      <button class="btn btn-primary ml-2" on:click={handleUpload}>Upload</button>
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {#each paginatedResults as result}
      <div class="card bg-white shadow-xl p-4" on:click={() => openModal(result)}>
        <div class="card-body">
          <h2 class="card-title text-lg">VideoID: {result.id}</h2>
          <p>Keyframe: {result.keyframe}</p>
          <p>Time: {result.time}</p>
        </div>
        <div class="w-full h-32 bg-gray-200 flex items-center justify-center">
          <span class="text-gray-500">Thumbnail</span>
        </div>
      </div>
    {/each}
  </div>

  <div class="flex justify-center mt-4">
    {#if currentPage > 1}
      <button class="btn btn-outline mr-2" on:click={prevPage}>&lt; Previous</button>
    {/if}
    <div class="flex space-x-1">
      {#each Array(Math.ceil(results.length / itemsPerPage)).fill(0).map((_, i) => i + 1) as page}
        <button class:btn-primary={page === currentPage} on:click={() => { currentPage = page; paginateResults(); }}>{page}</button>
      {/each}
    </div>
    {#if results.length > currentPage * itemsPerPage}
      <button class="btn btn-outline ml-2" on:click={nextPage}>Next &gt;</button>
    {/if}
  </div>

  <input type="checkbox" id="modal" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">VideoID: {modalContent.id}</h3>
      <p>Keyframe: {modalContent.keyframe}</p>
      <p>Time: {modalContent.time}</p>
      <p>Metadata: ...</p>
      <button class="btn btn-primary mt-4">Submit to DRES Task</button>
      <div class="mt-4">
        <h4 class="font-bold text-lg mb-2">Similar Videos</h4>
        <div class="flex space-x-4">
          {#each Array(5) as _, i}
            <div class="w-1/5 h-24 bg-gray-200 flex items-center justify-center">
              <div>
                <p>VideoID: {modalContent.id}</p>
                <p>Keyframe: {modalContent.keyframe}</p>
                <p>Time: {modalContent.time}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div class="modal-action">
        <label for="modal" class="btn">Close</label>
      </div>
    </div>
  </div>
</div> -->
<script>
import apiConnector from '$lib/ApiConnector';



export async function load() {
    try {
        const searchResults = await apiConnector.search(['person', 'bicycle'], 1, 10);
        // const tasks = await apiConnector.getTasks();
    } catch (error) {
        console.error(error);
    }
}
</script>

<div class="w-full h-full px-64">
  <div class="grid grid-cols-1 place-content-center w-full h-[7.5%]">
      <h1 class="text-5xl font-bold text text-center">bechha</h1>
  </div>
  <div class="grid grid-rows-6 w-full h-[92.5%]">
    <div class="w-full h-full row-span-1 flex flex-row flex-nowrap">
      <!-- Main Area -->
      <div class="flex-1 flex gap-4 p-2">
        <!-- Search Features -->
        <!-- <div class="card lg:card-side bg-base-100 shadow-xl h-full w-auto">
          <h2 class="card-title pl-4">Content Search</h2>
          <div class="card-body">
            <div>
              Body stuff
            </div>
            <h2 class="card-title">Tag Filter</h2>
            <div class="card-actions justify-end">
              <button class="btn btn-primary">Search</button>
            </div>
          </div>
        </div> -->
        <div class="border-2 border-black rounded-lg shadow-2xl grid grid-rows-4 grow cursor-pointer">
          <div class="row-span-1 grid grid-cols-4 place-content-center">
            <h2 class="text-left col-span-3 pl-4">Content Search</h2>
            <div class="w-full h-full grid place-content-end">
              <input type="checkbox" checked={false} class="checkbox col-span-1 mr-4 border-black" />
            </div>
          </div>
          <div class="row-span-3">
            <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs row-span-1" />
            <div class="row-span-2">
              <!-- infinite scroll neded TODO -->
              <div class="badge badge-outline gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="inline-block h-4 w-4 stroke-current">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                sample tag 1
              </div>
            </div>
          </div>
        </div>
        <div class="divider divider-horizontal w-fit py-4 flex-none"></div>
        <div class="border-2 border-black border-double rounded-md grid grid-rows-4 grow cursor-pointer opacity-50">
          <div class="row-span-1 grid grid-cols-4">
            <h2 class="text-left col-span-3">Browse</h2>
            <input type="checkbox" checked={false} class="checkbox col-span-1" />
          </div>
          <div class="row-span-3">
            <select class="select select-bordered w-full max-w-xs">
              <option disabled selected>Who shot first?</option>
              <option>Han Solo</option>
              <option>Greedo</option>
            </select>
          </div>
        </div>
      </div>
      <div class="divider divider-horizontal divider-neutral w-fit py-4 flex-none"></div>
      <div class="grid place-content-center gap-4 flex-initial">
        <!-- Upload -->
         <h1 class="text-xl font-medium text-center">Upload files here <span class="text-2xl font-bold">☟</span></h1>
        <input type="file" class="file-input file-input-bordered w-full max-w-xs" />
      </div>
    </div>
    <div class="w-full h-full row-span-5 bg-blue-500">
      <!-- Results -->
       <div class="w-full h-full grid place-content-center text-4xl">
        Make a query, results to be implemented
       </div>
    </div>
  </div>
</div>

<style>
  
</style>