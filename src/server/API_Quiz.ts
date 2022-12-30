import express from "express";
import { LineItemGrade } from "../lti";
import {
  Question,
  Quiz,
  QuizSubmission,
  toScore,
  toScoreMaximum,
} from "../quiz";
import { questions, quizzes } from "../quiz.sample-data";
import { db, lti, submitScore } from "./shared";

export const quizCol = db.collection<Quiz>("quizzes");
export const questionCol = db.collection<Question>("quiz-questions");

export const useAPI_Quiz = async (app: express.Application) => {
  // database stuff for full text search questions
  await questionCol.createIndex({ question: "text" });

  /* 
  
  
  
  */

  app.post("/quiz", async (req, res) => {
    console.log("POST /quiz", req.body);
    const parsed = Quiz.safeParse(req.body);

    if (!parsed.success) {
      console.log("failed to parse quiz");
      res.status(400).send({ message: "Invalid quiz" }).end();
      return;
    }

    const quizNew = parsed.data;

    await quizCol.insertOne(quizNew);

    return res.status(201).send({ message: "Quiz created" }).end();
  });

  /* 
  
  

  
  
  */

  app.post("/quiz-submission", async (req, res) => {
    const parsed = QuizSubmission.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).send({ message: "Invalid body" }).end();
      return;
    }

    const idToken = res.locals.token;

    const lineItemId = idToken.platformContext.endpoint.lineitem;

    if (typeof lineItemId !== "string") {
      res.status(500).send({ message: "no line item id" }).end();
      return;
    }

    const quizSubmission = parsed.data;

    const grade: LineItemGrade = {
      activityProgress: "Completed",
      gradingProgress: "FullyGraded",
      scoreGiven: toScore(quizSubmission),
      scoreMaximum: toScoreMaximum(quizSubmission),
      userId: idToken.user,
    };

    const submitted = await submitScore({
      idToken,
      lineItemId,
      grade,
    });

    if (submitted[0] === "err") {
      res.status(500).send({ message: submitted[1] }).end();
      return;
    }

    res.status(201).send({ message: "Submitted grade" }).end();
    return;
  });

  /* 
  
  
  docs: https://cvmcosta.me/ltijs/#/deeplinking
  
  
  */
  app.post("/quiz/deep-link", async (req, res) => {
    const parsed = Quiz.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).send({ message: "Invalid quiz" }).end();
      return;
    }

    const quiz = parsed.data;

    const items = [
      {
        type: "ltiResourceLink",
        title: quiz.title,
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

    const parsed = Question.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).send({ message: "Invalid quiz question" }).end();
      return;
    }

    const questionNew = parsed.data;

    await questionCol.insertOne(questionNew);
    res.status(201).send({ message: "Quiz question created" }).end();
    return;
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
    console.log(req.query);
    const found = questionCol.find({});
    const hits = await found.toArray();
    console.log(hits);
    res.status(200).send(hits).end();
  });

  /* 
  
  
  */

  app.post("/quiz-seed", async (req, res) => {
    await questionCol.insertMany(questions);
    await quizCol.insertMany(quizzes);
    res.status(201).send({ message: "Seeded database" }).end();
  });
};
