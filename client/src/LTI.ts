import { z } from "zod";
import { Result } from "./Result";

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
  lis_person_sourcedid: z.string(),
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
// Info
//
//

const Info = z.object({
  context: z.object({
    id: z.string(),
    label: z.string(),
    title: z.string(),
    type: z.array(z.string()),
  }),
  name: z.string(),
  email: z.string(),
  roles: z.array(z.string()),
});

type Info = z.infer<typeof Info>;

export type LTIInfo = Info;

export const getInfo = async (): Promise<Result<string, Info>> => {
  try {
    const response = await fetch("/info", {
      credentials: "include",
      headers: {
        Authorization: getAuthorizationHeader(),
      },
    });

    const data = await response.json();

    const parsed = Info.safeParse(data);

    if (!parsed.success) {
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
export const toRole = ({ roles }: { roles: string[] }): Role => {
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

export const LTI = {
  getMembers,
  getInfo,
  toRole,
  getAuthorizationHeader,
};
