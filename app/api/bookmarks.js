import { connectToDatabase } from "../lib/dbConnection";
import Bookmark from "../models/bookmark";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectToDatabase();
      const { bookmarks } = req.body;
      const newBookmark = new Bookmark(bookmarks);
      const savedBookmark = await newBookmark.save();
      res.status(201).json(savedBookmark);
    } catch (error) {
      res.status(500).json({ error: "Failed to save bookmark" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
