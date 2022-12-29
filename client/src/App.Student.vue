<script setup lang="ts">
import { AppMode } from "./app-mode";
import AppStudentDefaultVue from "./App.Student.Default.vue";
import AppStudentQuizVue from "./App.Student.Quiz.vue";
import { LTIContext } from "./LTI";

defineProps<{
  context: LTIContext;
  appMode: AppMode;
}>();
</script>

<template>
  <AppStudentDefaultVue v-if="context.custom.type === 'default'" />
  <AppStudentQuizVue
    v-else-if="context.custom.type === 'quiz'"
    :context="context"
    :app-mode="appMode"
    :quiz-id="context.custom.quizId" />
</template>
