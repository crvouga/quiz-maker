import { Question, Quiz } from "./quiz";

export const geographyQuestions: Question[] = [
  {
    id: "1",
    text: "What is the capital of France?",
    correctChoiceId: "1",
    choices: [
      {
        id: "1",
        text: "Paris",
      },
      {
        id: "2",
        text: "London",
      },
      {
        id: "3",
        text: "Berlin",
      },
      {
        id: "4",
        text: "Rome",
      },
    ],
  },

  {
    id: "2",
    text: "What is the capital of Germany?",
    correctChoiceId: "3",
    choices: [
      {
        id: "1",
        text: "Paris",
      },
      {
        id: "2",
        text: "London",
      },
      {
        id: "3",
        text: "Berlin",
      },
      {
        id: "4",
        text: "Rome",
      },
    ],
  },

  {
    id: "3",
    text: "What is the capital of Italy?",
    correctChoiceId: "4",
    choices: [
      {
        id: "1",
        text: "Paris",
      },
      {
        id: "2",
        text: "London",
      },
      {
        id: "3",
        text: "Berlin",
      },
      {
        id: "4",
        text: "Rome",
      },
    ],
  },

  {
    id: "4",
    text: "What is the capital of England?",
    correctChoiceId: "2",
    choices: [
      {
        id: "1",
        text: "Paris",
      },
      {
        id: "2",
        text: "London",
      },
      {
        id: "3",
        text: "Berlin",
      },
      {
        id: "4",
        text: "Rome",
      },
    ],
  },
].map((q) => ({ ...q, id: q.id + "geography" }));

export const mathQuestions: Question[] = [
  {
    id: "1",
    text: "What is 1 + 1?",
    correctChoiceId: "1",
    choices: [
      {
        id: "1",
        text: "2",
      },
      {
        id: "2",
        text: "3",
      },
      {
        id: "3",
        text: "4",
      },
      {
        id: "4",
        text: "5",
      },
    ],
  },

  {
    id: "2",
    text: "What is 2 + 2?",
    correctChoiceId: "2",
    choices: [
      {
        id: "1",
        text: "2",
      },
      {
        id: "2",
        text: "4",
      },
      {
        id: "3",
        text: "6",
      },
      {
        id: "4",
        text: "8",
      },
    ],
  },

  {
    id: "3",
    text: "What is 3 + 3?",
    correctChoiceId: "3",
    choices: [
      {
        id: "1",
        text: "2",
      },
      {
        id: "2",

        text: "4",
      },
      {
        id: "3",
        text: "6",
      },
      {
        id: "4",
        text: "8",
      },
    ],
  },

  {
    id: "4",
    text: "What is 4 + 4?",
    correctChoiceId: "4",
    choices: [
      {
        id: "1",
        text: "2",
      },
      {
        id: "2",
        text: "4",
      },
      {
        id: "3",
        text: "6",
      },
      {
        id: "4",
        text: "8",
      },
    ],
  },
].map((q) => ({ ...q, id: q.id + "math" }));

export const questions: Question[] = [...geographyQuestions, ...mathQuestions];

export const quizzes: Quiz[] = [
  {
    id: "1",
    title: "Geography Quiz",
    questions: geographyQuestions,
  },
  {
    id: "2",
    title: "Math Quiz",
    questions: mathQuestions,
  },
];
