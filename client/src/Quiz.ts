import { Result } from "./Result";
import { LTI } from "./LTI";

type Question = {
  question: string;
  answers: string[];
};

type Quiz = {
  id: string;
  title: string;
  questions: Question[];
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
};
