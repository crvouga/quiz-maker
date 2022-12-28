import { z } from "zod";
import { Result } from "./Result";
import { LTI } from "./LTI";

export type Quiz = {
  id: string;
  title: string;
  questions: Question[];
};

const Answer = z.object({
  id: z.string(),
  answer: z.string(),
});
export type Answer = z.infer<typeof Answer>;

const Question = z.object({
  id: z.string(),
  question: z.string(),
  correctAnswerId: z.string(),
  answers: z.array(Answer),
});
export type Question = z.infer<typeof Question>;

const post = async (quiz: Quiz): Promise<Result<string, null>> => {
  try {
    await fetch("/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: LTI.getAuthorizationHeader(),
      },
      body: JSON.stringify(quiz),
    });
    return ["ok", null];
  } catch (error) {
    return ["err", String(error)];
  }
};

type SearchResult<T> = {
  hits: T[];
};

export const Quiz = {
  post,
  Question: {
    async search({
      query,
    }: {
      query: string;
    }): Promise<Result<string, SearchResult<Question>>> {
      try {
        const response = await fetch(`/quiz-question-search?query=${query}`, {
          method: "POST",
          headers: {
            Authorization: LTI.getAuthorizationHeader(),
          },
        });

        const data = await response.json();

        const parsed = z
          .object({
            hits: z.array(Question),
          })
          .safeParse(data);

        if (!parsed.success) {
          return ["err", String(parsed.error)];
        }
        return ["ok", parsed.data];
      } catch (error) {
        return ["err", String(error)];
      }
    },

    async deleteForever({
      questionId,
    }: {
      questionId: string;
    }): Promise<Result<string, null>> {
      try {
        await fetch(`/quiz-question/${questionId}`, {
          method: "DELETE",
          headers: {
            Authorization: LTI.getAuthorizationHeader(),
          },
        });
        return ["ok", null];
      } catch (error) {
        return ["err", String(error)];
      }
    },

    async post(question: Question): Promise<Result<string, null>> {
      try {
        await fetch("/quiz-question", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: LTI.getAuthorizationHeader(),
          },
          body: JSON.stringify(question),
        });
        return ["ok", null];
      } catch (error) {
        return ["err", String(error)];
      }
    },
  },
};
