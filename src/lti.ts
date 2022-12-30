import { z } from "zod";

/* 


Context: 
This is data associated with a particular activity inside of a LMS.

For example in our app each quiz is associated with it's own Context.


*/

// this is app specific data
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

export const LTI_Context = z.object({
  id: z.string(),
  label: z.string(),
  title: z.string(),
  type: z.array(z.string()),
  //
  roles: z.array(z.string()),
  userName: z.string().optional(),
  userEmail: z.string().optional(),
  custom: CustomContext,
  lineItemId: z.string().optional(),
});

export type LTI_Context = z.infer<typeof LTI_Context>;

/* 

LineItem: 
This can be thought of as a grade book column. A line item is associated with a particular Context.
There is a one-to-many relationship between a Context and its LineItems.

http://www.imsglobal.org/spec/lti-ags/v2p0#:~:text=A%20line%20item%20is%20usually,context%20and%20its%20line%20items.


*/

export const LineItem = z.object({
  scoreMaximum: z.number(),
  label: z.string(),
  resourceId: z.string(),
  tag: z.string(),
  id: z.string(),
});

export type LineItem = z.infer<typeof LineItem>;

export const LineItemGrade = z.object({
  userId: z.string(),
  scoreGiven: z.number(),
  scoreMaximum: z.number(),
  activityProgress: z.literal("Completed"),
  gradingProgress: z.literal("FullyGraded"),
});

export type LineItemGrade = z.infer<typeof LineItemGrade>;

/* 


Member: 
Users that are manged inside of the LMS and associated with a particular Context. 


*/

export const LTI_Member = z.object({
  roles: z.array(z.string()),
  user_id: z.string(),
});
export type LTI_Member = z.infer<typeof LTI_Member>;

// Users in the LMS can have many types of roles but theses are the ones we care about for our app
export type Role = "Instructor" | "Student";
// TODO: unsure how well this works
export const toRole = ({ roles }: { roles: string[] }): Role => {
  if (roles.some((role) => role.toLowerCase().includes("instructor"))) {
    return "Instructor";
  }
  return "Student";
};
