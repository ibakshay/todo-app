const express = require("express");
const Post = require("../models/post")
const multer = require("multer")

const router = express.Router();
const MIME_TAP_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TAP_MAP[file.mimetype];
    let error = new Error("invalid mime type");
    if (isValid)
    {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const aksahy = "hshs".tolowercase
    const name = file.originalname.toLowerCase().split(' ').join('-')
    const ext = MIME_TAP_MAP[file.mimetype]
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});
//getting the post contents from the mongodb database
router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.currentpage;
  console.log(req.query);
  const postQuery = Post.find();
  if (pageSize && currentPage)
  {
    console.log("akshay is a google boy")
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  console.log("from database");
  postQuery.then(savedPosts => {
    res.status(200).json({
      data: savedPosts
    });
  })
    .catch((error) => console.log(`Error occurred when fetching saved data from db `) + error);
});

router.get("/get/:id", (req, res, next) => {
  Post.findById(req.params.id).then(response => {
    console.log("hello there" + response)
    if (Post)
    {
      res.status(200).json(response)
    }
    else
    {
      res.status(404).json({ message: "404 page not found" })
    }
  })
})

//posting single post content to the mongodb database
router.post("", multer({ storage: storage }).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  let post = "";
  if (req.body.filename)
  {
    post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename
    });
  }
  post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "data received sucessfully ",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  });

  console.log(post);
});

//editing a single post
router.put("/edit/:id", multer({ storage: storage }).single("image"), (req, res, next) => {
  console.log("akshay is -----------------> " + req.params.id);
  let imagePath = req.body.imagePath;
  if (req.file)
  {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  //console.log(post)
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
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
