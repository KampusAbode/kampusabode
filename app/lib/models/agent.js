import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    agency: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Agent || mongoose.model("Agent", agentSchema);
