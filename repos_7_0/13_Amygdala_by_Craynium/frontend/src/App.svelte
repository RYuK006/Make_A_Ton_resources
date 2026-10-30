<script>
  import { writable } from "svelte/store";
  import Cards from "./lib/Cards.svelte";
  import Footer from "./lib/Footer.svelte";

  let data = {};

  let questions = writable([]);

  const loadQuestions = async url => {
    loading = true;
    const questionsPromise = fetch(
      `${import.meta.env.VITE_SERVER_URL}/text?url=${url}`
    );
    const questionsResponse = await questionsPromise;
    data = await questionsResponse.json();
    $questions = data.questions;
    $questions = $questions.flatMap((el, i) =>
      el.map(qn => ({ front: qn.front, back: qn.back, box: 1 }))
    );
    loading = false;
  };

  $: console.log($questions);

  let url = "";
  let loading = false;

  function handleFormSubmit() {
    loadQuestions(url);
  }

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("url")) {
    const searchURL = urlParams.get("url");
    url = searchURL;

    loadQuestions(url);
  }
</script>

<section
  class="h-[calc(100vh/3)] mb-10 bg-amber-900 rounded-b-2xl flex items-center justify-center flex-col gap-10"
>
  <div>
    <h1 class="text-5xl font-bold text-center text-amber-200">Amygdala</h1>
    <p class="mt-2 text-center text-amber-200 opacity-80">
      Using AI to make humans smarter.
    </p>
  </div>
  <form on:submit|preventDefault={handleFormSubmit}>
    <input
      bind:value={url}
      type="text"
      name="url"
      id="url"
      placeholder="Enter URL"
      class="bg-amber-100 px-4 py-2 border-amber-100 border-2 rounded focus-visible:outline-none focus:border-amber-500 text-amber-950"
    />
    <button
      type="submit"
      class="px-4 py-2 font-bold bg-amber-200 rounded border-amber-200 border-2 text-amber-900 hover:bg-amber-300 hover:border-amber-300"
      >Submit</button
    >
  </form>
</section>

<main class="mx-auto my-15 max-w-screen-sm w-9/12 min-h-screen">
  <h2 class="text-3xl font-bold text-amber-900">
    {#if data.title}
      {data.title}
    {/if}
  </h2>

  {#if data.paragraphs}
    {#each data.paragraphs as item, i (i)}
      <p class="py-2">{@html item}</p>
      {#if $questions.length > 0}
        <Cards range={i + 1} {questions} />
      {/if}
    {/each}
  {:else if !loading}
    <p class="text-4xl font-light text-center text-amber-900 opacity-30 pt-16">
      Enter a URL to start
    </p>
  {/if}
  {#if loading}
    <p class="text-4xl font-light text-center text-amber-900 opacity-30 pt-16">
      Loading... <br /> <br />
      <small>This will take some time. Please wait.</small>
    </p>
  {/if}
</main>

<Footer />
