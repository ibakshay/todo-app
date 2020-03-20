const express = require("express");
const router = express.Router();
const Post = require("../models/post")




//getting the post contents from the mongodb database
router.get("", (req, res, next) => {
  console.log("from database");
  Post.find()
    .then(savedPosts => {
      console.log("hello there" + savedPosts);
      res.status(200).json({
        data: savedPosts
      });
    })
    .catch((error) => console.log(`Error occurred when fetching saved data from db `) + error);
});

router.get("/get/:id", (req, res, next) => {
  Post.findById(req.params.id).then(response => {
    console.log("hello there" + response)
    res.status(200).json(response)
  })
})

//posting single post content to the mongodb database
router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "data received sucessfully ",
      postId: createdPost._id
    });
  });

  console.log(post);
});

//editing a single post
router.put("/edit/:id", (req, res, next) => {
  console.log("akshay is -----------------> " + req.params.id);
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({ _id: req.params.id }, post).then(updatedPost => {
    res.status(200).json({
      message: "data updated sucessfully ",
      postId: updatedPost._id
    })
  }).catch(e => { console.log("the erroe when updating the post is " + e) })
})

router.delete("/delete/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({
    _id: req.params.id
  }).then(res.status(200).json({
    message: "success"
  })).catch(console.log(`Error occurred when deleting data from db `))

});

module.exports = router
