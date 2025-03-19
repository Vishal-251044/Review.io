import express from "express";
import { getUserReviews } from "../controllers/profileReviewController.js";

const router = express.Router();

router.get("/reviews", getUserReviews);

export default router;
