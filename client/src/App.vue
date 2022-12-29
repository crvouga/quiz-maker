<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { AppMode } from "./app-mode";
import AppInstructor from "./App.Instructor.vue";
import AppStudent from "./App.Student.vue";
import { LTI, LTIContext } from "./LTI";

const context = ref<LTIContext>();
const role = computed(() => {
  if (context.value) {
    return LTI.contextToRole(context.value);
  }
  return null;
});
onMounted(async () => {
  const got = await LTI.getContext();

  if (got[0] === "ok") {
    context.value = got[1];
    return;
  }

  console.error(got);
});

//
//
//

const appMode = ref<AppMode>("default");
onMounted(() => {
  if (window.location.pathname === "/deeplink") {
    appMode.value = "deepLinking";
    return;
  }
  appMode.value = "default";
  return;
});
</script>

<template>
  <div
    class="w-screen h-screen flex items-center justify-center font-bold"
    v-if="!context">
    Loading...
  </div>
  <AppInstructor
    v-else-if="role === 'Instructor'"
    :appMode="appMode"
    :context="context" />
  <AppStudent
    v-else-if="role === 'Student'"
    :context="context"
    :appMode="appMode" />
</template>
