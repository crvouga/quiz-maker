<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
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
  console.log("getting info");
  const got = await LTI.getInfo();
  console.log("got info", { got });
  if (got[0] === "ok") {
    info.value = got[1];
  }
});

console.log("HELLO");
onMounted(() => {
  console.log(info.value);
});
watch(info, (info) => {
  console.log(info);
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
