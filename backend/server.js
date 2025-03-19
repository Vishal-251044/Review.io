import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import updateRoutes from "./routes/updateRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import profileReviewRoutes from "./routes/profileReviewRoutes.js";
import deleteRoutes from "./routes/deleteRoutes.js";
import nlpRoutes from "./routes/nlpRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/update", updateRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/review", reviewRoutes);
app.use("/profile", profileReviewRoutes); 
app.use("/delete", deleteRoutes);
app.use("/nlp", nlpRoutes);

// Database Connection
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
