<script setup lang="ts">
import { onMounted, ref } from "vue";
import AppInstructor from "./App.Instructor.vue";
import AppStudent from "./App.Student.vue";
import { LTI, LTIContext, LTILaunch } from "./LTI";

const context = ref<LTIContext | null>(null);

onMounted(async () => {
  const got = await LTI.getContext();

  if (got[0] === "ok") {
    context.value = got[1];
    return;
  }

  console.error(got);
});

const launch = ref<LTILaunch>("Default");
onMounted(() => {
  launch.value = LTI.getLTILaunch();
});
</script>

<template>
  <div
    class="w-screen h-screen flex items-center justify-center font-bold"
    v-if="!context">
    Loading...
  </div>
  <AppInstructor
    v-else-if="LTI.contextToRole(context) === 'Instructor'"
    :launch="launch"
    :context="context" />
  <AppStudent
    v-else-if="LTI.contextToRole(context) === 'Student'"
    :context="context" />
</template>

<!-- tailwind boilerplate -->
<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
