<script setup lang="ts">
import { ref } from "vue";
import { Question, Quiz, QuizAPI } from "./QuizAPI";
import QuizQuestionAdd from "./QuizQuestionAdd.vue";
import { Id, useHistoryState } from "./utils";

const emit = defineEmits<{
  (e: "created", quiz: Quiz): void;
}>();

type Screen = "add" | "create";
const [screen, pushScreen] = useHistoryState<Screen>(
  "quizCreateScreen",
  "create",
  (x): x is Screen => typeof x === "string" && (x === "add" || x === "create")
);

//
//
//
//

const title = ref("");
const selected = ref<Question[]>([]);

const postStatus = ref<"idle" | "loading" | "error">("idle");
const postQuiz = async () => {
  if (postStatus.value === "loading") {
    return;
  }

  if (title.value.length === 0) {
    console.log("missing quiz title");
    return;
  }

  if (selected.value.length === 0) {
    console.log("missing questions");
    return;
  }

  postStatus.value = "loading";
  const quiz: Quiz = {
    id: Id.generate(),
    title: title.value,
    questions: selected.value,
  };
  const result = await QuizAPI.post(quiz);
  if (result[0] === "err") {
    postStatus.value = "error";
    return;
  }
  postStatus.value = "idle";
  emit("created", quiz);
};

const onAdd = (question: Question) => {
  pushScreen("create");
  selected.value.push(question);
};

const onRemove = (question: Question) => {
  selected.value = selected.value.filter((x) => x.id !== question.id);
};
</script>

<template>
  <QuizQuestionAdd v-if="screen === 'add'" @added="onAdd" />
  <div
    v-else-if="screen === 'create'"
    class="flex flex-col justify-center items-center p-4">
    <h1 class="font-bold text-2xl">Create New Quiz</h1>

    <!-- 

    Title

   -->
    <div class="w-full form-control">
      <label class="label">
        <span class="label-text">Quiz Title</span>
      </label>

      <input
        v-model="title"
        type="text"
        placeholder="My quiz"
        class="w-full input input-primary input-bordered" />
    </div>

    <!-- 

    Questions

   -->

    <label class="label w-full mt-4">
      <span class="label-text">Quiz Questions</span>
    </label>

    <button class="btn w-full btn-secondary" @click="pushScreen('add')">
      Add question
    </button>

    <ol class="w-full">
      <li
        v-for="(question, index) in selected"
        v-bind:key="question.id"
        class="py-2 flex items-center w-full">
        <div class="text-lg font-bold mr-2">{{ index + 1 }}.</div>
        <div class="flex-1 text-lg font-bold">
          {{ question.question }}
        </div>
        <button class="btn" @click="onRemove(question)">Remove</button>
      </li>
    </ol>

    <!-- 



     -->

    <button
      @click="postQuiz"
      class="mt-6 w-full btn btn-primary"
      :class="{ loading: postStatus === 'loading' }">
      Create New Quiz
    </button>
  </div>
</template>
