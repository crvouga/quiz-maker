<script setup lang="ts">
import { LTIInfo } from "./LTI";
import { Quiz, Question } from "./Quiz";
import { Id } from "./Id";
import { onMounted, ref, watch } from "vue";

defineProps<{ info: LTIInfo }>();

const query = ref<string>("");
const questions = ref<Question[]>([]);
const selected = ref<Question[]>([]);

onMounted(async () => {
  const result = await Quiz.Question.search({ query: "" });

  if (result[0] === "err") {
    console.log(result);
    return;
  }

  questions.value = result[1].hits;
});

watch(query, async (query) => {
  const result = await Quiz.Question.search({ query });

  if (result[0] === "err") {
    console.log(result);
    return;
  }

  questions.value = result[1].hits;
});

const postQuiz = async () => {
  await Quiz.post({
    id: Id.generate(),
    title: "test",
    questions: [],
  });
};
</script>

<template>
  <div class="flex flex-col justify-center items-center p-4">
    <h1 class="font-bold text-2xl">Create New Quiz</h1>

    <!-- 

    Title

   -->
    <div class="w-full form-control">
      <label class="label">
        <span class="label-text">Quiz Title</span>
      </label>

      <input
        type="text"
        placeholder="My quiz"
        class="w-full input input-primary input-bordered" />
    </div>

    <!-- 

    Questions

   -->

    <div class="w-full form-control mt-4">
      <label class="label">
        <span class="label-text">Quiz Questions</span>
      </label>

      <label class="w-full input-group">
        <input
          v-model="query"
          type="text"
          placeholder="Search questions..."
          class="w-full input input-primary input-bordered" />
        <a class="btn btn-secondary" href="#/quiz-question-create">
          Create New
        </a>
      </label>
    </div>

    <div class="w-full overflow-y-scroll max-h-72">
      <div
        v-for="question in questions"
        v-bind:key="question.id"
        class="py-2 flex items-center w-full">
        <div class="flex-1 text-lg font-bold">
          {{ question.question }}
        </div>
        <button class="btn">Add</button>
      </div>
    </div>

    <!-- 



     -->

    <button @click="postQuiz" class="mt-6 w-full btn btn-primary">
      Create New Quiz
    </button>
  </div>
</template>
