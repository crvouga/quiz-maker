import { z } from "zod";

/* 


This is app specific data we store and retrieve from the LMS


*/

export const CustomContext = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("quiz"),
    quizId: z.string(),
  }),
  z.object({
    type: z.literal("default"),
  }),
]);
export type CustomContext = z.infer<typeof CustomContext>;

/* 


This is data we get from the LMS


*/
export const LMS_Context = z.object({
  id: z.string(),
  label: z.string(),
  title: z.string(),
  type: z.array(z.string()),
  roles: z.array(z.string()),
  userName: z.string().optional(),
  userEmail: z.string().optional(),
  custom: CustomContext,
});

export type LMS_Context = z.infer<typeof LMS_Context>;

/* 


Users stored in the LMS are call "members"


*/

export const LMS_Member = z.object({
  roles: z.array(z.string()),
  user_id: z.string(),
});
export type LMS_Member = z.infer<typeof LMS_Member>;

/* 


Users in the LMS can have many types of roles but theses are the ones we care about for our app

*/

export type Role = "Instructor" | "Student";
// TODO: unsure how well this works
export const toRole = ({ roles }: { roles: string[] }): Role => {
  if (roles.some((role) => role.toLowerCase().includes("instructor"))) {
    return "Instructor";
  }
  return "Student";
};
