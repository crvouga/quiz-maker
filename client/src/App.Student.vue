<script setup lang="ts">
import AppStudentDefaultVue from "./App.Student.Default.vue";
import AppStudentQuizVue from "./App.Student.Quiz.vue";
import { LTIContext } from "./LTI";

defineProps<{
  context: LTIContext;
}>();
</script>

<template>
  <AppStudentDefaultVue v-if="context.custom.type === 'default'" />
  <AppStudentQuizVue
    v-else-if="context.custom.type === 'quiz'"
    :quiz-id="context.custom.quizId" />
</template>
