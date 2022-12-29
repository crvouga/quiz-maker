import { z } from "zod";
/* 


This is app specific data


*/

export const Choice = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});
export type Choice = z.infer<typeof Choice>;

export const Question = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  correctChoiceId: z.string().min(1),
  choices: z.array(Choice),
});

export type Question = z.infer<typeof Question>;

export const Quiz = z.object({
  id: z.string(),
  title: z.string(),
  questions: z.array(Question),
});

export type Quiz = z.infer<typeof Quiz>;

export const AnswersByQuestionId = z.record(
  z.object({
    questionId: z.string(),
    choiceId: z.string(),
  })
);
export type AnswersByQuestionId = z.infer<typeof AnswersByQuestionId>;

export const QuizSubmission = z.object({
  quiz: Quiz,
  answersByQuestionId: AnswersByQuestionId,
});
export type QuizSubmission = z.infer<typeof QuizSubmission>;
