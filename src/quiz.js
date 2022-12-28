const express = require("express");
const mongo = require("./mongo");
const lti = require("ltijs").Provider;
const router = express.Router();

const quizCol = mongo.db.collection("quizzes");
const questionCol = mongo.db.collection("quiz-questions");

router.post("/quiz", async (req, res) => {
  const idtoken = res.locals.token;
  const quizNew = req.body;

  const lineItem = {
    scoreMaximum: quizNew.questions.length,
    label: quizNew.title,
    tag: "quiz",
  };
  await lti.Grade.createLineItem(res.locals.token, lineItem);
  await quizCol.insertOne(req.body);
  return res.status(201).send({ message: "Quiz created" }).end();
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
