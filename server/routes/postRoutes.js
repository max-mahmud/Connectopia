import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createPost,
  getPosts,
  getPost,
  getUserPost,
  getComments,
  likePost,
  likePostComment,
  commentPost,
  replyPostComment,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

// crete post
router.post("/create-post", authMiddleware, createPost);
// get posts
router.post("/", authMiddleware, getPosts);
router.post("/:id", authMiddleware, getPost);

router.post("/get-user-post/:id", authMiddleware, getUserPost);

//like and comment on posts
router.post("/comment/:id", authMiddleware, commentPost);
router.post("/like/:id", authMiddleware, likePost);
router.post("/like-comment/:id/:rid?", authMiddleware, likePostComment);
router.post("/reply-comment/:id", authMiddleware, replyPostComment);

// get comments
router.get("/comments/:postId", getComments);

//delete post
router.delete("/:id", authMiddleware, deletePost);

export default router;
