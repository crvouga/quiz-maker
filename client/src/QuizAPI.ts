import { z } from "zod";
import { LTI } from "./LTI";
import { Result } from "./utils";

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

type SearchResult<T> = {
  hits: T[];
};

const Quiz = z.object({
  id: z.string(),
  title: z.string(),
  questions: z.array(Question),
});
export type Quiz = z.infer<typeof Quiz>;

export const QuizAPI = {
  //
  //
  // Select a quiz from the LMS assignment
  //
  //
  async deepLink(quiz: Quiz): Promise<Result<string, null>> {
    try {
      const response = await fetch("/quiz/deep-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: LTI.getAuthorizationHeader(),
        },
        body: JSON.stringify(quiz),
      });

      const json = await response.json();

      const parsed = z
        .object({
          deepLinkingFormHTML: z.string(),
        })
        .safeParse(json);

      if (!parsed.success) {
        return ["err", String(parsed.error)];
      }

      const { deepLinkingFormHTML } = parsed.data;

      document.body.insertAdjacentHTML("beforeend", deepLinkingFormHTML);
      const form = document.getElementById("ltijs_submit");

      if (!form) {
        return ["err", "form not found"];
      }

      // @ts-ignore
      form.submit();

      return ["ok", null];
    } catch (error) {
      return ["err", String(error)];
    }
  },

  async post(quiz: Quiz): Promise<Result<string, null>> {
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
  },

  async findOne({ quizId }: { quizId: string }): Promise<Result<string, Quiz>> {
    try {
      const response = await fetch(`/quiz/${quizId}`, {
        method: "GET",
        headers: {
          Authorization: LTI.getAuthorizationHeader(),
        },
      });

      const data = await response.json();

      const parsed = Quiz.safeParse(data);

      if (!parsed.success) {
        return ["err", String(parsed.error)];
      }
      return ["ok", parsed.data];
    } catch (error) {
      return ["err", String(error)];
    }
  },

  async findMany(): Promise<Result<string, Quiz[]>> {
    try {
      const response = await fetch("/quiz", {
        method: "GET",
        headers: {
          Authorization: LTI.getAuthorizationHeader(),
        },
      });

      const data = await response.json();

      const parsed = z.array(Quiz).safeParse(data);

      if (!parsed.success) {
        return ["err", String(parsed.error)];
      }
      return ["ok", parsed.data];
    } catch (error) {
      return ["err", String(error)];
    }
  },

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
