import express from "express";
import { lti } from "./shared";

export const useLMSRoutes = (app: express.Application) => {
  // Grading route
  app.post("/grade", async (req, res) => {
    try {
      const idtoken = res.locals.token; // IdToken
      const score = req.body.grade; // User numeric score sent in the body
      // Creating Grade object
      const gradeObj = {
        userId: idtoken.user,
        scoreGiven: score,
        scoreMaximum: 100,
        activityProgress: "Completed",
        gradingProgress: "FullyGraded",
      };

      // Selecting linetItem ID
      let lineItemId = idtoken.platformContext.endpoint.lineitem; // Attempting to retrieve it from idtoken
      if (!lineItemId) {
        // @ts-ignore
        const response = await lti.Grade.getLineItems(idtoken, {
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
            resourceLinkId: idtoken.platformContext.resource.id,
          };
          //   @ts-ignore
          const lineItem = await lti.Grade.createLineItem(idtoken, newLineItem);
          lineItemId = lineItem.id;
        } else lineItemId = lineItems[0].id;
      }

      // Sending Grade
      //   @ts-ignore
      const responseGrade = await lti.Grade.submitScore(
        idtoken,
        lineItemId,
        gradeObj
      );
      return res.send(responseGrade);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ err: String(err) });
    }
  });

  // Names and Roles route
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

  // Get user and context information
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

  app.get("/line-items", async (req, res) => {
    // @ts-ignore
    const result = await lti.Grade.getLineItems(res.locals.token);
    return res.send(result);
  });
};
