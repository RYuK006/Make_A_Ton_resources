<script>
  import { writable } from "svelte/store";
  import Card from "./Card.svelte";
  import space from "./space";

  /** @type {number}*/
  export let range;

  /** @type { import('svelte/store').Writable<{ front: string; back: string; box: number }[]>}*/
  export let questions;

  /**
   * Filters questions
   * @param qns
   * @returns {{ front: string; back: string; box: number }[]}
   */
  const filteredQuestions = qns =>
    qns
      .filter(qn => space[range - 1].boxes.includes(qn.box))
      .slice(0, range + 1);

  let filtered = [];
  $: filtered = filteredQuestions($questions).slice(0, range + 1);

  $: console.log(range - 1, filtered);
</script>

<div class="card-container">
  {#if filtered}
    <div
      class="card rounded bg-amber-300 flex items-center justify-center w-full text-2xl text-amber-950"
    >
      All done!
    </div>
  {/if}
  {#each filtered as card (card.front)}
    <div class="card w-full">
      <Card
        {card}
        on:userForgot={() => {
          card.box = 0;
          const i = $questions.indexOf(card);
          $questions[i].box = 0;
          // const spliced = $questions.splice(i, 1);
          $questions = $questions;
        }}
        on:userRemembered={() => {
          card.box++;
          $questions[$questions.indexOf(card)].box++;
          $questions = $questions;
          filtered.splice(filtered.indexOf(card), 1);
        }}
      />
    </div>
  {/each}
</div>

<style>
  .card-container {
    display: flex;
    position: relative;
    min-height: max-content;
    height: 15rem;
    @apply my-5 shadow-md shadow-gray-400;
  }

  .card {
    height: 15rem;
    position: absolute;
  }
</style>
