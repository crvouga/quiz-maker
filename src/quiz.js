const express = require("express");
const mongodb = require("./mongodb");

const router = express.Router();

const col = mongodb.db.collection("quizzes");

router.post("/quiz", async (req, res) => {
  console.log(req.body);
  col.insertOne(req.body);
  res.status(201).send({ message: "Quiz created" }).end();
});

module.exports = {
  router,
};
