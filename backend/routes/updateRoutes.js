import express from "express";
import { updateProfile } from "../controllers/updateController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/profile", authMiddleware, updateProfile);

export default router;
