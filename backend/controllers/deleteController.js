import Review from "../models/Review.js";

export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const deletedEvent = await Review.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};
