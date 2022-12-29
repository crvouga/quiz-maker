<script setup lang="ts">
import { ref } from "vue";
import { AnswersByQuestionId, Quiz } from "../quiz";
import { API_Quiz } from "./API_Quiz";

const { quiz } = defineProps<{
  quiz: Quiz;
}>();

const answersByQuestionId = ref<AnswersByQuestionId>({});

const isSelected = ({
  questionId,
  choiceId,
}: {
  questionId: string;
  choiceId: string;
}) => {
  return answersByQuestionId.value[questionId]?.choiceId === choiceId;
};

const select = ({
  questionId,
  choiceId,
}: {
  questionId: string;
  choiceId: string;
}) => {
  answersByQuestionId.value[questionId] = { questionId, choiceId };
};

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

const onSubmit = async () => {
  await API_Quiz.QuizSubmission.post({
    answersByQuestionId: answersByQuestionId.value,
    quiz,
  });
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
          {{ question.text }}
        </div>
      </div>

      <div
        v-for="(choice, index) in question.choices"
        v-bind:key="choice.id"
        @click="select({ questionId: question.id, choiceId: choice.id })"
        class="flex items-center py-4 px-2 cursor-pointer hover:bg-gray-100">
        <input
          type="radio"
          class="radio radio-primary mr-2"
          :checked="
            isSelected({ questionId: question.id, choiceId: choice.id })
          " />
        <div class="mr-2">{{ alphabet[index] }}.</div>
        <div class="text-lg">
          {{ choice.text }}
        </div>
      </div>
    </div>

    <div class="py-4 my-4">
      <button class="btn btn-primary w-full" @click="onSubmit">
        Submit Quiz
      </button>
    </div>
  </div>
</template>
