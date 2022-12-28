<script setup lang="ts">
import { LTIInfo } from "./LTI";
import { Quiz } from "./Quiz";
import { Id } from "./Id";

defineProps<{ info: LTIInfo }>();

const postQuiz = async () => {
  await Quiz.post({
    id: Id.generate(),
    title: "test",
    questions: [],
  });
};
</script>

<template>
  <div class="flex flex-col justify-center">
    <h1 class="font-bold text-2xl">Create New Quiz</h1>

    <!-- 

    Title

   -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Quiz Title</span>
      </label>
      <label class="input-group">
        <input
          type="text"
          placeholder="My quiz"
          class="input input-primary input-bordered" />
      </label>
    </div>

    <!-- 

    Title

   -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Quiz Questions</span>
      </label>
      <label class="input-group">
        <input
          type="text"
          placeholder="Question"
          class="input input-primary input-bordered" />
      </label>
    </div>

    <!-- 



     -->

    <button @click="postQuiz" class="mt-4 btn btn-primary">
      Create New Quiz
    </button>
  </div>
</template>
