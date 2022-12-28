<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import AppInstructor from "./App.Instructor.vue";
import AppStudent from "./App.Student.vue";
import { AppMode } from "./app-mode";
import { LTI, LTIInfo, LTIMember } from "./LTI";

const members = ref<LTIMember[]>([]);
onMounted(async () => {
  const got = await LTI.getMembers();
  if (got[0] === "ok") {
    members.value = got[1];
  }
});

const info = ref<LTIInfo>();
const role = computed(() => {
  if (info.value) {
    return LTI.toRole(info.value);
  }
  return null;
});

onMounted(async () => {
  const got = await LTI.getInfo();

  if (got[0] === "ok") {
    info.value = got[1];
  }
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
  <pre>
    {{ info }}
  </pre>
  <div
    class="w-screen h-screen flex items-center justify-center font-bold"
    v-if="!info">
    Loading...
  </div>
  <AppInstructor
    v-else-if="role === 'Instructor'"
    :appMode="appMode"
    :info="info" />
  <AppStudent v-else-if="role === 'Student'" :info="info" />
</template>
