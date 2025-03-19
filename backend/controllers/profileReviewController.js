import Review from "../models/Review.js";

export const getUserReviews = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "User email is required." });
    }

    const userReviews = await Review.find({ userEmail: email });

    if (!userReviews.length) {
      return res.json([]); // Return empty array if no events found
    }

    res.json(userReviews);
  } catch (error) {
    console.error("❌ Error fetching user reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};
