const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

router.post("/", async (request, response) => {});

router.get("/photosOfUser/:id", async (req, res) => {
  const userId = req.params.id;

  // Check if userId is a valid ObjectId
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    // Find the user with the given ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find photos of the user with the given ID
    const photos = await Photo.find({ user_id: userId }).lean().exec();

    // Assemble the response data with minimum user information for comments
    const responseData = photos.map((photo) => {
      const comments = photo.comments.map((comment) => ({
        comment: comment.comment,
        date_time: comment.date_time,
        _id: comment._id,
        user_id: comment.user_id
      }));
      return {
        _id: photo._id,
        user_id: photo.user_id,
        file_name: photo.file_name,
        date_time: photo.date_time,
        comments: comments,
      };
    });

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
