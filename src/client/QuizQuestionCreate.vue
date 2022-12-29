<script setup lang="ts">
import { ref } from "vue";
import { Id } from "../utils";
import { API_Quiz } from "./API_Quiz";
import { Choice, Question } from "../quiz";

const emit = defineEmits<{
  (e: "created", question: Question): void;
}>();

const questionText = ref<string>("");

const correctChoiceId = ref<string | null>(null);
const markAsCorrect = (choice: Choice) => {
  correctChoiceId.value = choice.id;
};

const choices = ref<Choice[]>([]);
const choiceText = ref<string>("");
const addChoice = () => {
  choices.value.push({
    id: Id.generate(),
    text: choiceText.value,
  });
  choiceText.value = "";
};
const removeChoice = (choice: Choice) => {
  choices.value = choices.value.filter((a) => a.id !== choice.id);
};

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

const posting = ref(false);
const post = async () => {
  if (!correctChoiceId.value) {
    console.error("missing correct choice");
    return;
  }

  if (choices.value.length === 0) {
    console.error("missing choices");
    return;
  }

  if (questionText.value.length === 0) {
    console.error("missing question title");
    return;
  }

  const question: Question = {
    id: Id.generate(),
    text: questionText.value,
    correctChoiceId: correctChoiceId.value,
    choices: choices.value,
  };

  posting.value = true;
  await API_Quiz.Question.post(question);
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
        v-model="questionText"
        type="text"
        placeholder="Some question?"
        class="w-full input input-primary input-bordered" />
    </div>

    <!-- 

    Choices

   -->
    <div class="form-control w-full mt-4">
      <label class="label">
        <span class="label-text">Choices</span>
      </label>

      <label class="input-group">
        <input
          v-model="choiceText"
          type="text"
          placeholder="Choice"
          class="w-full input input-bordered" />
        <button @click="addChoice" class="btn btn-primary">Add</button>
      </label>
    </div>

    <div
      v-for="(choice, index) in choices"
      class="font-bold p-2 flex w-full mt-4"
      :class="{ 'text-green-500 bg-green-100': choice.id === correctChoiceId }">
      <div class="mr-3">{{ alphabet[index] }}.</div>
      <div class="flex-1">
        {{ choice.text }}
      </div>
      <button
        @click="removeChoice(choice)"
        class="btn btn-xs btn-secondary mr-1">
        Remove
      </button>
      <button
        @click="markAsCorrect(choice)"
        :disabled="choice.id === correctChoiceId"
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
