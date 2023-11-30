import express from "express";
import authRoute from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import postRoutes from "./postRoutes.js";

const router = express.Router();

router.use(`/auth`, authRoute); //auth/register
router.use(`/user`, userRoutes); //user/friend
router.use(`/post`, postRoutes); //post/comment

export default router;
