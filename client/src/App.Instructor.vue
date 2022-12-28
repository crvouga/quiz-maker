<script setup lang="ts">
import { computed, ref } from "vue";
import InstructorHome from "./App.Instructor.Home.vue";
import { LTIInfo } from "./LTI";
import QuizCreate from "./QuizCreate.vue";
import QuizQuestionCreate from "./QuizQuestionCreate.vue";

defineProps<{ info: LTIInfo }>();

const currentPath = ref(window.location.hash);
window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash;
});
const currentView = computed(() => {
  const key = currentPath.value.slice(1) || "/";
  return key;
});
</script>

<template>
  <InstructorHome v-if="currentView === '/'" :info="info" />
  <QuizCreate v-else-if="currentView === '/quiz-create'" :info="info" />
  <QuizQuestionCreate
    v-else-if="currentView === '/quiz-question-create'"
    :info="info" />
  <InstructorHome v-else :info="info" />
</template>
