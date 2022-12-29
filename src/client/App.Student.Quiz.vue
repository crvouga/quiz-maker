<script setup lang="ts">
import { onMounted, ref } from "vue";
import QuizVue from "./Quiz.vue";
import { Quiz, API_Quiz } from "./API_Quiz";

const props = defineProps<{
  quizId: string;
}>();

type QuizState = ["loading"] | ["err", string] | ["ok", Quiz];

const state = ref<QuizState>(["loading"]);

const fetchQuiz = async () => {
  const found = await API_Quiz.findOne({ quizId: props.quizId });
  state.value = found;
};

onMounted(() => {
  fetchQuiz();
});
</script>

<template>
  <div
    v-if="state[0] === 'loading'"
    class="flex items-center justify-center h-36">
    Loading quiz...
  </div>
  <div
    v-else-if="state[0] === 'err'"
    class="flex items-center justify-center h-36 text-red-400">
    Failed to load quiz.
    {{ state[1] }}
  </div>
  <QuizVue v-if="state[0] === 'ok'" :quiz="state[1]" />
</template>
