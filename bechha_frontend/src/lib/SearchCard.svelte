<script lang="ts">
  import { CardType } from "./types";
  import { createEventDispatcher, onMount } from 'svelte';
  import MultiSelect from 'svelte-multiselect';
  let loading = false;
  export let selected: string[];

  $: if (selected) {
    loading = true;
    setTimeout(async () => {
      if(selected.length!=0){
        dispatch('tagselection', {selected});
      }
      loading = false;
    }, 1000);
}

  export let type: CardType;
  export let active: boolean = false;

  // Additional props can be added for future flexibility
  export let checked: boolean = false;
  export let options: string[] = ["Han Solo", "Greedo"];
  
  onMount(()=>{

  });

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
  aria-label={type === CardType.ContentSearch ? "Content Search" : "Browse"}
>
  <div class="w-full h-full">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg font-bold">{type === CardType.ContentSearch ? "Content Search" : "Browse"}</h2>
      {#if active}
        <input type="checkbox" bind:checked class="checkbox checkbox-primary border-black" />
      {:else}
        <input type="checkbox" class="checkbox checkbox-primary border-black opacity-80" />
      {/if}
    </div>
    {#if type === CardType.ContentSearch}
    <div class="w-full">
      <MultiSelect
      id="searchtags"
      options={options}
      placeholder="Take your pick..."
      bind:selected
      {loading}
    />
    </div>
    {:else if type === CardType.Browse}
      <select class="select select-bordered w-full">
        {#each options as option}
          <option>{option}</option>
        {/each}
      </select>
    {/if}
  </div>
</button>

<style>
  button {
    transition: box-shadow 0.3s ease, opacity 0.3s ease, border-color 0.3s ease; /* Smooth transition for shadow, opacity, and border color */
    width: 100%;
    border-width: 2px; /* Ensure consistent border width */
  }
</style>
