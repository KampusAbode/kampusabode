import { connectToDatabase } from "../lib/dbConnection";
import Comment from "../models/comment";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const comments = await Comment.find({});
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  } else if (req.method === "POST") {
    try {
      const newComment = new Comment(req.body);
      const savedComment = await newComment.save();
      res.status(201).json(savedComment);
    } catch (error) {
      res.status(500).json({ error: "Failed to save comment" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
