import { Result } from "./Result";
import { LTI } from "./LTI";

export type Quiz = {
  id: string;
  title: string;
  questions: Question[];
};

export type Question = {
  id: string;
  question: string;
  correctAnswerId: string;
  answers: Answer[];
};

export type Answer = {
  id: string;
  answer: string;
};

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

export const Quiz = {
  post,
  Question: {
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
