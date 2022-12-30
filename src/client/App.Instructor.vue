<script setup lang="ts">
import { LTI_Context } from "../lti";
import { LaunchMode } from "./API_LMS";
import AppInstructorDefault from "./App.Instructor.Default.vue";
import AppInstructorQuiz from "./App.Instructor.Quiz.vue";

defineProps<{ context: LTI_Context; launchMode: LaunchMode }>();
</script>

<template>
  <div class="bg-primary text-white text-center py-2 font-bold w-full">
    Instructor View
  </div>
  <AppInstructorDefault
    v-if="context.custom.type === 'default'"
    :launch-mode="launchMode" />
  <AppInstructorQuiz
    v-if="context.custom.type === 'quiz'"
    :quiz-id="context.custom.quizId"
    :context="context" />
</template>
