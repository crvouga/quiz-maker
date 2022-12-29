import { z } from "zod";
/* 


This is app specific data


*/

export const Answer = z.object({
  id: z.string(),
  answer: z.string(),
});
export type Answer = z.infer<typeof Answer>;

export const Question = z.object({
  id: z.string(),
  question: z.string(),
  correctAnswerId: z.string(),
  answers: z.array(Answer),
});
export type Question = z.infer<typeof Question>;

export const Quiz = z.object({
  id: z.string(),
  title: z.string(),
  questions: z.array(Question),
});
export type Quiz = z.infer<typeof Quiz>;
