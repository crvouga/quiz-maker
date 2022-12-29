<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Quiz } from "../quiz";
import { LaunchMode } from "./API_LMS";
import { API_Quiz } from "./API_Quiz";
import QuizCreate from "./QuizCreate.vue";
import { useHistoryState } from "./utils";

defineProps<{ launchMode: LaunchMode }>();

type Screen = "home" | "quiz-create";
const [screen, pushScreen] = useHistoryState(
  "instructor-app-screen",
  "home",
  (x): x is Screen =>
    typeof x === "string" && (x === "home" || x === "quiz-create")
);

//
//
//
//
//

const quizzes = ref<Quiz[]>([]);
const fetchStatus = ref<"idle" | "loading" | "error">("idle");
const fetchQuizzes = async () => {
  fetchStatus.value = "loading";
  const found = await API_Quiz.findMany();
  if (found[0] === "err") {
    fetchStatus.value = "error";
    return;
  }
  fetchStatus.value = "idle";
  quizzes.value = found[1];

  fetchStatus.value = "idle";
  quizzes.value = found[1];
};
onMounted(async () => {
  await fetchQuizzes();
});

//
//
//
//

const onCreated = async (quiz: Quiz) => {
  pushScreen("home");
  await fetchQuizzes();
};

const deepLinkQuiz = async (quiz: Quiz) => {
  await API_Quiz.deepLink(quiz);
};

const seeding = ref(false);
const seedDatabase = async () => {
  seeding.value = true;
  await API_Quiz.seed();
  seeding.value = false;
  await fetchQuizzes();
};
</script>

<template>
  <QuizCreate v-if="screen === 'quiz-create'" @created="onCreated" />
  <div v-else class="p-4">
    <h1 class="font-bold text-4xl text-left">Instructor Dashboard</h1>
    <button
      class="btn btn-primary w-full mt-3 mb-4"
      @click="pushScreen('quiz-create')">
      Create New Quiz
    </button>
    <div
      v-if="fetchStatus === 'loading'"
      class="w-full h-36 flex items-center justify-center font-bold">
      Loading quizzes...
    </div>
    <div
      v-else-if="fetchStatus === 'error'"
      class="w-full h-36 flex items-center justify-center font-bold text-red-500">
      Failed to load quizzes.
    </div>
    <div
      v-else-if="quizzes.length === 0"
      class="w-full h-36 flex flex-col items-center justify-center">
      <div class="font-bold">There are no quizzes.</div>
      <button
        class="btn btn-primary mt-4"
        @click="seedDatabase"
        :class="{ loading: seeding }">
        Add sample quizzes
      </button>
    </div>
    <div
      v-else
      v-for="quiz in quizzes"
      v-bind:key="quiz.id"
      class="flex items-center px-2">
      <div class="text-lg font-bold flex-1 py-3">
        {{ quiz.title }}
      </div>
      <button
        v-if="launchMode === 'DeepLinking'"
        class="btn btn-primary"
        @click="deepLinkQuiz(quiz)">
        Deep Link
      </button>
    </div>
  </div>
</template>
