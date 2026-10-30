<script>
  import { createEventDispatcher } from "svelte";
  import Check from "svelte-material-icons/Check.svelte";
  import Close from "svelte-material-icons/Close.svelte";

  /** @type {{ front: string; back: string; box: number }}*/
  export let card;

  let flipped = false;

  const dispatch = createEventDispatcher();
</script>

<div
  class="overflow-auto rounded flex flex-col justify-between border-2 bg-amber-300 border-amber-400 text-center h-full w-full"
>
  <div class="p-4 bg-amber-300">
    <h4 class="text-2xl text-amber-950">
      {card.front}
    </h4>
  </div>
  <button
    on:click={() => (flipped = !flipped)}
    class="font-serif text-xl m-auto block pt-2 pb-3 px-3 w-full rounded"
  >
    {#if !flipped}
      Show
    {:else}
      {card.back}
    {/if}
  </button>
  {#if flipped}
    <div class="flex justify-end p-4 w-full gap-4">
      <button
        on:click={() => dispatch("userForgot")}
        class="bg-red-400 px-3 py-3 rounded-full text-2xl text-red-900"
      >
        <Close />
      </button>
      <button
        on:click={() => dispatch("userRemembered")}
        class=" bg-green-400 px-3 py-3 rounded-full text-2xl text-green-900"
      >
        <Check />
      </button>
    </div>
  {/if}
</div>
