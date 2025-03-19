import Review from "../models/Review.js";

export const createReview = async (req, res) => {
    try {
      const { name, email, eventName, eventDescription } = req.body;
  
      if (!name || !email || !eventName || !eventDescription) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const review = new Review({
        userName: name, 
        userEmail: email,
        eventName,
        eventDescription,
      });
  
      await review.save();
  
      const eventLink = `http://localhost:3000/review/${review._id}`;
      res.status(201).json({ message: "Event link created successfully!", link: eventLink });
  
    } catch (error) {
      console.error("Error creating review link:", error); 
      res.status(500).json({ message: "Error creating review link", error: error.message });
    }
  };   

// ✅ Submit Public Review
export const submitReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { name, email, reviewText } = req.body;

        if (!name || !email || !reviewText) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Event review not found" });
        }

        // ✅ Check if the email has already submitted a review
        const alreadyReviewed = review.reviews.some((r) => r.email === email);
        if (alreadyReviewed) {
            return res.status(400).json({ message: "You have already submitted a review." });
        }

        // ✅ Check if link is expired
        const timeDiff = (Date.now() - review.createdAt) / 1000 / 60;
        if (timeDiff > 10) {
            return res.status(400).json({ message: "Link is closed" });
        }

        review.reviews.push({ name, email, reviewText });
        await review.save();

        res.json({ message: "Review submitted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error submitting review", error });
    }
};

// ✅ Get Event Review Data (for displaying on the frontend)
export const getReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found or expired" });
    }

    const timeDiff = (Date.now() - review.createdAt) / 1000 / 60;
    if (timeDiff > 10) {
      return res.status(400).json({ message: "Link is closed" });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Error fetching review", error });
  }
};
