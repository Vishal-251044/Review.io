import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },  
    userEmail: { type: String, required: true },
    eventName: { type: String, required: true },
    eventDescription: { type: String, required: true },
    reviews: [
      {
        name: String,
        email: String,
        reviewText: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
