const express = require("express");
const mongo = require("./mongo");
const ltijs = require("ltijs").Provider;
const router = express.Router();

const quizCol = mongo.db.collection("quizzes");
const questionCol = mongo.db.collection("quiz-questions");

router.post("/quiz", async (req, res) => {
  const quizNew = req.body;

  const lineItem = {
    scoreMaximum: quizNew.questions.length,
    label: quizNew.title,
    tag: "quiz",
  };
  await ltijs.Grade.createLineItem(res.locals.token, lineItem);
  await quizCol.insertOne(req.body);
  return res.status(201).send({ message: "Quiz created" }).end();
});

// docs: https://cvmcosta.me/ltijs/#/deeplinking
router.post("/quiz/deep-link", async (req, res) => {
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

  const deepLinkingFormHTML = await ltijs.DeepLinking.createDeepLinkingForm(
    res.locals.token,
    items,
    { message: "Successfully registered quiz!" }
  );

  return res.status(200).json({
    deepLinkingFormHTML,
  });
});

router.get("/quiz", async (req, res) => {
  const quizzes = await quizCol.find({}).toArray();
  return res.status(200).send(quizzes).end();
});

router.post("/quiz-question", async (req, res) => {
  console.log(req.body);

  await questionCol.createIndex({ question: "text" });
  await questionCol.insertOne(req.body);
  res.status(201).send({ message: "Quiz question created" }).end();
});

router.delete("/quiz-question/:id", async (req, res) => {
  const questionId = req.params.id;
  await questionCol.deleteOne({ id: questionId });
  res.status(201).send({ message: "Quiz question created" }).end();
});

router.post("/quiz-question-search", async (req, res) => {
  const searchQuery = req.query.query;
  console.log(req.query);
  const found = questionCol.find({});
  const hits = await found.toArray();
  console.log(hits);
  res.status(200).send({ hits: hits }).end();
});

module.exports = {
  router,
};
