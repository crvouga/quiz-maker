const express = require("express");
const mongodb = require("./mongodb");

const router = express.Router();

const col = mongodb.db.collection("quizzes");

const quizQuestions = mongodb.db.collection("quiz-questions");

router.post("/quiz", async (req, res) => {
  console.log(req.body);
  col.insertOne(req.body);
  res.status(201).send({ message: "Quiz created" }).end();
});

router.post("/quiz-question", async (req, res) => {
  console.log(req.body);
  await quizQuestions.createIndex({ question: "text" });
  await quizQuestions.insertOne(req.body);
  res.status(201).send({ message: "Quiz question created" }).end();
});

router.post("/quiz-question-search", async (req, res) => {
  const searchQuery = req.query.query;
  console.log(req.query);
  const found = quizQuestions.find({});
  const hits = await found.toArray();
  console.log(hits);
  res.status(200).send({ hits: hits }).end();
});

module.exports = {
  router,
};
