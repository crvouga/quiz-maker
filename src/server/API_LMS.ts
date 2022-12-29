import express from "express";
import { lti } from "./shared";

export const useAPI_LMS = (app: express.Application) => {
  /* 
  
  
 
 
  */

  app.post("/grade", async (req, res) => {
    try {
      const idToken = res.locals.token; // IdToken
      const score = req.body.grade; // User numeric score sent in the body
      // Creating Grade object
      const gradeObj = {
        userId: idToken.user,
        scoreGiven: score,
        scoreMaximum: 100,
        activityProgress: "Completed",
        gradingProgress: "FullyGraded",
      };

      // Selecting linetItem ID
      let lineItemId = idToken.platformContext.endpoint.lineitem; // Attempting to retrieve it from idtoken
      if (!lineItemId) {
        // @ts-ignore
        const response = await lti.Grade.getLineItems(idToken, {
          resourceLinkId: true,
        });
        const lineItems = response.lineItems;
        if (lineItems.length === 0) {
          // Creating line item if there is none
          console.log("Creating new line item");
          const newLineItem = {
            scoreMaximum: 100,
            label: "Grade",
            tag: "grade",
            resourceLinkId: idToken.platformContext.resource.id,
          };
          //   @ts-ignore
          const lineItem = await lti.Grade.createLineItem(idToken, newLineItem);
          lineItemId = lineItem.id;
        } else lineItemId = lineItems[0].id;
      }

      // Sending Grade
      //   @ts-ignore
      const responseGrade = await lti.Grade.submitScore(
        idToken,
        lineItemId,
        gradeObj
      );
      return res.send(responseGrade);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ err: String(err) });
    }
  });

  /* 
  
  
 
 
  */

  app.get("/members", async (req, res) => {
    try {
      const token = res.locals.token;
      const result = await lti.NamesAndRoles.getMembers(token);
      if (result) return res.send(result.members);
      return res.sendStatus(500);
    } catch (err) {
      console.log(err);
      return res.status(500).send(String(err));
    }
  });

  /* 
  
  
 
 
  */

  app.get("/context", async (req, res) => {
    const token = res.locals.token;
    const context = res.locals.context;
    const payload = {
      ...context.context,
      roles: context?.roles,
      userName: token?.userInfo?.name,
      userEmail: token?.userInfo?.email,
      custom: "type" in context?.custom ? context?.custom : { type: "default" },
    };
    return res.send(payload);
  });

  /* 
  
  
 
 
  */

  app.get("/line-items", async (req, res) => {
    // @ts-ignore
    const result = await lti.Grade.getLineItems(res.locals.token);
    return res.send(result);
  });
};
