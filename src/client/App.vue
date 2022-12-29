<script setup lang="ts">
import { onMounted, ref } from "vue";
import { LMS_Context, toRole } from "../lti";
import AppInstructor from "./App.Instructor.vue";
import AppStudent from "./App.Student.vue";
import { API_LMS, LaunchMode } from "./API_LMS";

const context = ref<LMS_Context | null>(null);

onMounted(async () => {
  const got = await API_LMS.getContext();

  if (got[0] === "ok") {
    context.value = got[1];
    return;
  }
});

const launchMode = ref<LaunchMode>("Default");
onMounted(() => {
  launchMode.value = API_LMS.getLaunchMode();
});
</script>

<template>
  <div
    class="w-screen h-screen flex items-center justify-center font-bold"
    v-if="!context">
    Loading...
  </div>
  <AppInstructor
    v-else-if="toRole(context) === 'Instructor'"
    :launch-mode="launchMode"
    :context="context" />
  <AppStudent v-else-if="toRole(context) === 'Student'" :context="context" />
</template>

<!-- tailwind boilerplate -->
<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
