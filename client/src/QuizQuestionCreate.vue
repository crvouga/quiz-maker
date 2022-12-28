<script setup lang="ts">
import { ref } from "vue";
import { Id } from "./Id";
import { LTIInfo } from "./LTI";
import { Answer, Question, QuizAPI } from "./QuizAPI";

defineProps<{ info: LTIInfo }>();

const emit = defineEmits<{
  (e: "created", question: Question): void;
}>();

const questionTitle = ref<string>("");

const correctAnswerId = ref<string | null>(null);
const markAsCorrect = (answer: Answer) => {
  correctAnswerId.value = answer.id;
};

const answers = ref<Answer[]>([]);
const answerInput = ref<string>("");
const addAnswer = () => {
  answers.value.push({
    id: Id.generate(),
    answer: answerInput.value,
  });
  answerInput.value = "";
};
const removeAnswer = (answer: Answer) => {
  answers.value = answers.value.filter((a) => a.id !== answer.id);
};

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

const posting = ref(false);
const post = async () => {
  if (!correctAnswerId.value) {
    console.log("no correct answer");
    return;
  }

  if (answers.value.length === 0) {
    console.log("no answers");
    return;
  }

  if (questionTitle.value.length === 0) {
    console.log("no question title");
    return;
  }

  const question: Question = {
    id: Id.generate(),
    question: questionTitle.value,
    correctAnswerId: correctAnswerId.value,
    answers: answers.value,
  };

  posting.value = true;
  await QuizAPI.Question.post(question);
  posting.value = false;

  emit("created", question);
};
</script>

<template>
  <div class="flex flex-col justify-center items-center p-4">
    <h1 class="font-bold text-2xl">Create New Question</h1>

    <!-- 

    Question

   -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">Question</span>
      </label>

      <input
        v-model="questionTitle"
        type="text"
        placeholder="Some question?"
        class="w-full input input-primary input-bordered" />
    </div>

    <!-- 

    Answers

   -->
    <div class="form-control w-full mt-4">
      <label class="label">
        <span class="label-text">Answers</span>
      </label>

      <label class="input-group">
        <input
          v-model="answerInput"
          type="text"
          placeholder="Answer"
          class="w-full input input-bordered" />
        <button @click="addAnswer" class="btn btn-primary">Add</button>
      </label>
    </div>

    <div
      v-for="(answer, index) in answers"
      class="font-bold p-2 flex w-full mt-4"
      :class="{ 'text-green-500 bg-green-100': answer.id === correctAnswerId }">
      <div class="mr-3">{{ alphabet[index] }}.</div>
      <div class="flex-1">
        {{ answer.answer }}
      </div>
      <button
        @click="removeAnswer(answer)"
        class="btn btn-xs btn-secondary mr-1">
        Remove
      </button>
      <button
        @click="markAsCorrect(answer)"
        :disabled="answer.id === correctAnswerId"
        class="btn btn-xs btn-secondary">
        Mark as Correct
      </button>
    </div>

    <!-- 



     -->

    <button
      @click="post"
      :class="{ loading: posting }"
      class="mt-6 btn btn-primary w-full">
      Create Question
    </button>
  </div>
</template>
