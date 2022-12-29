import { z } from "zod";
import { Question, Quiz } from "../quiz";
import { Result } from "../utils";
import { API_LMS } from "./API_LMS";

export const API_Quiz = {
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
          Authorization: API_LMS.getAuthorizationHeader(),
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
          Authorization: API_LMS.getAuthorizationHeader(),
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
          Authorization: API_LMS.getAuthorizationHeader(),
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
          Authorization: API_LMS.getAuthorizationHeader(),
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
    }): Promise<Result<string, Question[]>> {
      try {
        const response = await fetch(`/quiz-question-search?query=${query}`, {
          method: "POST",
          headers: {
            Authorization: API_LMS.getAuthorizationHeader(),
          },
        });

        const data = await response.json();

        const parsed = z.array(Question).safeParse(data);

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
            Authorization: API_LMS.getAuthorizationHeader(),
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
            Authorization: API_LMS.getAuthorizationHeader(),
          },
          body: JSON.stringify(question),
        });
        return ["ok", null];
      } catch (error) {
        return ["err", String(error)];
      }
    },
  },

  async seed() {
    try {
      await fetch("/quiz-seed", {
        method: "POST",
        headers: {
          Authorization: API_LMS.getAuthorizationHeader(),
        },
      });
    } catch (error) {
      console.error(error);
    }
  },
};
