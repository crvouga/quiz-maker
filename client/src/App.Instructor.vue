<script setup lang="ts">
import { AppMode } from "./app-mode";
import AppInstructorDefault from "./App.Instructor.Default.vue";
import AppInstructorQuiz from "./App.Instructor.Quiz.vue";
import { LTIContext } from "./LTI";

defineProps<{ context: LTIContext; appMode: AppMode }>();
</script>

<template>
  <AppInstructorDefault
    v-if="context.custom.type === 'default'"
    :context="context"
    :app-mode="appMode" />
  <AppInstructorQuiz
    v-if="context.custom.type === 'quiz'"
    :context="context"
    :app-mode="appMode"
    :quiz-id="context.custom.quizId" />
</template>
