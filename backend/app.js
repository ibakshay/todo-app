const express = require("express");
const bodyParser = require("body-parser");
const Post = require("./models/post");
const mongoose = require("mongoose");
const app = express();
mongoose
  .connect("mongodb://127.0.0.1:27017/node-angular")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch(() => {
    console.log("connection failed");
  });
//b5VZQfMxNk3R29FG
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

//middleware will go thru this file from top to bottom until there is next ()
//writing dummy middleware
app.use((req, res, next) => {
  console.log("hi from first middleware");
  next();
});
app.use((req, res, next) => {
  console.log("hi from second middleware");
  next();
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

//this submiddleware will be only called for this route
app.use("/api/posts", (req, res, next) => {
  console.log("hi from /api/posts route middleware ");
  next();
});

//getting the post contents from the mongodb database
app.get("/api/posts", (req, res, next) => {
  console.log("from database");
  Post.find()
    .then(savedPosts => {
      console.log("from database" + savedPosts);
      res.status(200).json({
        data: savedPosts
      });
    })
    .catch((error) => console.log(`Error occurred when fetching saved data from db `) + error);
});

//posting single post content to the mongodb database
app.post("/api/posts", (req, res, next) => {
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
app.put("/api/posts/edit/:id", (req, res, next) => {
  console.log("akshay is -----------------> " + req.params.id);
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({
    _id: req.params.id
  }, post).then(result => {
    console.log(result)
    res.status(200).json({
      message: "data updated sucessfully ",
      postId: createdPost._id
    })
  })
})

app.get("/", (req, res, next) => {
  console.log("hello world");
  res.send("Hello from akshay");
});

app.delete("/api/posts/delete/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({
    _id: req.params.id
  }).then(res.status(200).json({
    message: "success"
  })).catch(console.log(`Error occurred when deleting data from db `))

});

module.exports = app;
