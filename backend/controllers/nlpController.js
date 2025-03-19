import Review from "../models/Review.js";
import Sentiment from "sentiment";

export const analyzeReviews = async (req, res) => {
  try {
    const { eventId } = req.params;
    const reviewData = await Review.findById(eventId);

    if (!reviewData) {
      return res.status(404).json({ message: "Event not found" });
    }

    const sentiment = new Sentiment();
    let positive = 0, negative = 0, neutral = 0;

    reviewData.reviews.forEach(({ reviewText }) => {
      const { score } = sentiment.analyze(reviewText);
      if (score > 0) positive++;
      else if (score < 0) negative++;
      else neutral++;
    });

    const total = reviewData.reviews.length;
    const positivePercent = ((positive / total) * 100).toFixed(2);
    const negativePercent = ((negative / total) * 100).toFixed(2);
    const mixedPercent = ((neutral / total) * 100).toFixed(2);
    const successPercent = ((positive / total) * 100).toFixed(2);
    const rating = ((positive * 5 + neutral * 3 + negative * 1) / total).toFixed(1);

    res.json({
      positivePercent,
      negativePercent,
      mixedPercent,
      successPercent,
      rating,
    });
  } catch (error) {
    res.status(500).json({ message: "Error analyzing reviews" });
  }
};
