//importing express for using the express router declaring routes on the application
const express = require("express");

//declaring the router as express router
const router = express.Router();

//importing the post controller functions
const {
  AddPost,
  GetPosts,
  GetPost,
  DeletePost,
  UpdatePost
} = require("../controllers/PostControllers");

//importing the upload function created using multer
const upload = require("../utils/multer");

//the getPosts function will be get req as we fetch post datas from server's end to the user's end to show posts
router.get("/getposts", GetPosts);

//the getPost function will be get req as we fetch a specific post data from server's end to the user's end to show post
router.get("/:id", GetPost);

//the addPosts function will be a post req as we send data from user's end to the server's end to save a post
router.post("/addpost", upload.single("image"), AddPost);

//the deletePost function will be delete req as we try to delete data from server's end by the user's end to delete posts
router.delete("/:id", DeletePost);

//the updatePost function will be a put req as e try to update a post from the user's end to the server's end to update post
router.put("/:id", upload.single("image"), UpdatePost);

//exporting the created routes to use in index.js
module.exports = router;
