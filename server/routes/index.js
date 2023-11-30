import express from "express";
import authRoute from "./authRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

router.use(`/auth`, authRoute); //auth/register
router.use(`/user`, userRoutes); //auth/register

export default router;