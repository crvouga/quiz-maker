<script setup lang="ts">
import { LTIInfo } from "./LTI";
import { Quiz } from "./Quiz";
import QuizCreate from "./QuizCreate.vue";
import { useHistoryState } from "./useHistoryState";

defineProps<{ info: LTIInfo }>();

type Screen = "home" | "quiz-create";
const [screen, pushScreen] = useHistoryState(
  "instructor-app-screen",
  "home",
  (x): x is Screen =>
    typeof x === "string" && (x === "home" || x === "quiz-create")
);
const onCreated = (quiz: Quiz) => {
  pushScreen("home");
  console.log(quiz);
};
</script>

<template>
  <QuizCreate
    v-if="screen === 'quiz-create'"
    :info="info"
    @created="onCreated" />
  <div v-else class="p-4">
    <h1 class="font-bold text-4xl text-center">Hello, {{ info.name }}</h1>
    <button
      class="btn btn-primary w-full mt-3"
      @click="pushScreen('quiz-create')">
      Create New Quiz
    </button>
  </div>
</template>
