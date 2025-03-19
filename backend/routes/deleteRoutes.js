import express from "express";
import { deleteEvent } from "../controllers/deleteController.js";

const router = express.Router();

router.delete("/event/:eventId", deleteEvent);

export default router;
