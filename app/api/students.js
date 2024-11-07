import { connectToDatabase } from "../../lib/db";
import Student from "../models/student";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectToDatabase();
      const students = await Student.find({});
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
