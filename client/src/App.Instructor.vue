<script setup lang="ts">
import { LTIInfo } from "./LTI";

defineProps<{ info: LTIInfo }>();
</script>

<template>
  <h1>you are an instructor</h1>
  <pre>
    {{ info }}
  </pre>
</template>
