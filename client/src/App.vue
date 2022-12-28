<script setup lang="ts">
import { ref, onMounted } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import { LTI, LTIMember } from "./LTI";

const members = ref<LTIMember[]>([]);

onMounted(async () => {
  console.log("mounted");
  const got = await LTI.getMembers();

  if (got[0] === "ok") {
    members.value = got[1];
  }
});
</script>

<template>
  <!-- <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="COol" /> -->
  <h1 class="text-3xl font-bold underline">Hello world!</h1>

  <pre class="text-left">
    {{ JSON.stringify(members, null, 2) }}
  </pre>

  <button class="btn">Click me</button>
</template>

<!-- <style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style> -->
