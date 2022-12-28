<script lang="ts" setup>
import { LTIInfo } from "./LTI";

defineProps<{ info: LTIInfo }>();
</script>
<template>
  <div class="p-4">
    <h1 class="font-bold text-4xl text-center">Hello, {{ info.name }}</h1>
    <a class="btn btn-primary w-full mt-3" href="#/quiz-create">
      Create New Quiz
    </a>
  </div>
</template>
