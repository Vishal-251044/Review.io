import express from "express";
import { createReview, submitReview, getReview } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/create", createReview); 
router.post("/submit/:reviewId", submitReview); 
router.get("/:reviewId", getReview); 

export default router;
