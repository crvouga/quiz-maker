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
import { createLineItem, db, lti, submitScore } from "./shared";

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
    const quizSubmission = parsed.data;

    const idToken = res.locals.token;

    const lineItemId = idToken?.platformContext?.endpoint?.lineitem;
    if (typeof lineItemId !== "string") {
      res.status(500).send({ message: "no line item id" }).end();
      return;
    }

    // TODO:
    // we shouldn't create a new line item
    // the LMS usually creates a line item associated with the assignment
    // this will create junk entries into the LMS gradebook
    const created = await createLineItem(idToken, {
      label: "Grade",
      resourceId: parsed.data.quiz.id,
      scoreMaximum: toScoreMaximum(parsed.data),
      tag: "quiz",
    });

    if (created[0] === "err") {
      return res.status(500).send({ message: created[1] }).end();
    }

    const lineItem = created[1];

    const grade: LineItemGrade = {
      activityProgress: "Completed",
      gradingProgress: "FullyGraded",
      scoreGiven: toScore(quizSubmission),
      scoreMaximum: toScoreMaximum(quizSubmission),
      userId: idToken.user,
    };

    const submitted = await submitScore({
      idToken,
      lineItemId: lineItem.id,
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

    const deepLinkingFormHTML: string | false =
      await lti.DeepLinking.createDeepLinkingForm(res.locals.token, items, {
        message: "Successfully registered quiz!",
      });

    // NOTE
    // global_includes=0 is a hack for asu canvas dev to prevent it from including asu specific code
    // this problem the wrong place to include though
    const _withCustomQueryParam = (deepLinkingFormHTML || "").replace(
      "deep_linking_response?",
      "deep_linking_response?global_includes=0&"
    );

    return res.status(200).json({
      deepLinkingFormHTML: deepLinkingFormHTML,
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
