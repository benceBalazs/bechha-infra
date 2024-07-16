<script lang="ts">
  import { CardType } from "./types";
  import { createEventDispatcher } from 'svelte';

  export let type: CardType;
  export let active: boolean = false;

  // Additional props can be added for future flexibility
  export let checked: boolean = false;
  export let tags: string[] = ["sample tag 1"];
  export let placeholder: string = "Type here";
  export let options: string[] = ["Han Solo", "Greedo"];

  const dispatch = createEventDispatcher();

  function activateCard() {
    dispatch('activate', type);
  }
</script>

<button
  type="button"
  class="border rounded-lg p-4 cursor-pointer transition-transform transform hover:scale-105 h-full flex flex-col justify-between"
  class:shadow-lg={active}
  class:border-black={active}
  class:border-gray-300={!active}
  class:opacity-80={!active}
  class:opacity-100={active}
  on:click={activateCard}
  on:keydown={(e) => e.key === 'Enter' && activateCard()}
  aria-label={type === CardType.ContentSearch ? "Content Search" : "Browse"}
>
  <div>
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg font-bold">{type === CardType.ContentSearch ? "Content Search" : "Browse"}</h2>
      {#if active}
        <input type="checkbox" bind:checked class="checkbox checkbox-primary border-black" />
      {/if}
    </div>
    {#if type === CardType.ContentSearch}
      <input type="text" placeholder={placeholder} class="input input-bordered w-full mb-2" />
    {:else if type === CardType.Browse}
      <select class="select select-bordered w-full">
        {#each options as option}
          <option>{option}</option>
        {/each}
      </select>
    {/if}
  </div>
  <div class="flex flex-wrap gap-2 overflow-hidden">
    {#each tags as tag}
      <div class="badge badge-outline flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-4 w-4 stroke-current">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        {tag}
      </div>
    {/each}
  </div>
</button>

<style>
  button {
    transition: box-shadow 0.3s ease, opacity 0.3s ease, border-color 0.3s ease; /* Smooth transition for shadow, opacity, and border color */
    width: 100%;
    border-width: 2px; /* Ensure consistent border width */
  }
</style>
