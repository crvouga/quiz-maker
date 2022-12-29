import { z } from "zod";
import { Result } from "./utils";

const getLTIK = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const ltik = searchParams.get("ltik");
  if (!ltik) {
    return null;
  }
  return ltik;
};

const getAuthorizationHeader = () => {
  return `Bearer ${getLTIK()}`;
};

//
//
// Members
//
//

const Member = z.object({
  roles: z.array(z.string()),
  user_id: z.string(),
});
type Member = z.infer<typeof Member>;

export type LTIMember = Member;

const getMembers = async (): Promise<Result<string, Member[]>> => {
  try {
    const response = await fetch("/members", {
      credentials: "include",
      headers: {
        Authorization: getAuthorizationHeader(),
      },
    });

    const data = await response.json();

    const parsed = z.array(Member).safeParse(data);

    if (!parsed.success) {
      return ["err", "Failed to parse response"];
    }

    return ["ok", data];
  } catch (err) {
    return ["err", String(err)];
  }
};

//
//
// Custom
//
//

const CustomContext = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("quiz"),
    quizId: z.string(),
  }),
  z.object({
    type: z.literal("default"),
  }),
]);
export type CustomContext = z.infer<typeof CustomContext>;

//
//
// This is data we get the LMS
//
//

const Context = z.object({
  id: z.string(),
  label: z.string(),
  title: z.string(),
  type: z.array(z.string()),
  roles: z.array(z.string()),
  userName: z.string().optional(),
  userEmail: z.string().optional(),
  custom: CustomContext,
});

type Context = z.infer<typeof Context>;

export type LTIContext = Context;

export const getContext = async (): Promise<Result<string, Context>> => {
  try {
    const response = await fetch("/context", {
      credentials: "include",
      headers: {
        Authorization: getAuthorizationHeader(),
      },
    });

    const data = await response.json();

    const parsed = Context.safeParse(data);
    console.log(data);
    if (!parsed.success) {
      console.log(parsed.error);
      return ["err", "Failed to parse response"];
    }

    return ["ok", parsed.data];
  } catch (err) {
    return ["err", String(err)];
  }
};

//
//
//
//
//
//

export type Role = "Instructor" | "Student";

// TODO: unsure how well this works
export const contextToRole = ({ roles }: { roles: string[] }): Role => {
  if (roles.some((role) => role.toLowerCase().includes("instructor"))) {
    return "Instructor";
  }
  return "Student";
};

//
//
//
//
//

const getLineItems = async (): Promise<Result<string, any>> => {
  try {
    const response = await fetch("/line-items", {
      credentials: "include",
      headers: {
        Authorization: getAuthorizationHeader(),
      },
    });

    const data = await response.json();

    console.log("line items", data);

    return ["ok", data];
  } catch (err) {
    return ["err", String(err)];
  }
};

//
//
//
//

export type LTILaunch = "Default" | "DeepLinking";

const getLTILaunch = (): LTILaunch => {
  if (window.location.pathname === "/deeplink") {
    return "DeepLinking";
  }
  return "Default";
};

//
//
//
//
//

export const LTI = {
  getMembers,
  getContext,
  contextToRole,
  getAuthorizationHeader,
  getLineItems,
  getLTILaunch,
};
