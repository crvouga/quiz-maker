<script setup lang="ts">
import { LTIContext } from "./LTI";

defineProps<{ context: LTIContext }>();
</script>

<template>
  <h1>you are an student</h1>
  <pre>
    {{ context }}
  </pre>
</template>
