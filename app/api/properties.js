import { connectToDatabase } from "../lib/dbConnection";
import Property from "../models/property";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const properties = await Property.find({});
      res.status(200).json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  } else if (req.method === "POST") {
    try {
      const newProperty = new Property(req.body);
      const savedProperty = await newProperty.save();
      res.status(201).json(savedProperty);
    } catch (error) {
      res.status(500).json({ error: "Failed to save property" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
