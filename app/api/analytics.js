import { connectToDatabase } from "../lib/dbConnection";

// Assuming you have a predefined analytics data model or query
export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      // This is just an example; you might need to aggregate data from other models.
      const analyticsData = {
        totalProperties: await Property.countDocuments(),
        totalAgents: await Agent.countDocuments(),
        totalReviews: await Review.countDocuments(),
        totalComments: await Comment.countDocuments(),
      };
      res.status(200).json(analyticsData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics data" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
