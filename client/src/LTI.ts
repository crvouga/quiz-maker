import { z } from "zod";

type Result<TErr, TData> = ["ok", TData] | ["err", TErr];

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

export const LTI = {
  getMembers,
};
