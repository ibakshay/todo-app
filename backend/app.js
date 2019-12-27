const express = require("express");

const app = express();

//writing dummy middleware
app.use((req, res, next) => {
  console.log("hi from first middleware");
  next();
});
app.use((req, res, next) => {
  console.log("hi from second middleware");
  next();
});

//this middleware will be only called for this route
app.use("/api/posts", (req, res, next) => {
  console.log("hi from /api/posts route middleware ");
  next();
});

app.get("/api/posts", (req, res, next) => {
  const responseJson = [
    { id: 1234, name: "akshay", content: "some dummy content" },
    { id: 3536, name: "becky", content: "some dummy content2" },
    { id: 7474, name: "Mommy", content: "some dummy content3" },
    { id: 7573, name: "daddy", content: "some dummy content4" }
  ];
  res.status(200).json(responseJson);
});

app.use((req, res, next) => {
  res.send("Hello from express");
});

module.exports = app;
