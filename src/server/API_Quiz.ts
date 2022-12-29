import express from "express";
import { db, lti } from "./shared";

const quizCol = db.collection("quizzes");
const questionCol = db.collection("quiz-questions");

export const useAPI_Quiz = (app: express.Application) => {
  /* 
  
  
  
  */

  app.post("/quiz", async (req, res) => {
    const quizNew = req.body;

    const lineItem = {
      scoreMaximum: quizNew.questions.length,
      label: quizNew.title,
      resourceId: quizNew.id,
      tag: "quiz",
    };

    // @ts-ignore
    await lti.Grade.createLineItem(res.locals.token, lineItem);

    await quizCol.insertOne(req.body);

    return res.status(201).send({ message: "Quiz created" }).end();
  });

  /* 
  
  
  docs: https://cvmcosta.me/ltijs/#/deeplinking
  
  
  */
  app.post("/quiz/deep-link", async (req, res) => {
    const quiz = req.body;

    const items = [
      {
        type: "ltiResourceLink",
        title: quiz.title,
        // url: "/", // none
        custom: {
          type: "quiz",
          quizId: quiz.id,
        },
      },
    ];

    const deepLinkingFormHTML = await lti.DeepLinking.createDeepLinkingForm(
      res.locals.token,
      items,
      { message: "Successfully registered quiz!" }
    );

    return res.status(200).json({
      deepLinkingFormHTML,
    });
  });

  /* 
  
  
  

  */

  app.get("/quiz", async (req, res) => {
    const quizzes = await quizCol.find({}).toArray();
    return res.status(200).send(quizzes).end();
  });

  /* 
  
  
 
 
  */

  app.get("/quiz/:quizId", async (req, res) => {
    const quizId = req.params.quizId;

    const found = await quizCol.findOne({ id: quizId });

    if (!found) {
      return res.status(404).json({ message: "quiz not found" }).end();
    }

    return res.status(200).json(found).end();
  });

  /* 
  
  
 
 
  */

  app.post("/quiz-question", async (req, res) => {
    console.log(req.body);

    await questionCol.createIndex({ question: "text" });
    await questionCol.insertOne(req.body);
    res.status(201).send({ message: "Quiz question created" }).end();
  });

  /* 
  
  
 
 
  */

  app.delete("/quiz-question/:id", async (req, res) => {
    const questionId = req.params.id;
    await questionCol.deleteOne({ id: questionId });
    res.status(201).send({ message: "Quiz question created" }).end();
  });

  /* 
  
  
 
 
  */

  app.post("/quiz-question-search", async (req, res) => {
    const searchQuery = req.query.query;
    console.log(req.query);
    const found = questionCol.find({});
    const hits = await found.toArray();
    console.log(hits);
    res.status(200).send({ hits: hits }).end();
  });
};
