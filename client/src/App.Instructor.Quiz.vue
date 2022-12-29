<script setup lang="ts">
import { onMounted, ref } from "vue";
import { AppMode } from "./app-mode";
import { LTIContext } from "./LTI";
import { Quiz, QuizAPI } from "./QuizAPI";

const props = defineProps<{
  context: LTIContext;
  appMode: AppMode;
  quizId: string;
}>();

type QuizState = ["loading"] | ["err", string] | ["ok", Quiz];

const state = ref<QuizState>(["loading"]);

const fetchQuiz = async () => {
  const found = await QuizAPI.findOne({ quizId: props.quizId });
  state.value = found;
};

onMounted(() => {
  fetchQuiz();
});
</script>

<template>
  <div>
    quiz context
    {{ quizId }}
    app mode
    {{ appMode }}
    <pre> {{ state }}</pre>
  </div>
</template>
