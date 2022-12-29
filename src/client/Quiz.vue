<script setup lang="ts">
import { ref } from "vue";
import { Quiz } from "./API_Quiz";

defineProps<{
  quiz: Quiz;
}>();

const selectedAnswerIds = ref<{ [questionId: string]: { answerId: string } }>(
  {}
);

const isSelected = ({
  questionId,
  answerId,
}: {
  questionId: string;
  answerId: string;
}) => {
  return selectedAnswerIds.value[questionId]?.answerId === answerId;
};

const select = ({
  questionId,
  answerId,
}: {
  questionId: string;
  answerId: string;
}) => {
  selectedAnswerIds.value[questionId] = { answerId };
};

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

const submit = () => {
  console.log(selectedAnswerIds.value);
};
</script>

<template>
  <div class="p-4">
    <h1 class="font-bold text-4xl text-center mt-4 mb-8">
      {{ quiz.title }}
    </h1>
    <div
      v-for="(question, index) in quiz.questions"
      v-bind:key="question.id"
      class="flex flex-col mt-6">
      <div class="flex items-center py-4">
        <div class="mr-2 text-xl">{{ index + 1 }}.</div>
        <div class="font-bold text-2xl">
          {{ question.question }}
        </div>
      </div>

      <div
        v-for="(answer, index) in question.answers"
        v-bind:key="answer.id"
        @click="select({ questionId: question.id, answerId: answer.id })"
        class="flex items-center py-4 px-2 cursor-pointer hover:bg-gray-100">
        <input
          type="radio"
          class="radio radio-primary mr-2"
          :checked="
            isSelected({ questionId: question.id, answerId: answer.id })
          " />
        <div class="mr-2">{{ alphabet[index] }}.</div>
        <div class="text-lg">
          {{ answer.answer }}
        </div>
      </div>
    </div>

    <div class="py-4 my-4">
      <button class="btn btn-primary w-full" @click="submit">
        Submit Quiz
      </button>
    </div>
  </div>
</template>
