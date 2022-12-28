<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { LTIInfo } from "./LTI";
import { Question, QuizAPI } from "./QuizAPI";
import QuizQuestionCreate from "./QuizQuestionCreate.vue";
import { useHistoryState } from "./useHistoryState";

defineProps<{ info: LTIInfo }>();

//
//
//
//

type Screen = "add" | "create-new";
const [screen, pushScreen] = useHistoryState<Screen>(
  "quizQuestionAddScreen",
  "add",
  (x): x is Screen =>
    typeof x === "string" && (x === "add" || x === "create-new")
);

//
//
//
//

const searchQuery = ref<string>("");
const searchStatus = ref<"idle" | "loading" | "error">("idle");
const searchHits = ref<Question[]>([]);

const searchQuestions = async ({ query }: { query: string }) => {
  searchStatus.value = "loading";
  const result = await QuizAPI.Question.search({ query: "" });

  if (result[0] === "err") {
    searchStatus.value = "error";
    return;
  }
  searchStatus.value = "idle";
  searchHits.value = result[1].hits;
};

watch(searchQuery, async (query) => {
  await searchQuestions({ query });
});
onMounted(async () => {
  await searchQuestions({ query: "" });
});

const emit = defineEmits<{
  (e: "added", question: Question): void;
}>();

const onCreated = (question: Question) => {
  pushScreen("add");
  emit("added", question);
};

const deleteQuestion = async (question: Question) => {
  const prev = searchHits.value;
  searchHits.value = searchHits.value.filter((x) => x.id !== question.id);
  const result = await QuizAPI.Question.deleteForever({
    questionId: question.id,
  });
  if (result[0] === "err") {
    searchHits.value = prev;
    return;
  }
};
</script>

<template>
  <QuizQuestionCreate
    v-if="screen === 'create-new'"
    :info="info"
    @created="onCreated" />

  <div
    v-else-if="screen === 'add'"
    class="flex flex-col justify-center items-center p-4">
    <h1 class="font-bold text-2xl">Add Question</h1>

    <div class="w-full form-control mt-4 mb-4">
      <label class="label">
        <span class="label-text">Search</span>
      </label>

      <label class="w-full input-group">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search questions..."
          class="w-full input input-primary input-bordered" />
        <button class="btn btn-primary" @click="pushScreen('create-new')">
          Create New
        </button>
      </label>
    </div>

    <div
      v-for="hit in searchHits"
      v-bind:key="hit.id"
      class="flex items-center w-full">
      <div
        class="flex-1 p-3 font-bold text-lg cursor-pointer"
        @click="emit('added', hit)">
        {{ hit.question }}
      </div>
      <button @click="deleteQuestion(hit)" class="btn btn-xs mr-1">
        Delete Forever
      </button>
    </div>
  </div>
</template>
