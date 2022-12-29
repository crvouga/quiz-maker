<script setup lang="ts">
import { LMS_Context } from "../lti";
import AppStudentDefaultVue from "./App.Student.Default.vue";
import AppStudentQuizVue from "./App.Student.Quiz.vue";

defineProps<{
  context: LMS_Context;
}>();
</script>

<template>
  <AppStudentDefaultVue v-if="context.custom.type === 'default'" />
  <AppStudentQuizVue
    v-else-if="context.custom.type === 'quiz'"
    :quiz-id="context.custom.quizId" />
</template>
