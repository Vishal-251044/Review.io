import express from "express";
import { analyzeReviews } from "../controllers/nlpController.js";

const router = express.Router();

router.get("/analyze/:eventId", analyzeReviews);

export default router;
