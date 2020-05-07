const express = require("express");
const checkAuth = require("../middleware/check-auth")
const PostController = require("../controllers/posts")
const extractFile = require("../middleware/file")

const router = express.Router();

//getting the post contents from the mongodb database
router.get("", checkAuth, PostController.fetchAllPosts)

router.get("/get/:id", checkAuth, PostController.fetchPostById)

//posting single post content to the mongodb database
router.post("", checkAuth, extractFile, PostController.saveSinglePost)

//editing a single post
router.put("/edit/:id", checkAuth, extractFile, PostController.editSinglePost)

router.delete("/delete/:id", PostController.deleteSinglePost);

module.exports = router
