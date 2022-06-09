const express = require("express");
// const res = require("express/lib/response");
// const app = require("../../app");
const router = express.Router();
const mongoose = require("mongoose");

const Article = require("../models/article");

// all articles
router.get("/all", (req, res, next) => {
  Article.find()
    .exec()
    .then((docs) => {
      console.log("From Database", docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//Trending Section
router.get("/trending", (req, res, next) => {
  Article.find()
    .sort({ views: -1 })
    .exec()
    .then((docs) => {
      console.log("From Database", docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// Create article
router.post("/", (req, res, next) => {
  const article = new Article({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    article_no: req.params.article_no,
    title: req.body.title,
    content: req.body.content,
  });
  article
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        createdArticle: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// Read article
router.get("/:articleId", (req, res, next) => {
  const id = req.params.articleId;
  Article.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } })
    .exec()
    .then((doc) => {
      console.log("From Database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No value found for the provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// Update article
router.put("/:articleId", (req, res, next) => {
  const id = req.params.articleId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Article.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// Delete article
router.delete("/:articleId", (req, res, next) => {
  const id = req.params.articleId;
  Article.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// Like article
router.post("/:articleId/like", (req, res, next) => {
  const id = req.params.articleId;
  Article.updateOne({ _id: id }, { $inc: { likes: 1 } })
    .exec()
    .then((doc) => {
      console.log("From Database", doc);
      if (doc) {
        res.status(200).json({ message: "Liked!", doc });
      } else {
        res.status(404).json({ message: "No value found for the provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// Unlike article
router.delete("/:articleId/unlike", (req, res, next) => {
  const id = req.params.articleId;
  Article.updateOne({ _id: id }, { $inc: { likes: -1 } })
    .exec()
    .then((doc) => {
      console.log("From Database", doc);
      if (doc) {
        res.status(200).json({ message: "Unliked!", doc });
      } else {
        res.status(404).json({ message: "No value found for the provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
