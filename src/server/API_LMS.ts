import express from "express";
import { lti } from "./shared";
import { CustomContext, LTI_Context } from "../lti";

export const useAPI_LMS = (app: express.Application) => {
  /* 
  
  
 
 
  */

  app.get("/members", async (req, res) => {
    try {
      const token = res.locals.token;
      const result = await lti.NamesAndRoles.getMembers(token);
      if (result) {
        return res.send(result.members);
      }
      return res.sendStatus(500);
    } catch (err) {
      return res.status(500).send(String(err));
    }
  });

  /* 
  
  
 
 
  */

  app.get("/context", async (req, res) => {
    const token = res.locals.token;
    const context: any = res.locals.context;

    const lmsContext: LTI_Context = {
      id: context?.context?.id,
      label: context?.context?.label,
      title: context?.context?.title,
      type: context?.context?.type ?? [],
      roles: context?.roles,
      userName: token?.userInfo?.name,
      userEmail: token?.userInfo?.email,
      custom: toCustomContext(context?.custom),
      lineItemId: token?.platformContext?.endpoint?.lineitem,
    };

    return res.send({ ...lmsContext, locals: res.locals });
  });

  const toCustomContext = (context: unknown): CustomContext => {
    const parsed = CustomContext.safeParse(context);
    if (!parsed.success) {
      return { type: "default" };
    }
    return parsed.data;
  };

  /* 
  
  
 
 
  */

  app.get("/line-items", async (req, res) => {
    // @ts-ignore
    const result = await lti.Grade.getLineItems(res.locals.token);
    return res.send(result);
  });
};
