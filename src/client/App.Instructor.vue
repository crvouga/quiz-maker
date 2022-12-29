<script setup lang="ts">
import AppInstructorDefault from "./App.Instructor.Default.vue";
import AppInstructorQuiz from "./App.Instructor.Quiz.vue";
import { LTIContext, LTILaunch } from "./LTI";

defineProps<{ context: LTIContext; launch: LTILaunch }>();
</script>

<template>
  <div class="bg-primary text-white text-center py-2 font-bold w-full">
    Instructor View
  </div>
  <AppInstructorDefault
    v-if="context.custom.type === 'default'"
    :launch="launch" />
  <AppInstructorQuiz
    v-if="context.custom.type === 'quiz'"
    :quiz-id="context.custom.quizId" />
</template>
