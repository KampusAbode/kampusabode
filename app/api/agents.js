import { connectToDatabase } from "../lib/dbConnection";
import Agent from "../models/agent";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectToDatabase();
      const agents = await Agent.find({});
      res.status(200).json(agents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
