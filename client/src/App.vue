<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import AppInstructor from "./App.Instructor.vue";
import AppStudent from "./App.Student.vue";
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
</script>

<template>
  <div
    class="w-screen h-screen flex items-center justify-center font-bold"
    v-if="!info">
    Loading...
  </div>
  <AppInstructor v-else-if="role === 'Instructor'" :info="info" />
  <AppStudent v-else-if="role === 'Student'" :info="info" />
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
