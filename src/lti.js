const router = require("express").Router();
const path = require("path");

// Requiring Ltijs
const lti = require("ltijs").Provider;

// Grading route
router.post("/grade", async (req, res) => {
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
        const lineItem = await lti.Grade.createLineItem(idtoken, newLineItem);
        lineItemId = lineItem.id;
      } else lineItemId = lineItems[0].id;
    }

    // Sending Grade
    const responseGrade = await lti.Grade.submitScore(
      idtoken,
      lineItemId,
      gradeObj
    );
    return res.send(responseGrade);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ err: err.message });
  }
});

// Names and Roles route
router.get("/members", async (req, res) => {
  try {
    const token = res.locals.token;
    const result = await lti.NamesAndRoles.getMembers(token);
    if (result) return res.send(result.members);
    return res.sendStatus(500);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
});

// Return available deep linking resources
router.get("/resources", async (req, res) => {
  const resources = [
    {
      name: "Resource1",
      value: "value1",
    },
    {
      name: "Resource2",
      value: "value2",
    },
    {
      name: "Resource3",
      value: "value3",
    },
  ];
  return res.send(resources);
});

// Get user and context information
router.get("/context", async (req, res) => {
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

router.get("/line-items", async (req, res) => {
  const result = await lti.Grade.getLineItems(res.locals.token);
  return res.send(result);
});

module.exports = {
  router,
};
