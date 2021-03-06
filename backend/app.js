const express = require("express");
const bodyParser = require("body-parser");
const postsRoutes = require("./routes/posts")
const usersRoutes = require("./routes/auth")
const mongoose = require("mongoose");
const path = require("path")
const app = express();


mongoose
  .connect("mongodb+srv://ibakshay:" + process.env.MONGO_ATLAS_PASSWORD + "@cluster0-thkyt.mongodb.net/test?retryWrites=true&w=majority")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log(`connection failed ${ error }`);
  });
//b5VZQfMxNk3R29FG
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use("/images", express.static(path.join("backend/images")))

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
  console.log("hi from third middleware");
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

app.get("/", (req, res, next) => {
  console.log("hello world");
  res.send("Hello from akshay");
});



app.use("/api/posts", postsRoutes);
app.use("/api/user", usersRoutes);

module.exports = app;
