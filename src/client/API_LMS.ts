import { z } from "zod";
import { LMS_Context, LMS_Member } from "../lti";
import { Result } from "../utils";

const getAuthorizationHeader = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const ltik = searchParams.get("ltik");
  if (!ltik) {
    return "";
  }
  return `Bearer ${ltik}`;
};

/* 



*/

const getMembers = async (): Promise<Result<string, LMS_Member[]>> => {
  try {
    const response = await fetch("/members", {
      credentials: "include",
      headers: {
        Authorization: getAuthorizationHeader(),
      },
    });

    const data = await response.json();

    const parsed = z.array(LMS_Member).safeParse(data);

    if (!parsed.success) {
      return ["err", "Failed to parse response"];
    }

    return ["ok", data];
  } catch (err) {
    return ["err", String(err)];
  }
};

export const getContext = async (): Promise<Result<string, LMS_Context>> => {
  try {
    const response = await fetch("/context", {
      credentials: "include",
      headers: {
        Authorization: getAuthorizationHeader(),
      },
    });

    const data = await response.json();

    const parsed = LMS_Context.safeParse(data);

    if (!parsed.success) {
      return ["err", "Failed to parse response"];
    }

    return ["ok", parsed.data];
  } catch (err) {
    return ["err", String(err)];
  }
};

/* 




*/

const getLineItems = async (): Promise<Result<string, unknown>> => {
  try {
    const response = await fetch("/line-items", {
      credentials: "include",
      headers: {
        Authorization: getAuthorizationHeader(),
      },
    });

    const data = await response.json();

    return ["ok", data];
  } catch (err) {
    return ["err", String(err)];
  }
};

/* 




*/

export type LaunchMode = "Default" | "DeepLinking";

const getLaunchMode = (): LaunchMode => {
  if (window.location.pathname === "/deeplink") {
    return "DeepLinking";
  }
  return "Default";
};

/* 




*/

export const API_LMS = {
  getMembers,
  getContext,
  getAuthorizationHeader,
  getLineItems,
  getLaunchMode,
};
