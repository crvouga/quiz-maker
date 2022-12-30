<script setup lang="ts">
import { LTI_Context } from "../lti";
import AppStudentDefaultVue from "./App.Student.Default.vue";
import AppStudentQuizVue from "./App.Student.Quiz.vue";

defineProps<{
  context: LTI_Context;
}>();
</script>

<template>
  <AppStudentDefaultVue v-if="context.custom.type === 'default'" />
  <AppStudentQuizVue
    v-else-if="context.custom.type === 'quiz'"
    :context="context"
    :quiz-id="context.custom.quizId" />
</template>
